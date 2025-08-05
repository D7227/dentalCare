import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";

export const technicianUser = pgTable("technician_user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  roleId: text("role_id").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  departmentId: text("department_id"),
  employeeId: text("employee_id").notNull().unique(),
  password: text("password").notNull(),
  profilePic: text("profile_pic"),
  profilePicMimeType: text("profile_pic_mime_type"),
  status: text("status").notNull().default("active"),
});

export const insertTechnicianSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  mobileNumber: z.string(),
  departmentId: z.string().optional(),
  employeeId: z.string(),
  password: z.string(),
  profilePic: z.string().optional(),
  profilePicMimeType: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type TechnicianUser = typeof technicianUser.$inferSelect;
