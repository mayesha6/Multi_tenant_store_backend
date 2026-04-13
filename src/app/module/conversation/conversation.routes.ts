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
  "/",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ❌ viewer no
  validateRequest(createConversationZodSchema),
  ConversationControllers.createConversation
);

router.get(
  "/",
  checkAuth(...Object.values(UserRole)), // ✅ all can see
  ConversationControllers.getAllConversations
);

router.get(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  ConversationControllers.getSingleConversation
);

router.patch(
  "/:id",
  checkAuth(UserRole.OWNER, UserRole.ADMIN), // ❗ SUPPORT cannot change meta
  validateRequest(updateConversationZodSchema),
  ConversationControllers.updateConversation
);

router.get(
  "/:id/messages",
  checkAuth(...Object.values(UserRole)), // ✅ viewer can read
  ConversationControllers.getMessagesByConversationId
);

router.post(
  "/:id/messages",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ❌ viewer cannot send
  validateRequest(sendMessageZodSchema),
  ConversationControllers.sendAgentMessage
);

router.patch(
  "/:id/read",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT), // ❌ viewer no
  ConversationControllers.markConversationAsRead
);

export const ConversationRoutes = router;