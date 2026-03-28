import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import crypto from "crypto";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import prisma from "../../lib/prisma";
import { redisClient } from "../../config/redis.config";
import { IsActive, AuthProvider } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
    return {
        accessToken: newAccessToken,
    };
};
const resetPassword = async (token, newPassword) => {
    let decoded;
    try {
        decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET);
    }
    catch (err) {
        throw new AppError(401, "Invalid or expired reset token");
    }
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
    return {
        message: "Password reset successfully",
    };
};
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user)
        throw new AppError(404, "User not found");
    if (!user.isVerified)
        throw new AppError(401, "User not verified");
    if (user.isDeleted)
        throw new AppError(400, "User is deleted");
    if (user.isActive === IsActive.BLOCKED ||
        user.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${user.isActive}`);
    }
    const redisKey = `otp:reset:${email}`;
    const existingOtp = await redisClient.get(redisKey);
    if (existingOtp) {
        throw new AppError(429, "OTP already sent. Please wait 2 minutes.");
    }
    const generateOtp = (length = 6) => {
        return crypto
            .randomInt(10 ** (length - 1), 10 ** length)
            .toString();
    };
    const otp = generateOtp();
    await redisClient.set(redisKey, otp, {
        expiration: { type: "EX", value: 120 },
    });
    await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp,
        },
    });
};
const sendSignupOtp = async (email, name) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser && existingUser.isVerified) {
        throw new AppError(400, "User already exists and verified");
    }
    const redisKey = `otp:signup:${email}`;
    const existingOtp = await redisClient.get(redisKey);
    if (existingOtp) {
        throw new AppError(429, "OTP already sent. Please wait 2 minutes.");
    }
    const generateOtp = (length = 6) => {
        return crypto
            .randomInt(10 ** (length - 1), 10 ** length)
            .toString();
    };
    const otp = generateOtp();
    await redisClient.set(redisKey, otp, {
        expiration: { type: "EX", value: 120 },
    });
    await sendEmail({
        to: email,
        subject: "Verify Your Account",
        templateName: "otp",
        templateData: {
            name,
            otp,
        },
    });
    return {
        message: "OTP sent successfully",
    };
};
const verifySignupOtp = async (payload) => {
    const { email, otp } = payload;
    const redisKey = `otp:signup:${email}`;
    const storedOtp = await redisClient.get(redisKey);
    if (!storedOtp) {
        throw new AppError(400, "OTP expired or not found");
    }
    if (storedOtp !== otp) {
        throw new AppError(400, "Invalid OTP");
    }
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser && existingUser.isVerified) {
        throw new AppError(400, "User already verified");
    }
    //   const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
        where: { email },
        data: {
            //   name,
            //   email,
            //   password: hashedPassword,
            isVerified: true,
        },
    });
    await redisClient.del(redisKey);
    return {
        message: "User registered successfully",
        user,
    };
};
const setPassword = async (userId, plainPassword) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { auths: true },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const hasGoogleAuth = user.auths.some((provider) => provider.provider === AuthProvider.google);
    if (user.password && hasGoogleAuth) {
        throw new AppError(httpStatus.BAD_REQUEST, "You already set a password. Change it from profile settings.");
    }
    const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));
    const hasCredentialAuth = user.auths.some((provider) => provider.provider === AuthProvider.credentials);
    if (!hasCredentialAuth) {
        await prisma.auth.create({
            data: {
                provider: AuthProvider.credentials,
                providerId: user.email,
                userId: user.id,
            },
        });
    }
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
};
const changePassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
    });
    if (!user || !user.password) {
        throw new AppError(404, "User not found");
    }
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }
    const hashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
};
export const AuthServices = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    sendSignupOtp,
    verifySignupOtp,
};
//# sourceMappingURL=auth.services.js.map