import type {
  ConversationChannel,
  ConversationStatus,
  MessageDeliveryStatus,
  MessageDirection,
  MessageSenderType,
  MessageType,
  Prisma,
} from "@prisma/client";

export interface IConversation {
  id?: string;
  tenantId: string;
  contactId: string;
  subject?: string | null;
  status?: ConversationStatus;
  channel: ConversationChannel;
  assignedToId?: string | null;
  unreadCount?: number;
  lastMessageAt?: Date | null;
  lastMessageText?: string | null;
  lastMessageType?: MessageType | null;
  isAiHandled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  id?: string;
  tenantId: string;
  conversationId: string;
  senderId?: string | null;
  senderType: MessageSenderType;
  direction: MessageDirection;
  type?: MessageType;
  content?: string | null;
  externalMessageId?: string | null;
  deliveryStatus?: MessageDeliveryStatus;
  metadata?: Prisma.JsonValue | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversationQuery {
  searchTerm?: string;
  status?: ConversationStatus;
  channel?: ConversationChannel;
  assignedToId?: string;
  page?: string;
  limit?: string;
}

export interface ISendMessagePayload {
  conversationId: string;
  content?: string | null;
  type?: MessageType;
  metadata?: Prisma.JsonValue | null;
}