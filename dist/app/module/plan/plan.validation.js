import { Interval } from "@prisma/client";
import { z } from "zod";
export const planValidationSchema = z.object({
    planName: z.string().min(1, "Plan name is required"),
    description: z.string().max(500).optional(),
    amount: z.number().min(0, "Amount must be positive"),
    currency: z.string().length(3, "Currency must be 3-letter code").optional(),
    interval: z.enum(Object.values(Interval)).optional(),
    intervalCount: z.number().int().positive("Interval count must be positive").optional(),
    freeTrialDays: z.number().int().nonnegative().optional().default(0),
    active: z.boolean().default(true).optional(),
});
//# sourceMappingURL=plan.validation.js.map