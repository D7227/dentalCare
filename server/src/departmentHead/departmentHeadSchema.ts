import { createInsertSchema } from "drizzle-zod";
import {
  pgTable,
  boolean,
  timestamp,
  jsonb,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const departmentHeadSchema = pgTable("department_head", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 120 }).notNull().unique(),
  password: varchar("password", { length: 120 }).notNull(),
  roleId: uuid("role_id").notNull(),
  departmentIds: jsonb("department_ids").$type<string[]>().default([]), // array of department UUIDs
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const departmentSchema = pgTable("department", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDepartmentHeadSchema = createInsertSchema(
  departmentHeadSchema
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departmentSchema).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  }
);

export type InsertDepartmentHead = z.infer<typeof insertDepartmentHeadSchema>;
export type DepartmentHead = typeof departmentHeadSchema.$inferSelect;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departmentSchema.$inferSelect;
