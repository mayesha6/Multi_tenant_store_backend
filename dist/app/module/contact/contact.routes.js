import { Router } from "express";
import { ContactController } from "./contact.controller";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();
router.post("/", ContactController.createContact);
router.get("/", checkAuth("ADMIN", "SUPER_ADMIN"), ContactController.getContacts);
router.get("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), ContactController.getContactById);
router.patch("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), ContactController.updateContact);
router.delete("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), ContactController.deleteContact);
export const ContactRoutes = router;
//# sourceMappingURL=contact.routes.js.map