import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TenantController } from "./tenant.controller";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTenantZodSchema,
  updateTenantZodSchema,
} from "./tenant.validation";

const router = Router();

// FIX: authenticated verified user can create their own workspace
router.post(
  "/",
  checkAuth(...Object.values(UserRole)),
  validateRequest(createTenantZodSchema),
  TenantController.createTenant
);

// SUPER_ADMIN sees all tenants
router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN),
  TenantController.getAllTenant
);

// FIX: current user gets only their own tenant safely
router.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  TenantController.getMyTenant
);

// SUPER_ADMIN can fetch any tenant by id
router.get(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  TenantController.getTenantById
);

// FIX: user can update only their own tenant
router.patch(
  "/me",
  checkAuth(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(updateTenantZodSchema),
  TenantController.updateMyTenant
);

// SUPER_ADMIN can update any tenant
router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(updateTenantZodSchema),
  TenantController.updateTenant
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  TenantController.deleteTenant
);

export const TenantRoutes = router;