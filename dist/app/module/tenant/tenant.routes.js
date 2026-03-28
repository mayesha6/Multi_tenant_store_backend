import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TenantController } from "./tenant.controller";
import { UserRole } from "@prisma/client";
const router = Router();
router.post("/", checkAuth(UserRole.SUPER_ADMIN), TenantController.createTenant);
router.get("/", checkAuth(UserRole.SUPER_ADMIN), TenantController.getAllTenant);
router.get("/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.ADMIN), TenantController.getTenantById);
router.patch("/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.OWNER), TenantController.updateTenant);
router.delete("/:id", checkAuth(UserRole.SUPER_ADMIN), TenantController.deleteTenant);
export const TenantRoutes = router;
//# sourceMappingURL=tenant.routes.js.map