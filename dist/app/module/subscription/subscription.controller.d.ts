import type { Request, NextFunction, Response } from "express";
export declare const SubscriptionController: {
    createSubscription: (req: Request, res: Response, next: NextFunction) => void;
    getAllSubscription: (req: Request, res: Response, next: NextFunction) => void;
    getMySubscription: (req: Request, res: Response, next: NextFunction) => void;
    handleStripeWebhook: (req: Request, res: Response, next: NextFunction) => void;
    getSingleSubscription: (req: Request, res: Response, next: NextFunction) => void;
    updateSubscription: (req: Request, res: Response, next: NextFunction) => void;
    deleteSubscription: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=subscription.controller.d.ts.map