import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  mobileNumber: text("mobile_number").notNull().unique(),
  password: text("password").notNull(),
});

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: text("age"),
  sex: text("sex"),
  contact: text("contact"),
  createdAt: timestamp("created_at").defaultNow(),
});

// export const orders = pgTable("orders", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   orderId: text("order_id").notNull().unique(),
//   patientId: uuid("patient_id").references(() => patients.id),
//   type: text("type").notNull(),
//   category: text("category").notNull(), // 'implant' or 'crown_bridge'
//   status: text("status").notNull().default("pending"),
//   priority: text("priority").notNull().default("standard"), // 'critical', 'high', 'standard', 'low'
//   urgency: text("urgency").notNull().default("standard"),
//   caseHandledBy: text("case_handled_by"),
//   consultingDoctor: text("consulting_doctor"),
//   restorationType: text("restoration_type"),
//   toothGroups: jsonb("tooth_groups").$type<any[]>().default([]),
//   restorationProducts: jsonb("restoration_products").$type<any[]>().default([]),
//   accessories: jsonb("accessories").$type<string[]>().default([]),
//   notes: text("notes"),
//   files: jsonb("files").$type<string[]>().default([]),
//   orderType: text("order_type"),
//   paymentStatus: text("payment_status").default("pending"),
//   totalAmount: text("total_amount"),
//   paidAmount: text("paid_amount"),
//   outstandingAmount: text("outstanding_amount"),
//   rejectionReason: text("rejection_reason"),
//   rejectedBy: text("rejected_by"),
//   rejectedDate: timestamp("rejected_date"),
//   dueDate: timestamp("due_date"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull(),
  orderId: text("order_id"),
  referenceId: text("reference_id").notNull(),
  doctorId: uuid("doctor_id"),
  patientId: integer("patient_id"),
  type: text("type").notNull(),
  category: text("category"),
  orderType: text("order_type"),
  orderMethod: text("order_method"),
  occlusalStaining: text("occlusal_staining"),
  orderDate: timestamp("order_date").defaultNow(),
  orderStatus: uuid("order_status"),
  orderCategory: text("order_category"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("standard"),
  urgency: text("urgency").notNull().default("standard"),
  caseHandledBy: text("case_handled_by"),
  pontic: text("pontic"),
  trial: text("trial"), 
  shade: jsonb("shade").$type<string[]>().default([]),
  consultingDoctor: text("consulting_doctor"),
  patientFirstName: text("patient_first_name"),
  patientLastName: text("patient_last_name"),
  patientAge: integer("patient_age"),
  patientSex: text("patient_sex"),
  restorationType: text("restoration_type"),
  toothGroups: jsonb("tooth_groups").$type<any[]>().default([]),
  restorationProducts: jsonb("restoration_products").$type<any[]>().default([]),
  accessories: jsonb("accessories").$type<string[]>().default([]),
  selectedTeeth: jsonb("selected_teeth").$type<any[]>().default([]),
  location: text("location"),
  prescriptionType: text("prescription_type"),
  productName: text("product_name"),
  quantity: integer("quantity"),
  statusLabel: text("status_label"),
  percentage: numeric("percentage", { precision: 5, scale: 2 }),
  currency: text("currency"),
  paymentStatus: text("payment_status").default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
  paidAmount: numeric("paid_amount", { precision: 10, scale: 2 }),
  outstandingAmount: numeric("outstanding_amount", { precision: 10, scale: 2 }),
  shadeNotes: text("shade_notes"),
  additionalNotes: text("additional_notes"),
  shadeGuide: jsonb("shade_guide").$type<string[]>().default([]),
  files: jsonb("files").$type<string[]>().default([]),
  exportQuality: text("export_quality"),
  chatConnection: boolean("chat_connection"),
  unreadMessages: integer("unread_messages"),
  rejectionReason: text("rejection_reason"),
  rejectedBy: text("rejected_by"),
  rejectedDate: timestamp("rejected_date"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  description: text("description"),
});

