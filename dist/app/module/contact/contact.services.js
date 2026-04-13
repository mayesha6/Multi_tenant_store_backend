import httpStatus from "http-status-codes";
import { ContactSource, ContactStatus, Prisma, UserRole } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { contactSearchableFields } from "./contact.constant";
const ensureTenantAccess = (currentUser) => {
    // SUPER_ADMIN may skip tenant restriction only if explicitly needed later.
    // For normal SaaS contact operations, tenant is required.
    if (currentUser.role !== UserRole.SUPER_ADMIN && !currentUser.tenantId) {
        throw new AppError(httpStatus.BAD_REQUEST, "User has no tenant");
    }
};
const normalizeEmail = (email) => {
    if (!email)
        return null;
    return email.trim().toLowerCase();
};
const normalizePhone = (phone) => {
    if (!phone)
        return null;
    return phone.trim();
};
const normalizeTags = (tags) => {
    if (!tags)
        return [];
    return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
};
const createContact = async (currentUser, payload) => {
    ensureTenantAccess(currentUser);
    const tenantId = currentUser.tenantId;
    const email = normalizeEmail(payload.email);
    const phone = normalizePhone(payload.phone);
    // Duplicate email check within same tenant
    if (email) {
        const existingByEmail = await prisma.contact.findFirst({
            where: {
                tenantId,
                email,
                isDeleted: false,
            },
        });
        if (existingByEmail) {
            throw new AppError(httpStatus.BAD_REQUEST, "Contact with this email already exists");
        }
    }
    // Duplicate phone check within same tenant
    if (phone) {
        const existingByPhone = await prisma.contact.findFirst({
            where: {
                tenantId,
                phone,
                isDeleted: false,
            },
        });
        if (existingByPhone) {
            throw new AppError(httpStatus.BAD_REQUEST, "Contact with this phone already exists");
        }
    }
    const contact = await prisma.contact.create({
        data: {
            tenantId,
            name: payload.name.trim(),
            email,
            phone,
            picture: payload.picture ?? null,
            address: payload.address ?? null,
            status: payload.status ?? ContactStatus.ACTIVE,
            source: payload.source ?? ContactSource.MANUAL,
            tags: normalizeTags(payload.tags),
            metadata: payload.metadata ?? Prisma.JsonNull,
        },
    });
    return contact;
};
const getAllContacts = async (currentUser, query) => {
    ensureTenantAccess(currentUser);
    const tenantId = currentUser.tenantId;
    const queryBuilder = new QueryBuilder(query);
    const prismaQuery = queryBuilder
        .filter()
        .search(contactSearchableFields)
        .sort()
        .fields()
        .paginate()
        .build();
    const where = {
        ...(prismaQuery.where || {}),
        tenantId,
        isDeleted: false,
    };
    // Optional explicit filters
    if (query.status) {
        where.status = query.status;
    }
    if (query.source) {
        where.source = query.source;
    }
    // Tag filter: ?tag=VIP or ?tag=Frequent Buyer
    if (query.tag) {
        where.tags = {
            has: query.tag,
        };
    }
    const finalQuery = {
        ...prismaQuery,
        where,
        orderBy: prismaQuery.orderBy || { createdAt: "desc" },
        select: prismaQuery.select || {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
            address: true,
            status: true,
            source: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    conversations: true,
                },
            },
        },
    };
    const [data, total] = await Promise.all([
        prisma.contact.findMany(finalQuery),
        prisma.contact.count({ where }),
    ]);
    const meta = queryBuilder.getMeta(total);
    return {
        data,
        meta,
    };
};
const getSingleContact = async (currentUser, contactId) => {
    ensureTenantAccess(currentUser);
    const tenantId = currentUser.tenantId;
    const contact = await prisma.contact.findFirst({
        where: {
            id: contactId,
            tenantId,
            isDeleted: false,
        },
        include: {
            _count: {
                select: {
                    conversations: true,
                },
            },
        },
    });
    if (!contact) {
        throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
    }
    return contact;
};
const updateContact = async (currentUser, contactId, payload) => {
    ensureTenantAccess(currentUser);
    const tenantId = currentUser.tenantId;
    const existingContact = await prisma.contact.findFirst({
        where: {
            id: contactId,
            tenantId,
            isDeleted: false,
        },
    });
    if (!existingContact) {
        throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
    }
    const email = normalizeEmail(payload.email);
    const phone = normalizePhone(payload.phone);
    // Unique email check excluding current contact
    if (email) {
        const duplicateByEmail = await prisma.contact.findFirst({
            where: {
                tenantId,
                email,
                isDeleted: false,
                NOT: {
                    id: contactId,
                },
            },
        });
        if (duplicateByEmail) {
            throw new AppError(httpStatus.BAD_REQUEST, "Contact with this email already exists");
        }
    }
    // Unique phone check excluding current contact
    if (phone) {
        const duplicateByPhone = await prisma.contact.findFirst({
            where: {
                tenantId,
                phone,
                isDeleted: false,
                NOT: {
                    id: contactId,
                },
            },
        });
        if (duplicateByPhone) {
            throw new AppError(httpStatus.BAD_REQUEST, "Contact with this phone already exists");
        }
    }
    // SECURITY: never let generic update change tenant ownership
    delete payload.tenantId;
    delete payload.isDeleted;
    const data = {};
    if (payload.name !== undefined) {
        data.name = payload.name.trim();
    }
    if (payload.email !== undefined) {
        data.email = email;
    }
    if (payload.phone !== undefined) {
        data.phone = phone;
    }
    if (payload.picture !== undefined) {
        data.picture = payload.picture ?? null;
    }
    if (payload.address !== undefined) {
        data.address = payload.address ?? null;
    }
    if (payload.status !== undefined) {
        data.status = payload.status;
    }
    if (payload.source !== undefined) {
        data.source = payload.source;
    }
    if (payload.tags !== undefined) {
        data.tags = normalizeTags(payload.tags);
    }
    if (payload.metadata !== undefined) {
        data.metadata =
            payload.metadata === null
                ? Prisma.JsonNull
                : payload.metadata;
    }
    const updatedContact = await prisma.contact.update({
        where: {
            id: contactId,
        },
        data,
    });
    return updatedContact;
};
const deleteContact = async (currentUser, contactId) => {
    ensureTenantAccess(currentUser);
    const tenantId = currentUser.tenantId;
    const existingContact = await prisma.contact.findFirst({
        where: {
            id: contactId,
            tenantId,
            isDeleted: false,
        },
        include: {
            _count: {
                select: {
                    conversations: true,
                },
            },
        },
    });
    if (!existingContact) {
        throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
    }
    // Optional business rule:
    // If contact has conversations, do soft delete only.
    await prisma.contact.update({
        where: {
            id: contactId,
        },
        data: {
            isDeleted: true,
        },
    });
    return null;
};
export const ContactServices = {
    createContact,
    getAllContacts,
    getSingleContact,
    updateContact,
    deleteContact,
};
//# sourceMappingURL=contact.services.js.map