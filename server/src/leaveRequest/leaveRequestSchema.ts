import { z } from "zod";
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const leaveRequest = pgTable("leave_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  techId: text("tech_id"),
  leaveType: text("leave_type"),
  leaveDate: text("leave_date"),
  leaveTime: text("leave_time"),
  reason: text("reason"),
  leaveStatus: text("leave_status"),
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequest).omit({
  id: true,
});

export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequest.$inferSelect;
