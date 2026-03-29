import { z } from "zod";
import { Interval } from "@prisma/client";
export const createPlanZodSchema = z.object({
    name: z.string().min(3).max(50),
    price: z.number().min(0),
    currency: z.string().min(3).max(5).optional(),
    interval: z.enum(Object.values(Interval)),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});
export const updatePlanZodSchema = z.object({
    name: z.string().min(3).max(50).optional(),
    price: z.number().min(0).optional(),
    currency: z.string().min(3).max(5).optional(),
    interval: z.enum(Object.values(Interval)).optional(),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});
//# sourceMappingURL=plan.validation.js.map