import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ContactControllers } from "./contact.controller";
import {
  createContactZodSchema,
  updateContactZodSchema,
} from "./contact.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPPORT),
  validateRequest(createContactZodSchema),
  ContactControllers.createContact
);

router.get(
  "/all-contacts",
  checkAuth(...Object.values(UserRole)),
  ContactControllers.getAllContacts
);

router.get(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  ContactControllers.getSingleContact
);

router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPPORT),
  validateRequest(updateContactZodSchema),
  ContactControllers.updateContact
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER),
  ContactControllers.deleteContactById
);

export const ContactRoutes = router;