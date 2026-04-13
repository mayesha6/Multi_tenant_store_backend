import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SubscriptionServices } from "./subscription.services";
const getAllSubscriptions = catchAsync(async (req, res) => {
    const subscriptions = await SubscriptionServices.getAllSubscriptions(req.user);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscriptions fetched successfully",
        data: subscriptions,
    });
});
const createCheckoutSession = catchAsync(async (req, res) => {
    const { planId } = req.body;
    const user = req.user;
    const session = await SubscriptionServices.createCheckoutSession(user, planId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Checkout session created successfully",
        data: session,
    });
});
export const SubscriptionControllers = {
    getAllSubscriptions,
    createCheckoutSession,
};
//# sourceMappingURL=subscription.controller.js.map