import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const orderHistorySchema = pgTable("order_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: text("order_id"),
  history: jsonb("history").default([]), // stores list as JSON array
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
