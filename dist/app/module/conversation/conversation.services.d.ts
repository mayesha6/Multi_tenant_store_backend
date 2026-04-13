import { MessageType, Prisma } from "@prisma/client";
import type { IConversation } from "./conversation.interface";
import type { IMessage } from "../message/message.interface";
export declare const ConversationServices: {
    createConversation: (payload: IConversation, tenantId: string) => Promise<{
        contact: {
            email: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ContactStatus;
            metadata: Prisma.JsonValue | null;
            source: import("@prisma/client").$Enums.ContactSource;
            tags: string[];
        };
        assignedTo: {
            email: string;
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: import("@prisma/client").$Enums.ConversationStatus;
        subject: string | null;
        channel: import("@prisma/client").$Enums.ConversationChannel;
        unreadCount: number;
        lastMessageAt: Date | null;
        lastMessageText: string | null;
        lastMessageType: import("@prisma/client").$Enums.MessageType | null;
        isAiHandled: boolean;
        contactId: string;
        assignedToId: string | null;
    }>;
    getAllConversations: (query: Record<string, string>, tenantId: string, userId: string) => Promise<{
        data: ({
            [x: string]: ({
                id: string;
                tenantId: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.MessageType;
                metadata: Prisma.JsonValue | null;
                content: string | null;
                conversationId: string;
                senderType: import("@prisma/client").$Enums.MessageSenderType;
                direction: import("@prisma/client").$Enums.MessageDirection;
                externalMessageId: string | null;
                deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
            } | {
                id: string;
                tenantId: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.MessageType;
                metadata: Prisma.JsonValue | null;
                content: string | null;
                conversationId: string;
                senderType: import("@prisma/client").$Enums.MessageSenderType;
                direction: import("@prisma/client").$Enums.MessageDirection;
                externalMessageId: string | null;
                deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
            })[] | {
                id: string;
                tenantId: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.MessageType;
                metadata: Prisma.JsonValue | null;
                content: string | null;
                conversationId: string;
                senderType: import("@prisma/client").$Enums.MessageSenderType;
                direction: import("@prisma/client").$Enums.MessageDirection;
                externalMessageId: string | null;
                deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
            }[];
            [x: number]: never;
            [x: symbol]: never;
        } & {
            id: string;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            status: import("@prisma/client").$Enums.ConversationStatus;
            subject: string | null;
            channel: import("@prisma/client").$Enums.ConversationChannel;
            unreadCount: number;
            lastMessageAt: Date | null;
            lastMessageText: string | null;
            lastMessageType: import("@prisma/client").$Enums.MessageType | null;
            isAiHandled: boolean;
            contactId: string;
            assignedToId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
    }>;
    getSingleConversation: (id: string, tenantId: string) => Promise<{
        messages: {
            id: string;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.MessageType;
            metadata: Prisma.JsonValue | null;
            content: string | null;
            conversationId: string;
            senderType: import("@prisma/client").$Enums.MessageSenderType;
            direction: import("@prisma/client").$Enums.MessageDirection;
            externalMessageId: string | null;
            deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
        }[];
        contact: {
            email: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ContactStatus;
            metadata: Prisma.JsonValue | null;
            source: import("@prisma/client").$Enums.ContactSource;
            tags: string[];
        };
        assignedTo: {
            email: string;
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: import("@prisma/client").$Enums.ConversationStatus;
        subject: string | null;
        channel: import("@prisma/client").$Enums.ConversationChannel;
        unreadCount: number;
        lastMessageAt: Date | null;
        lastMessageText: string | null;
        lastMessageType: import("@prisma/client").$Enums.MessageType | null;
        isAiHandled: boolean;
        contactId: string;
        assignedToId: string | null;
    }>;
    updateConversation: (id: string, payload: Partial<IConversation>, tenantId: string) => Promise<{
        contact: {
            email: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ContactStatus;
            metadata: Prisma.JsonValue | null;
            source: import("@prisma/client").$Enums.ContactSource;
            tags: string[];
        };
        assignedTo: {
            email: string;
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: import("@prisma/client").$Enums.ConversationStatus;
        subject: string | null;
        channel: import("@prisma/client").$Enums.ConversationChannel;
        unreadCount: number;
        lastMessageAt: Date | null;
        lastMessageText: string | null;
        lastMessageType: import("@prisma/client").$Enums.MessageType | null;
        isAiHandled: boolean;
        contactId: string;
        assignedToId: string | null;
    }>;
    getMessagesByConversationId: (conversationId: string, tenantId: string) => Promise<{
        id: string;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        metadata: Prisma.JsonValue | null;
        content: string | null;
        conversationId: string;
        senderType: import("@prisma/client").$Enums.MessageSenderType;
        direction: import("@prisma/client").$Enums.MessageDirection;
        externalMessageId: string | null;
        deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
    }[]>;
    sendAgentMessage: (conversationId: string, payload: {
        content: string;
        type?: MessageType;
        metadata?: Prisma.JsonValue | null;
    }, tenantId: string, agentId: string) => Promise<{
        message: {
            id: string;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.MessageType;
            metadata: Prisma.JsonValue | null;
            content: string | null;
            conversationId: string;
            senderType: import("@prisma/client").$Enums.MessageSenderType;
            direction: import("@prisma/client").$Enums.MessageDirection;
            externalMessageId: string | null;
            deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
        };
        conversation: {
            contact: {
                email: string | null;
                id: string;
                name: string;
                phone: string | null;
                picture: string | null;
                address: string | null;
                tenantId: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.ContactStatus;
                metadata: Prisma.JsonValue | null;
                source: import("@prisma/client").$Enums.ContactSource;
                tags: string[];
            };
            assignedTo: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            status: import("@prisma/client").$Enums.ConversationStatus;
            subject: string | null;
            channel: import("@prisma/client").$Enums.ConversationChannel;
            unreadCount: number;
            lastMessageAt: Date | null;
            lastMessageText: string | null;
            lastMessageType: import("@prisma/client").$Enums.MessageType | null;
            isAiHandled: boolean;
            contactId: string;
            assignedToId: string | null;
        };
    }>;
    createInboundMessage: (payload: IMessage) => Promise<{
        message: {
            id: string;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.MessageType;
            metadata: Prisma.JsonValue | null;
            content: string | null;
            conversationId: string;
            senderType: import("@prisma/client").$Enums.MessageSenderType;
            direction: import("@prisma/client").$Enums.MessageDirection;
            externalMessageId: string | null;
            deliveryStatus: import("@prisma/client").$Enums.MessageDeliveryStatus;
        };
        conversation: {
            contact: {
                email: string | null;
                id: string;
                name: string;
                phone: string | null;
                picture: string | null;
                address: string | null;
                tenantId: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.ContactStatus;
                metadata: Prisma.JsonValue | null;
                source: import("@prisma/client").$Enums.ContactSource;
                tags: string[];
            };
            assignedTo: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            status: import("@prisma/client").$Enums.ConversationStatus;
            subject: string | null;
            channel: import("@prisma/client").$Enums.ConversationChannel;
            unreadCount: number;
            lastMessageAt: Date | null;
            lastMessageText: string | null;
            lastMessageType: import("@prisma/client").$Enums.MessageType | null;
            isAiHandled: boolean;
            contactId: string;
            assignedToId: string | null;
        };
    }>;
    markConversationAsRead: (conversationId: string, tenantId: string) => Promise<{
        contact: {
            email: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ContactStatus;
            metadata: Prisma.JsonValue | null;
            source: import("@prisma/client").$Enums.ContactSource;
            tags: string[];
        };
        assignedTo: {
            email: string;
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: import("@prisma/client").$Enums.ConversationStatus;
        subject: string | null;
        channel: import("@prisma/client").$Enums.ConversationChannel;
        unreadCount: number;
        lastMessageAt: Date | null;
        lastMessageText: string | null;
        lastMessageType: import("@prisma/client").$Enums.MessageType | null;
        isAiHandled: boolean;
        contactId: string;
        assignedToId: string | null;
    }>;
};
//# sourceMappingURL=conversation.services.d.ts.map