import type { NextFunction, Request, Response } from "express";
export declare const StripeWebhookControllers: {
    handleWebhook: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=webhook.controller.d.ts.map