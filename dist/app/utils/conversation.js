import { ConversationChannel, ConversationStatus } from "@prisma/client";
import prisma from "../lib/prisma";
/**
 * একই contact + channel এর open/pending conversation থাকলে reuse করবে
 * না থাকলে নতুন conversation create করবে
 */
export const findOrCreateOpenConversation = async (payload) => {
    const { tenantId, contactId, channel, subject } = payload;
    let conversation = await prisma.conversation.findFirst({
        where: {
            tenantId,
            contactId,
            channel,
            status: {
                in: [ConversationStatus.OPEN, ConversationStatus.PENDING],
            },
            isDeleted: false,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                tenantId,
                contactId,
                channel,
                subject: subject ?? null,
                status: ConversationStatus.OPEN,
            },
        });
    }
    return conversation;
};
//# sourceMappingURL=conversation.js.map