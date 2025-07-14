import { Server } from "socket.io";
import { chats } from "../src/chat/chatSchema";
import { messageStorage } from "../src/message/messageController";
import { teamMemberStorage } from "../src/teamMember/teamMemberController";
import { clinicStorage } from "../src/clinic/clinicController";
import { db } from "../database/db";
import { eq } from "drizzle-orm";

export function setupSocket(httpServer: any, app: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5000", "http://192.168.29.46:5000"],
      methods: ["GET", "POST"]
    }
  });

  const userSocketMap = new Map<string, string>();
  const activeChatUsers = new Map<string, Set<string>>(); // <chatId, Set<userId>>

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register-user', (userId: string) => {
      if (userId) {
        userSocketMap.set(userId, socket.id);
        (socket as any).userId = userId; // Store for easy access
        console.log(`Current userSocketMap entries:`, Array.from(userSocketMap.entries()));
      }
    });

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

    socket.on('leave-chat', (chatId: string) => {
      socket.leave(`chat-${chatId}`);
      const userId = (socket as any).userId;
      if (userId && activeChatUsers.has(chatId)) {
        activeChatUsers.get(chatId)!.delete(userId);
        console.log(`User ${userId} is no longer active in chat ${chatId}`);
      }
    });

    socket.on('send-message', async (data: { chatId: string; message: any; }) => {
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
            id: clinic.id,
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

    socket.on('typing', (data: { chatId: string; user: string; isTyping: boolean }) => {
      socket.to(`chat-${data.chatId}`).emit('user-typing', {
        chatId: data.chatId,
        user: data.user,
        isTyping: data.isTyping
      });
    });

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

  // Attach io and userSocketMap to app for use in routes
  app.io = io;
  app.userSocketMap = userSocketMap;
}
