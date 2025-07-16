import type { Express } from "express";
import { chatStorage } from "./chatController";
import { insertMessageSchema } from "../message/messageSchema";
import { insertChatSchema } from "./chatSchema";
import { messageStorage } from "../message/messageController";

export const setupChatRoutes = (app: Express) => {
  app.get("/api/chats/:clinicId", async (req, res) => {
    try {
      const { userId } = req.query;
      const clinicId = req.params.clinicId;
      const chats = await chatStorage.getChatsByClinic(clinicId);

      console.log(userId,"this is a user id");

      // If userId is provided, calculate unread count for each chat
      if (userId && typeof userId === "string") {
        console.log(`Calculating unread counts for user: ${userId}`);
        const chatsWithUnreadCount = await Promise.all(
          chats.map(async (chat) => {
            console.log(
              `Processing chat ${chat.title} (${chat.id}) with participants:`,
              chat.participants
            );

            // Check if user is a participant in this chat
            const participants = chat.participants || [];
            const isParticipant = participants.some((participant) => {
              const exactMatch =
                participant.toLowerCase() === userId.toLowerCase();
              const containsMatch =
                participant.toLowerCase().includes(userId.toLowerCase()) ||
                userId.toLowerCase().includes(participant.toLowerCase());
              return exactMatch || containsMatch;
            });

            console.log(
              `User ${userId} isParticipant in chat ${chat.title}: ${isParticipant}`
            );

            if (!isParticipant) {
              // Exclude this chat from the result
              return null;
            }
            const unreadCount = await messageStorage.getUnreadMessageCount(
              chat.id,
              userId
            );
            console.log(
              `Chat ${chat.title} (${chat.id}): ${unreadCount} unread messages for user ${userId}`
            );
            return {
              ...chat,
              unreadCount,
            };
          })
        );
        // Filter out nulls (chats where user is not a participant)
        const filteredChats = chatsWithUnreadCount.filter(Boolean);
        console.log("Final chats with unread counts:", filteredChats,userId);
        res.json(filteredChats);
      } else {
        console.log(
          "No userId provided, returning chats without unread counts"
        );
        res.json(chats);
      }
    } catch (error) {
      console.log("Error fetching chats", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });

  app.get("/api/chat/:id", async (req, res) => {
    try {
      console.log("Fetching chat", req.params.id);
      const chat = await chatStorage.getChat(req.params.id);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      console.log("Error fetching chat", error);
      res.status(500).json({ error: "Failed to fetch chat" });
    }
  });

  app.get("/api/chats/type/:type", async (req, res) => {
    try {
      const chats = await chatStorage.getChatsByType(req.params.type);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats by type" });
    }
  });

  app.post("/api/chats", async (req, res) => {
    try {
      if (!req.body.clinicId) {
        return res.status(400).json({ error: "clinicId is required" });
      }
      const chatData = insertChatSchema.parse(req.body);
      const chat = await chatStorage.createChat(chatData);
      res.status(201).json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Invalid chat data" });
    }
  });

  app.get("/api/chats/:id/messages", async (req, res) => {
    try {
      // Never send 304, always send 200 with latest messages
      const messages = await messageStorage.getMessagesByChat(req.params.id);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chats/:id/messages", async (req, res) => {
    try {
      console.log("req.body", req.body);
      const messageData = insertMessageSchema.parse({
        ...req.body,
        chatId: req.params.id, // use as string
      });
      const message = await messageStorage.createMessage(messageData);

      // Emit unread-count-update to all participants (including sender)
      const io = req.app.get("io") || (req.app as any).io;
      const userSocketMap = req.app.get("userSocketMap") || (req.app as any).userSocketMap;
      const chat = await chatStorage.getChat(req.params.id);
      if (io && userSocketMap && chat) {
        for (const participant of chat.participants || []) {
          const socketId = userSocketMap.get(participant);
          if (socketId) {
            const unreadCount = await messageStorage.getUnreadMessageCount(req.params.id, participant);
            io.to(socketId).emit("unread-count-update", { chatId: req.params.id, unreadCount });
          }
        }
      }

      res.status(201).json(message);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  });

  app.post("/api/chats/:id/mark-read", async (req, res) => {
    try {
      const { userId } = req.body;
      const chatId = req.params.id; // use as string
      await messageStorage.markAllMessagesAsRead(chatId, userId);
      // Emit unread-count-update to this user
      const io = req.app.get("io") || (req.app as any).io;
      const userSocketMap =
        req.app.get("userSocketMap") || (req.app as any).userSocketMap;
      if (io && userSocketMap && userId) {
        const socketId = userSocketMap.get(userId);
        if (socketId) {
          const unreadCount = await messageStorage.getUnreadMessageCount(
            chatId,
            userId
          );
          io.to(socketId).emit("unread-count-update", { chatId, unreadCount });
        }
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  app.delete("/api/chats/:id", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await chatStorage.getChat(chatId);

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Hard delete chat and its messages
      await chatStorage.deleteChat(chatId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chat" });
    }
  });

  app.patch("/api/chats/:id/archive", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await chatStorage.updateChat(chatId, { isActive: false });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to archive chat" });
    }
  });

  app.patch("/api/chats/:id/participants", async (req, res) => {
    try {
      const chatId = req.params.id;
      const { participants } = req.body;

      if (!Array.isArray(participants)) {
        return res.status(400).json({ error: "Participants must be an array" });
      }

      // Get current chat to compare participants
      const currentChat = await chatStorage.getChat(chatId);
      const currentParticipants = currentChat?.participants || [];

      // Find newly added participants
      const newParticipants = participants.filter(
        (p) => !currentParticipants.includes(p)
      );
      const removedParticipants = currentParticipants.filter(
        (p) => !participants.includes(p)
      );

      const chat = await chatStorage.updateChat(chatId, { participants });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Emit Socket.IO event to notify all connected users about participant change
      const io = (req.app as any).io;
      if (io) {
        io.emit("participants-updated", {
          chatId: chatId,
          participants: participants,
          newParticipants: newParticipants,
          removedParticipants: removedParticipants,
          updatedBy: req.body.updatedBy || "Unknown",
        });
        console.log(
          `Participants updated for chat ${chatId}, broadcasting to all users`
        );
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participants" });
    }
  });
};