import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { OTPService } from "./otp.services";

const verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const resetToken = await OTPService.verifyResetOtp(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: {
      resetToken,
    },
  });
});
export const OTPController = {
    verifyResetOtp
};
