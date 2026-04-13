// import type { NextFunction, Request, Response } from "express"
// import { ZodObject } from "zod"

// export const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // req.body =JSON.parse(req.body.data || {}) || req.body
//         if (req.body.data) {
//             req.body = JSON.parse(req.body.data)
//         }
//         req.body = await zodSchema.parseAsync(req.body)
//         next()
//     } catch (error) {
//         next(error)
//     }
// }

import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

export const validateRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let parsedBody = req.body;

      /**
       * ✅ multipart/form-data handle
       * only if `data` exists AND is string
       */
      if (parsedBody?.data && typeof parsedBody.data === "string") {
        try {
          parsedBody = JSON.parse(parsedBody.data);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Invalid JSON in 'data' field",
          });
        }
      }

      /**
       * ✅ validate ONLY body (as per your system)
       */
      const validatedData = await schema.parseAsync(parsedBody);

      /**
       * ✅ overwrite req.body safely
       */
      req.body = validatedData;

      next();
    } catch (error) {
      /**
       * ✅ Zod error clean response
       */
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errorSources: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }

      next(error);
    }
  };