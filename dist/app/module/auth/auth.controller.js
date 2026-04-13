import httpStatus from "http-status-codes";
import passport from "passport";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AuthServices } from "./auth.services";
const credentialsLogin = catchAsync(async (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return next(new AppError(401, err));
        }
        if (!user) {
            return next(new AppError(401, info.message));
        }
        const userTokens = await createUserTokens(user);
        const { password: pass, ...rest } = user;
        setAuthCookie(res, userTokens);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest,
            },
        });
    })(req, res, next);
});
const getNewAccessToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    });
});
const logout = catchAsync(async (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
});
const changePassword = catchAsync(async (req, res, next) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
export const resetPassword = catchAsync(async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
    await AuthServices.resetPassword(email, otp, newPassword, confirmPassword);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password reset successfully",
        data: null,
    });
});
const setPassword = catchAsync(async (req, res, next) => {
    const decodedToken = req.user;
    const { password } = req.body;
    await AuthServices.setPassword(decodedToken.userId, password);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    await AuthServices.forgotPassword(email);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP sent successfully",
        data: null,
    });
});
const resendSignupOtp = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    await AuthServices.resendSignupOtp(email);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP sent to your email",
        data: null,
    });
});
const verifySignupOtp = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await AuthServices.verifySignupOtp(email, otp);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User verified successfully",
        data: {
            id: user.id,
            email: user.email,
            isVerified: user.isVerified,
        },
    });
});
const googleCallbackController = catchAsync(async (req, res, next) => {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});
export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    setPassword,
    forgotPassword,
    changePassword,
    googleCallbackController,
    resendSignupOtp,
    verifySignupOtp,
};
//# sourceMappingURL=auth.controller.js.map