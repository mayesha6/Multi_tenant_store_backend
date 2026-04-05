import { getIO } from "../config/socket";

/**
 * Tenant level event emit
 * Example:
 * - new contact created
 * - conversation list updated
 * - unread count changed
 */
export const emitToTenantRoom = (
  tenantId: string,
  event: string,
  payload: unknown
) => {
  const io = getIO();
  io.to(`tenant:${tenantId}`).emit(event, payload);
};

/**
 * Conversation level event emit
 * Example:
 * - new message
 * - message status updated
 * - AI suggestion ready
 */
export const emitToConversationRoom = (
  conversationId: string,
  event: string,
  payload: unknown
) => {
  const io = getIO();
  io.to(`conversation:${conversationId}`).emit(event, payload);
};