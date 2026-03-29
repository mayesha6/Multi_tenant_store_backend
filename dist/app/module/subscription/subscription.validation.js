import { z } from "zod";
export const createSubscriptionZodSchema = z.object({
    tenantId: z.string(),
    planId: z.string(),
    stripeSubId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    intervalCount: z.number().optional(),
});
export const updateSubscriptionZodSchema = z.object({
    status: z.enum(["ACTIVE", "CANCELED", "PAST_DUE"]).optional(),
    endDate: z.date().optional(),
});
//# sourceMappingURL=subscription.validation.js.map