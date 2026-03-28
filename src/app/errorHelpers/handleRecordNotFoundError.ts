import { Prisma } from "@prisma/client";
import { type TGenericErrorResponse } from "../interfaces/error.types";

/** Handle Record Not Found */
export const handleRecordNotFoundError = (err: Prisma.PrismaClientKnownRequestError): TGenericErrorResponse => {
  if (err.code !== "P2025") throw err;

  return {
    statusCode: 404,
    message: "Record not found in the database"
  };
};


