import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv';
import { chats } from "./src/chat/chatSchema";
import { messageStorage } from "./src/message/messageController";
import { teamMemberStorage } from "./src/teamMember/teamMemberController";
import { clinicStorage } from "./src/clinic/clinicController";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://192.168.29.46:5000"],
    methods: ["GET", "POST"]
  }
});

const userSocketMap = new Map<string, string>();
const activeChatUsers = new Map<string, Set<string>>(); // <chatId, Set<userId>>

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Attach userSocketMap to app for access in routes
(app as any).userSocketMap = userSocketMap;

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

  // Socket.IO Chat functionality
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register-user', (userId: string) => {
      if (userId) {
        userSocketMap.set(userId, socket.id);
        (socket as any).userId = userId; // Store for easy access
        console.log(`Current userSocketMap entries:`, Array.from(userSocketMap.entries()));
      }
    });

    // Join a chat room
    socket.on('join-chat', (chatId: string) => {
      socket.join(`chat-${chatId}`);
      const userId = (socket as any).userId;
      if (userId) {
        if (!activeChatUsers.has(chatId)) {
          activeChatUsers.set(chatId, new Set());
        }
        activeChatUsers.get(chatId)!.add(userId);
        console.log(`User ${userId} is now active in chat ${chatId}`);
      }
    });

    // Leave a chat room
    socket.on('leave-chat', (chatId: string) => {
      socket.leave(`chat-${chatId}`);
      const userId = (socket as any).userId;
      if (userId && activeChatUsers.has(chatId)) {
        activeChatUsers.get(chatId)!.delete(userId);
        console.log(`User ${userId} is no longer active in chat ${chatId}`);
      }
    });

    // Handle new message
    socket.on('send-message', async (data: {
      chatId: string;
      message: any;
    }) => {
      try {
        console.log('New message received:', data);
        
        // Save message to database
        const savedMessage = await messageStorage.createMessage({
          ...data.message,
          chatId: data.chatId
        });
        console.log("savedMessage", savedMessage);
        await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, data.chatId));
        console.log("updatedChat");
        // Broadcast message to all users in the chat room
        io.to(`chat-${data.chatId}`).emit('new-message', {
          chatId: data.chatId,
          message: savedMessage
        });

        // Notify team members and clinic users who are NOT active in the chat
        const activeUsersInThisChat = activeChatUsers.get(data.chatId) || new Set();
        
        // Get all users (both team members and clinics)
        const teamMembers = await teamMemberStorage.getTeamMembers();
        const clinics = await clinicStorage.getClinics();
        
        // Create a combined list of all users
        const allUsers = [
          ...teamMembers.map(member => ({ 
            id: member.fullName, 
            type: 'team_member',
            permissions: member.permissions || []
          })),
          ...clinics.map(clinic => ({ 
            id: `${clinic.firstname} ${clinic.lastname}`, 
            type: 'clinic',
            permissions: clinic.permissions || []
          }))
        ];
        
        // Notify all users who are not the sender and not active in the chat
        allUsers.forEach(async (user) => {
          const userId = user.id;
          if (userId && userId !== savedMessage.sender && !activeUsersInThisChat.has(userId)) {
            const socketId = userSocketMap.get(userId);
            if (socketId) {
              const unreadCount = await messageStorage.getUnreadMessageCount(data.chatId, userId);
              io.to(socketId).emit('unread-count-update', { chatId: data.chatId, unreadCount });
              console.log(`Sent unread count update to ${userId}: ${unreadCount} unread messages in chat ${data.chatId}`);
            }
          }
        });

        console.log(`Message broadcasted to chat ${data.chatId}`);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { chatId: string; user: string; isTyping: boolean }) => {
      socket.to(`chat-${data.chatId}`).emit('user-typing', {
        chatId: data.chatId,
        user: data.user,
        isTyping: data.isTyping
      });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      const userId = (socket as any).userId;
      if (userId) {
        userSocketMap.delete(userId);
        // Remove user from any active chat sets
        activeChatUsers.forEach(users => users.delete(userId));
        console.log(`User ${userId} disconnected and unregistered.`);
      }
      console.log('User disconnected:', socket.id);
    });
  });

  // Export io for use in routes
  (app as any).io = io;

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
  httpServer.listen({ port, host: '0.0.0.0' }, () => {
    log(`Server is running on http://localhost:${port}`);
    log(`Socket.IO server is ready for real-time chat`);
  });

})();