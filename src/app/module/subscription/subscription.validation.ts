import { z } from "zod";

export const createSubscriptionZodSchema = z.object({
  tenantId: z.string(),
  planId: z.string(),
  stripeSubId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  intervalCount: z.number().optional(),
});

export const updateSubscriptionZodSchema = z.object({
  status: z.enum(["ACTIVE","CANCELED","PAST_DUE"]).optional(),
  endDate: z.date().optional(),
});

export const createStripeSubscriptionZodSchema = z.object({
  tenantId: z
    .string()
    .uuid({ message: "Invalid tenant id format" }),

  stripePriceId: z
    .string()
    .min(5, { message: "Stripe price id is required" }),
  
  paymentMethodId: z.string().min(1)
})