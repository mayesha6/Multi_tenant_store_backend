import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { stripe } from "../../lib/stripe";
import { envVars } from "../../config/env";
import { UserRole } from "@prisma/client";

const getAllSubscriptions = async (currentUser: any) => {
  // FIX: super admin sees all, tenant users see only their tenant subscriptions
  if (currentUser.role === UserRole.SUPER_ADMIN) {
    return prisma.subscription.findMany({
      include: { tenant: true, plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!currentUser.tenantId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has no tenant");
  }

  return prisma.subscription.findMany({
    where: { tenantId: currentUser.tenantId },
    include: { tenant: true, plan: true },
    orderBy: { createdAt: "desc" },
  });
};

const createCheckoutSession = async (currentUser: any, planId: string) => {
  if (!currentUser.tenantId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has no tenant");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: currentUser.tenantId },
  });

  if (!tenant || !tenant.stripeCustomerId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid tenant");
  }

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan || !plan.isActive) {
    throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
  }

  const activeSub = await prisma.subscription.findFirst({
    where: {
      tenantId: tenant.id,
      status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      endDate: { gt: new Date() },
    },
  });

  if (activeSub) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Tenant already has an active subscription"
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: tenant.stripeCustomerId,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],

    // FIX: never hardcode localhost in service
    success_url: `${envVars.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/billing/cancel`,

    metadata: {
      tenantId: tenant.id,
      planId: plan.id,
      userId: currentUser.userId,
    },
  });

  return { url: session.url };
};

export const SubscriptionServices = {
  getAllSubscriptions,
  createCheckoutSession,
};