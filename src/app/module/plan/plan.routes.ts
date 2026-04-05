import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  createPlanZodSchema,
  updatePlanZodSchema,
} from "./plan.validation";
import { PlanControllers } from "./plan.controller";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createPlanZodSchema),
  PlanControllers.createPlan
);

// Public or authenticated — depends on your app
router.get("/", PlanControllers.getAllPlans);
router.get("/:id", PlanControllers.getPlanById);

// FIX: protect update route
router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(updatePlanZodSchema),
  PlanControllers.updatePlan
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PlanControllers.deletePlan
);

export const PlanRoutes = router;