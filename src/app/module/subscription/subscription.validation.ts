import { z } from "zod";

export const createCheckoutSessionZodSchema = z.object({
  // FIX: no tenantId from frontend body needed if using logged-in user's tenant
  planId: z.string().min(1),
});