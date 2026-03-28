import prisma from "../../lib/prisma";


const createFAQ = async (payload: any) => {
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

const getSingleFAQ = async (id: string) => {
  return await prisma.fAQ.findUnique({
    where: { id },
  });
};

const updateFAQ = async (id: string, payload: any) => {
  return await prisma.fAQ.update({
    where: { id },
    data: payload,
  });
};

const deleteFAQ = async (id: string) => {
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