import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { MessageControllers } from "./message.controller";
import { sendMessageZodSchema } from "./message.validation";
import { UserRole } from "@prisma/client";

const router = Router();

// send message
router.post(
  "/:conversationId",
  checkAuth(UserRole.ADMIN, UserRole.AGENT, UserRole.SUPPORT),
  validateRequest(sendMessageZodSchema),
  MessageControllers.sendMessage
);

// get messages
router.get(
  "/:conversationId",
  checkAuth(UserRole.ADMIN, UserRole.AGENT, UserRole.SUPPORT),
  MessageControllers.getMessages
);

// mark seen
router.patch(
  "/:conversationId/seen",
  checkAuth(UserRole.ADMIN, UserRole.AGENT, UserRole.SUPPORT),
  MessageControllers.markSeen
);

export const MessageRoutes = router;