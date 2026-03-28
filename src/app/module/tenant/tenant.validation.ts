// tenant.ts
import { z } from "zod";
import { PlanType } from "../../utils/enums";

export const tenantSchema = z.object({
  name: z.string().min(2),
  plan: z.enum(Object.values(PlanType) as [string, ...string[]]),
});

