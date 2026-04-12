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
export const normalizeIncomingMessagePayload = (payload: {
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
}): INormalizedIncomingMessagePayload => {
  return {
    eventId:
      payload.eventId ||
      payload.externalMessageId ||
      `generated-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,

    source: payload.source || "web",
    tenantId: payload.tenantId,
    channel: payload.channel,

    customerName: payload.customerName ?? null,
    customerEmail: payload.customerEmail ?? null,
    customerPhone: payload.customerPhone ?? null,

    content: payload.content ?? null,
    type: payload.type ?? MessageType.TEXT,

    externalMessageId: payload.externalMessageId ?? null,
    metadata: payload.metadata ?? null,
  };
};