import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";

const getContentByType = async (type: string) => {
  const content = await prisma.content.findMany({
    where: { type: type as any },
  });

  if (!content || content.length === 0) {
    throw new AppError(404, "Content not found");
  }

  return content;
};

const getAllContents = async () => {
  return prisma.content.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const createContent = async (type: string, payload: any) => {
  
  return prisma.content.create({
    data: {
      type: type as any,
      title: payload.title,
      content: payload.content,
      image: payload.image,
      order: payload.order,
      isPublished: payload.isPublished ?? true,
    },
  });
};

const updateContent = async (type: string, id: string, payload: any) => {
  const existing = await prisma.content.findFirst({
    where: { type: type as any, id },
  });

  if (!existing) {
    throw new AppError(404, "Content not found. Use create instead.");
  }

  return prisma.content.update({
    where: { id: existing.id },
    data: {
      title: payload.title ?? existing.title,
      content: payload.content ?? existing.content,
      isPublished:
        payload.isPublished !== undefined
          ? payload.isPublished
          : existing.isPublished,
    },
  });
};

const deleteContent = async (type: string, id: string) => {
  const existing = await prisma.content.findFirst({
    where: { type: type as any, id },
  });

  if (!existing) {
    throw new AppError(404, "Content not found");
  }

  return prisma.content.delete({
    where: { id: existing.id },
  });
};

export const ContentService = {
  getContentByType,
  getAllContents,
  createContent,
  updateContent,
  deleteContent,
};