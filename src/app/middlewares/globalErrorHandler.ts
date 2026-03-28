import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { type TErrorSources } from "../interfaces/error.types";

import { handleRecordNotFoundError } from "../errorHelpers/handleRecordNotFoundError";
import { handleUniqueConstraintError } from "../errorHelpers/handleUniqueConstraintError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import { handleZodError } from "../errorHelpers/handleZodError";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  // Delete uploaded files from Cloudinary if exists
  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path).catch(console.error);
  }
  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
    await Promise.all(imageUrls.map(url => deleteImageFromCLoudinary(url).catch(console.error)));
  }

  let statusCode = 500;
  let message = "Something Went Wrong!!";
  let errorSources: TErrorSources[] = [];

  // Prisma Known Request Error (duplicate / record not found)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        ({ statusCode, message } = handleUniqueConstraintError(err));
        break;
      case "P2025":
        ({ statusCode, message } = handleRecordNotFoundError(err));
        break;
      default:
        statusCode = 500;
        message = err.message;
    }
  }
  // Prisma Validation Error
  else if (err.code === "P2000") {
    const validationErrorResult = handleValidationError(err);
    statusCode = validationErrorResult.statusCode;
    message = validationErrorResult.message;
    errorSources = validationErrorResult.errorSources || [];
  }
  // Zod Validation Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Generic Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });
};