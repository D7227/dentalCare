import { z } from "zod";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const attendance = pgTable("attendance", {
    id: uuid("id").primaryKey().defaultRandom(),
    techId: text("tech_id").notNull(),
    inTime: text("in").notNull(),
    outTime: text("out"),
    totalHours: text("total_hours"),
  });

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;