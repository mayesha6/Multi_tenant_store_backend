import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server;


export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join_tenant", (tenantId: string) => {
      if (!tenantId) return;

      socket.join(`tenant:${tenantId}`);
      console.log(`Socket ${socket.id} joined tenant:${tenantId}`);
    });

    socket.on("join_conversation", (conversationId: string) => {
      if (!conversationId) return;

      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation:${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId: string) => {
      if (!conversationId) return;

      socket.leave(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} left conversation:${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
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