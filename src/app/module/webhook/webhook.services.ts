import httpStatus from "http-status-codes";
import prisma from "../../lib/prisma"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { SubscriptionStatus } from "@prisma/client"
import AppError from "../../errorHelpers/AppError";

export type StripeSubWithPeriod = Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
};

// export const mapStripeStatus = (status: Stripe.Subscription.Status) => {
//     switch (status) {
//         case "active": return SubscriptionStatus.ACTIVE;
//         case "trialing": return SubscriptionStatus.TRIALING;
//         case "past_due": return SubscriptionStatus.PAST_DUE;
//         case "canceled":
//         case "unpaid":
//         case "incomplete_expired": return SubscriptionStatus.CANCELED;
//         default: return SubscriptionStatus.INACTIVE;
//     }
// };

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

// const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
//     const subscriptionId = session.subscription as string | undefined;
//     const tenantId = session.metadata?.tenantId;
//     if (!subscriptionId || !tenantId) throw new AppError(400, "Missing subscriptionId or tenantId");

//     const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] });
//     const firstItem = stripeSubscription.items?.data[0];
//     if (!firstItem?.price?.id) throw new AppError(400, "Stripe price info missing");

//     const plan = await prisma.plan.findFirst({ where: { stripePriceId: firstItem.price.id, isActive: true } });
//     if (!plan) throw new AppError(404, "Plan not found for Stripe price");

//     const { startDate, endDate } = getSubscriptionPeriod(stripeSubscription);

//     await prisma.subscription.create({
//         data: {
//             tenantId,
//             planId: plan.id,
//             stripeSubId: subscriptionId,
//             stripeCustomerId: session.customer as string,
//             status: mapStripeStatus(stripeSubscription.status),
//             startDate,
//             endDate,
//             intervalCount: firstItem.quantity ?? 1
//         }
//     });
// };

// const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
//     const { startDate, endDate } = getSubscriptionPeriod(subscription);
//     await prisma.subscription.updateMany({
//         where: { stripeSubId: subscription.id },
//         data: { status: mapStripeStatus(subscription.status), startDate, endDate }
//     });
// };

// const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
//     await prisma.subscription.updateMany({
//         where: { stripeSubId: subscription.id },
//         data: { status: SubscriptionStatus.CANCELED }
//     });
// };

// const handleInvoicePaid = async (invoice: any) => {
//     const subscriptionId = invoice.subscription as string | undefined;
//     if (!subscriptionId) return console.warn("Invoice paid with no subscription ID");
//     await prisma.subscription.updateMany({
//         where: { stripeSubId: subscriptionId },
//         data: { status: SubscriptionStatus.ACTIVE }
//     });
// };

// const handlePaymentFailed = async (invoice: any) => {
//     const subscriptionId = invoice.subscription as string | undefined;
//     if (!subscriptionId) return console.warn("Payment failed with no subscription ID");
//     await prisma.subscription.updateMany({
//         where: { stripeSubId: subscriptionId },
//         data: { status: SubscriptionStatus.PAST_DUE }
//     });
// };

// export const StripeWebhookServices = {
//     handleCheckoutCompleted,
//     handleSubscriptionUpdated,
//     handleSubscriptionDeleted,
//     handleInvoicePaid,
//     handlePaymentFailed
// };


const mapStripeStatus = (
    status: Stripe.Subscription.Status
): SubscriptionStatus => {
    switch (status) {
        case "active":
            return SubscriptionStatus.ACTIVE
        case "trialing":
            return SubscriptionStatus.TRIALING
        case "past_due":
            return SubscriptionStatus.PAST_DUE
        case "canceled":
        case "unpaid":
        case "incomplete_expired":
            return SubscriptionStatus.CANCELED
        default:
            return SubscriptionStatus.INACTIVE
    }
}

export const StripeWebhookService = {
    handleEvent: async (event: Stripe.Event) => {
        const exists = await prisma.webhookEvent.findUnique({
            where: { eventId: event.id }
        })

        if (exists) return

        await prisma.webhookEvent.create({
            data: {
                eventId: event.id,
                type: event.type,
                payload: event as any
            }
        })

        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(
                    event.data.object as Stripe.Checkout.Session
                )
                break

            case "customer.subscription.updated":
                await handleSubscriptionUpdated(
                    event.data.object as Stripe.Subscription
                )
                break

            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(
                    event.data.object as Stripe.Subscription
                )
                break

            case "invoice.paid":
                await handleInvoicePaid(event.data.object as Stripe.Invoice)
                break

            case "invoice.payment_failed":
                await handleInvoiceFailed(event.data.object as Stripe.Invoice)
                break
        }

    }
}

const handleCheckoutCompleted = async (
    session: Stripe.Checkout.Session
) => {
    const subscriptionId = session.subscription as string
    const tenantId = session.metadata?.tenantId

    if (!subscriptionId || !tenantId) return

    const stripeSub = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price"]
    })

    const priceItem = stripeSub.items.data[0]
    if (!priceItem?.price) return

    const priceId = priceItem.price.id

    const plan = await prisma.plan.findFirst({
        where: { stripePriceId: priceId }
    })

    if (!plan) return

    const sub = stripeSub as StripeSubWithPeriod
    const startDate = new Date(
        (sub.current_period_start ?? 0) * 1000
    )

    const endDate = new Date(
        (sub.current_period_end ?? 0) * 1000
    )

    await prisma.subscription.upsert({
        where: { stripeSubId: stripeSub.id },
        update: {
            status: mapStripeStatus(stripeSub.status),
            startDate,
            endDate
        },
        create: {
            tenantId,
            planId: plan.id,
            stripeSubId: stripeSub.id,
            stripeCustomerId: stripeSub.customer as string,
            status: mapStripeStatus(stripeSub.status),
            startDate,
            endDate
        }
    })

    await prisma.tenant.update({
        where: { id: tenantId },
        data: {
            isActive: stripeSub.status === "active",
            currentPlanId: plan.id,
            currentSubId: stripeSub.id
        }
    })
}

const handleSubscriptionUpdated = async (
    subscription: Stripe.Subscription
) => {
    const { startDate, endDate } = getSubscriptionPeriod(subscription);
    await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: {
            status: mapStripeStatus(subscription.status),
            startDate,
            endDate
        }
    })
}

const handleSubscriptionDeleted = async (
    subscription: Stripe.Subscription
) => {
    const dbSub = await prisma.subscription.findFirst({
        where: { stripeSubId: subscription.id }
    })

    if (!dbSub) return

    await prisma.subscription.update({
        where: { id: dbSub.id },
        data: { status: SubscriptionStatus.CANCELED }
    })

    await prisma.tenant.update({
        where: { id: dbSub.tenantId },
        data: {
            isActive: false,
            currentPlanId: null,
            currentSubId: null
        }
    })
}

const handleInvoicePaid = async (invoice: any) => {
    const subscriptionId = invoice.subscription as string
    if (!subscriptionId) return

    await prisma.subscription.updateMany({
        where: { stripeSubId: subscriptionId },
        data: { status: SubscriptionStatus.ACTIVE }
    })
}

const handleInvoiceFailed = async (invoice: any) => {
    const subscriptionId = invoice.subscription as string
    if (!subscriptionId) return

    await prisma.subscription.updateMany({
        where: { stripeSubId: subscriptionId },
        data: { status: SubscriptionStatus.PAST_DUE }
    })
}