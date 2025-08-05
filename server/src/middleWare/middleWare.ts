import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow login and register endpoints without auth
  console.log(req.path)
  if (
    req.path === "/login" ||
    req.path === "/register" ||
    req.path === "/wifi"||
    req.path === "/qa/login"||
    req.path === "/prescriptions/16ca5d24-1dd5-41f7-b3d8-5c3d04cafff6/icon"
  ) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Enter Authorization Token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
