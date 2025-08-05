import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const role = pgTable("role", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique()
  });

  export const insertRoleSchema = createInsertSchema(role).omit({
    id: true,
  });
  
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof role.$inferSelect;