import { Prisma } from "@prisma/client";
import {} from "../interfaces/error.types";
/** Handle Record Not Found */
export const handleRecordNotFoundError = (err) => {
    if (err.code !== "P2025")
        throw err;
    return {
        statusCode: 404,
        message: "Record not found in the database"
    };
};
//# sourceMappingURL=handleRecordNotFoundError.js.map