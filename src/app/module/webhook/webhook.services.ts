import prisma from "../../lib/prisma";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus, Interval } from "@prisma/client";

type StripeInvoiceWithSub = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription;
};

const mapStripeStatus = (
  status: Stripe.Subscription.Status
): SubscriptionStatus => {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return SubscriptionStatus.CANCELED;
    default:
      return SubscriptionStatus.INACTIVE;
  }
};

const isTenantActive = (status: Stripe.Subscription.Status) => {
  return status === "active" || status === "trialing";
};

const getFallbackEndTimestamp = (
  created: number,
  interval: Interval
): number => {
  switch (interval) {
    case "DAY":
      return created + 1 * 24 * 60 * 60;
    case "WEEK":
      return created + 7 * 24 * 60 * 60;
    case "MONTH":
      return created + 30 * 24 * 60 * 60;
    case "YEAR":
      return created + 365 * 24 * 60 * 60;
    default:
      return created + 30 * 24 * 60 * 60;
  }
};

const getPeriodFromSubscriptionObject = (
  subscription: Stripe.Subscription,
  interval: Interval
) => {
  const start =
    (subscription as any).current_period_start ?? subscription.created;

  const end =
    (subscription as any).current_period_end ??
    getFallbackEndTimestamp(subscription.created, interval);

  return {
    startDate: new Date(start * 1000),
    endDate: new Date(end * 1000),
  };
};

export const StripeWebhookService = {
  handleEvent: async (event: Stripe.Event) => {
    const exists = await prisma.webhookEvent.findUnique({
      where: { eventId: event.id },
    });

    if (exists) return;

    await prisma.webhookEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        payload: event as any,
      },
    });

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;

        case "invoice.paid":
          await handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case "invoice.payment_failed":
          await handleInvoiceFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Webhook processing failed:", {
        eventId: event.id,
        eventType: event.type,
        error,
      });
      throw error;
    }
  },
};

const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const subscriptionId = session.subscription as string | null;
  const tenantId = session.metadata?.tenantId;
  const sessionPlanId = session.metadata?.planId || null;

  if (!subscriptionId || !tenantId) {
    console.warn("checkout.session.completed skipped: missing data", {
      sessionId: session.id,
      subscriptionId,
      tenantId,
    });
    return;
  }

  // checkout.completed এ retrieve রাখলাম
  const freshSub = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price"],
  });

  let plan = sessionPlanId
    ? await prisma.plan.findUnique({ where: { id: sessionPlanId } })
    : null;

  if (!plan) {
    const priceItem = freshSub.items?.data?.[0];

    if (!priceItem?.price) {
      console.warn("checkout.session.completed skipped: missing price item", {
        subscriptionId,
      });
      return;
    }

    plan = await prisma.plan.findFirst({
      where: { stripePriceId: priceItem.price.id },
    });
  }

  if (!plan) {
    console.warn("checkout.session.completed skipped: plan not found", {
      subscriptionId,
      sessionPlanId,
    });
    return;
  }

  const period = getPeriodFromSubscriptionObject(freshSub, plan.interval);

  const stripeCustomerId =
    typeof freshSub.customer === "string"
      ? freshSub.customer
      : freshSub.customer.id;

  const result = await prisma.subscription.upsert({
    where: { stripeSubId: freshSub.id },
    update: {
      status: mapStripeStatus(freshSub.status),
      startDate: period.startDate,
      endDate: period.endDate,
      planId: plan.id,
      tenantId,
      stripeCustomerId,
    },
    create: {
      tenantId,
      planId: plan.id,
      stripeSubId: freshSub.id,
      stripeCustomerId,
      status: mapStripeStatus(freshSub.status),
      startDate: period.startDate,
      endDate: period.endDate,
    },
  });

  console.log("subscription upserted:", result.id);

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      isActive: isTenantActive(freshSub.status),
      currentPlanId: plan.id,
      currentSubId: freshSub.id,
      onboardingStep: 6,
      onboardingCompleted: true,
    },
  });
};

const handleSubscriptionUpdated = async (
  subscription: Stripe.Subscription
) => {
  const dbSub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id },
    include: { plan: true },
  });

  if (!dbSub) {
    console.warn("customer.subscription.updated skipped: db sub not found", {
      stripeSubId: subscription.id,
    });
    return;
  }

  const period = getPeriodFromSubscriptionObject(
    subscription,
    dbSub.plan.interval
  );

  await prisma.subscription.update({
    where: { id: dbSub.id },
    data: {
      status: mapStripeStatus(subscription.status),
      startDate: period.startDate,
      endDate: period.endDate,
    },
  });

  await prisma.tenant.update({
    where: { id: dbSub.tenantId },
    data: {
      isActive: isTenantActive(subscription.status),
    },
  });
};

const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription
) => {
  const dbSub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id },
  });

  if (!dbSub) {
    console.warn("customer.subscription.deleted skipped: db sub not found", {
      stripeSubId: subscription.id,
    });
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSub.id },
    data: { status: SubscriptionStatus.CANCELED },
  });

  await prisma.tenant.update({
    where: { id: dbSub.tenantId },
    data: {
      isActive: false,
      currentPlanId: null,
      currentSubId: null,
    },
  });
};

const handleInvoicePaid = async (invoice: Stripe.Invoice) => {
  const inv = invoice as StripeInvoiceWithSub;

  const subscriptionId =
    typeof inv.subscription === "string"
      ? inv.subscription
      : inv.subscription?.id;

  if (!subscriptionId) {
    console.warn("invoice.paid skipped: missing subscription");
    return;
  }

  const dbSub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscriptionId },
  });

  if (!dbSub) {
    console.warn("invoice.paid skipped: db sub not found", {
      subscriptionId,
    });
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSub.id },
    data: { status: SubscriptionStatus.ACTIVE },
  });

  await prisma.tenant.update({
    where: { id: dbSub.tenantId },
    data: { isActive: true },
  });
};

const handleInvoiceFailed = async (invoice: Stripe.Invoice) => {
  const inv = invoice as StripeInvoiceWithSub;

  const subscriptionId =
    typeof inv.subscription === "string"
      ? inv.subscription
      : inv.subscription?.id;

  if (!subscriptionId) {
    console.warn("invoice.payment_failed skipped: missing subscription");
    return;
  }

  const dbSub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscriptionId },
  });

  if (!dbSub) {
    console.warn("invoice.payment_failed skipped: db sub not found", {
      subscriptionId,
    });
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSub.id },
    data: { status: SubscriptionStatus.PAST_DUE },
  });

  await prisma.tenant.update({
    where: { id: dbSub.tenantId },
    data: { isActive: false },
  });
};