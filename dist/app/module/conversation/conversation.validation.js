import { z } from "zod";
import { ConversationStatus } from "../../utils/enums";
export const conversationSchema = z.object({
    tenantId: z.string(),
    contactId: z.string(),
    status: z.enum(Object.values(ConversationStatus)),
    assignedAgentId: z.string().optional(),
});
//# sourceMappingURL=conversation.validation.js.map