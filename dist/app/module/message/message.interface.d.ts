import type { MessageDirection, MessageSenderType, MessageType, Prisma } from "@prisma/client";
export interface IMessage {
    id?: string;
    tenantId: string;
    conversationId: string;
    senderType: MessageSenderType;
    direction: MessageDirection;
    type?: MessageType;
    content?: string | null;
    externalMessageId?: string | null;
    metadata?: Prisma.JsonValue | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISendMessagePayload {
    content: string;
    type?: MessageType;
    metadata?: Prisma.JsonValue | null;
}
//# sourceMappingURL=message.interface.d.ts.map