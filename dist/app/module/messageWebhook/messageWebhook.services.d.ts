import type { INormalizedIncomingMessagePayload } from "./messageWebhook.interface";
export declare const MessageWebhookService: {
    handleIncomingMessage: (payload: INormalizedIncomingMessagePayload) => Promise<{
        duplicated: boolean;
        message: string;
        MessageWebhookEventId?: never;
        contact?: never;
        conversation?: never;
        result?: never;
    } | {
        duplicated: boolean;
        MessageWebhookEventId: string;
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
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            source: import("@prisma/client").$Enums.ContactSource;
            tags: string[];
        };
        conversation: {
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
        result: {
            message: {
                id: string;
                tenantId: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.MessageType;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
        };
        message?: never;
    }>;
};
//# sourceMappingURL=messageWebhook.services.d.ts.map