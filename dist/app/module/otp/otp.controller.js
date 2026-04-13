import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { OTPService } from "./otp.services";
const verifyResetOtp = catchAsync(async (req, res) => {
    const { email, otp } = req.body;
    await OTPService.verifyResetOtp(email, otp);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
});
export const OTPController = {
    verifyResetOtp
};
//# sourceMappingURL=otp.controller.js.map