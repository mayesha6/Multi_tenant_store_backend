import { getIO } from "../config/socket";

/**
 * tenant room = inbox list updates
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
 * conversation room = specific chat thread updates
 */
export const emitToConversationRoom = (
  conversationId: string,
  event: string,
  payload: unknown
) => {
  const io = getIO();
  io.to(`conversation:${conversationId}`).emit(event, payload);
};