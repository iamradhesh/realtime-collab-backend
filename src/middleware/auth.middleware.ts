import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sql } from "../utils/db.js";

// 1. Authenticate: Checks if the user is logged in:-0
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Token is Missing" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
    };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or Expired token",
    });
  }
};

// 2. Authorize: Checks if the user has a specific role in a project

export const requiredProjectRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required for this route",
      });
    }

    try {
      const members = await sql`
        SELECT role FROM project_members 
        WHERE user_id = ${userId} AND project_id = ${projectId}
      `;

      if (members.length === 0 || !allowedRoles.includes(members[0].role)) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have the required permissions for this project",
        });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error during authorization" });
    }
  };
};
