import { catchAsync } from "../../utils/catchAsync";
import { ConversationServices } from "./conversation.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const createConversation = catchAsync(async (req, res, next) => {
    const user = req.user;
    const tenantId = user.tenantId;
    const result = await ConversationServices.createConversation(req.body, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Conversation created successfully",
        data: result,
    });
});
const getAllConversations = catchAsync(async (req, res) => {
    const user = req.user;
    const userId = user.userId;
    const result = await ConversationServices.getAllConversations(req.query, user.tenantId, userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Conversations fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getSingleConversation = catchAsync(async (req, res, next) => {
    const user = req.user;
    const tenantId = user.tenantId;
    const result = await ConversationServices.getSingleConversation(req.params.id, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Conversation fetched successfully",
        data: result,
    });
});
const updateConversation = catchAsync(async (req, res, next) => {
    const user = req.user;
    const tenantId = user.tenantId;
    const result = await ConversationServices.updateConversation(req.params.id, req.body, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Conversation updated successfully",
        data: result,
    });
});
const getMessagesByConversationId = catchAsync(async (req, res, next) => {
    const user = req.user;
    const tenantId = user.tenantId;
    const result = await ConversationServices.getMessagesByConversationId(req.params.id, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Messages fetched successfully",
        data: result,
    });
});
const sendAgentMessage = catchAsync(async (req, res, next) => {
    const user = req.user;
    const tenantId = user.tenantId;
    const userId = user.userId;
    const result = await ConversationServices.sendAgentMessage(req.params.id, req.body, tenantId, userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Message sent successfully",
        data: result,
    });
});
const markConversationAsRead = catchAsync(async (req, res, next) => {
    const user = req.user;
    const tenantId = user.tenantId;
    const result = await ConversationServices.markConversationAsRead(req.params.id, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Conversation marked as read successfully",
        data: result,
    });
});
export const ConversationControllers = {
    createConversation,
    getAllConversations,
    getSingleConversation,
    updateConversation,
    getMessagesByConversationId,
    sendAgentMessage,
    markConversationAsRead,
};
//# sourceMappingURL=conversation.controller.js.map