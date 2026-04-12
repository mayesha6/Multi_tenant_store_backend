// file: src/app/modules/webhook/messageWebhook.controller.ts

// import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import AppError from "../../errors/AppError";
import { verifyIncomingMessageWebhook } from "./messageWebhook.verify";
import { normalizeIncomingMessagePayload } from "./messageWebhook.utils";
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/AppError";
import { MessageWebhookService } from "./messageWebhook.services";
import { sendResponse } from "../../utils/sendResponse";
// import { MessageWebhookService } from "./messageWebhook.service";

const receiveIncomingMessageWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature =
      (req.headers["x-webhook-signature"] as string | undefined) ||
      (req.headers["x-signature"] as string | undefined);

    const rawBody =
      (req as any).rawBody?.toString("utf8") || JSON.stringify(req.body);

    /**
     * OPTIONAL DEBUG:
     * dev mode-এ signature mismatch বুঝতে useful
     */
    console.log("Incoming webhook signature:", signature);
    console.log("Incoming webhook rawBody:", rawBody);

    const isValid = verifyIncomingMessageWebhook(rawBody, signature);

    if (!isValid) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid webhook signature");
    }

    const normalizedPayload = normalizeIncomingMessagePayload(req.body);

    const result = await MessageWebhookService.handleIncomingMessage(
      normalizedPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Incoming message webhook processed successfully",
      data: result,
    });
  }
);

export const MessageWebhookController = {
  receiveIncomingMessageWebhook,
};