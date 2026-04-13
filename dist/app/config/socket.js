import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        /**
         * tenant room:
         * একই tenant-এর সব dashboard user এই room-এ join করতে পারবে
         */
        socket.on("join_tenant", (tenantId) => {
            socket.join(`tenant:${tenantId}`);
        });
        /**
         * conversation room:
         * specific conversation open থাকলে ওই room-এ join করবে
         */
        socket.on("join_conversation", (conversationId) => {
            socket.join(`conversation:${conversationId}`);
        });
        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized");
    }
    return io;
};
//# sourceMappingURL=socket.js.map