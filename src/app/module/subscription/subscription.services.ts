import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import type { ISubscription } from "./subscription.interface";
import { SubscriptionStatus } from "@prisma/client";

const createSubscription = async (payload: ISubscription) => {
    // Check tenant exists
    const tenant = await prisma.tenant.findUnique({ where: { id: payload.tenantId } });
    if (!tenant) throw new AppError(httpStatus.NOT_FOUND, "Tenant not found");

    // Check plan exists
    const plan = await prisma.plan.findUnique({ where: { id: payload.planId } });
    if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");

    // Prevent duplicate active subscription for the same tenant
    const existing = await prisma.subscription.findFirst({
        where: { tenantId: payload.tenantId, planId: payload.planId, status: "ACTIVE" },
    });
    if (existing) throw new AppError(httpStatus.BAD_REQUEST, "Tenant already has an active subscription for this plan");

    return prisma.subscription.create({ data: payload });
};

const getSubscriptionById = async (id: string) => {
    const subscription = await prisma.subscription.findUnique({ where: { id }, include: { tenant: true, plan: true } });
    if (!subscription) throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
    return subscription;
};

const getAllSubscriptions = async () => {
    return prisma.subscription.findMany({ include: { tenant: true, plan: true }, orderBy: { createdAt: "desc" } });
};

const updateSubscription = async (id: string, payload: Partial<ISubscription>) => {
    const subscription = await prisma.subscription.findUnique({ where: { id } });
    if (!subscription) throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");

    return prisma.subscription.update({ where: { id }, data: payload });
};

const cancelSubscription = async (id: string) => {
    const subscription = await prisma.subscription.findUnique({ where: { id } });
    if (!subscription) throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");

    return prisma.subscription.update({ where: { id }, data: { status: SubscriptionStatus.CANCELED } });
};

export const SubscriptionServices = {
    createSubscription,
    getSubscriptionById,
    getAllSubscriptions,
    updateSubscription,
    cancelSubscription,
};