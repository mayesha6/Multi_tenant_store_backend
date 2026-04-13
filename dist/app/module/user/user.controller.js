import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.services";
const createUser = catchAsync(async (req, res, next) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully. OTP sent to email. Please verify your account.",
        data: user,
    });
});
const getAllUsers = catchAsync(async (req, res, next) => {
    const query = req.query;
    const decodedToken = req.user;
    const result = await UserServices.getAllUsers(query, decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getMe = catchAsync(async (req, res, next) => {
    const decodedToken = req.user;
    const result = await UserServices.getMe(decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data,
    });
});
const getSingleUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const decodedToken = req.user;
    const result = await UserServices.getSingleUser(id, decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data: result.data,
    });
});
const updateUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Updated Successfully",
        data: user,
    });
});
export const updateMyProfile = catchAsync(async (req, res, next) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const payload = { ...req.body };
    const updatedUser = await UserServices.updateMyProfile(userId, payload, decodedToken, req.file);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully.",
        data: updatedUser,
    });
});
const deleteUserById = catchAsync(async (req, res, next) => {
    await UserServices.deleteUserById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Deleted Successfully",
        data: null,
    });
});
export const UserControllers = {
    createUser,
    getAllUsers,
    getMe,
    getSingleUser,
    updateUser,
    updateMyProfile,
    deleteUserById
};
//# sourceMappingURL=user.controller.js.map