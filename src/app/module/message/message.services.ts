import httpStatus from "http-status-codes";
import {
  MessageDirection,
  MessageSenderType,
  MessageType,
  Prisma,
} from "@prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import {
  emitToConversationRoom,
  emitToTenantRoom,
} from "../../lib/socketEmitter";

const sendAgentMessage = async (
  conversationId: string,
  tenantId: string,
  agentId: string,
  payload: {
    content: string;
    type?: MessageType;
    metadata?: Prisma.JsonValue | null;
  }
) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      tenantId,
      isDeleted: false,
    },
  });

  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        tenantId,
        conversationId,
        senderType: MessageSenderType.AGENT,
        direction: MessageDirection.OUTBOUND,
        type: payload.type ?? MessageType.TEXT,
        content: payload.content,

        metadata:
          payload.metadata === undefined
            ? Prisma.JsonNull
            : payload.metadata === null
            ? Prisma.JsonNull
            : (payload.metadata as Prisma.InputJsonValue),
      },
    });

    const updatedConversation = await tx.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: message.createdAt,
        lastMessageText: message.content ?? null,
        lastMessageType: message.type,
      },
      include: {
        contact: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { message, conversation: updatedConversation };
  });

  emitToConversationRoom(conversationId, "message.created", result.message);
  emitToTenantRoom(tenantId, "conversation.updated", result.conversation);

  return result;
};

const getMessages = async (
  conversationId: string,
  tenantId: string,
  query: Record<string, string>
) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      tenantId,
      isDeleted: false,
    },
  });

  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: {
        conversationId,
        tenantId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.message.count({
      where: {
        conversationId,
        tenantId,
        isDeleted: false,
      },
    }),
  ]);

  return {
    data: messages,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const markAsSeen = async (conversationId: string, tenantId: string) => {
  await prisma.message.updateMany({
    where: {
      conversationId,
      tenantId,
      direction: MessageDirection.INBOUND,
      deliveryStatus: "DELIVERED",
    },
    data: {
      deliveryStatus: "SEEN",
    },
  });

  return true;
};

export const MessageServices = {
  sendAgentMessage,
  getMessages,
  markAsSeen,
};