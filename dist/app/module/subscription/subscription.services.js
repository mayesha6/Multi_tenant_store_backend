import { handlePaymentIntentFailed, handlePaymentIntentSucceeded, } from "../../utils/webhook";
import Stripe from "stripe";
import httpStatus from "http-status-codes";
import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { stripe } from "../../lib/stripe";
import { envVars } from "../../config/env";
const createSubscription = async (userId, planId) => {
    console.log("createSubscription - userId:", userId);
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }
        const plan = await tx.plan.findUnique({
            where: { id: planId },
        });
        console.log("createSubscription - plan:", plan);
        if (!plan) {
            throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
        }
        const isLifetimePlan = plan.planName.toLowerCase().includes("lifetime") ||
            plan.interval === "lifetime";
        const startDate = new Date();
        let endDate = null;
        if (isLifetimePlan) {
            endDate = null;
            console.log("🔥 Creating LIFETIME subscription");
        }
        else {
            if (plan.interval === "month") {
                endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + (plan.intervalCount || 1));
                if (endDate.getDate() !== startDate.getDate()) {
                    endDate.setDate(0);
                }
            }
            else if (plan.interval === "year") {
                endDate = new Date(startDate);
                endDate.setFullYear(endDate.getFullYear() + (plan.intervalCount || 1));
            }
            console.log("🔄 Creating SUBSCRIPTION with end date:", endDate);
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(plan.amount * 100),
            currency: "usd",
            metadata: {
                userId: user.id,
                planId,
                planType: isLifetimePlan ? "lifetime" : "subscription",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        const existingSubscription = await tx.subscription.findUnique({
            where: { userId: user.id },
        });
        let subscription;
        if (existingSubscription?.paymentStatus === "PENDING") {
            subscription = await tx.subscription.update({
                where: { userId: user.id },
                data: {
                    planId,
                    stripePaymentId: paymentIntent.id,
                    startDate,
                    amount: plan.amount,
                    endDate: isLifetimePlan ? null : (existingSubscription.endDate || endDate), // 🚨 CHANGE 5: Lifetime handling
                    paymentStatus: "PENDING",
                },
            });
        }
        else {
            subscription = await tx.subscription.create({
                data: {
                    userId: user.id,
                    planId,
                    startDate,
                    amount: plan.amount,
                    stripePaymentId: paymentIntent.id,
                    paymentStatus: "PENDING",
                    endDate,
                },
            });
        }
        return {
            subscription,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            planType: isLifetimePlan ? "lifetime" : "subscription", // 🚨 CHANGE 7: Return plan type
        };
    });
};
const getAllSubscription = async (query) => {
    const queryBuilder = new QueryBuilder(query);
    const prismaQuery = queryBuilder
        .search([""])
        .sort()
        .fields()
        .paginate()
        .build();
    if (!prismaQuery.select) {
        prismaQuery.select = {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            isDeleted: true,
            isVerified: true,
            picture: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true,
            // plan: true,
            Subscription: {
                select: {
                    id: true,
                    planId: true,
                    startDate: true,
                    endDate: true,
                    amount: true,
                    paymentStatus: true,
                    plan: true, // include the related plan
                },
            },
        };
    }
    const [data, total] = await Promise.all([
        prisma.user.findMany(prismaQuery),
        prisma.user.count({
            where: prismaQuery.where || {},
        }),
    ]);
    const meta = queryBuilder.getMeta(total);
    return {
        data,
        meta,
    };
};
const getSingleSubscription = async (subscriptionId) => {
    const result = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    picture: true,
                    email: true,
                    role: true,
                    isSubscribed: true,
                    planExpiration: true,
                },
            },
            plan: true,
        },
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found!");
    }
    return result;
};
const getMySubscription = async (userId) => {
    console.log("getMySubscription - userId:", userId);
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const result = await prisma.subscription.findFirst({
        where: { user: { id: userId } },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    picture: true,
                    email: true,
                    role: true,
                    isSubscribed: true,
                    planExpiration: true,
                },
            },
            plan: true,
        },
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found!");
    }
    return result;
};
const updateSubscription = async (subscriptionId, data) => {
    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
    });
    if (!subscription) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
    }
    const result = await prisma.subscription.update({
        where: { id: subscriptionId },
        data,
    });
    return result;
};
const deleteSubscription = async (subscriptionId) => {
    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
    });
    if (!subscription) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
    }
    return null;
};
const HandleStripeWebhook = async (event) => {
    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                await handlePaymentIntentSucceeded(event.data.object);
                break;
            case "payment_intent.payment_failed":
                await handlePaymentIntentFailed(event.data.object);
                break;
            case "checkout.session.completed":
                const session = event.data.object;
                if (session.metadata?.planType === "lifetime") {
                    await handleLifetimePaymentSuccess(session);
                }
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return { received: true };
    }
    catch (error) {
        console.error("Error handling Stripe webhook:", error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Webhook handling failed");
    }
};
const handleLifetimePaymentSuccess = async (session) => {
    const { userId, planId } = session.metadata;
    if (!userId || !planId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Missing userId or planId in session metadata");
    }
    await prisma.subscription.updateMany({
        where: {
            userId: userId,
            planId: planId,
            paymentStatus: "PENDING"
        },
        data: {
            paymentStatus: "COMPLETED",
            stripePaymentId: session.payment_intent,
        }
    });
    await prisma.user.update({
        where: { id: userId },
        data: {
            isSubscribed: true,
            planExpiration: null,
        }
    });
    console.log("✅ Lifetime payment completed for user:", userId);
};
export const SubscriptionServices = {
    getMySubscription,
    createSubscription,
    getAllSubscription,
    updateSubscription,
    deleteSubscription,
    HandleStripeWebhook,
    getSingleSubscription,
};
//# sourceMappingURL=subscription.services.js.map