import { ConversationChannel, MessageType, Prisma } from "@prisma/client";
import type { INormalizedIncomingMessagePayload } from "./messageWebhook.interface";
/**
 * NOTE:
 * এই function example/demo shape use করছে.
 * Later তুমি provider অনুযায়ী:
 * - normalizeWhatsAppPayload
 * - normalizeEmailPayload
 * - normalizeInstagramPayload
 * আলাদা function বানাতে পারো.
 */
export declare const normalizeIncomingMessagePayload: (payload: {
    eventId?: string;
    source?: "whatsapp" | "email" | "instagram" | "facebook" | "web";
    tenantId: string;
    channel: ConversationChannel;
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    content?: string | null;
    type?: MessageType;
    externalMessageId?: string | null;
    metadata?: Prisma.JsonValue | null;
}) => INormalizedIncomingMessagePayload;
//# sourceMappingURL=messageWebhook.utils.d.ts.map