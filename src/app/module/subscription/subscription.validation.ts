import { z } from "zod";

export const createCheckoutSessionZodSchema = z.object({
 
    tenantId: z.string(),
    planId: z.string()
 
});

