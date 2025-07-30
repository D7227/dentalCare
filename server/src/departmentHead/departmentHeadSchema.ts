import { createInsertSchema } from "drizzle-zod";
import {
  pgTable,
  boolean,
  timestamp,
  jsonb,
  uuid,
  varchar,
  date,
  smallint,
  unique,
  text,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { technicianUser } from "../technician/technicianSchema";

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

export const labOrderSchema = pgTable("lab_order", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
  orderId: text("order_id"),
  orderByRole: text("order_by_role"),
  orderById: text("order_by_id"),
  dueDate: date("due_date").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium"),
  sequence: jsonb("sequence").$type<string[]>().default([]), // array of department UUIDs
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderFlowSchema = pgTable(
  "order_flow",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => labOrderSchema.id, { onDelete: "cascade" }),
    departmentId: uuid("department_id").references(() => departmentSchema.id),
    flowStep: smallint("flow_step").notNull(),
    isCurrent: boolean("is_current").default(false),
    inwardByHead: boolean("inward_by_head").default(false),
    inwardTime: timestamp("inward_time"),
    technicianId: uuid("technician_id").references(() => technicianUser.id),
    workStartedAt: timestamp("work_started_at"),
    workCompletedAt: timestamp("work_completed_at"),
    outwardByHead: boolean("outward_by_head").default(false),
    outwardTime: timestamp("outward_time"),
    status: varchar("status", { length: 30 }).default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueOrderDept: unique("unique_order_dept").on(
      table.orderId,
      table.departmentId
    ),
  })
);

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
