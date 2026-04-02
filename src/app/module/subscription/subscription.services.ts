import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { stripe } from "../../lib/stripe";


const getAllSubscriptions = async () => {
    return prisma.subscription.findMany({ include: { tenant: true, plan: true }, orderBy: { createdAt: "desc" } });
};

const createCheckoutSession = async (
    tenantId: string,
    planId: string
) => {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
    })

    if (!tenant || !tenant.stripeCustomerId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid tenant")
    }

    const plan = await prisma.plan.findUnique({
        where: { id: planId }
    })

    if (!plan || !plan.isActive) {
        throw new AppError(httpStatus.NOT_FOUND, "Plan not found")
    }

    const activeSub = await prisma.subscription.findFirst({
        where: {
            tenantId,
            status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
            endDate: { gt: new Date() }
        }
    })

    if (activeSub) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Tenant already has active subscription"
        )
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: tenant.stripeCustomerId,
        line_items: [
            {
                price: plan.stripePriceId,
                quantity: 1
            }
        ],
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        metadata: {
            tenantId,
            planId
        }
    })

    return { url: session.url }
}

export const SubscriptionServices = {
    getAllSubscriptions,
    createCheckoutSession,
};