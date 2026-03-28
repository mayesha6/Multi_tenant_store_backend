import { Prisma } from "@prisma/client";
import {} from "../interfaces/error.types";
export const handleUniqueConstraintError = (err) => {
    if (err.code !== "P2002")
        throw err;
    const target = err.meta?.target;
    return {
        statusCode: 400,
        message: target ? `${target.join(", ")} already exists!` : "Duplicate entry exists!"
    };
};
//# sourceMappingURL=handleUniqueConstraintError.js.map