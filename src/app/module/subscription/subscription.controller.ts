import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SubscriptionServices } from "./subscription.services";
import type { JwtPayload } from "jsonwebtoken";

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const subscriptions = await SubscriptionServices.getAllSubscriptions(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscriptions fetched successfully",
    data: subscriptions,
  });
});

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.body;
  const user = req.user as JwtPayload

  const session = await SubscriptionServices.createCheckoutSession(
    user,
    planId
  );

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