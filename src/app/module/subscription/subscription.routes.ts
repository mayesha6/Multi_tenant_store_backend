import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { createCheckoutSessionZodSchema } from "./subscription.validation";
import { SubscriptionControllers } from "./subscription.controller";

const router = Router();

// Get all subscriptions (admin only)
router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER),
  SubscriptionControllers.getAllSubscriptions
);


// Create checkout session for tenant
router.post(
  "/checkout",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER),
  validateRequest(createCheckoutSessionZodSchema),
  SubscriptionControllers.createCheckoutSession
);

export const SubscriptionRoutes = router;