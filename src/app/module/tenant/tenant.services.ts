import { AuthProvider, UserRole } from "@prisma/client";
import prisma from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import { envVars } from "../../config/env";
import bcryptjs from "bcryptjs";

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
      data: { name: payload.name, slug: payload.slug, stripeCustomerId: stripeCustomer.id }
    });

    const hashedPassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));

    await tx.user.create({
      data: {
        name: payload.ownerName,
        email: payload.ownerEmail,
        password: hashedPassword,
        role: UserRole.OWNER,
        tenantId: tenant.id,
        auths: { create: { provider: "credentials", providerId: payload.ownerEmail } }
      }
    });

    return tenant; // STEP: return tenant for frontend use
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