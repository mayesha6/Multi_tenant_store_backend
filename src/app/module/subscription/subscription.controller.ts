import type { Request, NextFunction, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SubscriptionServices } from "./subscription.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";

const createSubscription = catchAsync(
    async (req: Request, res: Response) => {
        const decoded = req.user as JwtPayload;

        const tenantId = decoded.tenantId;
        const { planId } = req.body;

        const result = await SubscriptionServices.createSubscription(
            tenantId,
            planId
        );

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Subscription created successfully",
            data: result,
        });

    }
);

const getAllSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const results = await SubscriptionServices.getAllSubscription(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscriptions retrieved successfully",
        meta: results.meta,
        data: results.data,
    });
});

const getSingleSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubscriptionServices.getSingleSubscription(
        req.params.subscriptionId as string
    );
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription retrieved successfully",
        data: result,
    });
});

const getMySubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    console.log("getMySubscription - decodedToken:", decodedToken);
    console.log("getMySubscription - userId:", userId);

    const result = await SubscriptionServices.getMySubscription(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription retrieved successfully.",
        data: result,
    });
});

const updateSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { subscriptionId } = req.params;

    const result = await SubscriptionServices.updateSubscription(
        subscriptionId as string,
        req.body
    );
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription updated successfully.",
        data: result,
    });
});

const deleteSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubscriptionServices.deleteSubscription(
        req.params.subscriptionId as string
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription deleted successfully.",
        data: result,
    });
});

const handleStripeWebhook = catchAsync(async (req, res) => {
    const result = await SubscriptionServices.HandleStripeWebhook(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook event trigger successfully",
        data: result,
    });
});

export const SubscriptionController = {
    createSubscription,
    getAllSubscription,
    getMySubscription,
    handleStripeWebhook,
    getSingleSubscription,
    updateSubscription,
    deleteSubscription,
};
