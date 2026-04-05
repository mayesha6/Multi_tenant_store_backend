import httpStatus from "http-status-codes";
import { ContactSource, Prisma } from "@prisma/client";
import type { IContact, IContactQuery } from "./constact.interface";
import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";

const createContact = async (payload: IContact) => {
  const {
    tenantId,
    name,
    email,
    phone,
    picture,
    address,
    source = ContactSource.MANUAL,
    status,
    tags = [],
    metadata,
  } = payload;

  const normalizedEmail = email?.trim().toLowerCase() || null;
  const normalizedPhone = phone?.trim() || null;

  // Deduplication logic:
  // Same tenant-এর মধ্যে same email / phone আবার create করতে দিব না
  if (normalizedEmail) {
    const existingByEmail = await prisma.contact.findFirst({
      where: {
        tenantId,
        email: normalizedEmail,
        isDeleted: false,
      },
    });

    if (existingByEmail) {
      throw new AppError(httpStatus.BAD_REQUEST, "Contact already exists with this email");
    }
  }

  if (normalizedPhone) {
    const existingByPhone = await prisma.contact.findFirst({
      where: {
        tenantId,
        phone: normalizedPhone,
        isDeleted: false,
      },
    });

    if (existingByPhone) {
      throw new AppError(httpStatus.BAD_REQUEST, "Contact already exists with this phone");
    }
  }
  const createData: Prisma.ContactCreateInput = {
    name,
    email: normalizedEmail,
    phone: normalizedPhone,
    picture: picture || null,
    address: address || null,
    source,
    tags,
    metadata:
      metadata === undefined
        ? Prisma.JsonNull
        : metadata === null
        ? Prisma.JsonNull
        : (metadata as Prisma.InputJsonValue),

    // tenant relation দিয়ে create করলে Prisma type safer হয়
    tenant: {
      connect: {
        id: tenantId,
      },
    },
  };

  // IMPORTANT:
  // status undefined হলে field add করবো না
  // তাহলে Prisma schema default(ACTIVE) use করবে
  if (status !== undefined) {
    createData.status = status;
  }
  const contact = await prisma.contact.create({
    data: createData
  });

  return contact;
};

const getAllContacts = async (query: IContactQuery, tenantId: string) => {
  const { searchTerm, status, source, tag } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.ContactWhereInput[] = [
    {
      tenantId,
      isDeleted: false,
    },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (source) {
    andConditions.push({ source });
  }

  if (tag) {
    andConditions.push({
      tags: {
        has: tag,
      },
    });
  }

  const whereConditions: Prisma.ContactWhereInput = {
    AND: andConditions,
  };

  const [data, metaTotal] = await Promise.all([
    prisma.contact.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contact.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total: metaTotal,
      totalPage: Math.ceil(metaTotal / limit),
    },
    data,
  };
};

const getSingleContact = async (id: string, tenantId: string) => {
  const contact = await prisma.contact.findFirst({
    where: {
      id,
      tenantId,
      isDeleted: false,
    },
    include: {
      conversations: {
        where: { isDeleted: false },
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!contact) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return contact;
};

const updateContact = async (id: string, payload: Partial<IContact>, tenantId: string) => {
  const existingContact = await prisma.contact.findFirst({
    where: {
      id,
      tenantId,
      isDeleted: false,
    },
  });

  if (!existingContact) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  const updateData: Prisma.ContactUpdateInput = {};

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  if (payload.email !== undefined) {
    updateData.email =
      payload.email === null
        ? null
        : payload.email.trim() === ""
        ? null
        : payload.email.trim().toLowerCase();
  }

  if (payload.phone !== undefined) {
    updateData.phone =
      payload.phone === null
        ? null
        : payload.phone.trim() === ""
        ? null
        : payload.phone.trim();
  }

  if (payload.picture !== undefined) {
    updateData.picture = payload.picture || null;
  }

  if (payload.address !== undefined) {
    updateData.address = payload.address || null;
  }

  if (payload.status !== undefined) {
    updateData.status = payload.status;
  }

  if (payload.source !== undefined) {
    updateData.source = payload.source;
  }

  if (payload.tags !== undefined) {
    updateData.tags = payload.tags;
  }

  if (payload.isDeleted !== undefined) {
    updateData.isDeleted = payload.isDeleted;
  }

  if (payload.metadata !== undefined) {
    updateData.metadata =
      payload.metadata === null
        ? Prisma.JsonNull
        : (payload.metadata as Prisma.InputJsonValue);
  }

  // email uniqueness check
  if (updateData.email && typeof updateData.email === "string" && updateData.email !== existingContact.email) {
    const emailExists = await prisma.contact.findFirst({
      where: {
        tenantId,
        email: updateData.email,
        isDeleted: false,
        NOT: { id },
      },
    });

    if (emailExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Another contact already uses this email");
    }
  }

  // phone uniqueness check
  if (updateData.phone && typeof updateData.phone === "string" && updateData.phone !== existingContact.phone) {
    const phoneExists = await prisma.contact.findFirst({
      where: {
        tenantId,
        phone: updateData.phone,
        isDeleted: false,
        NOT: { id },
      },
    });

    if (phoneExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Another contact already uses this phone");
    }
  }

  const updatedContact = await prisma.contact.update({
    where: { id },
    data: updateData,
  });

  return updatedContact;
};

const deleteContactById = async (id: string, tenantId: string) => {
  const existingContact = await prisma.contact.findFirst({
    where: {
      id,
      tenantId,
      isDeleted: false,
    },
  });

  if (!existingContact) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  const deletedContact = await prisma.contact.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return deletedContact;
};

export const ContactServices = {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContactById,
};