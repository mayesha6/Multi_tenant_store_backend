import { Prisma } from "@prisma/client";
import { type TGenericErrorResponse } from "../interfaces/error.types";

/** Handle Validation / Query Errors */
export const handleValidationError = (err: Prisma.PrismaClientValidationError): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Prisma Validation Error",
    errorSources: [{ message: err.message }]
  };
};