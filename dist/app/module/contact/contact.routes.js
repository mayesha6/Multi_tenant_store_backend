import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ContactControllers } from "./contact.controller";
import { createContactZodSchema, updateContactZodSchema, } from "./contact.validation";
const router = Router();
router.post("/", checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ✅ only creators
validateRequest(createContactZodSchema), ContactControllers.createContact);
router.get("/", checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT, UserRole.VIEWER, UserRole.SUPER_ADMIN), // ✅ viewer can see
ContactControllers.getAllContacts);
router.get("/:id", checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT, UserRole.VIEWER, UserRole.SUPER_ADMIN), ContactControllers.getSingleContact);
router.patch("/:id", checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ❌ viewer cannot update
validateRequest(updateContactZodSchema), ContactControllers.updateContact);
router.delete("/:id", checkAuth(UserRole.OWNER, UserRole.ADMIN), // ✅ restricted
ContactControllers.deleteContact);
export const ContactRoutes = router;
//# sourceMappingURL=contact.routes.js.map