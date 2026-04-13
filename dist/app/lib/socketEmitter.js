import { getIO } from "../config/socket";
/**
 * tenant room = inbox list updates
 */
export const emitToTenantRoom = (tenantId, event, payload) => {
    const io = getIO();
    io.to(`tenant:${tenantId}`).emit(event, payload);
};
/**
 * conversation room = specific chat thread updates
 */
export const emitToConversationRoom = (conversationId, event, payload) => {
    const io = getIO();
    io.to(`conversation:${conversationId}`).emit(event, payload);
};
//# sourceMappingURL=socketEmitter.js.map