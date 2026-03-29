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

const createUser = async (payload: IUser) => {
  const { email, password, name, phone, picture, address, tenantId, role } = payload;

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
      tenantId: tenantId ?? null,
      role,
      auths: {
        create: {
          provider: AuthProvider.credentials,
          providerId: email,
        },
      },
    },
  });


  return user;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder<Prisma.UserWhereInput>(query);

  const prismaQuery = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate()
    .build();

  if (!prismaQuery.select) {
    prismaQuery.select = {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isDeleted: true,
      isVerified: true,
      isSubscribed: true,
      picture: true,
      phone: true,
      address: true,
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
      createdAt: true,
    },
  });

  return { data: user };
};

const getSingleUser = async (id: string) => {
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
      createdAt: true,
    },
  });

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

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (decodedToken.role === UserRole.VIEWER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  if (
    decodedToken.role === UserRole.ADMIN &&
    existingUser.role === UserRole.SUPER_ADMIN
  ) {
    throw new AppError(401, "You are not authorized");
  }

  if (
    decodedToken.role === UserRole.VIEWER &&
    (payload.role || payload.isActive || payload.isDeleted || payload.isVerified)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
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

  if (!user) throw new AppError(404, "User not found");

  if (
    decodedToken.role === UserRole.VIEWER &&
    decodedToken.userId !== userId
  ) {
    throw new AppError(403, "You are not authorized");
  }

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

export const UserServices = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  updateUser,
  updateMyProfile,
};