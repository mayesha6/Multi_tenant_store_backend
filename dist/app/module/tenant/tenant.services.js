import prisma from "../../lib/prisma";
const createTenant = async (payload) => {
    return prisma.tenant.create({ data: payload });
};
const getAllTenant = async () => {
    return prisma.tenant.findMany();
};
const getTenantById = async (id) => {
    return prisma.tenant.findUnique({ where: { id } });
};
const updateTenant = async (id, payload) => {
    return prisma.tenant.update({
        where: { id },
        data: payload,
    });
};
const deleteTenant = async (id) => {
    return prisma.tenant.delete({ where: { id } });
};
export const TenantService = {
    createTenant,
    getAllTenant,
    getTenantById,
    updateTenant,
    deleteTenant
};
//# sourceMappingURL=tenant.services.js.map