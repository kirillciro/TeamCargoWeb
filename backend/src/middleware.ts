import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth.js";

export type AuthedRequest = Request & {
  userId?: number;
  userEmail?: string;
  userRole?: string;
};

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.header("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing bearer token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    req.userId = Number(payload.sub);
    req.userEmail = payload.email;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.userRole !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}
