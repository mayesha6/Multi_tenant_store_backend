import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import { SubscriptionServices } from "./subscription.services";
import { sendResponse } from "../../utils/sendResponse";


const createSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const subscription = await SubscriptionServices.createSubscription(req.body);
    sendResponse(res, { 
        success: true, 
        statusCode: httpStatus.CREATED, 
        message: "Subscription created", 
        data: subscription 
    });
})

const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
    const subscription = await SubscriptionServices.getSubscriptionById(req.params.id as string);
    sendResponse(res, { 
        success: true, 
        statusCode: httpStatus.OK, 
        message: "Subscription retrieved successfully",
        data: subscription });
})

const getAllSubscriptions = catchAsync(async (_req: Request, res: Response, next: NextFunction) => {
    const subscriptions = await SubscriptionServices.getAllSubscriptions();
    sendResponse(res, { 
        success: true, 
        statusCode: httpStatus.OK, 
        message: "All subscriptions retrieved successfully",
        data: subscriptions });
})

const updateSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const subscription = await SubscriptionServices.updateSubscription(req.params.id as string, req.body);
    sendResponse(res, { 
        success: true, 
        statusCode: httpStatus.OK, 
        message: "Subscription updated successfully",
        data: subscription 
    });
})

const cancelSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const subscription = await SubscriptionServices.cancelSubscription(req.params.id as string);
    sendResponse(res, { 
        success: true, 
        statusCode: httpStatus.OK, 
        message: "Subscription canceled", 
        data: subscription 
    });
})

  const createStripeSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const { tenantId, stripePriceId, paymentMethodId } = req.body

    const result = await SubscriptionServices.createStripeSubscription(
      tenantId,
      stripePriceId,
      paymentMethodId
    )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Stripe subscription created successfully",
      data: result,
    })
  }
)

export const SubscriptionController = {
    createSubscription,
    getSubscriptionById,
    getAllSubscriptions,
    updateSubscription,
    cancelSubscription,
    createStripeSubscription
};
