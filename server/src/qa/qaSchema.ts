import { pgTable, uuid, text, date, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const qaDailyReportSchema = pgTable("qa_daily_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  qaId: text("qa_id"), // QA user id or reference
  reportDate: date("report_date"),
  summary: text("summary"),
  approvedOrderIds: jsonb("approved_order_ids").default([]), // string[]
  rejectedOrderIds: jsonb("rejected_order_ids").default([]), // string[]
  rescanOrderIds: jsonb("rescan_order_ids").default([]), // string[]
  placeOrderIds: jsonb("place_order_ids").default([]), // string[]
  modifiedOrderIds: jsonb("modified_order_ids").default([]), // string[]
  accessoriesPendingOrderIds: jsonb("accessories_pending_order_ids").default([]), // string[]
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQaDailyReportSchema = createInsertSchema(qaDailyReportSchema).partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type QaDailyReport = z.infer<typeof insertQaDailyReportSchema>;

// --- QA User Table for Authentication/Management ---
export const qaUserSchema = pgTable("qa_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  roleId: uuid("role_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQaUserSchema = createInsertSchema(qaUserSchema).partial({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});

export type QaUser = z.infer<typeof insertQaUserSchema>; 