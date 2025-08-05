import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { orderSchema } from "../order/orderSchema";


export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: uuid("chat_id"),
    orderId: uuid("order_id").references(() => orderSchema.id),
    sender: text("sender").notNull(),
    senderRole: text("sender_role").notNull(),
    senderType: text("sender_type").notNull(), // 'clinic', 'lab'
    content: text("content").notNull(),
    messageType: text("message_type").default("text"),
    attachments: jsonb("attachments").$type<string[]>().default([]),
    readBy: jsonb("read_by").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    sender_id: uuid("sender_id"),
  });

  export const insertMessageSchema = createInsertSchema(messages).omit({
    id: true,
    createdAt: true,
  });

  export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;