import { z } from "zod";
export declare const conversationSchema: z.ZodObject<{
    tenantId: z.ZodString;
    contactId: z.ZodString;
    status: z.ZodEnum<{
        [x: string]: string;
    }>;
    assignedAgentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=conversation.validation.d.ts.map