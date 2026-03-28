import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { ContentService } from "./content.services";
import { sendResponse } from "../../utils/sendResponse";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
const getContent = catchAsync(async (req, res) => {
    const { type } = req.params;
    const result = await ContentService.getContentByType(type);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Content fetched successfully",
        data: result,
    });
});
const getAllContents = catchAsync(async (req, res) => {
    const result = await ContentService.getAllContents();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All contents fetched successfully",
        data: result,
    });
});
const createContent = catchAsync(async (req, res) => {
    const { type } = req.params;
    let imageUrl = null;
    if (req.file) {
        const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
        if (uploaded) {
            imageUrl = uploaded.secure_url;
        }
    }
    const payload = {
        title: req.body.title,
        content: req.body.content,
        order: Number(req.body.order) || 0,
        image: imageUrl,
    };
    const result = await ContentService.createContent(type, payload);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Content created successfully",
        data: result,
    });
});
const updateContent = catchAsync(async (req, res) => {
    const { type, id } = req.params;
    const result = await ContentService.updateContent(type, id, { ...req.body });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Content updated successfully",
        data: result,
    });
});
const deleteContent = catchAsync(async (req, res) => {
    const { type, id } = req.params;
    const result = await ContentService.deleteContent(type, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Content deleted successfully",
        data: result,
    });
});
export const ContentController = {
    getContent,
    getAllContents,
    createContent,
    updateContent,
    deleteContent,
};
//# sourceMappingURL=content.controller.js.map