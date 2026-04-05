import httpStatus from "http-status-codes";
import {
  MessageDirection,
  MessageSenderType,
  MessageType,
  Prisma,
} from "@prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import type { IConversation, IConversationQuery, IMessage } from "./conversation.interface";
import { emitToConversationRoom, emitToTenantRoom } from "../../lib/socketEmitter";

const createConversation = async (payload: IConversation, tenantId: string) => {
  const contact = await prisma.contact.findFirst({
    where: {
      id: payload.contactId,
      tenantId,
      isDeleted: false,
    },
  });

  if (!contact) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  if (payload.assignedToId) {
    const assignedUser = await prisma.user.findFirst({
      where: {
        id: payload.assignedToId,
        tenantId,
        isDeleted: false,
      },
    });

    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Assigned user not found");
    }
  }

  const createData: Prisma.ConversationUncheckedCreateInput = {
    tenantId,
    contactId: payload.contactId,
    channel: payload.channel,
    unreadCount: 0,
    isAiHandled: false,
  };

  if (payload.subject !== undefined) {
    createData.subject = payload.subject;
  }

  if (payload.status !== undefined) {
    createData.status = payload.status;
  }

  if (payload.assignedToId !== undefined) {
    createData.assignedToId = payload.assignedToId;
  }

  const conversation = await prisma.conversation.create({
    data: createData,
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

  /**
   * কেন tenant room-এ emit করছি?
   * - inbox list page open থাকলে নতুন conversation instantly show করা যাবে
   */
  emitToTenantRoom(tenantId, "conversation_created", conversation);

  return conversation;
};

const getAllConversations = async (query: IConversationQuery, tenantId: string) => {
  const { searchTerm, status, channel, assignedToId } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.ConversationWhereInput[] = [
    {
      tenantId,
      isDeleted: false,
    },
  ];

  if (status) {
    andConditions.push({ status });
  }

  if (channel) {
    andConditions.push({ channel });
  }

  if (assignedToId) {
    andConditions.push({ assignedToId });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          subject: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          contact: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          contact: {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          contact: {
            phone: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          lastMessageText: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ConversationWhereInput = {
    AND: andConditions,
  };

  const [data, total] = await Promise.all([
    prisma.conversation.findMany({
      where: whereConditions,
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
      orderBy: [
        { lastMessageAt: "desc" },
        { createdAt: "desc" },
      ],
      skip,
      take: limit,
    }),
    prisma.conversation.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const getSingleConversation = async (id: string, tenantId: string) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      tenantId,
      isDeleted: false,
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
      messages: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  return conversation;
};

const updateConversation = async (
  id: string,
  payload: Partial<IConversation>,
  tenantId: string
) => {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      id,
      tenantId,
      isDeleted: false,
    },
  });

  if (!existingConversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  if (payload.assignedToId) {
    const assignedUser = await prisma.user.findFirst({
      where: {
        id: payload.assignedToId,
        tenantId,
        isDeleted: false,
      },
    });

    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Assigned user not found");
    }
  }

  const updateData: Prisma.ConversationUpdateInput = {};

  if (payload.subject !== undefined) {
    updateData.subject = payload.subject;
  }

  if (payload.status !== undefined) {
    updateData.status = payload.status;
  }

  if (payload.assignedToId !== undefined) {
    updateData.assignedTo =
      payload.assignedToId === null
        ? { disconnect: true }
        : { connect: { id: payload.assignedToId } };
  }

  if (payload.unreadCount !== undefined) {
    updateData.unreadCount = payload.unreadCount;
  }

  if (payload.isAiHandled !== undefined) {
    updateData.isAiHandled = payload.isAiHandled;
  }

  const updatedConversation = await prisma.conversation.update({
    where: { id },
    data: updateData,
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

  emitToTenantRoom(tenantId, "conversation_updated", updatedConversation);
  emitToConversationRoom(id, "conversation_updated", updatedConversation);

  return updatedConversation;
};

const getMessagesByConversationId = async (conversationId: string, tenantId: string) => {
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

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      tenantId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
};

const sendAgentMessage = async (
  conversationId: string,
  payload: { content: string; type?: MessageType; metadata?: Prisma.JsonValue | null },
  tenantId: string,
  agentId: string
) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      tenantId,
      isDeleted: false,
    },
    include: {
      contact: true,
    },
  });

  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  /**
   * এখানে DB transaction use করছি
   * কারণ:
   * - message create
   * - conversation snapshot update
   * দুইটা একসাথে consistent রাখতে চাই
   */
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

    return {
      message,
      conversation: updatedConversation,
    };
  });

  /**
   * কেন দুই জায়গায় emit করছি?
   * 1) conversation room -> open chat screen যেন নতুন message পায়
   * 2) tenant room -> conversation list / unread badges update করার জন্য
   */
  emitToConversationRoom(conversationId, "new_message", result.message);
  emitToTenantRoom(tenantId, "conversation_updated", result.conversation);

  return result;
};

const createInboundMessage = async (payload: IMessage) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: payload.conversationId,
      tenantId: payload.tenantId,
      isDeleted: false,
    },
  });

  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        tenantId: payload.tenantId,
        conversationId: payload.conversationId,
        senderType: MessageSenderType.CUSTOMER,
        direction: MessageDirection.INBOUND,
        type: payload.type ?? MessageType.TEXT,
        content: payload.content ?? null,
        externalMessageId: payload.externalMessageId ?? null,
        metadata:
          payload.metadata === undefined
            ? Prisma.JsonNull
            : payload.metadata === null
            ? Prisma.JsonNull
            : (payload.metadata as Prisma.InputJsonValue),
      },
    });

    const updatedConversation = await tx.conversation.update({
      where: { id: payload.conversationId },
      data: {
        unreadCount: {
          increment: 1,
        },
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

    return {
      message,
      conversation: updatedConversation,
    };
  });

  emitToConversationRoom(payload.conversationId, "new_message", result.message);
  emitToTenantRoom(payload.tenantId, "conversation_updated", result.conversation);

  return result;
};

const markConversationAsRead = async (conversationId: string, tenantId: string) => {
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

  const updatedConversation = await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      unreadCount: 0,
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

  emitToTenantRoom(tenantId, "conversation_updated", updatedConversation);
  emitToConversationRoom(conversationId, "conversation_read", {
    conversationId,
    unreadCount: 0,
  });

  return updatedConversation;
};

export const ConversationServices = {
  createConversation,
  getAllConversations,
  getSingleConversation,
  updateConversation,
  getMessagesByConversationId,
  sendAgentMessage,
  createInboundMessage,
  markConversationAsRead,
};