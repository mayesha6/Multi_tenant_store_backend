import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ConversationControllers } from "./conversation.controller";
import {
  createConversationZodSchema,
  sendMessageZodSchema,
  updateConversationZodSchema,
} from "./conversation.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPPORT),
  validateRequest(createConversationZodSchema),
  ConversationControllers.createConversation
);

router.get(
  "/",
  checkAuth(...Object.values(UserRole)),
  ConversationControllers.getAllConversations
);

router.get(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  ConversationControllers.getSingleConversation
);

router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPPORT),
  validateRequest(updateConversationZodSchema),
  ConversationControllers.updateConversation
);

router.get(
  "/:id/messages",
  checkAuth(...Object.values(UserRole)),
  ConversationControllers.getMessagesByConversationId
);

router.post(
  "/:id/messages",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPPORT),
  validateRequest(sendMessageZodSchema),
  ConversationControllers.sendAgentMessage
);

router.patch(
  "/:id/read",
  checkAuth(...Object.values(UserRole)),
  ConversationControllers.markConversationAsRead
);

export const ConversationRoutes = router;