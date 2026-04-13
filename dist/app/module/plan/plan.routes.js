import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { createPlanZodSchema, updatePlanZodSchema, } from "./plan.validation";
import { PlanControllers } from "./plan.controller";
const router = Router();
router.post("/", checkAuth(UserRole.SUPER_ADMIN), // ✅ only platform owner
validateRequest(createPlanZodSchema), PlanControllers.createPlan);
router.get("/", PlanControllers.getAllPlans);
router.get("/:id", PlanControllers.getPlanById);
router.patch("/:id", checkAuth(UserRole.SUPER_ADMIN), // ❌ tenant admin cannot
validateRequest(updatePlanZodSchema), PlanControllers.updatePlan);
router.delete("/:id", checkAuth(UserRole.SUPER_ADMIN), PlanControllers.deletePlan);
export const PlanRoutes = router;
//# sourceMappingURL=plan.routes.js.map