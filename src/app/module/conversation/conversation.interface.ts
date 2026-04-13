import type {
  ConversationChannel,
  ConversationStatus,
  MessageType,
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

export interface ICreateConversationPayload {
  contactId: string;
  subject?: string;
  channel: ConversationChannel;
  assignedToId?: string;
}

export interface IAssignConversationPayload {
  assignedToId: string | null;
}

export interface IUpdateConversationStatusPayload {
  status: ConversationStatus;
}