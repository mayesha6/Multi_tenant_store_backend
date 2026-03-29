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