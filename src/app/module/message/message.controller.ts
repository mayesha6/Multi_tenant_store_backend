import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MessageServices } from "./message.services";
import type { JwtPayload } from "jsonwebtoken";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const result = await MessageServices.sendAgentMessage(
    req.params.conversationId as string,
    user.tenantId,
    user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Message sent successfully",
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const result = await MessageServices.getMessages(
    req.params.conversationId as string,
    user.tenantId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const markSeen = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  await MessageServices.markAsSeen(
    req.params.conversationId as string,
    user.tenantId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages marked as seen",
    data: null,
  });
});

export const MessageControllers = {
  sendMessage,
  getMessages,
  markSeen,
};