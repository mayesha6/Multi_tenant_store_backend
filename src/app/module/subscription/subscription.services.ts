import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import type { ISubscription } from "./subscription.interface";
import { SubscriptionStatus } from "@prisma/client";
import { stripe } from "../../lib/stripe";
import { mapStripeStatus, type StripeSubWithPeriod } from "../webhook/webhook.services";

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

// const createStripeSubscription = async (tenantId: string, stripePriceId: string, paymentMethodId: string) => {
//     const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
//     if (!tenant) throw new Error("Tenant not found");
//     if (!tenant.stripeCustomerId) {
//         throw new AppError(400, "Tenant does not have a Stripe customer ID");
//     }


//     const plan = await prisma.plan.findFirst({
//         where: {
//             stripePriceId: stripePriceId,
//             isActive: true
//         }
//     });

//     if (!plan) {
//         throw new AppError(404, "Plan not found for this Stripe price");
//     }

//     // UPDATED: attach payment method to customer
//     await stripe.paymentMethods.attach(paymentMethodId, {
//         customer: tenant.stripeCustomerId
//     });

//     // UPDATED: set default payment method
//     await stripe.customers.update(tenant.stripeCustomerId, {
//         invoice_settings: {
//             default_payment_method: paymentMethodId
//         }
//     });

//     // Create subscription in Stripe
//     const subscription = await stripe.subscriptions.create({
//         customer: tenant.stripeCustomerId,
//         items: [{ price: stripePriceId }],
//         default_payment_method: paymentMethodId,
//         payment_behavior: "default_incomplete",
//         expand: ["latest_invoice.payment_intent"]
//     });

//     const sub = subscription as StripeSubWithPeriod

//     if (!sub.current_period_start || !sub.current_period_end) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             "Stripe subscription period data missing"
//         )
//     }

//     // Save subscription in DB
//     const dbSub = await prisma.subscription.create({
//         data: {
//             tenantId: tenant.id,
//             planId: plan.id, // or assign your plan id here
//             stripeSubId: subscription.id,
//             stripeCustomerId: tenant.stripeCustomerId,
//             status: mapStripeStatus(subscription.status),
//             startDate: new Date(sub.current_period_start * 1000),
//             endDate: new Date(sub.current_period_end * 1000),
//         }
//     });

//     return dbSub;
// };


export const attachPaymentMethod = async (tenantId: string, paymentMethodId: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new AppError(httpStatus.NOT_FOUND, "Tenant not found");
  if (!tenant.stripeCustomerId) throw new AppError(400, "Tenant has no Stripe customer");

  // Attach payment method
  await stripe.paymentMethods.attach(paymentMethodId, { customer: tenant.stripeCustomerId });

  // Set default payment method
  await stripe.customers.update(tenant.stripeCustomerId, {
    invoice_settings: { default_payment_method: paymentMethodId }
  });

  return { success: true };
};

// Create Stripe subscription and store in DB
export const createStripeSubscription = async (tenantId: string, stripePriceId: string, paymentMethodId: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant || !tenant.stripeCustomerId) throw new AppError(400, "Invalid tenant or missing Stripe customer");

  const plan = await prisma.plan.findFirst({ where: { stripePriceId, isActive: true } });
  if (!plan) throw new AppError(404, "Plan not found");

  await attachPaymentMethod(tenantId, paymentMethodId); // attach card

  const subscription = await stripe.subscriptions.create({
    customer: tenant.stripeCustomerId,
    items: [{ price: stripePriceId }],
    default_payment_method: paymentMethodId,
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"]
  });

  const sub = subscription as StripeSubWithPeriod;

  return prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planId: plan.id,
      stripeSubId: subscription.id,
      stripeCustomerId: tenant.stripeCustomerId,
      status: subscription.status === "active" ? SubscriptionStatus.ACTIVE : SubscriptionStatus.INACTIVE,
      startDate: sub.current_period_start ? new Date(sub.current_period_start * 1000) : new Date(),
      endDate: sub.current_period_end ? new Date(sub.current_period_end * 1000) : new Date(),
      intervalCount: subscription.items.data[0]?.quantity ?? 1
    }
  });
};
const createCheckoutSession = async (tenantId: string, stripePriceId: string) => {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
    })

    if (!tenant || !tenant.stripeCustomerId) {
        throw new AppError(400, "Invalid tenant")
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: tenant.stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
            {
                price: stripePriceId,
                quantity: 1
            }
        ],
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        metadata: {
            tenantId
        }
    })

    return session.url
}

const subscribeTenantToPlan = async (tenantId: string, stripePriceId: string, paymentMethodId: string) => {
  return createStripeSubscription(tenantId, stripePriceId, paymentMethodId);
};

export const SubscriptionServices = {
    createSubscription,
    getSubscriptionById,
    getAllSubscriptions,
    updateSubscription,
    cancelSubscription,
    createStripeSubscription,
    createCheckoutSession,
    subscribeTenantToPlan
};