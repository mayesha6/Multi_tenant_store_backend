import { ZodObject } from "zod";
export const validateRequest = (zodSchema) => async (req, res, next) => {
    try {
        // req.body =JSON.parse(req.body.data || {}) || req.body
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        req.body = await zodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=validateRequest.js.map