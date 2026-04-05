import { ConversationChannel } from "@prisma/client";
import prisma from "../lib/prisma";

interface IFindOrCreateConversationPayload {
  tenantId: string;
  contactId: string;
  channel: ConversationChannel;
  subject?: string | null;
}

export const findOrCreateOpenConversation = async (
  payload: IFindOrCreateConversationPayload
) => {
  const { tenantId, contactId, channel, subject } = payload;

  let conversation = await prisma.conversation.findFirst({
    where: {
      tenantId,
      contactId,
      channel,
      status: {
        in: ["OPEN", "PENDING"],
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
      },
    });
  }

  return conversation;
};