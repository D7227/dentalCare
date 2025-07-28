import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];
  
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "Authentication service not configured" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if token is for admin
    if (decoded.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin token required" });
    }
    
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
} 