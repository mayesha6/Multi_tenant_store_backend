import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TenantController } from "./tenant.controller";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTenantZodSchema, updateTenantZodSchema, } from "./tenant.validation";
const router = Router();
router.post("/", checkAuth(...Object.values(UserRole)), // ✅ any logged user
validateRequest(createTenantZodSchema), TenantController.createTenant);
router.get("/", checkAuth(UserRole.SUPER_ADMIN), TenantController.getAllTenant);
router.get("/me", checkAuth(...Object.values(UserRole)), TenantController.getMyTenant);
router.get("/:id", checkAuth(UserRole.SUPER_ADMIN), TenantController.getTenantById);
router.patch("/me", checkAuth(UserRole.OWNER), // ❗ admin remove (safe)
validateRequest(updateTenantZodSchema), TenantController.updateMyTenant);
router.patch("/:id", checkAuth(UserRole.SUPER_ADMIN), validateRequest(updateTenantZodSchema), TenantController.updateTenant);
router.delete("/:id", checkAuth(UserRole.SUPER_ADMIN), TenantController.deleteTenant);
export const TenantRoutes = router;
//# sourceMappingURL=tenant.routes.js.map