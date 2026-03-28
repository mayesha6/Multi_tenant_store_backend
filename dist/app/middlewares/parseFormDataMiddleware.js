export const parseFormDataMiddleware = (req, res, next) => {
    try {
        // Parse FormData JSON if exists
        if (req.body && typeof req.body.data === "string") {
            req.body = JSON.parse(req.body.data);
        }
        else if (!req.body) {
            req.body = {};
        }
        // Convert comma-separated strings into arrays
        if (req.body.travelInterests && typeof req.body.travelInterests === "string") {
            req.body.travelInterests = req.body.travelInterests
                .split(",")
                .map((x) => x.trim())
                .filter((x) => x); // remove empty strings
        }
        if (req.body.visitedCountries && typeof req.body.visitedCountries === "string") {
            req.body.visitedCountries = req.body.visitedCountries
                .split(",")
                .map((x) => x.trim())
                .filter((x) => x);
        }
    }
    catch (error) {
        console.error("Error processing update-my-profile request:", error);
        return next(error);
    }
    next();
};
//# sourceMappingURL=parseFormDataMiddleware.js.map