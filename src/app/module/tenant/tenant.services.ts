import { UserRole } from "@prisma/client";
import prisma from "../../lib/prisma"
import { stripe } from "../../lib/stripe";

// const createTenant = async (payload: any) => {
//     return prisma.tenant.create({ data: payload })
// }

const createTenant = async (payload: any) => {
  return prisma.$transaction(async (tx) => {

    const stripeCustomer = await stripe.customers.create({
      name: payload.name,
      email: payload.ownerEmail
    });

    const tenant = await tx.tenant.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        stripeCustomerId: stripeCustomer.id
      }
    });

    await tx.user.create({
      data: {
        name: payload.ownerName,
        email: payload.ownerEmail,
        password: payload.password,
        role: UserRole.OWNER,
        tenantId: tenant.id
      }
    });

    return tenant;

  });
};

const getAllTenant = async () => {
  return prisma.tenant.findMany()
}

const getTenantById = async (id: string) => {
  return prisma.tenant.findUnique({ where: { id } })
}

const updateTenant = async (id: string, payload: any) => {
  return prisma.tenant.update({
    where: { id },
    data: payload,
  })
}

const deleteTenant = async (id: string) => {
  return prisma.tenant.delete({ where: { id } })
}

export const TenantService = {
  createTenant,
  getAllTenant,
  getTenantById,
  updateTenant,
  deleteTenant
}