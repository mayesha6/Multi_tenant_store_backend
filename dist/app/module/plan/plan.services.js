import prisma from "../../lib/prisma";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { stripe } from "../../lib/stripe";
const mapIntervalToStripe = (interval) => {
    switch (interval) {
        case "DAY":
            return "day";
        case "WEEK":
            return "week";
        case "MONTH":
            return "month";
        case "YEAR":
            return "year";
        default:
            return "month";
    }
};
const createPlan = async (payload) => {
    const existingPlan = await prisma.plan.findUnique({
        where: { name: payload.name },
    });
    if (existingPlan) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan already exists");
    }
    const stripeProduct = await stripe.products.create({
        name: payload.name,
        description: payload.features?.join(", "),
    });
    const stripePrice = await stripe.prices.create({
        unit_amount: Math.round(payload.price * 100),
        currency: payload.currency?.toLowerCase() || "usd",
        recurring: {
            interval: mapIntervalToStripe(payload.interval),
        },
        product: stripeProduct.id,
    });
    return prisma.plan.create({
        data: {
            name: payload.name,
            price: payload.price,
            currency: payload.currency || "USD",
            interval: payload.interval,
            features: payload.features || [],
            isActive: payload.isActive ?? true,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
        },
    });
};
const getAllPlans = async () => {
    return prisma.plan.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });
};
const getPlanById = async (id) => {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
    }
    return plan;
};
const updatePlan = async (id, payload) => {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
    }
    const updatedData = { ...payload };
    // FIX: if price or interval changes, create new Stripe price
    if (payload.price !== undefined || payload.interval !== undefined) {
        const newPrice = await stripe.prices.create({
            unit_amount: Math.round((payload.price ?? plan.price) * 100),
            currency: (payload.currency ?? plan.currency).toLowerCase(),
            recurring: {
                interval: mapIntervalToStripe(payload.interval ?? plan.interval),
            },
            product: plan.stripeProductId,
        });
        updatedData.stripePriceId = newPrice.id;
    }
    return prisma.plan.update({
        where: { id },
        data: updatedData,
    });
};
const deletePlan = async (id) => {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
    }
    // FIX: safer to soft-disable instead of hard delete in SaaS billing systems
    return prisma.plan.update({
        where: { id },
        data: { isActive: false },
    });
};
export const PlanServices = {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
};
//# sourceMappingURL=plan.services.js.map