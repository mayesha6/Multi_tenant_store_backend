import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
export declare const checkAuth: (...authRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=checkAuth.d.ts.map