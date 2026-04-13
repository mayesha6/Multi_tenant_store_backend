// file: src/app/modules/webhook/messageWebhook.service.ts
import prisma from "../../lib/prisma";
import { ContactSource, MessageDirection, MessageSenderType, MessageType, } from "@prisma/client";
import { findOrCreateContactFromWebhook } from "../../utils/contact";
import { findOrCreateOpenConversation } from "../../utils/conversation";
import { ConversationServices } from "../conversation/conversation.services";
const mapChannelToContactSource = (channel) => {
    switch (channel) {
        case "WHATSAPP":
            return ContactSource.WHATSAPP;
        case "EMAIL":
            return ContactSource.EMAIL;
        case "INSTAGRAM":
            return ContactSource.INSTAGRAM;
        case "FACEBOOK":
            return ContactSource.FACEBOOK;
        default:
            return ContactSource.MANUAL;
    }
};
/**
 * FULL production-ready flow:
 * 1. webhook event dedupe
 * 2. webhook event log create
 * 3. contact find/create
 * 4. conversation find/create
 * 5. message create
 * 6. event status success/fail update
 */
const handleIncomingMessage = async (payload) => {
    // 1) event-level idempotency
    const exists = await prisma.messageWebhookEvent.findUnique({
        where: { eventId: payload.eventId },
    });
    if (exists) {
        return {
            duplicated: true,
            message: "Webhook event already processed",
        };
    }
    // 2) create webhook event log
    const MessageWebhookEvent = await prisma.messageWebhookEvent.create({
        data: {
            eventId: payload.eventId,
            type: "incoming.message",
            source: payload.source,
            status: "PENDING",
            payload: payload,
        },
    });
    try {
        /**
         * CHANGE:
         * exactOptionalPropertyTypes: true এর জন্য
         * optional field-এ undefined assign করছি না
         * field only তখনই add করছি যখন value আছে
         */
        const contactPayload = {
            tenantId: payload.tenantId,
            // explicit enum-safe source mapping
            source: mapChannelToContactSource(payload.channel),
        };
        if (payload.customerName !== undefined && payload.customerName !== null) {
            contactPayload.name = payload.customerName;
        }
        if (payload.customerEmail !== undefined && payload.customerEmail !== null) {
            contactPayload.email = payload.customerEmail;
        }
        if (payload.customerPhone !== undefined && payload.customerPhone !== null) {
            contactPayload.phone = payload.customerPhone;
        }
        // 3) resolve/create contact
        const contact = await findOrCreateContactFromWebhook(contactPayload);
        // 4) resolve/create conversation
        const conversation = await findOrCreateOpenConversation({
            tenantId: payload.tenantId,
            contactId: contact.id,
            channel: payload.channel,
        });
        // 5) create inbound message + emit socket
        const result = await ConversationServices.createInboundMessage({
            tenantId: payload.tenantId,
            conversationId: conversation.id,
            senderType: MessageSenderType.CUSTOMER,
            direction: MessageDirection.INBOUND,
            type: payload.type ?? MessageType.TEXT,
            content: payload.content ?? null,
            externalMessageId: payload.externalMessageId ?? null,
            metadata: payload.metadata ?? null,
        });
        // 6) mark webhook event success
        await prisma.messageWebhookEvent.update({
            where: { id: MessageWebhookEvent.id },
            data: {
                status: "SUCCESS",
                processedAt: new Date(),
            },
        });
        return {
            duplicated: false,
            MessageWebhookEventId: MessageWebhookEvent.id,
            contact,
            conversation,
            result,
        };
    }
    catch (error) {
        // 7) mark webhook event failed
        await prisma.messageWebhookEvent.update({
            where: { id: MessageWebhookEvent.id },
            data: {
                status: "FAILED",
                errorMessage: error?.message || "Unknown webhook processing error",
            },
        });
        throw error;
    }
};
export const MessageWebhookService = {
    handleIncomingMessage,
};
//# sourceMappingURL=messageWebhook.services.js.map