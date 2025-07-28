import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid, numeric, date, customType } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { orderSchema } from "server/src/order/orderSchema";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

// export const users = pgTable("users", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   mobileNumber: text("mobile_number").notNull().unique(),
//   password: text("password").notNull(),
// });

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  description: text("description"),
});

// export const scanBookings = pgTable("scan_bookings", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   orderId: uuid("order_id").references(() => orderSchema.id),
//   areaManagerId: text("area_manager_id"),
//   scanDate: text("scan_date"),
//   scanTime: text("scan_time"),
//   notes: text("notes"),
//   status: text("status").default("pending"),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const pickupRequests = pgTable("pickup_requests", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   orderId: uuid("order_id").references(() => orderSchema.id),
//   pickupDate: text("pickup_date"),
//   pickupTime: text("pickup_time"),
//   remarks: text("remarks"),
//   status: text("status").default("pending"),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const bills = pgTable("bills", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   orderId: uuid("order_id").references(() => orderSchema.id),
//   amount: text("amount").notNull(),
//   status: text("status").default("unpaid"),
//   dueDate: timestamp("due_date"),
//   paidDate: timestamp("paid_date"),
//   paymentMethod: text("payment_method"),
//   createdAt: timestamp("created_at").defaultNow(),
// });


// Insert schemas
// export const insertUserSchema = createInsertSchema(users);

// export const insertOrderSchema = createInsertSchema(orderSchema).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });
// export const insertScanBookingSchema = createInsertSchema(scanBookings).omit({
//   id: true,
//   createdAt: true,
// });

// export const insertPickupRequestSchema = createInsertSchema(pickupRequests).omit({
//   id: true,
//   createdAt: true,
// });

// export const insertBillSchema = createInsertSchema(bills).omit({
//   id: true,
//   createdAt: true,
// });


export const insertClinicSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  clinicName: z.string(),
  clinicLicenseNumber: z.string(),
  gstNumber: z.string(),
  panNumber: z.string(),
  password: z.string(),
  roleId: z.string(),
  permissions: z.array(z.string()),
  clinicAddressLine1: z.string().optional(),
  clinicAddressLine2: z.string().optional(),
  clinicCity: z.string().optional(),
  clinicState: z.string().optional(),
  clinicPincode: z.string().optional(),
  clinicCountry: z.string().optional(),
  billingAddressLine1: z.string().optional(),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPincode: z.string().optional(),
  billingCountry: z.string().optional(),
});

// export const insertProductSchema = createInsertSchema(products).omit({
//   id: true,
// });



// // Types
// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof users.$inferSelect;

// export type InsertScanBooking = z.infer<typeof insertScanBookingSchema>;
// export type ScanBooking = typeof scanBookings.$inferSelect;

// export type InsertPickupRequest = z.infer<typeof insertPickupRequestSchema>;
// export type PickupRequest = typeof pickupRequests.$inferSelect;

// export type InsertBill = z.infer<typeof insertBillSchema>;
// export type Bill = typeof bills.$inferSelect;

// export type InsertProduct = z.infer<typeof insertProductSchema>;
// export type Product = typeof products.$inferSelect;