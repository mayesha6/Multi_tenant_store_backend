import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MessageServices } from "./message.services";
const sendMessage = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await MessageServices.sendAgentMessage(req.params.conversationId, user.tenantId, user.userId, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Message sent successfully",
        data: result,
    });
});
const getMessages = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await MessageServices.getMessages(req.params.conversationId, user.tenantId, req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Messages fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const markSeen = catchAsync(async (req, res) => {
    const user = req.user;
    await MessageServices.markAsSeen(req.params.conversationId, user.tenantId);
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
//# sourceMappingURL=message.controller.js.map