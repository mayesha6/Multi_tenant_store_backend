import { MessageType } from "@prisma/client";
import { z } from "zod";
export const sendMessageZodSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Message content is required" })
        .max(5000, { message: "Message too long" }),
    type: z
        .enum(Object.values(MessageType))
        .optional(),
    metadata: z.any().optional(),
});
//# sourceMappingURL=message.validation.js.map