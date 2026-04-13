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

// Create contact
router.post(
  "/",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.SUPPORT),
  validateRequest(createContactZodSchema),
  ContactControllers.createContact
);

// List contacts with search/filter/pagination
router.get(
  "/",
  checkAuth(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.AGENT,
    UserRole.SUPPORT,
    UserRole.SUPER_ADMIN
  ),
  ContactControllers.getAllContacts
);

// Get single contact
router.get(
  "/:id",
  checkAuth(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.AGENT,
    UserRole.SUPPORT,
    UserRole.SUPER_ADMIN
  ),
  ContactControllers.getSingleContact
);

// Update contact
router.patch(
  "/:id",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.SUPPORT),
  validateRequest(updateContactZodSchema),
  ContactControllers.updateContact
);

// Soft delete contact
router.delete(
  "/:id",
  checkAuth(UserRole.OWNER, UserRole.ADMIN),
  ContactControllers.deleteContact
);

export const ContactRoutes = router;