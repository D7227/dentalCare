var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bills: () => bills,
  billsRelations: () => billsRelations,
  chats: () => chats,
  chatsRelations: () => chatsRelations,
  clinic: () => clinic,
  companies: () => companies,
  insertBillSchema: () => insertBillSchema,
  insertChatSchema: () => insertChatSchema,
  insertClinicSchema: () => insertClinicSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertMessageSchema: () => insertMessageSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPatientSchema: () => insertPatientSchema,
  insertPickupRequestSchema: () => insertPickupRequestSchema,
  insertProductSchema: () => insertProductSchema,
  insertScanBookingSchema: () => insertScanBookingSchema,
  insertTeamMemberSchema: () => insertTeamMemberSchema,
  insertToothGroupSchema: () => insertToothGroupSchema,
  insertUserSchema: () => insertUserSchema,
  lifecycleStages: () => lifecycleStages,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  patients: () => patients,
  patientsRelations: () => patientsRelations,
  pickupRequests: () => pickupRequests,
  pickupRequestsRelations: () => pickupRequestsRelations,
  products: () => products,
  role: () => role,
  scanBookings: () => scanBookings,
  scanBookingsRelations: () => scanBookingsRelations,
  teamMembers: () => teamMembers,
  teamMembersRelations: () => teamMembersRelations,
  toothGroups: () => toothGroups,
  toothGroupsRelations: () => toothGroupsRelations,
  users: () => users
});
import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  mobileNumber: text("mobile_number").notNull().unique(),
  password: text("password").notNull()
});
var patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: text("age"),
  sex: text("sex"),
  contact: text("contact"),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
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
  shade: jsonb("shade").$type().default([]),
  consultingDoctor: text("consulting_doctor"),
  patientFirstName: text("patient_first_name"),
  patientLastName: text("patient_last_name"),
  patientAge: integer("patient_age"),
  patientSex: text("patient_sex"),
  restorationType: text("restoration_type"),
  toothGroups: jsonb("tooth_groups").$type().default([]),
  restorationProducts: jsonb("restoration_products").$type().default([]),
  accessories: jsonb("accessories").$type().default([]),
  selectedTeeth: jsonb("selected_teeth").$type().default([]),
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
  shadeGuide: jsonb("shade_guide").$type().default([]),
  files: jsonb("files").$type().default([]),
  exportQuality: text("export_quality"),
  chatConnection: boolean("chat_connection"),
  unreadMessages: integer("unread_messages"),
  rejectionReason: text("rejection_reason"),
  rejectedBy: text("rejected_by"),
  implantPhoto: text("implant_capture"),
  implantCompany: text("implant_company"),
  implantRemark: text("implant_remark_note"),
  rejectedDate: timestamp("rejected_date"),
  issueDescription: text("issue_description"),
  issueCategory: text("issue_category"),
  repairType: text("repair_type"),
  trialApproval: boolean("trial_approval"),
  reapirInstructions: text("repair_instructions"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name")
});
var products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  description: text("description")
});
var lifecycleStages = pgTable("lifecycle_stages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  date: date("date"),
  time: text("time"),
  person: text("person").notNull(),
  role: text("role").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var toothGroups = pgTable("tooth_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id"),
  groupId: text("group_id").notNull(),
  teeth: jsonb("teeth").$type().notNull(),
  type: text("type").notNull(),
  notes: text("notes"),
  material: text("material"),
  shade: text("shade"),
  warning: text("warning")
});
var clinic = pgTable("clinic", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  clinicName: text("clinic_name"),
  clinicLicenseNumber: text("clinic_license_number"),
  clinicAddressLine1: text("clinic_address_line1"),
  clinicAddressLine2: text("clinic_address_line2"),
  clinicCity: text("clinic_city"),
  clinicState: text("clinic_state"),
  clinicPincode: text("clinic_pincode"),
  clinicCountry: text("clinic_country"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  billingAddressLine1: text("billing_address_line1"),
  billingAddressLine2: text("billing_address_line2"),
  billingCity: text("billing_city"),
  billingState: text("billing_state"),
  billingPincode: text("billing_pincode"),
  billingCountry: text("billing_country"),
  password: text("password").notNull(),
  roleId: uuid("role_id").notNull(),
  permissions: jsonb("permissions").$type().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var role = pgTable("role", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique()
});
var scanBookings = pgTable("scan_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  areaManagerId: text("area_manager_id"),
  scanDate: text("scan_date"),
  scanTime: text("scan_time"),
  notes: text("notes"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var pickupRequests = pgTable("pickup_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  pickupDate: text("pickup_date"),
  pickupTime: text("pickup_time"),
  remarks: text("remarks"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var bills = pgTable("bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  amount: text("amount").notNull(),
  status: text("status").default("unpaid"),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow()
});
var chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id"),
  type: text("type").notNull(),
  title: text("title"),
  participants: jsonb("participants").$type().default([]),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  clinicId: uuid("clinic_id").notNull(),
  isActive: boolean("is_active").notNull().default(true)
});
var messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id"),
  orderId: uuid("order_id").references(() => orders.id),
  sender: text("sender").notNull(),
  senderRole: text("sender_role").notNull(),
  senderType: text("sender_type").notNull(),
  // 'clinic', 'lab'
  content: text("content").notNull(),
  messageType: text("message_type").default("text"),
  attachments: jsonb("attachments").$type().default([]),
  readBy: jsonb("read_by").$type().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  sender_id: uuid("sender_id")
});
var teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number"),
  profilePicture: text("profile_picture"),
  roleId: uuid("role_id").notNull(),
  permissions: jsonb("permissions").$type().default([]),
  status: text("status").default("active"),
  password: text("password"),
  joinDate: timestamp("join_date").defaultNow(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  clinicName: text("clinic_name")
});
var patientsRelations = relations(patients, ({ many }) => ({
  orders: many(orders)
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  patient: one(patients, {
    fields: [orders.patientId],
    references: [patients.id]
  }),
  toothGroups: many(toothGroups),
  scanBookings: many(scanBookings),
  pickupRequests: many(pickupRequests),
  bills: many(bills),
  messages: many(messages)
}));
var toothGroupsRelations = relations(toothGroups, ({ one }) => ({
  order: one(orders, {
    fields: [toothGroups.orderId],
    references: [orders.id]
  })
}));
var scanBookingsRelations = relations(scanBookings, ({ one }) => ({
  order: one(orders, {
    fields: [scanBookings.orderId],
    references: [orders.id]
  })
}));
var pickupRequestsRelations = relations(pickupRequests, ({ one }) => ({
  order: one(orders, {
    fields: [pickupRequests.orderId],
    references: [orders.id]
  })
}));
var billsRelations = relations(bills, ({ one }) => ({
  order: one(orders, {
    fields: [bills.orderId],
    references: [orders.id]
  })
}));
var chatsRelations = relations(chats, ({ one, many }) => ({
  order: one(orders, {
    fields: [chats.orderId],
    references: [orders.id]
  }),
  messages: many(messages)
}));
var messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  }),
  order: one(orders, {
    fields: [messages.orderId],
    references: [orders.id]
  })
}));
var teamMembersRelations = relations(teamMembers, ({}) => ({}));
var insertUserSchema = createInsertSchema(users);
var insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertToothGroupSchema = createInsertSchema(toothGroups).omit({
  id: true
});
var insertScanBookingSchema = createInsertSchema(scanBookings).omit({
  id: true,
  createdAt: true
});
var insertPickupRequestSchema = createInsertSchema(pickupRequests).omit({
  id: true,
  createdAt: true
});
var insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true
});
var insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});
var insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinDate: true,
  lastLogin: true
});
var insertClinicSchema = z.object({
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
  billingCountry: z.string().optional()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var insertCompanySchema = createInsertSchema(companies).omit({
  id: true
});

// server/db.ts
import dotenv from "dotenv";
dotenv.config();
var pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "dental_lab_db",
  ssl: false
  // Always disable SSL for local testing
});
pool.on("connect", (client) => {
  console.log("Database connected successfully");
});
pool.on("error", (err) => {
  console.error("Database connection error:", err);
});
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err);
  } else {
    console.log("Database connection test successful:", res.rows[0]);
  }
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, asc } from "drizzle-orm";
import { z as z2 } from "zod";
var teamMemberInsertSchema = z2.object({
  fullName: z2.string().min(1, "Full name is required"),
  email: z2.string().email("Invalid email format").optional(),
  contactNumber: z2.string().optional(),
  profilePicture: z2.string().optional(),
  role: z2.string().min(1, "Role is required"),
  permissions: z2.array(z2.string()).default([]),
  status: z2.string().default("active"),
  password: z2.string().optional(),
  clinicName: z2.string().optional()
});
var teamMemberUpdateSchema = z2.object({
  fullName: z2.string().min(1, "Full name is required").optional(),
  email: z2.string().email("Invalid email format").optional(),
  contactNumber: z2.string().optional(),
  profilePicture: z2.string().optional(),
  role: z2.string().min(1, "Role is required").optional(),
  permissions: z2.array(z2.string()).optional(),
  status: z2.string().optional(),
  password: z2.string().optional(),
  clinicName: z2.string().optional()
});
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, username));
    return user;
  }
  async getUserByMobileNumber(mobileNumber) {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    return user;
  }
  async createUser(insertUser) {
    const userData = {
      ...insertUser,
      id: Math.floor(Math.random() * 1e6) + 1
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async getAllUsers() {
    const user = await db.select().from(users);
    return user;
  }
  async getPatient(id) {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }
  async createPatient(insertPatient) {
    const patientData = {
      ...insertPatient,
      id: Math.floor(Math.random() * 1e6) + 1
    };
    const [patient] = await db.insert(patients).values(patientData).returning();
    return patient;
  }
  async getPatients() {
    return await db.select().from(patients);
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async createOrder(insertOrder) {
    const orderData = {
      ...insertOrder,
      files: Array.isArray(insertOrder.files) ? insertOrder.files : [],
      toothGroups: Array.isArray(insertOrder.toothGroups) ? insertOrder.toothGroups : [],
      restorationProducts: Array.isArray(insertOrder.restorationProducts) ? insertOrder.restorationProducts : [],
      shade: Array.isArray(insertOrder.shade) ? insertOrder.shade : [],
      trial: insertOrder.trial || "",
      pontic: insertOrder.pontic || "Ridge Lap",
      occlusalStaining: insertOrder.occlusalStaining || "",
      shadeGuide: Array.isArray(insertOrder.shadeGuide) ? insertOrder.shadeGuide : [],
      additionalNotes: insertOrder.additionalNotes || "",
      shadeNotes: insertOrder.shadeNotes || "",
      selectedTeeth: Array.isArray(insertOrder.selectedTeeth) ? insertOrder.selectedTeeth : [],
      implantPhoto: insertOrder.implantPhoto || "",
      implantCompany: insertOrder.implantCompany || "",
      implantRemark: insertOrder.implantRemark || "",
      issueDescription: insertOrder.issueDescription || "",
      issueCategory: insertOrder.issueCategory || "",
      repairType: insertOrder.repairType || "",
      trialApproval: insertOrder.trialApproval || false,
      reapirInstructions: insertOrder.reapirInstructions || ""
    };
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }
  async getOrders() {
    return await db.select().from(orders);
  }
  async getOrdersWithFilters(filters) {
    let query = db.select().from(orders);
    const whereClauses = [];
    if (filters.paymentStatus) {
      whereClauses.push(eq(orders.paymentStatus, filters.paymentStatus));
    }
    if (filters.type) {
      whereClauses.push(eq(orders.type, filters.type));
    }
    if (filters.categories && filters.categories.length > 0) {
      whereClauses.push(orders.category.in(filters.categories));
    }
    if (filters.dateFrom) {
      whereClauses.push(orders.createdAt.gte(new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      whereClauses.push(orders.createdAt.lte(new Date(filters.dateTo)));
    }
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereClauses.push(
        db.or(
          db.sql`LOWER(${orders.patientFirstName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.patientLastName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.consultingDoctor}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.orderId}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.referenceId}) LIKE ${searchTerm}`
        )
      );
    }
    if (whereClauses.length > 0) {
      query = query.where(db.and(...whereClauses));
    }
    if (filters.page && filters.pageSize) {
      query = query.limit(filters.pageSize).offset((filters.page - 1) * filters.pageSize);
    }
    return await query;
  }
  async getOrdersWithFiltersCount(filters) {
    let query = db.select({ count: db.sql`COUNT(*)` }).from(orders);
    const whereClauses = [];
    if (filters.paymentStatus) {
      whereClauses.push(eq(orders.paymentStatus, filters.paymentStatus));
    }
    if (filters.type) {
      whereClauses.push(eq(orders.type, filters.type));
    }
    if (filters.categories && filters.categories.length > 0) {
      whereClauses.push(orders.category.in(filters.categories));
    }
    if (filters.dateFrom) {
      whereClauses.push(orders.createdAt.gte(new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      whereClauses.push(orders.createdAt.lte(new Date(filters.dateTo)));
    }
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereClauses.push(
        db.or(
          db.sql`LOWER(${orders.patientFirstName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.patientLastName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.consultingDoctor}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.orderId}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.referenceId}) LIKE ${searchTerm}`
        )
      );
    }
    if (whereClauses.length > 0) {
      query = query.where(db.and(...whereClauses));
    }
    const result = await query;
    return Number(result[0]?.count || 0);
  }
  async getOrdersByPatient(patientId) {
    return await db.select().from(orders).where(eq(orders.patientId, patientId));
  }
  async updateOrderStatus(id, status) {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order;
  }
  async updateOrder(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [order] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return order;
  }
  async createToothGroup(insertToothGroup) {
    const toothGroupData = {
      ...insertToothGroup,
      teeth: Array.isArray(insertToothGroup.teeth) ? insertToothGroup.teeth : []
    };
    const [toothGroup] = await db.insert(toothGroups).values(toothGroupData).returning();
    return toothGroup;
  }
  async getToothGroupsByOrder(orderId) {
    console.log("orderId", orderId);
    return await db.select().from(toothGroups).where(eq(toothGroups.orderId, orderId));
  }
  async createScanBooking(insertScanBooking) {
    const scanBookingData = {
      ...insertScanBooking,
      id: Math.floor(Math.random() * 1e6) + 1
    };
    const [scanBooking] = await db.insert(scanBookings).values(scanBookingData).returning();
    return scanBooking;
  }
  async getScanBookingsByOrder(orderId) {
    return await db.select().from(scanBookings).where(eq(scanBookings.orderId, orderId));
  }
  async createPickupRequest(insertPickupRequest) {
    const pickupRequestData = {
      ...insertPickupRequest,
      id: Math.floor(Math.random() * 1e6) + 1
    };
    const [pickupRequest] = await db.insert(pickupRequests).values(pickupRequestData).returning();
    return pickupRequest;
  }
  async getPickupRequestsByOrder(orderId) {
    return await db.select().from(pickupRequests).where(eq(pickupRequests.orderId, orderId));
  }
  async createBill(insertBill) {
    const billData = {
      ...insertBill,
      id: Math.floor(Math.random() * 1e6) + 1
    };
    const [bill] = await db.insert(bills).values(billData).returning();
    return bill;
  }
  async getBillsByOrder(orderId) {
    return await db.select().from(bills).where(eq(bills.orderId, orderId));
  }
  async createMessage(insertMessage) {
    console.log("insertMessage", insertMessage);
    const messageData = {
      ...insertMessage,
      attachments: Array.isArray(insertMessage.attachments) ? insertMessage.attachments : [],
      readBy: [insertMessage.sender]
    };
    console.log("messageData", messageData);
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }
  async getMessagesByOrder(orderId) {
    const orderChats = await db.select().from(chats).where(eq(chats.orderId, orderId));
    if (orderChats.length === 0) return [];
    return await db.select().from(messages).where(eq(messages.chatId, orderChats[0].id));
  }
  async getChat(id) {
    console.log("Getting chat", id);
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    console.log("Chat", chat);
    return chat;
  }
  async createChat(data) {
    const chatData = {
      ...data,
      participants: Array.isArray(data.participants) ? data.participants : []
    };
    const [chat] = await db.insert(chats).values(chatData).returning();
    return chat;
  }
  async getChats() {
    const chatList = await db.select().from(chats);
    console.log("chatList", chatList);
    return chatList;
  }
  async getChatsByType(type) {
    return await db.select().from(chats).where(eq(chats.type, type));
  }
  async getChatsByClinic(clinicId) {
    return await db.select().from(chats).where(eq(chats.clinicId, clinicId));
  }
  async updateChat(id, updates) {
    const [chat] = await db.update(chats).set(updates).where(eq(chats.id, id)).returning();
    return chat;
  }
  async getMessagesByChat(chatId) {
    return await db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(asc(messages.createdAt));
  }
  async getTeamMember(id) {
    const [user] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return user;
  }
  async createTeamMember(data) {
    console.log("Creating team member with data:", data);
    const teamMemberData = {
      ...data,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      joinDate: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      lastLogin: /* @__PURE__ */ new Date()
    };
    console.log("Inserting team member:", teamMemberData);
    const [teamMember] = await db.insert(teamMembers).values(teamMemberData).returning();
    console.log("Team member created:", teamMember);
    return teamMember;
  }
  async getTeamMembers() {
    const members = await db.select().from(teamMembers);
    return members;
  }
  async getTeamMembersByClinic(clinicName) {
    const members = await db.select().from(teamMembers).where(eq(teamMembers.clinicName, clinicName));
    return members;
  }
  async updateTeamMember(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [teamMember] = await db.update(teamMembers).set(updateData).where(eq(teamMembers.id, id)).returning();
    return teamMember;
  }
  /**
   * Remove a member from all chat participants lists by fullName
   */
  async removeMemberFromAllChats(fullName) {
    const chatsWithMember = await db.select({ id: chats.id, participants: chats.participants }).from(chats);
    for (const chat of chatsWithMember) {
      const participantsArr = Array.isArray(chat.participants) ? chat.participants : [];
      if (participantsArr.includes(fullName)) {
        const updatedParticipants = participantsArr.filter((p) => p !== fullName);
        await db.update(chats).set({ participants: updatedParticipants }).where(eq(chats.id, chat.id));
      }
    }
  }
  async deleteTeamMember(id) {
    const member = await this.getTeamMember(id);
    if (member && member.fullName) {
      await this.removeMemberFromAllChats(member.fullName);
    }
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }
  async getTeamMemberByMobileNumber(mobileNumber) {
    const [teamMember] = await db.select().from(teamMembers).where(eq(teamMembers.contactNumber, mobileNumber));
    return teamMember;
  }
  async getTeamMemberByFullName(fullName) {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.fullName, fullName));
    return member;
  }
  async initializeData() {
    console.log("Starting database initialization...");
    const existingOrders = await this.getOrders();
    if (existingOrders.length > 0) {
      console.log("Database already has data, skipping initialization");
      return;
    }
    try {
      await this.createPatient({
        firstName: "John",
        lastName: "Doe",
        age: "35",
        sex: "male"
      });
      await this.createPatient({
        firstName: "Jane",
        lastName: "Smith",
        age: "28",
        sex: "female"
      });
      await db.insert(companies).values([
        { name: "Nobel Biocare" },
        { name: "Straumann" },
        { name: "Dentsply Sirona" },
        { name: "Zimmer Biomet" },
        { name: "BioHorizons" },
        { name: "MegaGen" },
        { name: "Osstem" },
        { name: "Neodent" }
      ]);
      console.log("Basic sample data created successfully");
    } catch (error) {
      console.error("Error creating sample data:", error);
    }
  }
  async getUnreadMessageCount(chatId, userId) {
    if (!userId) {
      console.log("No userId provided, returning 0");
      return 0;
    }
    const chat = await this.getChat(chatId);
    if (!chat) {
      console.log(`Chat ${chatId} not found, returning 0`);
      return 0;
    }
    const participants = chat.participants || [];
    const isParticipant = participants.some((participant) => {
      const exactMatch = participant.toLowerCase() === userId.toLowerCase();
      const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) || userId.toLowerCase().includes(participant.toLowerCase());
      return exactMatch || containsMatch;
    });
    if (!isParticipant) {
      console.log(`User ${userId} is not a participant in chat ${chatId}, returning 0`);
      return 0;
    }
    const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
    console.log(`getUnreadMessageCount called for chatId: ${chatId}, userId: ${userId}`);
    console.log("messageList", messageList);
    const unreadCount = messageList.filter((message) => {
      const readBy = message.readBy || [];
      const isUnread = !readBy.includes(userId);
      console.log(`Message ${message.id}: readBy=${JSON.stringify(readBy)}, isUnread=${isUnread} for user ${userId}`);
      return isUnread;
    }).length;
    console.log(`Total unread count for user ${userId} in chat ${chatId}: ${unreadCount}`);
    return unreadCount;
  }
  async markAllMessagesAsRead(chatId, userId) {
    const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
    for (const messageItem of messageList) {
      const currentReadBy = messageItem.readBy || [];
      if (!currentReadBy.includes(userId)) {
        const updatedReadBy = [...currentReadBy, userId];
        await db.update(messages).set({ readBy: updatedReadBy }).where(eq(messages.id, messageItem.id));
      }
    }
  }
  async getClinic(id) {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.id, id));
    return clinicData;
  }
  async getClinicByEmail(email) {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.email, email));
    return clinicData;
  }
  async getClinicByMobileNumber(mobileNumber) {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.phone, mobileNumber));
    return clinicData;
  }
  async createClinic(clinicData) {
    const [newClinic] = await db.insert(clinic).values(clinicData).returning();
    return newClinic;
  }
  async getClinics() {
    return await db.select().from(clinic);
  }
  async updateClinic(id, updates) {
    const [updatedClinic] = await db.update(clinic).set(updates).where(eq(clinic.id, id)).returning();
    console.log("updatedClinic==>", updatedClinic);
    return updatedClinic;
  }
  async getClinicByName(clinicName) {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.clinicName, clinicName));
    return clinicData;
  }
  async getRoleById(roleId) {
    const [roleData] = await db.select().from(role).where(eq(role.id, roleId));
    return roleData;
  }
  async getRoleByName(roleName) {
    const [roleData] = await db.select().from(role).where(eq(role.name, roleName));
    return roleData;
  }
  async getProducts() {
    return await db.select().from(products);
  }
  async getLifecycleStages() {
    return await db.select().from(lifecycleStages).orderBy(lifecycleStages.createdAt);
  }
  async getChatByOrderId(orderId) {
    const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
    return chat;
  }
  // Company methods implementation
  async getCompanies() {
    return await db.select().from(companies);
  }
  async getCompanyById(id) {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }
  async getCompanyNameById(id) {
    const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, id));
    return company?.name || void 0;
  }
  async createCompany(company) {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }
  // Hard delete all messages for a chat
  async deleteMessagesByChat(chatId) {
    await db.delete(messages).where(eq(messages.chatId, chatId));
  }
  // Hard delete a chat and its messages
  async deleteChat(chatId) {
    await this.deleteMessagesByChat(chatId);
    await db.delete(chats).where(eq(chats.id, chatId));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
var clinicFieldMap = {
  first_name: "firstname",
  last_name: "lastname",
  clinic_name: "clinicName",
  license_number: "clinicLicenseNumber",
  clinic_address_line1: "clinicAddressLine1",
  clinic_address_line2: "clinicAddressLine2",
  clinic_city: "clinicCity",
  clinic_state: "clinicState",
  clinic_pincode: "clinicPincode",
  clinic_country: "clinicCountry",
  gst_number: "gstNumber",
  pan_number: "panNumber",
  billing_address_line1: "billingAddressLine1",
  billing_address_line2: "billingAddressLine2",
  billing_city: "billingCity",
  billing_state: "billingState",
  billing_pincode: "billingPincode",
  billing_country: "billingCountry"
  // Add more fields as needed
};
function mapClinicFields(obj) {
  const mapped = {};
  for (const key in obj) {
    if (clinicFieldMap[key]) {
      mapped[clinicFieldMap[key]] = obj[key];
    }
  }
  return mapped;
}
async function registerRoutes(app2) {
  passport.use(
    new LocalStrategy(
      (username, password, done) => {
        done(null, { username });
      }
    )
  );
  app2.get("/api/orders", async (req, res) => {
    try {
      const { search, paymentStatus, type, dateFrom, dateTo, categories, page, pageSize } = req.query;
      const filters = {};
      if (search) filters.search = String(search);
      if (paymentStatus) filters.paymentStatus = String(paymentStatus);
      if (type) filters.type = String(type);
      if (dateFrom) filters.dateFrom = String(dateFrom);
      if (dateTo) filters.dateTo = String(dateTo);
      if (categories) {
        if (typeof categories === "string") {
          filters.categories = categories.split(",").map((c) => c.trim());
        } else if (Array.isArray(categories)) {
          filters.categories = categories;
        }
      }
      if (page) filters.page = Number(page);
      if (pageSize) filters.pageSize = Number(pageSize);
      const hasAnyFilter = Object.keys(filters).length > 0;
      const orders2 = hasAnyFilter ? await storage.getOrdersWithFilters(filters) : await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/count", async (req, res) => {
    try {
      const { search, paymentStatus, type, dateFrom, dateTo, categories } = req.query;
      const filters = {};
      if (search) filters.search = String(search);
      if (paymentStatus) filters.paymentStatus = String(paymentStatus);
      if (type) filters.type = String(type);
      if (dateFrom) filters.dateFrom = String(dateFrom);
      if (dateTo) filters.dateTo = String(dateTo);
      if (categories) {
        if (typeof categories === "string") {
          filters.categories = categories.split(",").map((c) => c.trim());
        } else if (Array.isArray(categories)) {
          filters.categories = categories;
        }
      }
      const count = await storage.getOrdersWithFiltersCount(filters);
      res.json({ count });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Failed to fetch order count" });
    }
  });
  app2.post("/api/create-user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.get("/api/get-all-users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users data" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });
  app2.put("/api/orders/:id", async (req, res) => {
    try {
      const updates = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order update data" });
    }
  });
  app2.get("/api/patients", async (req, res) => {
    try {
      const patients2 = await storage.getPatients();
      res.json(patients2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });
  app2.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ error: "Invalid patient data" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  app2.get("/api/companies", async (req, res) => {
    try {
      const companies2 = await storage.getCompanies();
      res.json(companies2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });
  app2.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompanyById(req.params.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });
  app2.get("/api/companies/:id/name", async (req, res) => {
    try {
      const companyName = await storage.getCompanyNameById(req.params.id);
      if (!companyName) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json({ name: companyName });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company name" });
    }
  });
  app2.post("/api/companies", async (req, res) => {
    try {
      const companyData = { name: req.body.name };
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });
  app2.post("/api/tooth-groups", async (req, res) => {
    try {
      console.log("Received tooth group data:", JSON.stringify(req.body, null, 2));
      const toothGroupData = insertToothGroupSchema.parse(req.body);
      console.log("Parsed tooth group data:", JSON.stringify(toothGroupData, null, 2));
      const toothGroup = await storage.createToothGroup(toothGroupData);
      res.status(201).json(toothGroup);
    } catch (error) {
      console.error("Tooth group validation error:", error);
      res.status(400).json({
        error: "Invalid tooth group data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/orders/:orderId/tooth-groups", async (req, res) => {
    try {
      const toothGroups2 = await storage.getToothGroupsByOrder(req.params.orderId);
      res.json(toothGroups2);
    } catch (error) {
      console.error("Error fetching tooth groups", error);
      res.status(500).json({ error: "Failed to fetch tooth groups" });
    }
  });
  app2.get("/api/team-members", async (req, res) => {
    try {
      const { clinicName } = req.query;
      if (clinicName && typeof clinicName === "string") {
        const teamMembers2 = await storage.getTeamMembersByClinic(clinicName);
        const teamMembersWithRoleName = await Promise.all(
          teamMembers2.map(async (member) => {
            let roleName = "";
            if (member.roleId) {
              const role2 = await storage.getRoleById(member.roleId);
              roleName = role2?.name || "";
            }
            return {
              ...member,
              roleName
            };
          })
        );
        res.json(teamMembersWithRoleName);
      } else {
        const teamMembers2 = await storage.getTeamMembers();
        const teamMembersWithRoleName = await Promise.all(
          teamMembers2.map(async (member) => {
            let roleName = "";
            if (member.roleId) {
              const role2 = await storage.getRoleById(member.roleId);
              roleName = role2?.name || "";
            }
            return {
              ...member,
              roleName
            };
          })
        );
        res.json(teamMembersWithRoleName);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });
  app2.get("/api/team-members/:id", async (req, res) => {
    try {
      const teamMember = await storage.getTeamMember(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json(teamMember);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team member" });
    }
  });
  app2.post("/api/team-members", async (req, res) => {
    try {
      const { roleName, ...teamMemberData } = req.body;
      let roleId;
      if (roleName) {
        const role2 = await storage.getRoleByName(roleName);
        if (!role2) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        roleId = role2.id;
      } else {
        return res.status(400).json({ error: "Role name is required" });
      }
      const teamMember = await storage.createTeamMember({
        ...teamMemberData,
        roleId
      });
      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ error: "Invalid team member data" });
    }
  });
  app2.put("/api/team-members/:id", async (req, res) => {
    try {
      const { roleName, ...teamMemberData } = req.body;
      const prevTeamMember = await storage.getTeamMember(req.params.id);
      const prevFullName = prevTeamMember?.fullName;
      if (roleName) {
        const role2 = await storage.getRoleByName(roleName);
        if (!role2) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        teamMemberData.roleId = role2.id;
      }
      const teamMember = await storage.updateTeamMember(req.params.id, teamMemberData);
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      const io2 = req.app.get("io") || req.app.io;
      const userSocketMap2 = global.userSocketMap || req.app.userSocketMap;
      const memberId = teamMember.fullName;
      console.log(teamMember.fullName, "teamMember.fullName");
      console.log("Update request body:", req.body);
      console.log("userSocketMap:", Array.from(userSocketMap2?.entries?.() || []));
      if (io2 && userSocketMap2 && memberId) {
        const socketId = userSocketMap2.get(memberId);
        if (socketId) {
          io2.to(socketId).emit("permissions-updated");
          console.log(`Emitted permissions-updated to ${memberId} (${socketId})`);
        } else {
          console.log(`No socketId found for memberId: ${memberId}`);
        }
      } else {
        if (!io2) console.log("Socket.io instance not found");
        if (!userSocketMap2) console.log("userSocketMap not found");
        if (!memberId) console.log("memberId not found");
      }
      if (prevFullName && teamMember.fullName && prevFullName !== teamMember.fullName) {
        const allChats = await storage.getChats();
        for (const chat of allChats) {
          if (Array.isArray(chat.participants) && chat.participants.includes(prevFullName)) {
            const updatedParticipants = chat.participants.map((p) => p === prevFullName ? teamMember.fullName : p);
            await storage.updateChat(chat.id, { participants: updatedParticipants });
            if (io2) {
              io2.emit("participants-updated", {
                chatId: chat.id,
                participants: updatedParticipants,
                newParticipants: [teamMember.fullName],
                removedParticipants: [prevFullName],
                updatedBy: "System"
              });
              console.log(`Updated participants for chat ${chat.id} after name change:`, updatedParticipants);
            }
          }
        }
      }
      res.json(teamMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ error: "Invalid team member data" });
    }
  });
  app2.delete("/api/team-members/:id", async (req, res) => {
    try {
      const member = await storage.getTeamMember(req.params.id);
      const fullName = member?.fullName;
      let affectedChats = [];
      let allChats = [];
      if (fullName) {
        allChats = await storage.getChats();
        affectedChats = allChats.filter((chat) => Array.isArray(chat.participants) && chat.participants.includes(fullName));
      }
      await storage.deleteTeamMember(req.params.id);
      const io2 = req.app.get("io") || req.app.io;
      if (io2 && fullName) {
        for (const chat of affectedChats) {
          const updatedParticipants = (chat.participants || []).filter((p) => p !== fullName);
          io2.emit("participants-updated", {
            chatId: chat.id,
            participants: updatedParticipants,
            newParticipants: [],
            removedParticipants: [fullName],
            updatedBy: "System"
          });
        }
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });
  app2.get("/api/team-members/mobile/:mobileNumber", async (req, res) => {
    try {
      const { mobileNumber } = req.params;
      console.log("Finding team member by mobile number:", mobileNumber);
      const teamMember = await storage.getTeamMemberByMobileNumber(mobileNumber);
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      console.log("Team member found:", teamMember);
      res.json(teamMember);
    } catch (error) {
      console.error("Error finding team member by mobile number:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/clinics/mobile/:mobileNumber", async (req, res) => {
    try {
      const { mobileNumber } = req.params;
      console.log("Finding clinic by mobile number:", mobileNumber);
      const clinic2 = await storage.getClinicByMobileNumber(mobileNumber);
      if (!clinic2) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      console.log("Clinic found:", clinic2);
      res.json(clinic2);
    } catch (error) {
      console.error("Error finding clinic by mobile number:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/chats", async (req, res) => {
    try {
      const { userId } = req.query;
      const chats2 = await storage.getChats();
      console.log("chats", chats2);
      console.log("userId from query:", userId);
      if (userId && typeof userId === "string") {
        console.log(`Calculating unread counts for user: ${userId}`);
        const chatsWithUnreadCount = await Promise.all(
          chats2.map(async (chat) => {
            console.log(`Processing chat ${chat.title} (${chat.id}) with participants:`, chat.participants);
            const participants = chat.participants || [];
            const isParticipant = participants.some((participant) => {
              const exactMatch = participant.toLowerCase() === userId.toLowerCase();
              const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) || userId.toLowerCase().includes(participant.toLowerCase());
              return exactMatch || containsMatch;
            });
            console.log(`User ${userId} isParticipant in chat ${chat.title}: ${isParticipant}`);
            if (!isParticipant) {
              return null;
            }
            const unreadCount = await storage.getUnreadMessageCount(chat.id, userId);
            console.log(`Chat ${chat.title} (${chat.id}): ${unreadCount} unread messages for user ${userId}`);
            return {
              ...chat,
              unreadCount
            };
          })
        );
        const filteredChats = chatsWithUnreadCount.filter(Boolean);
        console.log("Final chats with unread counts:", filteredChats);
        res.json(filteredChats);
      } else {
        console.log("No userId provided, returning chats without unread counts");
        res.json(chats2);
      }
    } catch (error) {
      console.log("Error fetching chats", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });
  app2.get("/api/chats/:id", async (req, res) => {
    try {
      console.log("Fetching chat", req.params.id);
      const chat = await storage.getChat(req.params.id);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      console.log("Error fetching chat", error);
      res.status(500).json({ error: "Failed to fetch chat" });
    }
  });
  app2.get("/api/chats/type/:type", async (req, res) => {
    try {
      const chats2 = await storage.getChatsByType(req.params.type);
      res.json(chats2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats by type" });
    }
  });
  app2.post("/api/chats", async (req, res) => {
    try {
      if (!req.body.clinicId) {
        return res.status(400).json({ error: "clinicId is required" });
      }
      const chatData = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(chatData);
      res.status(201).json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Invalid chat data" });
    }
  });
  app2.get("/api/chats/:id/messages", async (req, res) => {
    try {
      const messages2 = await storage.getMessagesByChat(req.params.id);
      res.status(200).json(messages2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/chats/:id/messages", async (req, res) => {
    try {
      console.log("req.body", req.body);
      const messageData = insertMessageSchema.parse({
        ...req.body,
        chatId: req.params.id
        // use as string
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  });
  app2.post("/api/chats/:id/mark-read", async (req, res) => {
    try {
      const { userId } = req.body;
      const chatId = req.params.id;
      await storage.markAllMessagesAsRead(chatId, userId);
      const io2 = req.app.get("io") || req.app.io;
      const userSocketMap2 = req.app.get("userSocketMap") || req.app.userSocketMap;
      if (io2 && userSocketMap2 && userId) {
        const socketId = userSocketMap2.get(userId);
        if (socketId) {
          const unreadCount = await storage.getUnreadMessageCount(chatId, userId);
          io2.to(socketId).emit("unread-count-update", { chatId, unreadCount });
        }
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });
  app2.delete("/api/chats/:id", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await storage.getChat(chatId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      await storage.deleteChat(chatId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chat" });
    }
  });
  app2.patch("/api/chats/:id/archive", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await storage.updateChat(chatId, { isActive: false });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to archive chat" });
    }
  });
  app2.patch("/api/chats/:id/participants", async (req, res) => {
    try {
      const chatId = req.params.id;
      const { participants } = req.body;
      if (!Array.isArray(participants)) {
        return res.status(400).json({ error: "Participants must be an array" });
      }
      const currentChat = await storage.getChat(chatId);
      const currentParticipants = currentChat?.participants || [];
      const newParticipants = participants.filter((p) => !currentParticipants.includes(p));
      const removedParticipants = currentParticipants.filter((p) => !participants.includes(p));
      const chat = await storage.updateChat(chatId, { participants });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      const io2 = req.app.io;
      if (io2) {
        io2.emit("participants-updated", {
          chatId,
          participants,
          newParticipants,
          removedParticipants,
          updatedBy: req.body.updatedBy || "Unknown"
        });
        console.log(`Participants updated for chat ${chatId}, broadcasting to all users`);
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participants" });
    }
  });
  app2.post("/api/orders/create", async (req, res) => {
    try {
      const orderData = req.body;
      if (!orderData.patient || !orderData.doctor) {
        return res.status(400).json({ error: "Patient and doctor information are required" });
      }
      const patient = await storage.createPatient({
        firstName: orderData.patient.firstName,
        lastName: orderData.patient.lastName,
        age: orderData.patient.age,
        sex: orderData.patient.sex
      });
      const order = await storage.createOrder({
        orderId: orderData.orderId || `ADL-${Date.now()}`,
        patientId: patient.id,
        category: orderData.category,
        type: orderData.restorationType || orderData.orderType,
        notes: orderData.notes,
        status: orderData.status || "pending"
      });
      if (orderData.toothGroups && orderData.toothGroups.length > 0) {
        for (const group of orderData.toothGroups) {
          await storage.createToothGroup({
            orderId: order.id,
            groupId: group.groupId,
            teeth: Array.isArray(group.teeth) ? group.teeth : [],
            type: group.type,
            material: group.material,
            shade: group.shade,
            notes: group.notes
          });
        }
      }
      if (orderData.scanBooking) {
        await storage.createScanBooking({
          orderId: order.id,
          areaManagerId: orderData.scanBooking.areaManagerId,
          scanDate: orderData.scanBooking.scanDate,
          scanTime: orderData.scanBooking.scanTime,
          notes: orderData.scanBooking.notes
        });
      }
      res.status(201).json({ order, patient });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });
  app2.post("/api/login", async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      if (!mobileNumber || !password) {
        return res.status(400).json({ error: "Mobile number and password are required" });
      }
      const teamMember = await storage.getTeamMemberByMobileNumber(mobileNumber);
      if (teamMember) {
        if (teamMember.password === password) {
          let roleName = "";
          if (teamMember.roleId) {
            const role2 = await storage.getRoleById(teamMember.roleId);
            roleName = role2?.name || "";
          }
          let clinicId = "";
          if (teamMember.clinicName) {
            const clinic3 = await storage.getClinicByName(teamMember.clinicName);
            clinicId = clinic3?.id || "";
          }
          return res.json({
            ...teamMember,
            userType: "teamMember",
            roleName,
            clinicId
          });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
      const clinic2 = await storage.getClinicByMobileNumber(mobileNumber);
      if (clinic2) {
        if (clinic2.password === password) {
          let roleName = "";
          if (clinic2.roleId) {
            const role2 = await storage.getRoleById(clinic2.roleId);
            roleName = role2?.name || "";
          }
          return res.json({
            ...clinic2,
            userType: "clinic",
            roleName,
            clinicId: clinic2.id
          });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
      return res.status(401).json({ error: "User not found" });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      const newUser = await storage.createUser({
        mobileNumber,
        password
        // Note: Password should be hashed
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });
  app2.post("/api/clinic/register", async (req, res) => {
    try {
      const clinicData = insertClinicSchema.parse(req.body);
      const existingClinic = await storage.getClinicByEmail(clinicData.email);
      if (existingClinic) {
        return res.status(400).json({ error: "Clinic with this email already exists" });
      }
      const defaultPermissions = [
        "scan_booking",
        "tracking",
        "pickup_requests",
        "chat",
        "all_patients",
        "billing"
      ];
      const clinicRoleId = "2411f233-1e48-43ae-9af9-6d5ce0569278";
      const newClinic = await storage.createClinic({
        ...clinicData,
        roleId: clinicRoleId,
        permissions: defaultPermissions
      });
      let roleName = "";
      try {
        const role2 = await storage.getRoleById(clinicRoleId);
        roleName = role2?.name || "";
      } catch (error) {
        console.log("Failed to fetch role name for clinic:", error);
      }
      res.status(201).json({
        message: "Clinic registered successfully",
        clinic: {
          id: newClinic.id,
          firstname: newClinic.firstname,
          lastname: newClinic.lastname,
          email: newClinic.email,
          clinicName: newClinic.clinicName,
          permissions: newClinic.permissions,
          roleId: newClinic.roleId,
          roleName
        }
      });
    } catch (error) {
      console.error("Clinic registration error:", error);
      res.status(400).json({
        error: "Invalid clinic data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/clinic/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const clinic2 = await storage.getClinicByEmail(email);
      if (!clinic2) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (clinic2.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({
        id: clinic2.id,
        firstname: clinic2.firstname,
        lastname: clinic2.lastname,
        email: clinic2.email,
        phone: clinic2.phone,
        clinicName: clinic2.clinicName,
        roleId: clinic2.roleId,
        permissions: clinic2.permissions
      });
    } catch (error) {
      console.error("Clinic login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logout successful" });
    });
  });
  app2.get("/api/me", async (req, res) => {
    try {
      const mobileNumber = req.headers["x-mobile-number"];
      if (!mobileNumber || typeof mobileNumber !== "string") {
        return res.status(401).json({ error: "Not authenticated" });
      }
      let teamMember = await storage.getTeamMemberByMobileNumber(mobileNumber);
      let clinic2 = null;
      let userType = "teamMember";
      if (!teamMember) {
        clinic2 = await storage.getClinicByMobileNumber(mobileNumber);
        userType = "clinic";
      }
      if (!teamMember && !clinic2) {
        return res.status(404).json({ error: "User not found" });
      }
      let roleName = "";
      const roleId = teamMember?.roleId || clinic2?.roleId;
      if (roleId) {
        try {
          const role2 = await storage.getRoleById(roleId);
          roleName = role2?.name || "";
        } catch (error) {
          console.log("Failed to fetch role name:", error);
        }
      }
      const essentialUserData = {
        id: userType === "clinic" ? clinic2.id : teamMember.id,
        fullName: userType === "clinic" ? `${clinic2.firstname} ${clinic2.lastname}` : teamMember.fullName,
        permissions: (userType === "clinic" ? clinic2.permissions : teamMember.permissions) || [],
        contactNumber: userType === "clinic" ? clinic2.phone : teamMember.contactNumber,
        roleId: roleId || "",
        clinicName: (userType === "clinic" ? clinic2.clinicName : teamMember.clinicName) || "",
        roleName,
        userType,
        clinicId: userType === "clinic" ? clinic2.id : ""
      };
      res.json(essentialUserData);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });
  app2.get("/api/roles/:roleId", async (req, res) => {
    try {
      const { roleId } = req.params;
      const role2 = await storage.getRoleById(roleId);
      if (!role2) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json({ id: role2.id, name: role2.name });
    } catch (error) {
      console.error("Error fetching role by id:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/roles/name/:roleName", async (req, res) => {
    try {
      const { roleName } = req.params;
      const role2 = await storage.getRoleByName(roleName);
      if (!role2) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json({ id: role2.id, name: role2.name });
    } catch (error) {
      console.error("Error fetching role by name:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/clinics/:id", async (req, res) => {
    console.log("clinic name by id", req.params.id);
    try {
      console.log("clinic name by id", req.params.id);
      const { id } = req.params;
      const clinic2 = await storage.getClinic(id);
      if (!clinic2) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json({ id: clinic2.id, clinicName: clinic2.clinicName });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/clinics/name/:clinicName", async (req, res) => {
    try {
      const { clinicName } = req.params;
      const clinics = await storage.getClinics();
      const clinic2 = clinics.find((c) => c.clinicName === clinicName);
      if (!clinic2) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json({ id: clinic2.id, clinicName: clinic2.clinicName });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/lifecycle-stages", async (req, res) => {
    try {
      const stages = await storage.getLifecycleStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lifecycle stages" });
    }
  });
  app2.get("/api/orders/:orderId/chat", async (req, res) => {
    try {
      const chat = await storage.getChatByOrderId(req.params.orderId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found for this order" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat for order" });
    }
  });
  app2.get("/api/userData/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("getUserData API called with ID:", id);
      let clinic2 = await storage.getClinic(id);
      console.log("Clinic lookup result:", clinic2 ? "Found" : "Not found");
      if (clinic2) {
        console.log("Processing clinic data for:", clinic2.firstname, clinic2.lastname);
        let roleName = "";
        if (clinic2.roleId) {
          try {
            const role2 = await storage.getRoleById(clinic2.roleId);
            roleName = role2?.name || "";
            console.log("Role name for clinic:", roleName);
          } catch (error) {
            console.log("Failed to fetch role name:", error);
          }
        }
        let clinicAddress = {};
        let billingInfo = {};
        try {
          if (clinic2.clinicAddress) {
            clinicAddress = JSON.parse(clinic2.clinicAddress);
          }
        } catch (e) {
          clinicAddress = { address: clinic2.clinicAddress || "" };
        }
        try {
          if (clinic2.billingInfo) {
            billingInfo = JSON.parse(clinic2.billingInfo);
          }
        } catch (e) {
          billingInfo = {};
        }
        console.log("Clinic", clinic2);
        const userData = {
          id: clinic2.id,
          firstName: clinic2.firstname,
          lastName: clinic2.lastname,
          email: clinic2.email,
          phone: clinic2.phone,
          clinicName: clinic2.clinicName,
          licenseNumber: clinic2.clinicLicenseNumber,
          clinicAddressLine1: clinic2.clinicAddressLine1 || "",
          clinicAddressLine2: clinic2.clinicAddressLine2 || "",
          clinicCity: clinic2.clinicCity || "",
          clinicState: clinic2.clinicState || "",
          clinicPincode: clinic2.clinicPincode || "",
          clinicCountry: clinic2.clinicCountry || "",
          billingAddressLine1: clinic2.billingAddressLine1 || "",
          billingAddressLine2: clinic2.billingAddressLine2 || "",
          billingCity: clinic2.billingCity || "",
          billingState: clinic2.billingState || "",
          billingPincode: clinic2.billingPincode || "",
          billingCountry: clinic2.billingCountry || "",
          gstNumber: clinic2.gstNumber || "",
          panNumber: clinic2.panNumber || "",
          roleName,
          userType: "clinic",
          permissions: clinic2.permissions || []
        };
        console.log("Returning clinic user data");
        return res.json(userData);
      }
      let teamMember = await storage.getTeamMember(id);
      console.log("Team member lookup result:", teamMember ? "Found" : "Not found");
      if (teamMember) {
        console.log("Processing team member data for:", teamMember.fullName);
        let roleName = "";
        if (teamMember.roleId) {
          try {
            const role2 = await storage.getRoleById(teamMember.roleId);
            roleName = role2?.name || "";
            console.log("Role name for team member:", roleName);
          } catch (error) {
            console.log("Failed to fetch role name:", error);
          }
        }
        const userData = {
          id: teamMember.id,
          firstName: teamMember.fullName.split(" ")[0] || "",
          lastName: teamMember.fullName.split(" ").slice(1).join(" ") || "",
          email: teamMember.email,
          phone: teamMember.contactNumber,
          clinicName: teamMember.clinicName,
          licenseNumber: "",
          clinicAddressLine1: "",
          clinicAddressLine2: "",
          clinicCity: "",
          clinicState: "",
          clinicPincode: "",
          clinicCountry: "India",
          billingAddressLine1: "",
          billingAddressLine2: "",
          billingCity: "",
          billingState: "",
          billingPincode: "",
          billingCountry: "India",
          gstNumber: "",
          panNumber: "",
          roleName,
          userType: "teamMember",
          permissions: teamMember.permissions || []
        };
        console.log("Returning team member user data");
        return res.json(userData);
      }
      console.log("User not found in either clinic or team member tables");
      return res.status(404).json({ error: "User not found" });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });
  app2.put("/api/clinic/:id", async (req, res) => {
    try {
      console.log("clinic update endpoint", req.params.id);
      console.log("clinic update body", req.body);
      const updates = mapClinicFields(req.body);
      console.log("updates==>", updates);
      const clinic2 = await storage.updateClinic(req.params.id, updates);
      if (!clinic2) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json(clinic2);
    } catch (error) {
      console.log("clinic update error", error);
      res.status(400).json({ error: "Invalid clinic update data", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  const httpServer2 = createServer(app2);
  return httpServer2;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import svgr from "vite-plugin-svgr";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    svgr(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import { eq as eq2 } from "drizzle-orm";
import { createServer as createServer2 } from "http";
import { Server } from "socket.io";
import dotenv2 from "dotenv";
dotenv2.config();
var app = express2();
var httpServer = createServer2(app);
var io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://192.168.29.46:5000"],
    methods: ["GET", "POST"]
  }
});
var userSocketMap = /* @__PURE__ */ new Map();
var activeChatUsers = /* @__PURE__ */ new Map();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.userSocketMap = userSocketMap;
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyObj, ...args) {
    capturedJsonResponse = bodyObj;
    return originalResJson.apply(res, [bodyObj, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 80)}`;
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    console.log("Checking database initialization...");
    await storage.initializeData();
    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
  const server = await registerRoutes(app);
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("register-user", (userId) => {
      if (userId) {
        userSocketMap.set(userId, socket.id);
        socket.userId = userId;
        console.log(`Current userSocketMap entries:`, Array.from(userSocketMap.entries()));
      }
    });
    socket.on("join-chat", (chatId) => {
      socket.join(`chat-${chatId}`);
      const userId = socket.userId;
      if (userId) {
        if (!activeChatUsers.has(chatId)) {
          activeChatUsers.set(chatId, /* @__PURE__ */ new Set());
        }
        activeChatUsers.get(chatId).add(userId);
        console.log(`User ${userId} is now active in chat ${chatId}`);
      }
    });
    socket.on("leave-chat", (chatId) => {
      socket.leave(`chat-${chatId}`);
      const userId = socket.userId;
      if (userId && activeChatUsers.has(chatId)) {
        activeChatUsers.get(chatId).delete(userId);
        console.log(`User ${userId} is no longer active in chat ${chatId}`);
      }
    });
    socket.on("send-message", async (data) => {
      try {
        console.log("New message received:", data);
        const savedMessage = await storage.createMessage({
          ...data.message,
          chatId: data.chatId
        });
        console.log("savedMessage", savedMessage);
        await db.update(chats).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq2(chats.id, data.chatId));
        console.log("updatedChat");
        io.to(`chat-${data.chatId}`).emit("new-message", {
          chatId: data.chatId,
          message: savedMessage
        });
        const activeUsersInThisChat = activeChatUsers.get(data.chatId) || /* @__PURE__ */ new Set();
        const teamMembers2 = await storage.getTeamMembers();
        const clinics = await storage.getClinics();
        const allUsers = [
          ...teamMembers2.map((member) => ({
            id: member.fullName,
            type: "team_member",
            permissions: member.permissions || []
          })),
          ...clinics.map((clinic2) => ({
            id: `${clinic2.firstname} ${clinic2.lastname}`,
            type: "clinic",
            permissions: clinic2.permissions || []
          }))
        ];
        allUsers.forEach(async (user) => {
          const userId = user.id;
          if (userId && userId !== savedMessage.sender && !activeUsersInThisChat.has(userId)) {
            const socketId = userSocketMap.get(userId);
            if (socketId) {
              const unreadCount = await storage.getUnreadMessageCount(data.chatId, userId);
              io.to(socketId).emit("unread-count-update", { chatId: data.chatId, unreadCount });
              console.log(`Sent unread count update to ${userId}: ${unreadCount} unread messages in chat ${data.chatId}`);
            }
          }
        });
        console.log(`Message broadcasted to chat ${data.chatId}`);
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("message-error", { error: "Failed to send message" });
      }
    });
    socket.on("typing", (data) => {
      socket.to(`chat-${data.chatId}`).emit("user-typing", {
        chatId: data.chatId,
        user: data.user,
        isTyping: data.isTyping
      });
    });
    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (userId) {
        userSocketMap.delete(userId);
        activeChatUsers.forEach((users2) => users2.delete(userId));
        console.log(`User ${userId} disconnected and unregistered.`);
      }
      console.log("User disconnected:", socket.id);
    });
  });
  app.io = io;
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    log(`Server is running on http://localhost:${port}`);
    log(`Socket.IO server is ready for real-time chat`);
  });
})();
