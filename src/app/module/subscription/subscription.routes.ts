import { Router } from "express";
import { UserRole } from "@prisma/client";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/create-subscription",
  checkAuth(UserRole.USER),
  validateRequest(SubscriptionValidation.SubscriptionValidationSchema),
  SubscriptionController.createSubscription
);

router.get(
  "/my-subscription",
  checkAuth(...Object.values(UserRole)),
  SubscriptionController.getMySubscription
);

router.get(
    "/", 
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER), 
    SubscriptionController.getAllSubscription
);

router.get(
  "/:subscriptionId",
  checkAuth(...Object.values(UserRole)),
  SubscriptionController.getSingleSubscription
);

router.patch(
  "/:subscriptionId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SubscriptionController.updateSubscription
);

router.delete(
  "/:subscriptionId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SubscriptionController.deleteSubscription 
);


export const SubscriptionRoutes = router;
