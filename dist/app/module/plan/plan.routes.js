import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { createPlanZodSchema } from "./plan.validation";
import { PlanControllers } from "./plan.controller";
const router = Router();
router.post("/create-plan", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(createPlanZodSchema), PlanControllers.createPlan);
router.get("/", PlanControllers.getAllPlans);
router.get("/:planId", PlanControllers.getPlanById);
router.patch("/:planId", PlanControllers.updatePlan);
router.delete("/:planId", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PlanControllers.deletePlan);
export const PlanRoutes = router;
//# sourceMappingURL=plan.routes.js.map