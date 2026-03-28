import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { FAQService } from "./faq.services";
import { catchAsync } from "../../utils/catchAsync";
const createFAQ = catchAsync(async (req, res) => {
    const result = await FAQService.createFAQ(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FAQ created successfully",
        data: result,
    });
});
const getAllFAQ = catchAsync(async (_req, res) => {
    const result = await FAQService.getAllFAQ();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All FAQs fetched successfully",
        data: result,
    });
});
const getSingleFAQ = catchAsync(async (req, res) => {
    const result = await FAQService.getSingleFAQ(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FAQ fetched successfully",
        data: result,
    });
});
const updateFAQ = catchAsync(async (req, res) => {
    const result = await FAQService.updateFAQ(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FAQ updated successfully",
        data: result,
    });
});
const deleteFAQ = catchAsync(async (req, res) => {
    const result = await FAQService.deleteFAQ(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FAQ deleted successfully",
        data: result,
    });
});
export const FAQController = {
    createFAQ,
    getAllFAQ,
    getSingleFAQ,
    updateFAQ,
    deleteFAQ,
};
//# sourceMappingURL=faq.controller.js.map