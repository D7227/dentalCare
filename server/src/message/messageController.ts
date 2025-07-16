import { chatStorage } from "../chat/chatController";
import { InsertMessage, Message, messages } from "./messageSchema";
import { orderStorage } from "../order/orderController";
import { eq, and, or, sql, gte, lte, inArray, asc } from "drizzle-orm";
import { db } from "../../database/db";
import { chats } from "../chat/chatSchema";
import { companies } from "../company/companyschema";

export interface MessageStore {
createMessage(message: InsertMessage): Promise<Message>;
getMessagesByChat(chatId: string): Promise<Message[]>;
getMessagesByOrder(orderId: string): Promise<Message[]>;
markAllMessagesAsRead(chatId: string, userId: string): Promise<void>;
getUnreadMessageCount(chatId: string, userId?: string): Promise<number>;
}

export class MessageStorage implements MessageStore {
    async createMessage(insertMessage: InsertMessage): Promise<Message> {
        console.log("insertMessage", insertMessage);
        const messageData = {
          ...insertMessage,
          attachments: Array.isArray(insertMessage.attachments) ? insertMessage.attachments as string[] : [],
          readBy: [insertMessage.sender],
        };
        console.log("messageData", messageData);
        const [message] = await db.insert(messages).values(messageData).returning();
        return message;
      }
    
      async getMessagesByOrder(orderId: string): Promise<Message[]> {
        const orderChats = await db.select().from(chats).where(eq(chats.orderId, orderId));
        if (orderChats.length === 0) return [];
        
        return await db.select().from(messages).where(eq(messages.chatId, orderChats[0].id));
      }
    
      
    
      async getMessagesByChat(chatId: string): Promise<Message[]> {
        return await db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(asc(messages.createdAt));
      }
    
      
    
      async initializeData() {
        console.log("Starting database initialization...");
        
        // Check if we already have data to avoid duplicates
        const existingOrders = await orderStorage.getOrders();
        if (existingOrders.length > 0) {
          console.log("Database already has data, skipping initialization");
          return;
        }
    
        // Create basic sample data
        try {
          // Create sample companies
          await db.insert(companies).values([
            { name: "Nobel Biocare" },
            { name: "Straumann" },
            { name: "Dentsply Sirona" },
            { name: "Zimmer Biomet" },
            { name: "BioHorizons" },
            { name: "MegaGen" },
            { name: "Osstem" },
            { name: "Neodent" }
          ]);
          
          console.log("Basic sample data created successfully");
        } catch (error) {
          console.error("Error creating sample data:", error);
        }
      }
    
      async getUnreadMessageCount(chatId: string, userId?: string): Promise<number> {
        console.log(chatId , userId ,"this is a alll")


        if (!userId) {
          console.log("No userId provided, returning 0");
          return 0;
        }
    
        // First, get the chat to check if the user is a participant
        const chat = await chatStorage.getChat(chatId);
        if (!chat) {
          console.log(`Chat ${chatId} not found, returning 0`);
          return 0;
        }
    
        // Check if the user is a participant in this chat
        const participants = chat.participants || [];
        const isParticipant = participants.some((participant: string) => {
          const exactMatch = participant.toLowerCase() === userId.toLowerCase();
          const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) ||
                               userId.toLowerCase().includes(participant.toLowerCase());
          return exactMatch || containsMatch;
        });
    
        if (!isParticipant) {
          console.log(`User ${userId} is not a participant in chat ${chatId}, returning 0`);
          return 0;
        }
    
        const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
        
        const unreadCount = messageList.filter((message: Message) => {
          const readBy = message.readBy || [];
          const isUnread = !readBy.includes(userId);
          console.log(`Message ${message.id}: readBy=${JSON.stringify(readBy)}, isUnread=${isUnread} for user ${userId}`);
          return isUnread;
        }).length;
        
        console.log(`Total unread count for user ${userId} in chat ${chatId}: ${unreadCount}`);
        return unreadCount;
      }
    
      async markAllMessagesAsRead(chatId: string, userId: string): Promise<void> {
        const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
        for (const messageItem of messageList) {
          const currentReadBy = messageItem.readBy || [];
          if (!currentReadBy.includes(userId)) {
            const updatedReadBy = [...currentReadBy, userId];
            await db
              .update(messages)
              .set({ readBy: updatedReadBy })
              .where(eq(messages.id, messageItem.id));
          }
        }
      }
}

export const messageStorage = new MessageStorage();