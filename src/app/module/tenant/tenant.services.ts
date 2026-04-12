import { UserRole } from "@prisma/client";
import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const normalizeSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const createTenant = async (userId: string, payload: any) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.tenantId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User already belongs to a tenant"
      );
    }

    const normalizedSlug = normalizeSlug(payload.slug);

    const existingSlug = await tx.tenant.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existingSlug) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists");
    }

    const stripeCustomer = await stripe.customers.create({
      name: payload.name,
      email: user.email,
    });

    const tenant = await tx.tenant.create({
      data: {
        name: payload.name,
        slug: normalizedSlug,
        industry: payload.industry,
        teamSize: payload.teamSize,
        websiteUrl: payload.websiteUrl,
        stripeCustomerId: stripeCustomer.id,
        onboardingStep: 2,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        tenantId: tenant.id,
        role: UserRole.OWNER,
      },
    });

    return tenant;
  });
};

const getAllTenant = async () => {
  return prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getTenantById = async (id: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
  });

  if (!tenant) {
    throw new AppError(httpStatus.NOT_FOUND, "Tenant not found");
  }

  return tenant;
};

const getMyTenant = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: true,
    },
  });

  if (!user?.tenant) {
    throw new AppError(httpStatus.NOT_FOUND, "Tenant not found");
  }

  return user.tenant;
};

const updateMyTenant = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.tenantId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has no tenant");
  }

  // SECURITY:
  // Block billing/internal fields from normal tenant settings update
  delete payload.stripeCustomerId;
  delete payload.currentPlanId;
  delete payload.currentSubId;
  delete payload.isActive;

  if (payload.slug) {
    payload.slug = normalizeSlug(payload.slug);
  }

  return prisma.tenant.update({
    where: { id: user.tenantId },
    data: payload,
  });
};

const updateTenant = async (id: string, payload: any) => {
  if (payload.slug) {
    payload.slug = normalizeSlug(payload.slug);
  }

  return prisma.tenant.update({
    where: { id },
    data: payload,
  });
};

const deleteTenant = async (id: string) => {
  return prisma.tenant.delete({
    where: { id },
  });
};

export const TenantService = {
  createTenant,
  getAllTenant,
  getTenantById,
  getMyTenant,
  updateMyTenant,
  updateTenant,
  deleteTenant,
};