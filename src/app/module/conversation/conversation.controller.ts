import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ConversationServices } from "./conversation.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";

const createConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const tenantId = user.tenantId;
    const result = await ConversationServices.createConversation(
      req.body,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Conversation created successfully",
      data: result,
    });
  }
);

const getAllConversations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const tenantId = user.tenantId;
    const result = await ConversationServices.getAllConversations(
      req.query,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Conversations fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const tenantId = user.tenantId;
    const result = await ConversationServices.getSingleConversation(
      req.params.id as string,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Conversation fetched successfully",
      data: result,
    });
  }
);

const updateConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const tenantId = user.tenantId;

    const result = await ConversationServices.updateConversation(
      req.params.id as string,
      req.body,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Conversation updated successfully",
      data: result,
    });
  }
);

const getMessagesByConversationId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const tenantId = user.tenantId;

    const result = await ConversationServices.getMessagesByConversationId(
      req.params.id as string,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Messages fetched successfully",
      data: result,
    });
  }
);

const sendAgentMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const tenantId = user.tenantId;
    const userId = user.userId;

    const result = await ConversationServices.sendAgentMessage(
      req.params.id as string,
      req.body,
      tenantId,
      userId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Message sent successfully",
      data: result,
    });
  }
);

const markConversationAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const tenantId = user.tenantId;

    const result = await ConversationServices.markConversationAsRead(
      req.params.id as string,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Conversation marked as read successfully",
      data: result,
    });
  }
);

export const ConversationControllers = {
  createConversation,
  getAllConversations,
  getSingleConversation,
  updateConversation,
  getMessagesByConversationId,
  sendAgentMessage,
  markConversationAsRead,
};