import prisma from "../../lib/prisma";
const createFAQ = async (payload) => {
    return await prisma.fAQ.create({
        data: payload,
    });
};
const getAllFAQ = async () => {
    return await prisma.fAQ.findMany({
        orderBy: {
            order: "asc",
        },
    });
};
const getSingleFAQ = async (id) => {
    return await prisma.fAQ.findUnique({
        where: { id },
    });
};
const updateFAQ = async (id, payload) => {
    return await prisma.fAQ.update({
        where: { id },
        data: payload,
    });
};
const deleteFAQ = async (id) => {
    return await prisma.fAQ.delete({
        where: { id },
    });
};
export const FAQService = {
    createFAQ,
    getAllFAQ,
    getSingleFAQ,
    updateFAQ,
    deleteFAQ,
};
//# sourceMappingURL=faq.services.js.map