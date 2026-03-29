import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import prisma from "../lib/prisma";
import { IsActive, PaymentStatus, UserRole } from "@prisma/client";
import { SubscriptionStatus } from "../utils/enums";
export const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];
        if (!accessToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, "No access token provided");
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: verifiedToken.userId },
        });
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }
        if (!user.isVerified) {
            throw new AppError(httpStatus.FORBIDDEN, "User not verified");
        }
        if (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.FORBIDDEN, `User is ${user.isActive}`);
        }
        if (user.isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, "User deleted");
        }
        // Role check
        if (authRoles.length && !authRoles.includes(user.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to access this route");
        }
        // Super admin bypass tenant + subscription check
        if (user.role !== UserRole.SUPER_ADMIN) {
            // Tenant isolation check
            if (!user.tenantId) {
                throw new AppError(httpStatus.FORBIDDEN, "User not assigned to any tenant");
            }
            const subscription = await prisma.subscription.findFirst({
                where: {
                    tenantId: user.tenantId,
                    status: SubscriptionStatus.ACTIVE,
                },
            });
            if (!subscription) {
                throw new AppError(httpStatus.FORBIDDEN, "Subscription inactive. Please renew.");
            }
            // Attach tenant scoped data
            req.user = {
                userId: user.id,
                role: user.role,
                tenantId: user.tenantId,
            };
        }
        else {
            req.user = {
                userId: user.id,
                role: user.role,
            };
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=checkAuth.js.map