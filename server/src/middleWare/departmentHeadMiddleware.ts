import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../database/db";
import { departmentHeadSchema } from "../departmentHead/departmentHeadSchema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET;

// Single comprehensive middleware for department head authentication and authorization
export async function departmentHeadAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "Authentication service not configured" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if token has required fields
    if (!decoded.email || !decoded.type) {
      return res.status(401).json({ error: "Invalid token structure" });
    }

    // Check if token is for department head
    if (decoded.type !== "department_head") {
      return res
        .status(403)
        .json({ error: "Access denied. Department head token required" });
    }

    console.log("Token decoded:", decoded);
    console.log("Looking for email:", decoded.email);

    // Fetch department head from database using email
    const [departmentHead] = await db
      .select()
      .from(departmentHeadSchema)
      .where(eq(departmentHeadSchema.email, decoded.email));

    console.log("Database query result:", departmentHead);

    if (!departmentHead) {
      return res.status(401).json({ error: "Department head not found" });
    }

    // Check if department head is active
    if (!departmentHead.isActive) {
      return res.status(403).json({
        error: "Account is deactivated. Please contact administrator.",
      });
    }

    // Verify roleId matches (additional security check)
    if (departmentHead.roleId !== decoded.roleId) {
      return res.status(401).json({ error: "Token role mismatch" });
    }

    // Add department head data to request object
    (req as any).user = {
      id: departmentHead.id,
      email: departmentHead.email,
      name: departmentHead.name,
      roleId: departmentHead.roleId,
      departmentIds: departmentHead.departmentIds,
      type: "department_head",
    };

    // Check for department access if departmentId is in params
    const departmentId = req.params.departmentId;
    console.log("departmentId", departmentId);

    if (departmentId) {
      const userDepartmentIds = Array.isArray(departmentHead.departmentIds)
        ? departmentHead.departmentIds
        : [];

      console.log("userDepartmentIds", userDepartmentIds);

      console.log(
        "!userDepartmentIds.includes(departmentId",
        !userDepartmentIds.includes(departmentId)
      );

      if (!userDepartmentIds.includes(departmentId)) {
        return res.status(403).json({
          error:
            "Access denied. You don't have permission to access this department.",
        });
      }
    }

    // Check for self-update/delete prevention
    const targetId = req.params.id;
    if (targetId && (req.method === "PUT" || req.method === "DELETE")) {
      if (targetId === departmentHead.id) {
        return res.status(403).json({
          error:
            "Department heads cannot update or delete their own accounts. Please contact administrator.",
        });
      }
    }

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token has expired" });
    }

    console.error("Department head middleware error:", err);
    return res.status(500).json({ error: "Authentication service error" });
  }
}
