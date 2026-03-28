import { Prisma } from "@prisma/client";
import { type TGenericErrorResponse } from "../interfaces/error.types";

export const handleUniqueConstraintError = (err: Prisma.PrismaClientKnownRequestError): TGenericErrorResponse => {
  if (err.code !== "P2002") throw err;

  const target = err.meta?.target as string[] | undefined;

  return {
    statusCode: 400,
    message: target ? `${target.join(", ")} already exists!` : "Duplicate entry exists!"
  };
};