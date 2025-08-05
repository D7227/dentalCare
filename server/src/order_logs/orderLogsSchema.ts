import { pgTable, uuid, jsonb } from "drizzle-orm/pg-core";

export const orderLogs = pgTable("order_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  logs: jsonb("logs").$type<any>(),           
  orderId: uuid("order_id"),
});