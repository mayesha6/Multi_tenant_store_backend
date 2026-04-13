import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { MessageControllers } from "./message.controller";
import { sendMessageZodSchema } from "./message.validation";
import { UserRole } from "@prisma/client";
const router = Router();
router.post("/:conversationId", checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ❌ viewer no
validateRequest(sendMessageZodSchema), MessageControllers.sendMessage);
router.get("/:conversationId", checkAuth(...Object.values(UserRole)), // ✅ viewer can read
MessageControllers.getMessages);
router.patch("/:conversationId/seen", checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ❌ viewer no
MessageControllers.markSeen);
export const MessageRoutes = router;
//# sourceMappingURL=message.routes.js.map