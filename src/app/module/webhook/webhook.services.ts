import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";

export type StripeSubWithPeriod = Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
};

export const mapStripeStatus = (status: Stripe.Subscription.Status) => {
    switch (status) {
        case "active": return SubscriptionStatus.ACTIVE;
        case "trialing": return SubscriptionStatus.TRIALING;
        case "past_due": return SubscriptionStatus.PAST_DUE;
        case "canceled":
        case "unpaid":
        case "incomplete_expired": return SubscriptionStatus.CANCELED;
        default: return SubscriptionStatus.INACTIVE;
    }
};

const getSubscriptionPeriod = (subscription: Stripe.Subscription) => {
    const sub = subscription as StripeSubWithPeriod;
    if (!sub.current_period_start || !sub.current_period_end) {
        throw new AppError(httpStatus.BAD_REQUEST, "Stripe subscription period missing");
    }
    return {
        startDate: new Date(sub.current_period_start * 1000),
        endDate: new Date(sub.current_period_end * 1000)
    };
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
    const subscriptionId = session.subscription as string | undefined;
    const tenantId = session.metadata?.tenantId;
    if (!subscriptionId || !tenantId) throw new AppError(400, "Missing subscriptionId or tenantId");

    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] });
    const firstItem = stripeSubscription.items?.data[0];
    if (!firstItem?.price?.id) throw new AppError(400, "Stripe price info missing");

    const plan = await prisma.plan.findFirst({ where: { stripePriceId: firstItem.price.id, isActive: true } });
    if (!plan) throw new AppError(404, "Plan not found for Stripe price");

    const { startDate, endDate } = getSubscriptionPeriod(stripeSubscription);

    await prisma.subscription.create({
        data: {
            tenantId,
            planId: plan.id,
            stripeSubId: subscriptionId,
            stripeCustomerId: session.customer as string,
            status: mapStripeStatus(stripeSubscription.status),
            startDate,
            endDate,
            intervalCount: firstItem.quantity ?? 1
        }
    });
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
    const { startDate, endDate } = getSubscriptionPeriod(subscription);
    await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: { status: mapStripeStatus(subscription.status), startDate, endDate }
    });
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
    await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: { status: SubscriptionStatus.CANCELED }
    });
};

const handleInvoicePaid = async (invoice: any) => {
    const subscriptionId = invoice.subscription as string | undefined;
    if (!subscriptionId) return console.warn("Invoice paid with no subscription ID");
    await prisma.subscription.updateMany({
        where: { stripeSubId: subscriptionId },
        data: { status: SubscriptionStatus.ACTIVE }
    });
};

const handlePaymentFailed = async (invoice: any) => {
    const subscriptionId = invoice.subscription as string | undefined;
    if (!subscriptionId) return console.warn("Payment failed with no subscription ID");
    await prisma.subscription.updateMany({
        where: { stripeSubId: subscriptionId },
        data: { status: SubscriptionStatus.PAST_DUE }
    });
};

export const StripeWebhookServices = {
    handleCheckoutCompleted,
    handleSubscriptionUpdated,
    handleSubscriptionDeleted,
    handleInvoicePaid,
    handlePaymentFailed
};