import { Router } from "express";
import { UserRole } from "@prisma/client";
import { PlanController } from "./plan.controller";
import { planValidationSchema } from "./plan.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();
router.post("/create-plan", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(planValidationSchema), PlanController.createPlan);
router.get("/", PlanController.getAllPlans);
router.get("/:planId", PlanController.getPlanById);
router.patch("/:planId", PlanController.updatePlan);
router.delete("/:planId", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PlanController.deletePlan);
export const PlanRoutes = router;
//# sourceMappingURL=plan.routes.js.map