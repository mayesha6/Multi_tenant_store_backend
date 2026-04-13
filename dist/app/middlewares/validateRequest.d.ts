import type { NextFunction, Request, Response } from "express";
import { type ZodTypeAny } from "zod";
export declare const validateRequest: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validateRequest.d.ts.map