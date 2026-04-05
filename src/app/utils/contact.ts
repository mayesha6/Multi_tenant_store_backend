import { ContactSource } from "@prisma/client";
import prisma from "../lib/prisma";

interface IFindOrCreateContactFromWebhookPayload {
  tenantId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  picture?: string | null;
  address?: string | null;
  source?: ContactSource;
  metadata?: unknown;
}

/**
 * কেন এই function?
 * - webhook payload different provider থেকে আসবে
 * - but আমাদের internal system contact resolve/create একভাবেই করবে
 * - conversation/message module later এই function use করবে
 */
export const findOrCreateContactFromWebhook = async (
  payload: IFindOrCreateContactFromWebhookPayload
) => {
  const {
    tenantId,
    name,
    email,
    phone,
    picture,
    address,
    source = ContactSource.MANUAL,
    metadata,
  } = payload;

  const normalizedEmail =
    email == null ? null : email.trim() === "" ? null : email.trim().toLowerCase();

  const normalizedPhone =
    phone == null ? null : phone.trim() === "" ? null : phone.trim();

  let contact = null;

  /**
   * First priority: phone
   * কারণ WhatsApp / SMS style integration এ phone বেশি reliable
   */
  if (normalizedPhone) {
    contact = await prisma.contact.findFirst({
      where: {
        tenantId,
        phone: normalizedPhone,
        isDeleted: false,
      },
    });
  }

  /**
   * Second priority: email
   * email based channels এর জন্য useful
   */
  if (!contact && normalizedEmail) {
    contact = await prisma.contact.findFirst({
      where: {
        tenantId,
        email: normalizedEmail,
        isDeleted: false,
      },
    });
  }

  /**
   * Contact না পেলে create করবো
   */
  if (!contact) {
    contact = await prisma.contact.create({
      data: {
        tenantId,
        name: name?.trim() || "Unknown Contact",
        email: normalizedEmail,
        phone: normalizedPhone,
        picture: picture || null,
        address: address || null,
        source,
        tags: [],
        metadata:
          metadata === undefined || metadata === null
            ? undefined
            : (metadata as any),
      },
    });
  }

  return contact;
};