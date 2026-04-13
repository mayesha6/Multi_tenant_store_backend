import { MessageType, Prisma } from "@prisma/client";
export declare const MessageServices: {
    sendAgentMessage: (conversationId: string, tenantId: string, agentId: string, payload: {
        content: string;
        type?: MessageType;
        metadata?: Prisma.JsonValue | null;
    }) => Promise<{
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
    getMessages: (conversationId: string, tenantId: string, query: Record<string, string>) => Promise<{
        data: {
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
    }>;
    markAsSeen: (conversationId: string, tenantId: string) => Promise<boolean>;
};
//# sourceMappingURL=message.services.d.ts.map