export const lifecycleStages = pgTable("lifecycle_stages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  date: date("date"),
  time: text("time"), 
  person: text("person").notNull(),
  role: text("role").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const toothGroups = pgTable("tooth_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id"),
  groupId: text("group_id").notNull(),
  teeth: jsonb("teeth").$type<number[]>().notNull(),
  type: text("type").notNull(),
  notes: text("notes"),
  material: text("material"),
  shade: text("shade"),
  warning: text("warning"),
});

export const clinic = pgTable("clinic", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  clinicName: text("clinic_name"),
  clinicLicenseNumber: text("clinic_license_number"),
  clinicAddress: text("clinic_address"),
  billingInfo: text("billing_info"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  address: text("address"),
  password: text("password").notNull(),
  roleId: uuid("role_id").notNull(),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const role = pgTable("role", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique()
});

export const scanBookings = pgTable("scan_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  areaManagerId: text("area_manager_id"),
  scanDate: text("scan_date"),
  scanTime: text("scan_time"),
  notes: text("notes"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pickupRequests = pgTable("pickup_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  pickupDate: text("pickup_date"),
  pickupTime: text("pickup_time"),
  remarks: text("remarks"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bills = pgTable("bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  amount: text("amount").notNull(),
  status: text("status").default("unpaid"),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id"),
  type: text("type").notNull(),
  title: text("title"),
  participants: jsonb("participants").$type<string[]>().default([]),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  clinicId: uuid("clinic_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id"),
  orderId: uuid("order_id").references(() => orders.id),
  sender: text("sender").notNull(),
  senderRole: text("sender_role").notNull(),
  senderType: text("sender_type").notNull(), // 'clinic', 'lab'
  content: text("content").notNull(),
  messageType: text("message_type").default("text"),
  attachments: jsonb("attachments").$type<string[]>().default([]),
  readBy: jsonb("read_by").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  sender_id: uuid("sender_id"),
});

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

// Relations
export const patientsRelations = relations(patients, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  patient: one(patients, {
    fields: [orders.patientId],
    references: [patients.id],
  }),
  toothGroups: many(toothGroups),
  scanBookings: many(scanBookings),
  pickupRequests: many(pickupRequests),
  bills: many(bills),
  messages: many(messages),
}));

export const toothGroupsRelations = relations(toothGroups, ({ one }) => ({
  order: one(orders, {
    fields: [toothGroups.orderId],
    references: [orders.id],
  }),
}));

export const scanBookingsRelations = relations(scanBookings, ({ one }) => ({
  order: one(orders, {
    fields: [scanBookings.orderId],
    references: [orders.id],
  }),
}));

export const pickupRequestsRelations = relations(pickupRequests, ({ one }) => ({
  order: one(orders, {
    fields: [pickupRequests.orderId],
    references: [orders.id],
  }),
}));

export const billsRelations = relations(bills, ({ one }) => ({
  order: one(orders, {
    fields: [bills.orderId],
    references: [orders.id],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  order: one(orders, {
    fields: [chats.orderId],
    references: [orders.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  order: one(orders, {
    fields: [messages.orderId],
    references: [orders.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ }) => ({}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users);

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertToothGroupSchema = createInsertSchema(toothGroups).omit({
  id: true,
});

export const insertScanBookingSchema = createInsertSchema(scanBookings).omit({
  id: true,
  createdAt: true,
});

export const insertPickupRequestSchema = createInsertSchema(pickupRequests).omit({
  id: true,
  createdAt: true,
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinDate: true,
  lastLogin: true,
});

export const insertClinicSchema = createInsertSchema(clinic).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertToothGroup = z.infer<typeof insertToothGroupSchema>;
export type ToothGroup = typeof toothGroups.$inferSelect;

export type InsertScanBooking = z.infer<typeof insertScanBookingSchema>;
export type ScanBooking = typeof scanBookings.$inferSelect;

export type InsertPickupRequest = z.infer<typeof insertPickupRequestSchema>;
export type PickupRequest = typeof pickupRequests.$inferSelect;

export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type Clinic = typeof clinic.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
