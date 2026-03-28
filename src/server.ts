/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import prisma from "./app/lib/prisma";

let server: Server;

const startServer = async () => {
  try {
    // Test Prisma DB connection
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma ✅");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening on port ${envVars.PORT} 🚀`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
};

(async () => {
  try {
    await connectRedis();
    await startServer();
    await seedSuperAdmin();
  } catch (error) {
    console.log("Startup error:", error);
    process.exit(1);
  }
})();

/**
 * Graceful Shutdown Handler
 */
const shutdown = async (signal: string, error?: unknown) => {
  console.log(`${signal} received. Shutting down gracefully...`, error || "");

  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed.");
      });
    }

    await prisma.$disconnect();
    console.log("Prisma disconnected.");

    process.exit(1);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (err) => shutdown("Unhandled Rejection", err));
process.on("uncaughtException", (err) => shutdown("Uncaught Exception", err));