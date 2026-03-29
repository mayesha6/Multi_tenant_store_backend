import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SubscriptionServices } from "./subscription.services";
import { sendResponse } from "../../utils/sendResponse";
const createSubscription = catchAsync(async (req, res, next) => {
    const subscription = await SubscriptionServices.createSubscription(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Subscription created",
        data: subscription
    });
});
const getSubscriptionById = catchAsync(async (req, res) => {
    const subscription = await SubscriptionServices.getSubscriptionById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription retrieved successfully",
        data: subscription
    });
});
const getAllSubscriptions = catchAsync(async (_req, res, next) => {
    const subscriptions = await SubscriptionServices.getAllSubscriptions();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All subscriptions retrieved successfully",
        data: subscriptions
    });
});
const updateSubscription = catchAsync(async (req, res, next) => {
    const subscription = await SubscriptionServices.updateSubscription(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription updated successfully",
        data: subscription
    });
});
const cancelSubscription = catchAsync(async (req, res, next) => {
    const subscription = await SubscriptionServices.cancelSubscription(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription canceled",
        data: subscription
    });
});
export const SubscriptionController = {
    createSubscription,
    getSubscriptionById,
    getAllSubscriptions,
    updateSubscription,
    cancelSubscription,
};
//# sourceMappingURL=subscription.controller.js.map