import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../lib/prisma";
import bcryptjs from "bcryptjs";
import type { JwtPayload } from "jsonwebtoken";
import {
  deleteImageFromCLoudinary,
  uploadBufferToCloudinary,
} from "../../config/cloudinary.config";
import { AuthProvider, UserRole, IsActive, Prisma } from "@prisma/client";
import type { IUser } from "./user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { generateOtp } from "../otp/otp.services";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";

const createUser = async (payload: IUser) => {
  // SECURITY:
  // Never trust role/tenantId from public registration payload.
  // New public users always start as VIEWER and without tenant.
  const { email, password, name, phone, picture, address } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone: phone ?? null,
      picture: picture ?? null,
      address: address ?? null,

      // SECURITY:
      // public signup users should not be placed in a tenant directly
      tenantId: null,

      // SECURITY:
      // fixed safe default role
      role: UserRole.VIEWER,

      auths: {
        create: {
          provider: AuthProvider.credentials,
          providerId: email,
        },
      },
    },
  });

  const redisKey = `otp:signup:${email}`;
  const otp = generateOtp();

  await redisClient.set(redisKey, otp, {
    expiration: { type: "EX", value: 120 },
  });

  await sendEmail({
    to: email,
    subject: "Account Verification OTP",
    templateName: "otp",
    templateData: {
      name: user.name,
      otp,
    },
  });

  return user;
};

const getAllUsers = async (
  query: Record<string, string>,
  currentUser: JwtPayload
) => {
  const queryBuilder = new QueryBuilder<Prisma.UserWhereInput>(query);

  const prismaQuery = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate()
    .build();

  // Multi-tenant safety:
  // SUPER_ADMIN can view all users
  // OWNER/ADMIN can only view users from their own tenant
  if (currentUser.role !== UserRole.SUPER_ADMIN) {
    if (!currentUser.tenantId) {
      throw new AppError(httpStatus.BAD_REQUEST, "User has no tenant");
    }

    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      tenantId: currentUser.tenantId,
      isDeleted: false,
    };
  } else {
    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      isDeleted: false,
    };
  }

  if (!prismaQuery.select) {
    prismaQuery.select = {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isDeleted: true,
      isVerified: true,
      picture: true,
      phone: true,
      address: true,
      tenantId: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany(prismaQuery),
    prisma.user.count({
      where: prismaQuery.where || {},
    }),
  ]);

  const meta = queryBuilder.getMeta(total);

  return {
    data,
    meta,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isDeleted: true,
      isVerified: true,
      picture: true,
      phone: true,
      address: true,
      tenantId: true,
      createdAt: true,
    },
  });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return { data: user };
};

const getSingleUser = async (id: string, currentUser: JwtPayload) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isDeleted: true,
      isVerified: true,
      picture: true,
      phone: true,
      address: true,
      tenantId: true,
      createdAt: true,
    },
  });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // SUPER_ADMIN can access anyone
  if (currentUser.role !== UserRole.SUPER_ADMIN) {
    // same tenant only
    if (!currentUser.tenantId || user.tenantId !== currentUser.tenantId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  return { data: user };
};

const updateUser = async (
  userId: string,
  payload: any,
  decodedToken: JwtPayload
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // VIEWER can only update self basic profile fields
  if (decodedToken.role === UserRole.VIEWER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
  }

  // Non-super-admin users must stay inside their own tenant boundary
  if (decodedToken.role !== UserRole.SUPER_ADMIN) {
    if (!decodedToken.tenantId || existingUser.tenantId !== decodedToken.tenantId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // ADMIN cannot update SUPER_ADMIN
  if (
    decodedToken.role === UserRole.ADMIN &&
    existingUser.role === UserRole.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  // VIEWER cannot update system/security fields
  if (
    decodedToken.role === UserRole.VIEWER &&
    (payload.role ||
      payload.isActive ||
      payload.isDeleted ||
      payload.isVerified ||
      payload.tenantId)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  // SECURITY:
  // Prevent tenant reassignment through generic update route
  if (payload.tenantId !== undefined && decodedToken.role !== UserRole.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Tenant reassignment is not allowed");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return updatedUser;
};

const updateMyProfile = async (
  userId: string,
  payload: any,
  decodedToken: JwtPayload,
  file?: Express.Multer.File
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (decodedToken.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  // SECURITY:
  // Block sensitive/system fields from self-profile update
  delete payload.role;
  delete payload.isActive;
  delete payload.isDeleted;
  delete payload.isVerified;
  delete payload.tenantId;
  delete payload.auths;

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  if (file) {
    if (user.picture) {
      await deleteImageFromCLoudinary(user.picture);
    }

    const uploadResult = await uploadBufferToCloudinary(
      file.buffer,
      `profile-${userId}`
    );

    payload.picture = uploadResult?.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return updatedUser;
};

const deleteUserById = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Soft delete for SaaS safety
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: IsActive.INACTIVE,
    },
  });

  return { message: "User deleted successfully" };
};

export const UserServices = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  updateUser,
  updateMyProfile,
  deleteUserById
};