import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { createServer } from "http";
import dotenv from "dotenv";
import { authMiddleware } from "./src/middleWare/middleWare";
import { setupSocket } from "./socket/socket";
import path from "path";
import { fileURLToPath } from "url";
import { setupSubPrescriptionRoutes } from "./sub/subPrescriptionRoute";
import { setupPrescriptionRoutes } from "./src/prescription/prescriptionRoute";
import { setupTechnicianRoutes } from "./src/technician/technicianRoute";
import { setupAttendanceRoutes } from "./src/attendence/attendenceRoute";
import { setupLeaveRequestRoutes } from "./src/leaveRequest/leaveRequestRoute";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const httpServer = createServer(app);

const userSocketMap = new Map<string, string>();
const activeChatUsers = new Map<string, Set<string>>(); // <chatId, Set<userId>>

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Attach userSocketMap to app for access in routes
(app as any).userSocketMap = userSocketMap;
setupPrescriptionRoutes(app);
setupSubPrescriptionRoutes(app);
setupTechnicianRoutes(app);
setupAttendanceRoutes(app);
setupLeaveRequestRoutes(app);

// Apply JWT auth middleware to all /api routes except login/register
app.use("/api", authMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyObj, ...args) {
    capturedJsonResponse = bodyObj;
    return originalResJson.apply(res, [bodyObj, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 80)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database with sample data
  try {
    console.log("Checking database initialization...");
    await storage.initializeData();
    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization error:", error);
  }

  const server = await registerRoutes(app);

  // Setup Socket.IO (moved to socket/socket.ts)
  setupSocket(httpServer, app);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // const port = 5432;
  // server.listen({
  //   port,
  //   host: "localhost",
  //   reusePort: true,
  // }, () => {
  //   log(`serving on port ${port}`);
  // });

  const port = 5000; // <- change from 5432 to something else
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    log(`Server is running on http://localhost:${port}`);
    log(`Socket.IO server is ready for real-time chat`);
  });
})();
