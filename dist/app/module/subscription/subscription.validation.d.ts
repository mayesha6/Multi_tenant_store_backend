import { z } from "zod";
export declare const createSubscriptionZodSchema: z.ZodObject<{
    tenantId: z.ZodString;
    planId: z.ZodString;
    stripeSubId: z.ZodString;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    intervalCount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateSubscriptionZodSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        CANCELED: "CANCELED";
        PAST_DUE: "PAST_DUE";
    }>>;
    endDate: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
//# sourceMappingURL=subscription.validation.d.ts.map