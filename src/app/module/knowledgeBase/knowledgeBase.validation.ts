// knowledgeBase.ts
import { z } from "zod";
import { KBType } from "../../utils/enums";

export const kbSchema = z.object({
  tenantId: z.string(),
  title: z.string(),
  type:  z.enum(Object.values(KBType) as [string, ...string[]]),
  content: z.string(),
  source: z.string().optional(),
});

export type KBInput = z.infer<typeof kbSchema>;