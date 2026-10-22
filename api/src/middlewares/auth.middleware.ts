import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    id: string;
    role?: 'admin' | 'staff' | 'maintainer' | string;
    type?: 'customer' | 'staff';
    [key: string]: any;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Authentication middleware: verifies JWT token from cookie or Authorization Bearer header.
 */
export default function authenticate(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined;

    // 1. Explicit Authorization Bearer header from client
    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2. Cookie fallback: check staff_token first (dedicated staff session), then generic token
    if (!token) {
        token = req.cookies?.staff_token || req.cookies?.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
            return res.status(401).json({
                success: false,
                message: "Invalid or malformed token payload.",
            });
        }

        req.user = decoded as AuthPayload;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }
        console.error("Authentication error:", err.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Invalid token.",
        });
    }
}

/**
 * Role-based authorization middleware.
 * Example: router.post("/products", authenticate, requireRoles("admin", "staff"), addProduct);
 */
export function requireRoles(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        if (!req.user.role || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You do not have permission to perform this action.",
            });
        }

        next();
    };
}

/**
 * Middleware requiring staff clearance (admin, staff, maintainer).
 */
export function requireStaff(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    const isStaff = req.user.type === "staff" || Boolean(req.user.role);
    if (!isStaff) {
        return res.status(403).json({
            success: false,
            message: "Access restricted to Rite Plus staff members.",
        });
    }

    next();
}