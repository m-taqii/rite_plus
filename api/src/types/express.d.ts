import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | { id: string; role?: string; type?: string; [key: string]: any };
    }
  }
}

export {};
