import { ConversationChannel, MessageType, Prisma } from "@prisma/client";

/**
 * Provider payload normalize করার পর
 * আমাদের internal standard shape হবে এটা
 */
export interface INormalizedIncomingMessagePayload {
  eventId: string; // provider event id or generated id
  source: "whatsapp" | "email" | "instagram" | "facebook" | "web";

  tenantId: string;
  channel: ConversationChannel;

  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;

  content?: string | null;
  type?: MessageType;

  externalMessageId?: string | null;
  metadata?: Prisma.JsonValue | null;
}