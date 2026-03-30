import prisma from "../../lib/prisma";
import httpStatus from "http-status-codes";
import type { IPlan } from "./plan.interface";
import AppError from "../../errorHelpers/AppError";
import { stripe } from "../../lib/stripe";
import type { Interval } from "@prisma/client";
import type Stripe from "stripe";

// helper function
const mapIntervalToStripe = (interval: Interval): Stripe.PriceCreateParams.Recurring.Interval => {
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

const createPlan = async (payload: IPlan) => {
  const existingPlan = await prisma.plan.findUnique({ where: { name: payload.name } });
  if (existingPlan) throw new AppError(httpStatus.BAD_REQUEST, "Plan already exists");

  const stripeProduct = await stripe.products.create({
    name: payload.name,
    description: payload.features?.join(", "),
  });

  const stripePrice = await stripe.prices.create({
    unit_amount: Math.round(payload.price * 100),
    currency: payload.currency?.toLowerCase() || "usd",
    recurring: { interval: mapIntervalToStripe(payload.interval) },
    product: stripeProduct.id,
  });

  return prisma.plan.create({
    data: {
      ...payload,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      features: payload.features || [],
    },
  });
};

const getAllPlans = async () => {
  return prisma.plan.findMany({ orderBy: { createdAt: "desc" } });
}

const getPlanById = async (id: string) => {
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
  return plan;
}

const updatePlan = async (id: string, payload: Partial<IPlan>) => {
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");

  let updatedData = { ...payload };

  if (payload.price || payload.interval) {
    const stripeInterval = payload.interval ? mapIntervalToStripe(payload.interval) : mapIntervalToStripe(plan.interval);

    // create new Stripe Price
    const newPrice = await stripe.prices.create({
      unit_amount: payload.price ? Math.round(payload.price * 100) : Math.round(plan.price * 100),
      currency: plan.currency.toLowerCase(),
      recurring: { interval: stripeInterval  }, 
      product: plan.stripeProductId,
    });

    updatedData.stripePriceId = newPrice.id;
  }

  return prisma.plan.update({ where: { id }, data: updatedData });
};

const deletePlan = async (id: string) => {
  if (!id) throw new AppError(httpStatus.BAD_REQUEST, "Plan ID is required");
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");

  return prisma.plan.delete({ where: { id } });
}

export const PlanServices = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
};