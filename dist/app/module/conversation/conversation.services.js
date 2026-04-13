import httpStatus from "http-status-codes";
import { MessageDirection, MessageSenderType, MessageType, Prisma, } from "@prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { emitToConversationRoom, emitToTenantRoom } from "../../lib/socketEmitter";
import { QueryBuilder } from "../../utils/QueryBuilder";
const createConversation = async (payload, tenantId) => {
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
    const createData = {
        tenantId,
        contactId: payload.contactId,
        channel: payload.channel,
        unreadCount: 0,
        isAiHandled: false,
    };
    if (payload.subject !== undefined) {
        createData.subject = payload.subject;
    }
    createData.status = "OPEN";
    createData.assignedToId = payload.assignedToId ?? null;
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
    emitToTenantRoom(tenantId, "conversation.created", conversation);
    return conversation;
};
const getAllConversations = async (query, tenantId, userId) => {
    const queryBuilder = new QueryBuilder(query);
    /**
     * STEP 1: base prisma query (NO filter here)
     */
    const prismaQuery = queryBuilder
        .sort()
        .paginate()
        .build();
    /**
     * STEP 2: manual + dynamic filters
     */
    const andConditions = [
        {
            tenantId,
            isDeleted: false,
        },
    ];
    /**
     * 🔍 SEARCH
     */
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    subject: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    lastMessageText: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    contact: {
                        name: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    contact: {
                        email: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    contact: {
                        phone: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    /**
     * 🎯 FILTERS
     */
    if (query.status) {
        andConditions.push({
            status: query.status,
        });
    }
    if (query.channel) {
        andConditions.push({
            channel: query.channel,
        });
    }
    if (query.assigned === "me" && userId) {
        andConditions.push({
            assignedToId: userId,
        });
    }
    if (query.unassigned === "true") {
        andConditions.push({
            assignedToId: null,
        });
    }
    if (query.assignedToId) {
        andConditions.push({
            assignedToId: query.assignedToId,
        });
    }
    if (query.unread === "true") {
        andConditions.push({
            unreadCount: {
                gt: 0,
            },
        });
    }
    /**
     * 🧠 MERGE with QueryBuilder.where
     */
    const finalWhere = {
        AND: [
            ...(prismaQuery.where ? [prismaQuery.where] : []),
            ...andConditions,
        ],
    };
    /**
     * 📦 INCLUDE
     */
    const include = {
        contact: true,
        assignedTo: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
    };
    /**
     * 🚀 QUERY EXECUTION
     */
    const [data, total] = await Promise.all([
        prisma.conversation.findMany({
            ...prismaQuery,
            where: finalWhere,
            include,
            orderBy: prismaQuery.orderBy || {
                lastMessageAt: "desc",
            },
        }),
        prisma.conversation.count({
            where: finalWhere,
        }),
    ]);
    const meta = queryBuilder.getMeta(total);
    return {
        data,
        meta,
    };
};
const getSingleConversation = async (id, tenantId) => {
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
const updateConversation = async (id, payload, tenantId) => {
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
    const updateData = {};
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
    emitToTenantRoom(tenantId, "conversation.updated", updatedConversation);
    emitToConversationRoom(id, "conversation.updated", updatedConversation);
    return updatedConversation;
};
const getMessagesByConversationId = async (conversationId, tenantId) => {
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
const sendAgentMessage = async (conversationId, payload, tenantId, agentId) => {
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
                metadata: payload.metadata === undefined
                    ? Prisma.JsonNull
                    : payload.metadata === null
                        ? Prisma.JsonNull
                        : payload.metadata,
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
    emitToConversationRoom(conversationId, "new.message", result.message);
    emitToTenantRoom(tenantId, "conversation.updated", result.conversation);
    return result;
};
const createInboundMessage = async (payload) => {
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
                metadata: payload.metadata === undefined
                    ? Prisma.JsonNull
                    : payload.metadata === null
                        ? Prisma.JsonNull
                        : payload.metadata,
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
    emitToConversationRoom(payload.conversationId, "new.message", result.message);
    emitToTenantRoom(payload.tenantId, "conversation.updated", result.conversation);
    return result;
};
const markConversationAsRead = async (conversationId, tenantId) => {
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
    emitToTenantRoom(tenantId, "conversation.updated", updatedConversation);
    emitToConversationRoom(conversationId, "conversation.read", {
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
//# sourceMappingURL=conversation.services.js.map