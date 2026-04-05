import { getIO } from "../config/socket";

export const emitToTenantRoom = (
  tenantId: string,
  event: string,
  payload: unknown
) => {
  const io = getIO();
  io.to(`tenant:${tenantId}`).emit(event, payload);
};

export const emitToConversationRoom = (
  conversationId: string,
  event: string,
  payload: unknown
) => {
  const io = getIO();
  io.to(`conversation:${conversationId}`).emit(event, payload);
};