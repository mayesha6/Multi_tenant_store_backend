import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import prisma from "../lib/prisma";
import { IsActive, UserRole } from "@prisma/client";
import { SubscriptionStatus } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";

export const checkAuth =
    (...authRoles: UserRole[]) =>
        async (req: any, res: any, next: any) => {
            try {
                // ✅ Get token (cookie OR header)
                const accessToken =
                    req.cookies?.accessToken ||
                    req.headers.authorization?.split(" ")[1];

                if (!accessToken) {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        "No access token provided"
                    );
                }

                const verifiedToken = verifyToken(
                    accessToken,
                    envVars.JWT_ACCESS_SECRET
                ) as JwtPayload;

                const user = await prisma.user.findUnique({
                    where: { id: verifiedToken.userId },
                });

                if (!user) {
                    throw new AppError(httpStatus.NOT_FOUND, "User not found");
                }

                if (!user.isVerified) {
                    throw new AppError(httpStatus.FORBIDDEN, "User not verified");
                }

                if (
                    user.isActive === IsActive.BLOCKED ||
                    user.isActive === IsActive.INACTIVE
                ) {
                    throw new AppError(
                        httpStatus.FORBIDDEN,
                        `User is ${user.isActive}`
                    );
                }

                if (user.isDeleted) {
                    throw new AppError(httpStatus.FORBIDDEN, "User deleted");
                }

                // ✅ Role check
                if (authRoles.length && !authRoles.includes(user.role)) {
                    throw new AppError(
                        httpStatus.FORBIDDEN,
                        "You are not permitted to access this route"
                    );
                }

                // ✅ Attach base user info
                req.user = {
                    userId: user.id,
                    role: user.role,
                    tenantId: user.tenantId,
                };

                // ✅ SUPER ADMIN bypass everything
                if (user.role === UserRole.SUPER_ADMIN) {
                    return next();
                }

                // -----------------------------
                // 🧠 ONBOARDING SAFE LOGIC
                // -----------------------------

                const url = req.originalUrl;

                // ✅ Routes allowed without tenant (onboarding phase)
                const allowWithoutTenant = [
                    "/api/v1/tenant",              // create workspace
                    "/api/v1/plan",                // view plans
                    "/api/v1/subscription/checkout" // optional
                ];

                const isAllowedWithoutTenant = allowWithoutTenant.some((route) =>
                    url.startsWith(route)
                );

                // ❌ Block if no tenant AND not allowed route
                if (!user.tenantId && !isAllowedWithoutTenant) {
                    throw new AppError(
                        httpStatus.FORBIDDEN,
                        "User not assigned to any tenant"
                    );
                }

                // -----------------------------
                // 💳 SUBSCRIPTION CHECK
                // -----------------------------

                // ✅ Skip subscription check for onboarding routes
                const skipSubscriptionCheck = [
                    "/api/v1/tenant",
                    "/api/v1/plan",
                    "/api/v1/subscription",
                    "/api/v1/subscription/checkout",
                ];

                const shouldSkipSubscription = skipSubscriptionCheck.some((route) =>
                    url.startsWith(route)
                );

                if (!shouldSkipSubscription && user.tenantId) {
                    const subscription = await prisma.subscription.findFirst({
                        where: {
                            tenantId: user.tenantId,
                            status: {
                                in: [
                                    SubscriptionStatus.ACTIVE,
                                    SubscriptionStatus.TRIALING,
                                ],
                            },
                        },
                    });

                    if (!subscription) {
                        throw new AppError(
                            httpStatus.FORBIDDEN,
                            "Subscription inactive. Please upgrade your plan."
                        );
                    }
                }

                next();
            } catch (error) {
                next(error);
            }
        };