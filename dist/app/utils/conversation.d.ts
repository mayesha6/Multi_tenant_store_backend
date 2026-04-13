import { ConversationChannel } from "@prisma/client";
interface IFindOrCreateConversationPayload {
    tenantId: string;
    contactId: string;
    channel: ConversationChannel;
    subject?: string | null;
}
/**
 * একই contact + channel এর open/pending conversation থাকলে reuse করবে
 * না থাকলে নতুন conversation create করবে
 */
export declare const findOrCreateOpenConversation: (payload: IFindOrCreateConversationPayload) => Promise<{
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
export {};
//# sourceMappingURL=conversation.d.ts.map