// knowledgeBase.ts
import { z } from "zod";
import { KBType } from "../../utils/enums";
export const kbSchema = z.object({
    tenantId: z.string(),
    title: z.string(),
    type: z.enum(Object.values(KBType)),
    content: z.string(),
    source: z.string().optional(),
});
//# sourceMappingURL=knowledgeBase.validation.js.map