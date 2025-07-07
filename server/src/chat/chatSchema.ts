import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { orderSchema } from "../order/orderSchema";
import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { messages } from "../message/messageSchema";


export const chats = pgTable("chats", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id"),
    type: text("type").notNull(),
    title: text("title"),
    participants: jsonb("participants").$type<string[]>().default([]),
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    clinicId: uuid("clinic_id").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  });

  export const chatsRelations = relations(chats, ({ one, many }) => ({
    order: one(orderSchema, {
      fields: [chats.orderId],
      references: [orderSchema.id],
    }),
    messages: many(messages),
  }));
  
  export const messagesRelations = relations(messages, ({ one }) => ({
    chat: one(chats, {
      fields: [messages.chatId],
      references: [chats.id],
    }),
    order: one(orderSchema, {
      fields: [messages.orderId],
      references: [orderSchema.id],
    }),
  }));

  export const insertChatSchema = createInsertSchema(chats).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

  export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;