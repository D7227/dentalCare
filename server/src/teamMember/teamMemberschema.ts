import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamMembers = pgTable("team_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    contactNumber: text("contact_number"),
    profilePicture: text("profile_picture"),
    roleId: uuid("role_id").notNull(),
    permissions: jsonb("permissions").$type<string[]>().default([]),
    status: text("status").default("active"),
    password: text("password"),
    joinDate: timestamp("join_date").defaultNow(),
    lastLogin: timestamp("last_login"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    clinicName: text("clinic_name"),
  });

  export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
    id: true,
    joinDate: true,
    lastLogin: true,
  });

  export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;