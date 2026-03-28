// message.ts
import { z } from "zod";
import { SenderType } from "../../utils/enums";

export const messageSchema = z.object({
  conversationId: z.string().uuid(),
  senderType:  z.enum(Object.values(SenderType) as [string, ...string[]]),
  content: z.string().min(1),
});
