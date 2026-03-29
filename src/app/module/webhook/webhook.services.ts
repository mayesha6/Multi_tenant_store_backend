import prisma from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import AppError from "../../errorHelpers/AppError"
import httpStatus from "http-status-codes"
import Stripe from "stripe"

type StripeSubWithPeriod = Stripe.Subscription & {
    current_period_start?: number
    current_period_end?: number
}

const mapStripeStatus = (status: Stripe.Subscription.Status) => {
    switch (status) {
        case "active":
            return "ACTIVE"
        case "trialing":
            return "TRIALING"
        case "past_due":
            return "PAST_DUE"
        case "canceled":
        case "unpaid":
        case "incomplete_expired":
            return "CANCELED"
        default:
            return "INACTIVE"
    }
}

const getSubscriptionPeriod = (subscription: Stripe.Subscription) => {
    const sub = subscription as StripeSubWithPeriod

    if (!sub.current_period_start || !sub.current_period_end) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Stripe subscription period data missing"
        )
    }

    return {
        startDate: new Date(sub.current_period_start * 1000),
        endDate: new Date(sub.current_period_end * 1000),
    }
}

const handleCheckoutCompleted = async (
    session: Stripe.Checkout.Session
) => {
    const subscriptionId = session.subscription as string | null
    const tenantId = session.metadata?.tenantId

    if (!subscriptionId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Subscription ID missing from session"
        )
    }

    if (!tenantId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Tenant metadata missing in checkout session"
        )
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
        subscriptionId,
        {
            expand: ["items.data.price"],
        }
    )
    const items = stripeSubscription.items?.data

    if (!items || items.length === 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Stripe subscription items missing"
        )
    }

    const firstItem = items[0]

    if (!firstItem || !firstItem.price?.id) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Stripe price information missing"
        )
    }

    const stripePriceId = firstItem.price.id

    const plan = await prisma.plan.findFirst({
        where: {
            stripePriceId,
            isActive: true,
        },
    })

    if (!plan) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Plan not found for Stripe price"
        )
    }

    const { startDate, endDate } =
        getSubscriptionPeriod(stripeSubscription)

    await prisma.subscription.create({
        data: {
            tenantId,
            planId: plan.id,
            stripeSubId: stripeSubscription.id,
            stripeCustomerId: session.customer as string,
            status: mapStripeStatus(stripeSubscription.status),
            startDate,
            endDate,
            intervalCount: firstItem.quantity ?? 1,
        },
    })
}

const handleSubscriptionUpdated = async (
    subscription: Stripe.Subscription
) => {
    const { startDate, endDate } =
        getSubscriptionPeriod(subscription)

    await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: {
            status: mapStripeStatus(subscription.status),
            startDate,
            endDate,
        },
    })
}

const handleSubscriptionDeleted = async (
    subscription: Stripe.Subscription
) => {
    await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: {
            status: "CANCELED",
        },
    })
}

export const StripeWebhookServices = {
    handleCheckoutCompleted,
    handleSubscriptionUpdated,
    handleSubscriptionDeleted,
}