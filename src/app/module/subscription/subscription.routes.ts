import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { createCheckoutSessionZodSchema } from "./subscription.validation";
import { SubscriptionControllers } from "./subscription.controller";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER),
  SubscriptionControllers.getAllSubscriptions
);

// FIX: checkout uses logged-in user's tenant, not arbitrary tenantId from body
router.post(
  "/checkout",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER),
  validateRequest(createCheckoutSessionZodSchema),
  SubscriptionControllers.createCheckoutSession
);

export const SubscriptionRoutes = router;