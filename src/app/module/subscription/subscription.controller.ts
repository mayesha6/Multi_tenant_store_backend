import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SubscriptionServices } from "./subscription.services";


const getAllSubscriptions = catchAsync(async (_req: Request, res: Response, next: NextFunction) => {
  const subscriptions = await SubscriptionServices.getAllSubscriptions();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All subscriptions fetched successfully",
    data: subscriptions
  });
});

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId, planId } = req.body;
  const session = await SubscriptionServices.createCheckoutSession(tenantId, planId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Checkout session created successfully",
    data: session
  });
});

export const SubscriptionControllers = {
  getAllSubscriptions,
  createCheckoutSession
};