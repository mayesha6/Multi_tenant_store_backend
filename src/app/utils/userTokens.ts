import httpStatus from "http-status-codes";
import { type JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { generateToken, verifyToken } from "./jwt";
import prisma from "../lib/prisma";
import { IsActive } from "@prisma/client";

/**
 * Create Access + Refresh Token
 */
export const createUserTokens = (user: {
  id: string;
  email: string;
  role: string;
}) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Generate New Access Token Using Refresh Token
 */
export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await prisma.user.findUnique({
    where: { email: verifiedRefreshToken.email },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const newAccessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return newAccessToken;
};