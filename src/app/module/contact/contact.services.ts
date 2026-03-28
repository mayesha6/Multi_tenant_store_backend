import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";

const createContact = async (payload: any) => {
  return prisma.contact.create({ data: payload });
};

const getContacts = async () => {
  return prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
};

const getContactById = async (id: string) => {
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) throw new AppError(404, "Contact not found");
  return contact;
};

const updateContact = async (id: string, payload: any) => {
  return prisma.contact.update({ where: { id }, data: payload });
};

const deleteContact = async (id: string) => {
  await prisma.contact.delete({ where: { id } });
  return { message: "Contact deleted successfully" };
};

export const ContactService = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};