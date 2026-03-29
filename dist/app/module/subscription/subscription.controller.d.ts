import type { NextFunction, Request, Response } from "express";
export declare const SubscriptionController: {
    createSubscription: (req: Request, res: Response, next: NextFunction) => void;
    getSubscriptionById: (req: Request, res: Response, next: NextFunction) => void;
    getAllSubscriptions: (req: Request, res: Response, next: NextFunction) => void;
    updateSubscription: (req: Request, res: Response, next: NextFunction) => void;
    cancelSubscription: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=subscription.controller.d.ts.map