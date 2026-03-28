import prisma from "../../lib/prisma"

const createTenant = async (payload: any) => {
    return prisma.tenant.create({ data: payload })
}

const getAllTenant = async () => {
    return prisma.tenant.findMany()
}

const getByIdTenant = async (id: string) => {
    return prisma.tenant.findUnique({ where: { id } })
}

const updateTenant = async (id: string, payload: any) => {
    return prisma.tenant.update({
        where: { id },
        data: payload,
    })
}

const removeTenant = async (id: string) => {
    return prisma.tenant.delete({ where: { id } })
}

export const TenantService = { 
    createTenant, 
    getAllTenant, 
    getByIdTenant, 
    updateTenant, 
    removeTenant 
}