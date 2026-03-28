import { z } from "zod";
export declare const messageSchema: z.ZodObject<{
    conversationId: z.ZodString;
    senderType: z.ZodEnum<{
        [x: string]: string;
    }>;
    content: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=message.validation.d.ts.map