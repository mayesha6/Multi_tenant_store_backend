// tag.ts
import { z } from "zod";

export const tagSchema = z.object({
  tenantId: z.string(),
  name: z.string().min(1),
});

