import prisma from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
const getContentByType = async (type) => {
    const content = await prisma.content.findMany({
        where: { type: type },
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
const createContent = async (type, payload) => {
    return prisma.content.create({
        data: {
            type: type,
            title: payload.title,
            content: payload.content,
            image: payload.image,
            order: payload.order,
            isPublished: payload.isPublished ?? true,
        },
    });
};
const updateContent = async (type, id, payload) => {
    const existing = await prisma.content.findFirst({
        where: { type: type, id },
    });
    if (!existing) {
        throw new AppError(404, "Content not found. Use create instead.");
    }
    return prisma.content.update({
        where: { id: existing.id },
        data: {
            title: payload.title ?? existing.title,
            content: payload.content ?? existing.content,
            isPublished: payload.isPublished !== undefined
                ? payload.isPublished
                : existing.isPublished,
        },
    });
};
const deleteContent = async (type, id) => {
    const existing = await prisma.content.findFirst({
        where: { type: type, id },
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
//# sourceMappingURL=content.services.js.map