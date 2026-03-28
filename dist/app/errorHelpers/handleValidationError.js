import { Prisma } from "@prisma/client";
import {} from "../interfaces/error.types";
/** Handle Validation / Query Errors */
export const handleValidationError = (err) => {
    return {
        statusCode: 400,
        message: "Prisma Validation Error",
        errorSources: [{ message: err.message }]
    };
};
//# sourceMappingURL=handleValidationError.js.map