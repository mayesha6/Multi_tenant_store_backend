import { ContactSource } from "@prisma/client";
import prisma from "../lib/prisma";
/**
 * webhook থেকে contact resolve/create
 * priority:
 * 1. phone match
 * 2. email match
 * 3. new contact create
 */
export const findOrCreateContactFromWebhook = async (payload) => {
    const { tenantId, name, email, phone, source } = payload;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone?.trim();
    let contact = null;
    if (normalizedPhone) {
        contact = await prisma.contact.findFirst({
            where: {
                tenantId,
                phone: normalizedPhone,
                isDeleted: false,
            },
        });
    }
    if (!contact && normalizedEmail) {
        contact = await prisma.contact.findFirst({
            where: {
                tenantId,
                email: normalizedEmail,
                isDeleted: false,
            },
        });
    }
    if (!contact) {
        contact = await prisma.contact.create({
            data: {
                tenantId,
                name: name || "Unknown Contact",
                email: normalizedEmail || null,
                phone: normalizedPhone || null,
                source: source ?? ContactSource.MANUAL,
            },
        });
    }
    return contact;
};
//# sourceMappingURL=contact.js.map