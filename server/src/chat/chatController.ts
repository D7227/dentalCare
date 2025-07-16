import { eq } from "drizzle-orm";
import { db } from "../../database/db";
import { Chat, chats, InsertChat } from "./chatSchema";
import { messages } from "../message/messageSchema";

export interface ChatStore {
  getChat(id: string): Promise<Chat | undefined>;
  createChat(chat: InsertChat): Promise<Chat>;
  getChats(userId?: string): Promise<(Chat & { unreadCount: number })[]>;
  getChatsByType(type: string): Promise<Chat[]>;
  getChatsByClinic(clinicId: string): Promise<Chat[]>;
  updateChat(id: string, updates: Partial<InsertChat>): Promise<Chat | undefined>;
  getChatByOrderId(orderId: string): Promise<Chat | undefined>;
  deleteChat(chatId: string): Promise<void>;
  deleteMessagesByChat(chatId: string): Promise<void>;
  getUnreadMessageCount(chatId: string, userId?: string): Promise<number>;
}


  export class ChatStorage implements ChatStore {
  async getChat(id: string): Promise<Chat | undefined> {
    console.log("Getting chat", id);
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    console.log("Chat", chat);
    return chat;
  }

  async createChat(data: any) {
    // Ensure participants are user full names (not IDs)
    const chatData = {
      ...data,
      participants: Array.isArray(data.participants)
        ? data.participants.map((p: any) => typeof p === 'object' ? p.fullName : p)
        : [],
    };
    const [chat] = await db.insert(chats).values(chatData).returning();
    return chat;
  }

  async getChats(userId?: string): Promise<(Chat & { unreadCount: number })[]> {
    const chatList = await db.select().from(chats);
    console.log("chatList", chatList);
    
    if (!userId) {
      // If no userId provided, return chats with unreadCount as 0
      return chatList.map(chat => ({ ...chat, unreadCount: 0 }));
    }
    
    // Calculate unread counts for each chat
    const chatsWithUnreadCounts = await Promise.all(
      chatList.map(async (chat) => {
        // Check if user is a participant in this chat
        const participants = chat.participants || [];
        const isParticipant = participants.some((participant) => {
          const exactMatch = participant.toLowerCase() === userId.toLowerCase();
          const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) ||
                               userId.toLowerCase().includes(participant.toLowerCase());
          return exactMatch || containsMatch;
        });
        
        if (!isParticipant) {
          // If user is not a participant, return chat with unreadCount as 0
          return { ...chat, unreadCount: 0 };
        }
        
        // Calculate unread count for this user in this chat
        const unreadCount = await this.getUnreadMessageCount(chat.id, userId);
        return {
          ...chat,
          unreadCount,
        };
      })
    );
    
    return chatsWithUnreadCounts;
  }

  async getChatsByType(type: string): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.type, type));
  }

  async getChatsByClinic(clinicId: string): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.clinicId, clinicId));
  }

  async updateChat(id: string, updates: Partial<InsertChat>): Promise<Chat | undefined> {
    const updateData: any = { ...updates };
    if (updates.participants && Array.isArray(updates.participants)) {
      // Always use fullName for participants
      updateData.participants = updates.participants.map((p: any) => typeof p === 'object' ? p.fullName : p);
    }
    
    const [chat] = await db
      .update(chats)
      .set(updateData)
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
    return chat;
  }
  async deleteMessagesByChat(chatId: string): Promise<void> {
    await db.delete(messages).where(eq(messages.chatId, chatId));
  }
    // Hard delete a chat and its messages
    async deleteChat(chatId: string): Promise<void> {
        await this.deleteMessagesByChat(chatId);
        await db.delete(chats).where(eq(chats.id, chatId));
      }
      
    // Get unread message count for a user in a chat
    async getUnreadMessageCount(chatId: string, userId?: string): Promise<number> {
      if (!userId) {
        console.log("No userId provided, returning 0");
        return 0;
      }

      // First, get the chat to check if the user is a participant
      const chat = await this.getChat(chatId);
      if (!chat) {
        console.log(`Chat ${chatId} not found, returning 0`);
        return 0;
      }

      // Check if the user is a participant in this chat
      const participants = chat.participants || [];
      const isParticipant = participants.includes(userId);

      if (!isParticipant) {
        console.log(`User ${userId} is not a participant in chat ${chatId}, returning 0`);
        return 0;
      }

      const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
      
      const unreadCount = messageList.filter((message: any) => {
        const readBy = message.readBy || [];
        const isUnread = !readBy.includes(userId);
        console.log(`Message ${message.id}: readBy=${JSON.stringify(readBy)}, isUnread=${isUnread} for user ${userId}`);
        return isUnread;
      }).length;
      
      console.log(`Total unread count for user ${userId} in chat ${chatId}: ${unreadCount}`);
      return unreadCount;
    }
      
}

export const chatStorage = new ChatStorage();