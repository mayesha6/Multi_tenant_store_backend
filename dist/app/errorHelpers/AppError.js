class AppError extends Error {
    statusCode;
    constructor(statusCode, message, stack = '') {
        super(message); // throw new Error("Something went wrong")
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map