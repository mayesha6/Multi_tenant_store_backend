import { z } from "zod";
export declare const createConversationZodSchema: z.ZodObject<{
    contactId: z.ZodString;
    subject: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    channel: z.ZodEnum<{
        [x: string]: string;
    }>;
    assignedToId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateConversationZodSchema: z.ZodObject<{
    subject: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    assignedToId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    unreadCount: z.ZodOptional<z.ZodNumber>;
    isAiHandled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const sendMessageZodSchema: z.ZodObject<{
    content: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const createInboundMessageZodSchema: z.ZodObject<{
    tenantId: z.ZodString;
    conversationId: z.ZodString;
    content: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    externalMessageId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const conversationQueryZodSchema: z.ZodObject<{
    searchTerm: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    channel: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    assignedToId: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=conversation.validation.d.ts.map