import { ConversationChannel, ConversationStatus, MessageDirection, MessageSenderType, MessageType, } from "@prisma/client";
import { z } from "zod";
export const createConversationZodSchema = z.object({
    contactId: z.string().uuid(),
    subject: z.string().max(200).optional().nullable(),
    channel: z.enum(Object.values(ConversationChannel)),
    assignedToId: z.string().uuid().optional().nullable(),
});
export const updateConversationZodSchema = z.object({
    subject: z.string().max(200).optional().nullable(),
    status: z.enum(Object.values(ConversationStatus)).optional(),
    assignedToId: z.string().uuid().optional().nullable(),
    unreadCount: z.number().int().min(0).optional(),
    isAiHandled: z.boolean().optional(),
});
export const sendMessageZodSchema = z.object({
    content: z.string().min(1, "Message content is required").max(5000),
    type: z.enum(Object.values(MessageType)).optional(),
    metadata: z.any().optional(),
});
export const createInboundMessageZodSchema = z.object({
    tenantId: z.string().uuid(),
    conversationId: z.string().uuid(),
    content: z.string().optional().nullable(),
    type: z.enum(Object.values(MessageType)).optional(),
    externalMessageId: z.string().optional().nullable(),
    metadata: z.any().optional(),
});
export const conversationQueryZodSchema = z.object({
    searchTerm: z.string().optional(),
    status: z.enum(Object.values(ConversationStatus)).optional(),
    channel: z.enum(Object.values(ConversationChannel)).optional(),
    assignedToId: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
});
//# sourceMappingURL=conversation.validation.js.map