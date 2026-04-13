import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { createCheckoutSessionZodSchema } from "./subscription.validation";
import { SubscriptionControllers } from "./subscription.controller";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.OWNER), // ❗ admin remove
  SubscriptionControllers.getAllSubscriptions
);

router.post(
  "/checkout",
  checkAuth(UserRole.OWNER), // ✅ only owner pays
  validateRequest(createCheckoutSessionZodSchema),
  SubscriptionControllers.createCheckoutSession
);

export const SubscriptionRoutes = router;