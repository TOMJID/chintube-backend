import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { Role } from "../../../generated/prisma/enums";

//? setting global types for user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        res.status(401).json({
          success: false,
          message: "You are not authorized because of session",
        });
        return;
      }

      if (!session.user.emailVerified) {
        res.status(403).json({
          success: false,
          message: "You are not authorized because you email isn't Verified",
        });
        return;
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role as Role,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as Role)) {
        res.status(403).json({
          success: false,
          message: `Forbidden: You do not have the required permissions (${roles.join(", ")}) to access this resource.`,
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const verifyUser = auth(Role.USER);
export const verifyAdmin = auth(Role.ADMIN);

export default auth;
