import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createSubscriptionZodSchema, updateSubscriptionZodSchema } from "./subscription.validation";
import { UserRole } from "@prisma/client";
import { SubscriptionController } from "./subscription.controller";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createSubscriptionZodSchema),
  SubscriptionController.createSubscription
);

router.get("/", checkAuth(...Object.values(UserRole)), SubscriptionController.getAllSubscriptions);

router.get("/:id", checkAuth(...Object.values(UserRole)), SubscriptionController.getSubscriptionById);

router.patch("/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(updateSubscriptionZodSchema), SubscriptionController.updateSubscription);

router.patch("/:id/cancel", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), SubscriptionController.cancelSubscription);

export const SubscriptionRoutes = router;