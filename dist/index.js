var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// server/database/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertClinicSchema: () => insertClinicSchema,
  products: () => products
});
import { pgTable, text, uuid, customType } from "drizzle-orm/pg-core";
import { z } from "zod";
var bytea = customType({
  dataType() {
    return "bytea";
  }
});
var products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  description: text("description")
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

// server/database/db.ts
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

// server/src/clinic/clinicSchema.ts
import { pgTable as pgTable2, text as text2, timestamp as timestamp2, jsonb as jsonb2, uuid as uuid2 } from "drizzle-orm/pg-core";
import { z as z2 } from "zod";
var clinic = pgTable2("clinic", {
  id: uuid2("id").primaryKey().defaultRandom(),
  firstname: text2("firstname").notNull(),
  lastname: text2("lastname").notNull(),
  email: text2("email").notNull().unique(),
  phone: text2("phone"),
  clinicName: text2("clinic_name"),
  clinicLicenseNumber: text2("clinic_license_number"),
  clinicAddressLine1: text2("clinic_address_line1"),
  clinicAddressLine2: text2("clinic_address_line2"),
  clinicCity: text2("clinic_city"),
  clinicState: text2("clinic_state"),
  clinicPincode: text2("clinic_pincode"),
  clinicCountry: text2("clinic_country"),
  gstNumber: text2("gst_number"),
  panNumber: text2("pan_number"),
  billingAddressLine1: text2("billing_address_line1"),
  billingAddressLine2: text2("billing_address_line2"),
  billingCity: text2("billing_city"),
  billingState: text2("billing_state"),
  billingPincode: text2("billing_pincode"),
  billingCountry: text2("billing_country"),
  password: text2("password").notNull(),
  roleId: uuid2("role_id").notNull(),
  permissions: jsonb2("permissions").$type().default([]),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var insertClinicSchema2 = z2.object({
  firstname: z2.string(),
  lastname: z2.string(),
  email: z2.string().email(),
  phone: z2.string(),
  clinicName: z2.string(),
  clinicLicenseNumber: z2.string(),
  gstNumber: z2.string(),
  panNumber: z2.string(),
  password: z2.string(),
  roleId: z2.string(),
  permissions: z2.array(z2.string()),
  clinicAddressLine1: z2.string().optional(),
  clinicAddressLine2: z2.string().optional(),
  clinicCity: z2.string().optional(),
  clinicState: z2.string().optional(),
  clinicPincode: z2.string().optional(),
  clinicCountry: z2.string().optional(),
  billingAddressLine1: z2.string().optional(),
  billingAddressLine2: z2.string().optional(),
  billingCity: z2.string().optional(),
  billingState: z2.string().optional(),
  billingPincode: z2.string().optional(),
  billingCountry: z2.string().optional()
});

// server/src/clinic/clinicController.ts
import { eq } from "drizzle-orm";
var ClinicStorage = class {
  async getClinic(id) {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.id, id));
    return clinicData;
  }
  async getClinicById(id) {
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
};
var clinicStorage = new ClinicStorage();

// server/src/role/roleController.ts
import { eq as eq2 } from "drizzle-orm";

// server/src/role/roleSchema.ts
import { pgTable as pgTable3, text as text3, uuid as uuid3 } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var role = pgTable3("role", {
  id: uuid3("id").primaryKey().defaultRandom(),
  name: text3("name").notNull().unique()
});
var insertRoleSchema = createInsertSchema(role).omit({
  id: true
});

// server/src/role/roleController.ts
var RoleStorage = class {
  async getRoleById(roleId) {
    const [roleData] = await db.select().from(role).where(eq2(role.id, roleId));
    return roleData;
  }
  async getRoleByName(roleName) {
    const [roleData] = await db.select().from(role).where(eq2(role.name, roleName));
    return roleData;
  }
};
var RolesStorage = new RoleStorage();

// server/src/teamMember/teamMemberController.ts
import { eq as eq3 } from "drizzle-orm";

// server/src/teamMember/teamMemberschema.ts
import { pgTable as pgTable4, text as text4, timestamp as timestamp4, jsonb as jsonb4, uuid as uuid4 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema2 } from "drizzle-zod";
var teamMembers = pgTable4("team_members", {
  id: uuid4("id").primaryKey().defaultRandom(),
  fullName: text4("full_name").notNull(),
  email: text4("email").notNull(),
  contactNumber: text4("contact_number"),
  profilePicture: text4("profile_picture"),
  roleId: uuid4("role_id").notNull(),
  permissions: jsonb4("permissions").$type().default([]),
  status: text4("status").default("active"),
  password: text4("password"),
  joinDate: timestamp4("join_date").defaultNow(),
  lastLogin: timestamp4("last_login"),
  createdAt: timestamp4("created_at").defaultNow(),
  updatedAt: timestamp4("updated_at").defaultNow(),
  clinicName: text4("clinic_name")
});
var insertTeamMemberSchema = createInsertSchema2(teamMembers).omit({
  id: true,
  joinDate: true,
  lastLogin: true
});

// server/src/teamMember/teamMemberController.ts
var TeamMemberStorage = class {
  async getTeamMember(id) {
    const [user] = await db.select().from(teamMembers).where(eq3(teamMembers.id, id));
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
    const members = await db.select().from(teamMembers).where(eq3(teamMembers.clinicName, clinicName));
    return members;
  }
  async updateTeamMember(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [teamMember] = await db.update(teamMembers).set(updateData).where(eq3(teamMembers.id, id)).returning();
    return teamMember;
  }
  async deleteTeamMember(id) {
    await db.delete(teamMembers).where(eq3(teamMembers.id, id));
  }
  async getTeamMemberByMobileNumber(mobileNumber) {
    const [teamMember] = await db.select().from(teamMembers).where(eq3(teamMembers.contactNumber, mobileNumber));
    return teamMember;
  }
  async getTeamMemberById(id) {
    const [member] = await db.select().from(teamMembers).where(eq3(teamMembers.id, id));
    return member;
  }
};
var teamMemberStorage = new TeamMemberStorage();

// server/src/authentication/authenticationRoute.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
var setupAuthenticationRoutes = (app2) => {
  const JWT_SECRET6 = process.env.JWT_SECRET || "your_jwt_secret_key";
  app2.post("/api/register", async (req, res) => {
    try {
      const clinicData = insertClinicSchema2.parse(req.body);
      const existingClinic = await clinicStorage.getClinicByEmail(
        clinicData.email
      );
      if (existingClinic) {
        return res.status(400).json({ error: "Clinic with this email already exists" });
      }
      const existingClinicByMobile = await clinicStorage.getClinicByMobileNumber(clinicData.phone);
      if (existingClinicByMobile) {
        return res.status(400).json({ error: "Mobile number is already in use by a clinic" });
      }
      const existingTeamMemberByMobile = await teamMemberStorage.getTeamMemberByMobileNumber(clinicData.phone);
      if (existingTeamMemberByMobile) {
        return res.status(400).json({ error: "Mobile number is already in use by a team member" });
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
      const hashedPassword = await bcrypt.hash(clinicData.password, 10);
      const newClinic = await clinicStorage.createClinic({
        ...clinicData,
        password: hashedPassword,
        roleId: clinicRoleId,
        permissions: defaultPermissions
      });
      return res.status(201).json({
        token: jwt.sign({ id: newClinic.id }, JWT_SECRET6, { expiresIn: "7d" })
      });
    } catch (error) {
      console.error("Clinic registration error:", error);
      res.status(400).json({
        error: "Invalid clinic data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/login", async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      if (!mobileNumber || !password) {
        return res.status(400).json({ error: "Mobile number and password are required" });
      }
      const teamMember = await teamMemberStorage.getTeamMemberByMobileNumber(
        mobileNumber
      );
      if (teamMember) {
        const isPasswordValid = await bcrypt.compare(password, teamMember.password || "");
        if (isPasswordValid) {
          return res.json({
            token: jwt.sign({ id: teamMember.id }, JWT_SECRET6, { expiresIn: "7d" })
          });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
      const clinic2 = await clinicStorage.getClinicByMobileNumber(mobileNumber);
      if (clinic2) {
        console.log(clinic2.password);
        const isPasswordValid = await bcrypt.compare(password, clinic2.password || "");
        console.log(isPasswordValid);
        if (isPasswordValid) {
          return res.json({
            token: jwt.sign({ id: clinic2.id }, JWT_SECRET6, { expiresIn: "7d" })
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
  app2.get("/api/userData/:id", async (req, res) => {
    try {
      const id = req.params.id;
      let roleName;
      let clinicId = "";
      const clinicData = await clinicStorage.getClinicById(id);
      let teamMemberData;
      if (!clinicData) {
        teamMemberData = await teamMemberStorage.getTeamMemberById(id);
        console.log("hello ytjosdfvkdfksdjfksdj", teamMemberData);
        if (!teamMemberData) {
          return res.status(401).json({ error: "User Not Found" });
        }
        if (teamMemberData.roleId) {
          const role2 = await RolesStorage.getRoleById(teamMemberData.roleId);
          roleName = role2?.name || "";
        }
        if (!roleName) {
          return res.status(401).json({ error: "Role Not Found" });
        }
        if (teamMemberData.clinicName) {
          const clinic2 = await clinicStorage.getClinicByName(
            teamMemberData.clinicName
          );
          clinicId = clinic2?.id || "";
        }
        if (!clinicId) {
          return res.status(401).json({ error: "Clinic Not Found" });
        }
        const teamMembersData = {
          ...teamMemberData,
          roleName,
          clinicId
        };
        return res.json(teamMembersData);
      }
      if (clinicData.roleId) {
        clinicId = clinicData.id;
        const role2 = await RolesStorage.getRoleById(clinicData.roleId);
        roleName = role2?.name || "";
      }
      const fullName = `${clinicData?.firstname} ${clinicData?.lastname}`;
      const ClinicsData = {
        ...clinicData,
        roleName,
        clinicId,
        fullName
      };
      return res.json(ClinicsData);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });
  app2.patch("/api/userUpdate/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let updatedUser;
      const clinic2 = await clinicStorage.getClinicById(id);
      if (clinic2) {
        let updates = { ...req.body };
        if (updates.password) {
          updates.password = await bcrypt.hash(updates.password, 10);
        }
        updatedUser = await clinicStorage.updateClinic(id, updates);
        if (!updatedUser) {
          return res.status(404).json({ error: "Clinic not found" });
        }
        return res.json({ userType: "clinic", updatedUser });
      }
      const teamMember = await teamMemberStorage.getTeamMember(id);
      if (teamMember) {
        let updates = { ...req.body };
        if (updates.password) {
          updates.password = await bcrypt.hash(updates.password, 10);
        }
        updatedUser = await teamMemberStorage.updateTeamMember(id, updates);
        if (!updatedUser) {
          return res.status(404).json({ error: "Team member not found" });
        }
        return res.json({ userType: "teamMember", updatedUser });
      }
      return res.status(404).json({ error: "User not found" });
    } catch (error) {
      console.error("User update error:", error);
      res.status(500).json({ error: "Invalid user update data", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.patch("/api/forgotPassword/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({ error: "New password is required" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const clinic2 = await clinicStorage.getClinicById(id);
      if (clinic2) {
        await clinicStorage.updateClinic(id, { password: hashedPassword });
        return res.json({ message: "Password updated successfully for clinic" });
      }
      const teamMember = await teamMemberStorage.getTeamMember(id);
      if (teamMember) {
        await teamMemberStorage.updateTeamMember(id, { password: hashedPassword });
        return res.json({ message: "Password updated successfully for team member" });
      }
      return res.status(404).json({ error: "User not found" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to reset password", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });
};

// server/src/chat/chatController.ts
import { eq as eq4 } from "drizzle-orm";

// server/src/chat/chatSchema.ts
import { createInsertSchema as createInsertSchema5 } from "drizzle-zod";

// server/src/order/orderSchema.ts
import {
  jsonb as jsonb5,
  pgTable as pgTable5,
  text as text5,
  timestamp as timestamp5,
  uuid as uuid5
} from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema3 } from "drizzle-zod";
var orderSchema = pgTable5("orders", {
  id: uuid5("id").primaryKey().defaultRandom(),
  patientId: text5("patient_id"),
  clinicId: text5("clinic_id"),
  qaId: text5("qa_id"),
  clinicInformationId: text5("clinic_information_id"),
  orderMethod: text5("order_method"),
  prescriptionTypesId: text5("prescription_types_id").array(),
  subPrescriptionTypesId: text5("sub_prescription_types_id").array(),
  selectedTeethId: text5("selected_teeth_id"),
  files: jsonb5("files"),
  accessorios: jsonb5("accessorios"),
  handllingType: text5("handlling_type"),
  pickupData: jsonb5("pickup_data"),
  courierData: jsonb5("courier_data"),
  resonOfReject: text5("reson_of_reject"),
  resonOfRescan: text5("reson_of_rescan"),
  rejectNote: text5("reject_note"),
  orderId: text5("order_id"),
  crateNo: text5("crate_no"),
  notes: text5("notes"),
  additionalNote: text5("additional_note"),
  extraAdditionalNote: text5("extra_additional_note"),
  orderByRole: text5("order_by_role"),
  orderById: text5("order_by_id"),
  acpectedDileveryData: timestamp5("acpected_dilevery_data"),
  lifeCycle: jsonb5("life_cycle"),
  orderStatus: text5("order_status"),
  refId: text5("ref_id"),
  orderDate: timestamp5("order_date"),
  updateDate: timestamp5("update_date"),
  totalAmount: text5("total_amount"),
  paymentType: text5("payment_type"),
  paymentStatus: text5("payment_status"),
  percentage: text5("percentage"),
  doctorNote: text5("doctor_note"),
  orderType: text5("order_type"),
  createdAt: timestamp5("created_at").defaultNow(),
  updatedAt: timestamp5("updated_at").defaultNow()
});
var insertOrderSchema = createInsertSchema3(orderSchema).omit({
  id: true,
  createdAt: true
}).partial();

// server/src/chat/chatSchema.ts
import { pgTable as pgTable7, text as text7, boolean as boolean7, timestamp as timestamp7, jsonb as jsonb7, uuid as uuid7 } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// server/src/message/messageSchema.ts
import { createInsertSchema as createInsertSchema4 } from "drizzle-zod";
import { pgTable as pgTable6, text as text6, timestamp as timestamp6, jsonb as jsonb6, uuid as uuid6 } from "drizzle-orm/pg-core";
var messages = pgTable6("messages", {
  id: uuid6("id").primaryKey().defaultRandom(),
  chatId: uuid6("chat_id"),
  orderId: uuid6("order_id").references(() => orderSchema.id),
  sender: text6("sender").notNull(),
  senderRole: text6("sender_role").notNull(),
  senderType: text6("sender_type").notNull(),
  // 'clinic', 'lab'
  content: text6("content").notNull(),
  messageType: text6("message_type").default("text"),
  attachments: jsonb6("attachments").$type().default([]),
  readBy: jsonb6("read_by").$type().default([]),
  createdAt: timestamp6("created_at").defaultNow(),
  sender_id: uuid6("sender_id")
});
var insertMessageSchema = createInsertSchema4(messages).omit({
  id: true,
  createdAt: true
});

// server/src/chat/chatSchema.ts
var chats = pgTable7("chats", {
  id: uuid7("id").primaryKey().defaultRandom(),
  orderId: uuid7("order_id"),
  type: text7("type").notNull(),
  title: text7("title"),
  participants: jsonb7("participants").$type().default([]),
  createdBy: text7("created_by"),
  createdAt: timestamp7("created_at").defaultNow(),
  updatedAt: timestamp7("updated_at").defaultNow(),
  clinicId: uuid7("clinic_id").notNull(),
  isActive: boolean7("is_active").notNull().default(true)
});
var chatsRelations = relations(chats, ({ one, many }) => ({
  order: one(orderSchema, {
    fields: [chats.orderId],
    references: [orderSchema.id]
  }),
  messages: many(messages)
}));
var messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  }),
  order: one(orderSchema, {
    fields: [messages.orderId],
    references: [orderSchema.id]
  })
}));
var insertChatSchema = createInsertSchema5(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/src/chat/chatController.ts
var ChatStorage = class {
  async getChat(id) {
    console.log("Getting chat", id);
    const [chat] = await db.select().from(chats).where(eq4(chats.id, id));
    console.log("Chat", chat);
    return chat;
  }
  async createChat(data) {
    const chatData = {
      ...data,
      participants: Array.isArray(data.participants) ? data.participants.map((p) => typeof p === "object" ? p.fullName : p) : []
    };
    const [chat] = await db.insert(chats).values(chatData).returning();
    return chat;
  }
  async getChats(userId) {
    const chatList = await db.select().from(chats);
    console.log("chatList", chatList);
    if (!userId) {
      return chatList.map((chat) => ({ ...chat, unreadCount: 0 }));
    }
    const chatsWithUnreadCounts = await Promise.all(
      chatList.map(async (chat) => {
        const participants = chat.participants || [];
        const isParticipant = participants.some((participant) => {
          const exactMatch = participant.toLowerCase() === userId.toLowerCase();
          const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) || userId.toLowerCase().includes(participant.toLowerCase());
          return exactMatch || containsMatch;
        });
        if (!isParticipant) {
          return { ...chat, unreadCount: 0 };
        }
        const unreadCount = await this.getUnreadMessageCount(chat.id, userId);
        return {
          ...chat,
          unreadCount
        };
      })
    );
    return chatsWithUnreadCounts;
  }
  async getChatsByType(type) {
    return await db.select().from(chats).where(eq4(chats.type, type));
  }
  async getChatsByClinic(clinicId) {
    return await db.select().from(chats).where(eq4(chats.clinicId, clinicId));
  }
  async updateChat(id, updates) {
    const updateData = { ...updates };
    if (updates.participants && Array.isArray(updates.participants)) {
      updateData.participants = updates.participants.map((p) => typeof p === "object" ? p.fullName : p);
    }
    const [chat] = await db.update(chats).set(updateData).where(eq4(chats.id, id)).returning();
    return chat;
  }
  async getChatByOrderId(orderId) {
    const [chat] = await db.select().from(chats).where(eq4(chats.orderId, orderId));
    return chat;
  }
  async deleteMessagesByChat(chatId) {
    await db.delete(messages).where(eq4(messages.chatId, chatId));
  }
  // Hard delete a chat and its messages
  async deleteChat(chatId) {
    await this.deleteMessagesByChat(chatId);
    await db.delete(chats).where(eq4(chats.id, chatId));
  }
  // Get unread message count for a user in a chat
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
    const isParticipant = participants.includes(userId);
    if (!isParticipant) {
      console.log(`User ${userId} is not a participant in chat ${chatId}, returning 0`);
      return 0;
    }
    const messageList = await db.select().from(messages).where(eq4(messages.chatId, chatId));
    const unreadCount = messageList.filter((message) => {
      const readBy = message.readBy || [];
      const isUnread = !readBy.includes(userId);
      console.log(`Message ${message.id}: readBy=${JSON.stringify(readBy)}, isUnread=${isUnread} for user ${userId}`);
      return isUnread;
    }).length;
    console.log(`Total unread count for user ${userId} in chat ${chatId}: ${unreadCount}`);
    return unreadCount;
  }
};
var chatStorage = new ChatStorage();

// server/src/order/orderController.ts
import { eq as eq9, and as and3, sql as sql3 } from "drizzle-orm";

// server/src/patient/patientSchema.ts
import {
  integer as integer8,
  pgTable as pgTable8,
  text as text8,
  uuid as uuid8
} from "drizzle-orm/pg-core";
var patients = pgTable8("patient", {
  id: uuid8("id").primaryKey().defaultRandom(),
  firstName: text8("first_name").notNull(),
  lastName: text8("last_name").notNull(),
  age: integer8("age").notNull(),
  sex: text8("sex").notNull()
});

// server/src/patient/patientController.ts
import { eq as eq5 } from "drizzle-orm";
var PatientStorage = class {
  async getPatient(id) {
    const [patient] = await db.select().from(patients).where(eq5(patients.id, id));
    return patient;
  }
  async createPatient(insertPatient) {
    const patientData = {
      ...insertPatient
    };
    const [patient] = await db.insert(patients).values(patientData).returning();
    return patient;
  }
  async getPatients() {
    return await db.select().from(patients);
  }
  async deletePatient(id) {
    await db.delete(patients).where(eq5(patients.id, id));
  }
  async updatePatient(id, updates) {
    const [patient] = await db.update(patients).set(updates).where(eq5(patients.id, id)).returning();
    return patient;
  }
};
var patientStorage = new PatientStorage();

// server/src/clinicInformation/clinicInformationSchema.ts
import { pgTable as pgTable9, text as text9, uuid as uuid9 } from "drizzle-orm/pg-core";
var clinicInformation = pgTable9("clinic_information", {
  id: uuid9("id").primaryKey().defaultRandom(),
  clinicId: text9("clinic_id"),
  caseHandleBy: text9("case_handle_by").notNull(),
  doctorMobileNumber: text9("doctor_mobile_number").notNull(),
  consultingDoctorName: text9("consulting_doctor_name"),
  consultingDoctorMobileNumber: text9("consulting_doctor_mobile_number")
});

// server/src/clinicInformation/clinicInformationController.ts
import { eq as eq6 } from "drizzle-orm";
var ClinicInformationStorage = class {
  async createClinicInformation(data) {
    const [newClinicInformation] = await db.insert(clinicInformation).values(data).returning();
    return newClinicInformation;
  }
  async getClinicInformationById(id) {
    const [info] = await db.select().from(clinicInformation).where(eq6(clinicInformation.id, id));
    return info;
  }
  async getClinicInformations() {
    return await db.select().from(clinicInformation);
  }
  async updateClinicInformation(id, updates) {
    const [info] = await db.update(clinicInformation).set(updates).where(eq6(clinicInformation.id, id)).returning();
    return info;
  }
  async deleteClinicInformation(id) {
    await db.delete(clinicInformation).where(eq6(clinicInformation.id, id));
  }
};
var clinicInformationStorage = new ClinicInformationStorage();

// server/src/teethGroup/teethGroupSchema.ts
import { jsonb as jsonb8, pgTable as pgTable10, uuid as uuid10 } from "drizzle-orm/pg-core";
var teethGroups = pgTable10("teeth_group", {
  id: uuid10("id").primaryKey().defaultRandom(),
  teethGroup: jsonb8("teeth_group").notNull(),
  selectedTeeth: jsonb8("selected_teeth").notNull()
});

// server/src/teethGroup/teethGroupcontroller.ts
import { eq as eq7 } from "drizzle-orm";
var TeethGroupStorage = class {
  async createTeethGroup(data) {
    const [newTeethGroup] = await db.insert(teethGroups).values(data).returning();
    return newTeethGroup;
  }
  async getTeethGroupById(id) {
    const [teethGroup] = await db.select().from(teethGroups).where(eq7(teethGroups.id, id));
    return teethGroup;
  }
  async getTeethGroups() {
    return await db.select().from(teethGroups);
  }
  async updateTeethGroup(id, updates) {
    const [teethGroup] = await db.update(teethGroups).set(updates).where(eq7(teethGroups.id, id)).returning();
    return teethGroup;
  }
  async deleteTeethGroup(id) {
    await db.delete(teethGroups).where(eq7(teethGroups.id, id));
  }
};
var teethGroupStorage = new TeethGroupStorage();

// server/src/order_logs/orderLogsController.ts
import { eq as eq8 } from "drizzle-orm";

// server/src/order_logs/orderLogsSchema.ts
import { pgTable as pgTable11, uuid as uuid11, jsonb as jsonb9 } from "drizzle-orm/pg-core";
var orderLogs = pgTable11("order_logs", {
  id: uuid11("id").defaultRandom().primaryKey(),
  logs: jsonb9("logs").$type(),
  orderId: uuid11("order_id")
});

// server/src/order_logs/orderLogsController.ts
var OrderLogsStorage = class {
  async getLogsByOrderId(orderId) {
    const [logsData] = await db.select().from(orderLogs).where(eq8(orderLogs.orderId, orderId));
    return logsData;
  }
  async createLogs(log2) {
    const [orderLog] = await db.insert(orderLogs).values(log2).returning();
    return orderLog;
  }
  async updateLogs(id, updates) {
    const [updatedLog] = await db.update(orderLogs).set(updates).where(eq8(orderLogs.orderId, id)).returning();
    return updatedLog;
  }
};
var orderLogsStorage = new OrderLogsStorage();

// server/src/departmentHead/departmentHeadSchema.ts
import { createInsertSchema as createInsertSchema6 } from "drizzle-zod";
import {
  pgTable as pgTable13,
  boolean as boolean8,
  timestamp as timestamp8,
  jsonb as jsonb10,
  uuid as uuid13,
  varchar,
  date as date8,
  smallint,
  unique,
  text as text11
} from "drizzle-orm/pg-core";

// server/src/technician/technicianSchema.ts
import { pgTable as pgTable12, text as text10, uuid as uuid12 } from "drizzle-orm/pg-core";
import { z as z3 } from "zod";
var technicianUser = pgTable12("technician_user", {
  id: uuid12("id").primaryKey().defaultRandom(),
  firstName: text10("first_name").notNull(),
  lastName: text10("last_name").notNull(),
  email: text10("email").notNull().unique(),
  roleId: text10("role_id").notNull(),
  mobileNumber: text10("mobile_number").notNull(),
  departmentId: text10("department_id"),
  employeeId: text10("employee_id").notNull().unique(),
  password: text10("password").notNull(),
  profilePic: text10("profile_pic"),
  profilePicMimeType: text10("profile_pic_mime_type")
});
var insertTechnicianSchema = z3.object({
  firstName: z3.string(),
  lastName: z3.string(),
  email: z3.string().email(),
  mobileNumber: z3.string(),
  departmentId: z3.string().optional(),
  employeeId: z3.string(),
  password: z3.string(),
  profilePic: z3.string().optional(),
  profilePicMimeType: z3.string().optional()
});

// server/src/departmentHead/departmentHeadSchema.ts
var departmentHeadSchema = pgTable13("department_head", {
  id: uuid13("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 120 }).notNull().unique(),
  password: varchar("password", { length: 120 }).notNull(),
  roleId: uuid13("role_id").notNull(),
  departmentIds: jsonb10("department_ids").$type().default([]),
  // array of department UUIDs
  isActive: boolean8("is_active").default(true).notNull(),
  createdAt: timestamp8("created_at").defaultNow().notNull(),
  updatedAt: timestamp8("updated_at").defaultNow().notNull()
});
var departmentSchema = pgTable13("department", {
  id: uuid13("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  isActive: boolean8("is_active").default(true).notNull(),
  createdAt: timestamp8("created_at").defaultNow().notNull(),
  updatedAt: timestamp8("updated_at").defaultNow().notNull()
});
var labOrderSchema = pgTable13("lab_order", {
  id: uuid13("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
  orderId: uuid13("order_id").notNull().references(() => orderSchema.id, { onDelete: "cascade" }),
  orderByRole: text11("order_by_role"),
  orderById: text11("order_by_id"),
  dueDate: date8("due_date").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium"),
  sequence: jsonb10("sequence").$type().default([]),
  // array of department UUIDs
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp8("created_at").defaultNow().notNull(),
  updatedAt: timestamp8("updated_at").defaultNow().notNull()
});
var orderFlowSchema = pgTable13(
  "order_flow",
  {
    id: uuid13("id").primaryKey().defaultRandom(),
    orderId: uuid13("order_id").notNull().references(() => orderSchema.id, { onDelete: "cascade" }),
    departmentId: uuid13("department_id").references(() => departmentSchema.id),
    flowStep: smallint("flow_step").notNull(),
    isCurrent: boolean8("is_current").default(false),
    inwardByHead: boolean8("inward_by_head").default(false),
    inwardTime: timestamp8("inward_time"),
    technicianId: uuid13("technician_id").references(() => technicianUser.id),
    workStartedAt: timestamp8("work_started_at"),
    workCompletedAt: timestamp8("work_completed_at"),
    outwardByHead: boolean8("outward_by_head").default(false),
    outwardTime: timestamp8("outward_time"),
    status: varchar("status", { length: 30 }).default("pending"),
    createdAt: timestamp8("created_at").defaultNow().notNull(),
    updatedAt: timestamp8("updated_at").defaultNow().notNull()
  },
  (table) => ({
    uniqueOrderDept: unique("unique_order_dept").on(
      table.orderId,
      table.departmentId
    )
  })
);
var insertDepartmentHeadSchema = createInsertSchema6(
  departmentHeadSchema
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDepartmentSchema = createInsertSchema6(departmentSchema).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true
  }
);

// server/src/order/orderController.ts
var STATIC_DUE_DATE = new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3);
var STATIC_PRIORITY = "medium";
var STATIC_SEQUENCE = [
  "b9caa2f4-a8ee-461c-8d83-ed0ff1d58129",
  // dept-5
  "1c307134-cf0b-420e-b7c3-7347acd81067",
  // dept-1
  "43140bd3-08c5-45e3-ba36-602cbbd56153"
  // dept-2
];
var OrderStorage = class {
  getOrdersByPatient(patientId) {
    throw new Error("Method not implemented.");
  }
  async getOrder(id) {
    const [order] = await db.select().from(orderSchema).where(eq9(orderSchema.id, id));
    const orderFulldData = await this.getFullOrderData(order);
    if (!orderFulldData) {
      throw new Error("order not found");
    }
    if (!order) throw new Error("order not found");
    let logsData = await orderLogsStorage.getLogsByOrderId(orderFulldData?.id);
    if (!logsData) {
      logsData = { logs: [] };
    }
    return {
      ...orderFulldData,
      notes: logsData?.logs
      // This is the logs array
    };
  }
  async createOrder(insertOrder, user) {
    let insertPatient = null;
    let clinicInformation2 = null;
    let teethGroup = null;
    try {
      const patientData = {
        firstName: insertOrder.firstName,
        lastName: insertOrder.lastName,
        age: insertOrder.age,
        sex: insertOrder.sex
      };
      insertPatient = await patientStorage.createPatient(patientData);
      if (!insertPatient) {
        throw new Error("Failed to create patient record");
      }
      const clinicInformationData = {
        clinicId: insertOrder.clinicId,
        caseHandleBy: insertOrder.caseHandleBy,
        doctorMobileNumber: insertOrder.doctorMobileNumber,
        consultingDoctorName: insertOrder?.consultingDoctorName,
        consultingDoctorMobileNumber: insertOrder?.consultingDoctorMobileNumber
      };
      clinicInformation2 = await clinicInformationStorage.createClinicInformation(
        clinicInformationData
      );
      if (!clinicInformation2) {
        throw new Error("Failed to create clinic information record");
      }
      console.log(clinicInformation2);
      const teethGroupData = {
        selectedTeeth: insertOrder.selectedTeeth,
        teethGroup: insertOrder.teethGroup
      };
      teethGroup = await teethGroupStorage.createTeethGroup(teethGroupData);
      console.log(insertOrder.courierData, "courierData");
      let orderByRole = insertOrder.orderByRole;
      let orderById = insertOrder.orderById;
      if (user) {
        if (user.roleName === "main_doctor") {
          orderByRole = orderByRole || "main_doctor";
          orderById = orderById || user.clinicId;
        } else if (user.roleName === "qa") {
          orderByRole = orderByRole || "qa";
          orderById = orderById || user.id;
        } else {
          orderByRole = orderByRole || user.roleName;
          orderById = orderById || user.id;
        }
      }
      const orderDataWithRole = {
        ...insertOrder,
        orderByRole,
        orderById
      };
      const orderToInsert = await this.orderInsert(
        orderDataWithRole,
        insertPatient.id,
        clinicInformation2.id,
        teethGroup.id
      );
      const fixDate = (val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === "string") {
          const d = new Date(val);
          return isNaN(d.getTime()) ? null : d;
        }
        return null;
      };
      orderToInsert.acceptedDileveryData = fixDate(
        orderToInsert.acceptedDileveryData
      );
      orderToInsert.createdAt = /* @__PURE__ */ new Date();
      orderToInsert.updatedAt = /* @__PURE__ */ new Date();
      const [order] = await db.insert(orderSchema).values(orderToInsert).returning();
      const chatData = await chatStorage.getChatByOrderId(order?.id);
      if (!chatData) {
        const clinicData = await clinicStorage.getClinicById(
          order?.clinicId || ""
        );
        if (!clinicData) return "Clinic Data Not Found";
        const clinicFullname = `${clinicData?.firstname || ""} ${clinicData?.lastname || ""}`;
        const chatPayload = {
          clinicId: order?.clinicId || "",
          createdBy: clinicFullname,
          orderId: order?.id || "",
          participants: [clinicFullname, order?.orderById || ""],
          roleName: "main_doctor",
          title: order?.orderId || order?.refId || "",
          type: "order",
          userRole: "main_doctor"
        };
        const createNewChat = await chatStorage.createChat(chatPayload);
        if (!createNewChat) return "Something Went Wrong On Create Chat";
        const updateOrder = {
          ...order,
          chatId: createNewChat?.id || ""
        };
        const updateOrderData = await orderStorage.updateOrder(
          order?.id,
          updateOrder
        );
        if (!updateOrderData) return "Order Not Update";
      }
      if (order?.additionalNote) {
        const subLog = {
          addedBy: order?.orderById,
          additionalNote: order?.additionalNote,
          extraAdditionalNote: order?.extraAdditionalNote,
          createdAt: /* @__PURE__ */ new Date()
        };
        const logsData = {
          logs: [subLog],
          orderId: order.id
        };
        await orderLogsStorage.createLogs(logsData);
      }
      return order;
    } catch (error) {
      if (insertPatient && insertPatient.id) {
        await patientStorage.deletePatient(insertPatient.id);
      }
      if (clinicInformation2 && clinicInformation2.id) {
        await clinicInformationStorage.deleteClinicInformation(
          clinicInformation2.id
        );
      }
      if (teethGroup && teethGroup.id) {
        await teethGroupStorage.deleteTeethGroup(teethGroup.id);
      }
      throw error;
    }
  }
  async updateStatus(orderId, body) {
    const bodyData = body?.orderDate;
    const orderData = await orderStorage.getOrder(orderId);
    console.log("orderId", orderId);
    console.log("callllllleeeeeddddd");
    console.log("body", body);
    console.log("orderData", orderData);
    if (body?.orderId) {
      const [existing] = await db.select().from(orderSchema).where(
        and3(eq9(orderSchema.orderId, body.orderId), sql3`id != ${orderId}`)
      );
      if (existing) {
        const error = new Error("Order ID already exists");
        error.statusCode = 409;
        throw error;
      }
    }
    if (body?.crateNo) {
      const [existingCrate] = await db.select().from(orderSchema).where(
        and3(eq9(orderSchema.crateNo, body.crateNo), sql3`id != ${orderId}`)
      );
      if (existingCrate) {
        const error = new Error("Crate Number already exists");
        error.statusCode = 409;
        throw error;
      }
    }
    if ((body?.orderStatus || "") === "active") {
      const orderLogsData = await orderLogsStorage.getLogsByOrderId(orderId);
      if (orderLogsData?.logs?.length > 0) {
        const log2 = {
          addedBy: body?.userName,
          additionalNote: body?.additionalNote,
          extraAdditionalNote: body?.extraAdditionalNote,
          createdAt: /* @__PURE__ */ new Date()
        };
        const updateLogs = await orderLogsStorage.updateLogs(orderId, {
          logs: [...orderLogsData?.logs, log2]
        });
      }
      const chatData = await chatStorage.getChatByOrderId(orderId);
      if (!chatData) {
        const clinicData = await clinicStorage.getClinicById(
          orderData?.clinicId || ""
        );
        if (!clinicData) return "Clinic Data Not Found";
        const clinicFullname = `${clinicData?.firstname || ""} ${clinicData?.lastname || ""}`;
        const chatPayload = {
          clinicId: orderData?.clinicId || "",
          createdBy: clinicFullname,
          orderId: orderData?.id || "",
          participants: [clinicFullname, body?.userName || ""],
          roleName: "main_doctor",
          title: body?.orderId || "",
          type: "order",
          userRole: "main_doctor"
        };
        const createNewChat = await chatStorage.createChat(chatPayload);
        if (!createNewChat) return "Something Went Wrong On Create Chat";
        const updateOrder = {
          ...bodyData,
          orderStatus: body?.orderStatus || orderData.orderStatus,
          orderId: body?.orderId ? body.orderId : orderData.orderId,
          crateNo: body?.crateNo ? body.crateNo : orderData.crateNo,
          qaNote: body?.qaNote || orderData.qaNote,
          qaId: body?.qaId
        };
        const UpdateOrderData = await orderStorage.updateOrder(
          orderId,
          updateOrder
        );
        if (!UpdateOrderData) return "Order Not Update";
        return UpdateOrderData;
      } else {
        const chatParticipentList = chatData?.participants || [];
        if (!chatParticipentList.includes(body?.userName || "")) {
          const newParticipantsList = [
            ...chatParticipentList,
            body?.userName || ""
          ];
          const updateChatData = {
            ...chatData,
            participants: newParticipantsList
          };
          const updateParticipant = await chatStorage.updateChat(
            chatData?.id || "",
            updateChatData
          );
          if (!updateParticipant) return "Chat Is Not Update";
        }
        const updateOrder = {
          ...bodyData,
          orderStatus: body?.orderStatus || orderData.orderStatus,
          orderId: body?.orderId ? body.orderId : orderData.orderId,
          crateNo: body?.crateNo ? body.crateNo : orderData.crateNo,
          qaId: body?.qaId
        };
        const UpdateOrderData = await orderStorage.updateOrder(
          orderId,
          updateOrder
        );
        const [existingLabOrder] = await db.select().from(labOrderSchema).where(eq9(labOrderSchema.orderId, orderId));
        let labOrderId = null;
        if (!existingLabOrder) {
          try {
            const [newLabOrder] = await db.insert(labOrderSchema).values({
              orderId,
              orderNumber: updateOrder?.orderId,
              orderByRole: updateOrder?.orderByRole,
              orderById: updateOrder?.orderById,
              // Use orderById from the order
              dueDate: STATIC_DUE_DATE.toISOString().split("T")[0],
              // Convert Date to date string (YYYY-MM-DD)
              priority: STATIC_PRIORITY,
              sequence: STATIC_SEQUENCE,
              status: "pending"
            }).returning();
            labOrderId = newLabOrder.orderId;
            console.log(
              `Lab order created successfully for order: ${orderId} with order number: ${updateOrder?.orderId}`
            );
            console.log("updateOrder", updateOrder);
            console.log("Lab order orderById:", updateOrder?.orderById);
            console.log("Lab order orderByRole:", updateOrder?.orderByRole);
          } catch (error) {
            console.error(
              `Error creating lab order for order ${orderId}:`,
              error
            );
          }
        } else {
          labOrderId = existingLabOrder.id;
          console.log(`Lab order already exists for order: ${orderId}`);
        }
        if (labOrderId) {
          try {
            const [existingOrderFlow] = await db.select().from(orderFlowSchema).where(eq9(orderFlowSchema.orderId, labOrderId));
            if (!existingOrderFlow) {
              if (STATIC_SEQUENCE[0]) {
                await db.insert(orderFlowSchema).values({
                  orderId: labOrderId,
                  // Use the lab order ID, not the original order ID
                  departmentId: STATIC_SEQUENCE[0],
                  flowStep: 1,
                  isCurrent: true,
                  status: "waiting_inward"
                });
                console.log(
                  `Order flow created successfully for lab order: ${orderId} with department: ${STATIC_SEQUENCE[0]}`
                );
              } else {
                console.warn(
                  `No department ID available for order flow creation for lab order: ${orderId}`
                );
              }
            } else {
              console.log(
                `Order flow already exists for lab order: ${orderId}`
              );
            }
          } catch (error) {
            console.error(
              `Error creating order flow for lab order ${orderId}:`,
              error
            );
          }
        }
        if (!UpdateOrderData) return "Order Not Update";
        return UpdateOrderData;
      }
    } else if ((body?.orderStatus || "") === "rejected") {
      const orderLogsData = await orderLogsStorage.getLogsByOrderId(orderId);
      if (orderLogsData?.logs?.length > 0) {
        const log2 = {
          addedBy: body?.userName,
          additionalNote: body?.resonOfReject,
          extraAdditionalNote: body?.rejectNote,
          createdAt: /* @__PURE__ */ new Date()
        };
        const updateLogs = await orderLogsStorage.updateLogs(orderId, {
          logs: [...orderLogsData?.logs, log2]
        });
      }
      const updateOrder = {
        ...bodyData,
        orderStatus: body?.orderStatus || orderData.orderStatus,
        resonOfReject: body?.resonOfReject || orderData.resonOfReject,
        qaId: body?.qaId
      };
      const UpdateOrderData = await orderStorage.updateOrder(
        orderId,
        updateOrder
      );
      if (!UpdateOrderData) return "Order Not Update";
      return UpdateOrderData;
    } else if ((body?.orderStatus || "") === "rescan") {
      const orderLogsData = await orderLogsStorage.getLogsByOrderId(orderId);
      if (orderLogsData?.logs?.length > 0) {
        const log2 = {
          addedBy: body?.userName,
          additionalNote: body?.resonOfRescan,
          extraAdditionalNote: body?.additionalNote,
          createdAt: /* @__PURE__ */ new Date()
        };
        const updateLogs = await orderLogsStorage.updateLogs(orderId, {
          logs: [...orderLogsData?.logs, log2]
        });
      }
      const updateOrder = {
        ...bodyData,
        orderStatus: body?.orderStatus || orderData.orderStatus,
        resonOfRescan: body?.resonOfRescan || orderData.resonOfRescan,
        rejectNote: body?.resonOfRescan || orderData.rejectNote,
        qaId: body?.qaId
      };
      const UpdateOrderData = await orderStorage.updateOrder(
        orderId,
        updateOrder
      );
      if (!UpdateOrderData) return "Order Not Update";
      return UpdateOrderData;
    } else {
      const updateOrder = {
        orderStatus: body?.orderStatus || orderData.orderStatus,
        resonOfRescan: body?.resonOfRescan || orderData.resonOfRescan,
        rejectNote: body?.resonOfRescan || orderData.rejectNote,
        orderId: body?.orderId ? body.orderId : orderData.orderId,
        crateNo: body?.crateNo ? body.crateNo : orderData.crateNo,
        qaId: body?.qaId
      };
      const UpdateOrderData = await orderStorage.updateOrder(
        orderId,
        updateOrder
      );
      if (!UpdateOrderData) return "Order Not Update";
      return UpdateOrderData;
    }
  }
  async getOrders() {
    return await db.select().from(orderSchema);
  }
  async getOrdersByClinicId(clinicId) {
    const orders = await db.select().from(orderSchema).where(eq9(orderSchema.clinicId, clinicId));
    if (!orders || orders.length === 0) return [];
    let newOrderList = [];
    for (const order of orders) {
      const updateOrder = await this.getFullOrderData(order);
      const allClinicOrder = {
        id: updateOrder?.id,
        refId: updateOrder?.refId,
        orderId: updateOrder?.orderId,
        prescriptionTypes: updateOrder?.prescriptionTypesId,
        subPrescriptionTypes: updateOrder?.subPrescriptionTypesId,
        orderDate: updateOrder?.createdAt || updateOrder?.orderDate,
        selectedTeeth: updateOrder?.teethNumber,
        orderType: updateOrder?.orderType,
        orderStatus: updateOrder?.orderStatus,
        products: updateOrder?.products,
        paymentStatus: updateOrder?.paymentStatus || "Pandding",
        firstName: updateOrder?.firstName,
        lastName: updateOrder?.lastName,
        percentage: updateOrder?.percentage || 10,
        orderMethod: updateOrder?.orderMethod,
        logs: updateOrder?.logs || [],
        message: updateOrder?.message || ""
      };
      newOrderList.push(allClinicOrder);
    }
    return newOrderList;
  }
  async getOrderByStatus(body) {
    const orders = await db.select().from(orderSchema).where(eq9(orderSchema.orderStatus, body.status));
    let updateOrder = [];
    for (const order of orders) {
      const fullData = await this.getFullOrderData(order);
      const clinicData = await clinicStorage.getClinicById(fullData?.clinicId);
      updateOrder.push({
        id: fullData?.id,
        refId: fullData?.refId,
        orderId: fullData?.orderId,
        clinicName: clinicData?.clinicName,
        handleBy: fullData?.caseHandleBy,
        patientName: `${fullData?.firstName} ${fullData?.lastName}`,
        orderType: fullData?.orderType,
        prescription: fullData?.prescriptionTypesId,
        product: fullData?.products,
        department: fullData?.department,
        technician: fullData?.technician,
        lastStatus: fullData?.updateDate,
        orderStatus: fullData?.orderStatus,
        selectedTeeth: fullData?.teethNumber,
        files: fullData?.files?.addPatientPhotos?.length
      });
    }
    return updateOrder;
  }
  //   async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
  //     const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
  //     return chat;
  //   }
  async getFullOrderData(order) {
    console.log(order.patientId, "order.patientId");
    console.log(order.clinicInformationId, "order.clinicInformationId");
    const patient = order.patientId ? await patientStorage.getPatient(order.patientId) : void 0;
    console.log(patient, "patient");
    const clinicInformation2 = order.clinicInformationId ? await clinicInformationStorage.getClinicInformationById(
      order.clinicInformationId
    ) : void 0;
    const clinicData = await clinicStorage.getClinicById(order.clinicId);
    const teethGroup = order.selectedTeethId ? await teethGroupStorage.getTeethGroupById(order.selectedTeethId) : void 0;
    const groupTeethNumbers = teethGroup?.teethGroup.flatMap(
      (group) => (group.teethDetails || []).flat().map((tooth) => tooth.teethNumber)
    ) || [];
    const selectedTeethNumbers = (teethGroup?.selectedTeeth || []).map(
      (tooth) => tooth.toothNumber ?? tooth.teethNumber
    ) || [];
    let teethnumber = [...groupTeethNumbers, ...selectedTeethNumbers];
    teethnumber = teethnumber.filter((n) => n !== null && n !== void 0);
    const allProductNames = [];
    if (teethGroup?.selectedTeeth) {
      teethGroup.selectedTeeth.forEach((tooth) => {
        if (Array.isArray(tooth.productName)) {
          allProductNames.push(...tooth.productName);
        }
      });
    }
    if (teethGroup?.teethGroup) {
      teethGroup.teethGroup.forEach((group) => {
        if (Array.isArray(group.teethDetails)) {
          group.teethDetails.forEach((row) => {
            if (Array.isArray(row)) {
              row.forEach((tooth) => {
                if (Array.isArray(tooth.productName)) {
                  allProductNames.push(...tooth.productName);
                }
              });
            }
          });
        }
      });
    }
    const productCountMap = {};
    for (const name of allProductNames) {
      if (!name) continue;
      console.log(name, "name s");
      productCountMap[name] = (productCountMap[name] || 0) + 1;
    }
    const productSummary = Object.entries(productCountMap).map(
      ([name, qty]) => ({ name, qty })
    );
    const orderData = {
      id: order?.id,
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      age: patient?.age || 0,
      sex: patient?.sex || "",
      clinicName: clinicData?.clinicName || "",
      clinicId: clinicInformation2?.clinicId || "",
      caseHandleBy: clinicInformation2?.caseHandleBy || "",
      doctorMobileNumber: clinicInformation2?.doctorMobileNumber || "",
      consultingDoctorName: clinicInformation2?.consultingDoctorName || "",
      consultingDoctorMobileNumber: clinicInformation2?.consultingDoctorMobileNumber || "",
      orderMethod: order.orderMethod || "",
      accessorios: Array.isArray(order.accessorios) ? order.accessorios : [],
      selectedTeeth: Array.isArray(teethGroup?.selectedTeeth) ? teethGroup.selectedTeeth : [],
      teethGroup: Array.isArray(teethGroup?.teethGroup) ? teethGroup.teethGroup : [],
      teethNumber: Array.isArray(teethnumber) ? teethnumber : [],
      products: Array.isArray(productSummary) ? productSummary : [],
      acceptedDileveryData: (() => {
        if (!order.acceptedDileveryData) return /* @__PURE__ */ new Date();
        try {
          const date12 = new Date(order.acceptedDileveryData);
          return isNaN(date12.getTime()) ? /* @__PURE__ */ new Date() : date12;
        } catch {
          return /* @__PURE__ */ new Date();
        }
      })(),
      prescriptionTypesId: Array.isArray(order.prescriptionTypesId) ? order.prescriptionTypesId : [],
      subPrescriptionTypesId: Array.isArray(order.subPrescriptionTypesId) ? order.subPrescriptionTypesId : [],
      files: {
        addPatientPhotos: Array.isArray((order.files ?? {}).addPatientPhotos) ? (order.files ?? {}).addPatientPhotos : [],
        faceScan: Array.isArray((order.files ?? {}).faceScan) ? (order.files ?? {}).faceScan : [],
        intraOralScan: Array.isArray((order.files ?? {}).intraOralScan) ? (order.files ?? {}).intraOralScan : [],
        referralImages: Array.isArray((order.files ?? {}).referralImages) ? (order.files ?? {}).referralImages : []
      },
      handllingType: order.handllingType || "",
      pickupData: Array.isArray(order.pickupData) ? order.pickupData : [],
      courierData: order.courierData,
      resonOfReject: order.resonOfReject || "",
      resonOfRescan: order.resonOfRescan || "",
      rejectNote: order.rejectNote || "",
      orderId: order.orderId || "",
      crateNo: order.crateNo || "",
      qaNote: order.qaNote || "",
      orderByRole: order.orderByRole || "",
      orderById: order.orderById || "",
      lifeCycle: Array.isArray(order.lifeCycle) ? order.lifeCycle : [],
      orderStatus: order.orderStatus || "",
      refId: order.refId || "",
      orderDate: (() => {
        if (!order.orderDate) return (/* @__PURE__ */ new Date()).toISOString();
        if (typeof order.orderDate === "string") return order.orderDate;
        try {
          const date12 = new Date(order.orderDate);
          return isNaN(date12.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : date12.toISOString();
        } catch {
          return (/* @__PURE__ */ new Date()).toISOString();
        }
      })(),
      updateDate: (() => {
        if (!order.updatedAt) return (/* @__PURE__ */ new Date()).toISOString();
        if (typeof order.updatedAt === "string") return order.updatedAt;
        try {
          const date12 = new Date(order.updatedAt);
          return isNaN(date12.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : date12.toISOString();
        } catch {
          return (/* @__PURE__ */ new Date()).toISOString();
        }
      })(),
      totalAmount: order.totalAmount || "",
      paymentType: order.paymentType || "",
      doctorNote: order.doctorNote || "",
      orderType: order.orderType || "",
      paymentStatus: order.paymentStatus || "",
      percentage: order.percentage || ""
      // ...add any other fields from OrderType with appropriate fallbacks
    };
    return orderData;
  }
  async updateOrderStatus(id, orderStatus) {
    const [order] = await db.update(orderSchema).set({ orderStatus, updatedAt: /* @__PURE__ */ new Date() }).where(eq9(orderSchema.id, id)).returning();
    return order;
  }
  async updateOrder(id, updates) {
    try {
      const [order] = await db.select().from(orderSchema).where(eq9(orderSchema.id, id));
      if (!order) {
        return void 0;
      }
      let patientId = order.patientId;
      if (patientId && (updates.firstName || updates.lastName || updates.age || updates.sex)) {
        try {
          const patientUpdates = {};
          if (updates.firstName !== void 0)
            patientUpdates.firstName = updates.firstName;
          if (updates.lastName !== void 0)
            patientUpdates.lastName = updates.lastName;
          if (updates.age !== void 0) patientUpdates.age = updates.age;
          if (updates.sex !== void 0) patientUpdates.sex = updates.sex;
          if (Object.keys(patientUpdates).length > 0) {
            await patientStorage.updatePatient(patientId, patientUpdates);
          }
        } catch (error) {
          console.error("Error updating patient:", error);
        }
      }
      let clinicInformationId = order.clinicInformationId;
      if (clinicInformationId && (updates.caseHandleBy || updates.doctorMobileNumber || updates.consultingDoctorName || updates.consultingDoctorMobileNumber)) {
        try {
          const clinicUpdates = {};
          if (updates.caseHandleBy !== void 0)
            clinicUpdates.caseHandleBy = updates.caseHandleBy;
          if (updates.doctorMobileNumber !== void 0)
            clinicUpdates.doctorMobileNumber = updates.doctorMobileNumber;
          if (updates.consultingDoctorName !== void 0)
            clinicUpdates.consultingDoctorName = updates.consultingDoctorName;
          if (updates.consultingDoctorMobileNumber !== void 0)
            clinicUpdates.consultingDoctorMobileNumber = updates.consultingDoctorMobileNumber;
          if (Object.keys(clinicUpdates).length > 0) {
            await clinicInformationStorage.updateClinicInformation(
              clinicInformationId,
              clinicUpdates
            );
          }
        } catch (error) {
          console.error("Error updating clinic information:", error);
        }
      }
      let selectedTeethId = order.selectedTeethId;
      if (selectedTeethId && (updates.selectedTeeth || updates.teethGroup)) {
        try {
          const teethUpdates = {};
          if (updates.selectedTeeth !== void 0)
            teethUpdates.selectedTeeth = updates.selectedTeeth;
          if (updates.teethGroup !== void 0)
            teethUpdates.teethGroup = updates.teethGroup;
          if (Object.keys(teethUpdates).length > 0) {
            await teethGroupStorage.updateTeethGroup(
              selectedTeethId,
              teethUpdates
            );
          }
        } catch (error) {
          console.error("Error updating teeth group:", error);
        }
      }
      const accessorios = Array.isArray(updates.accessorios) ? updates.accessorios : [];
      const orderUpdate = { ...updates, accessorios };
      delete orderUpdate.firstName;
      delete orderUpdate.lastName;
      delete orderUpdate.age;
      delete orderUpdate.sex;
      delete orderUpdate.caseHandleBy;
      delete orderUpdate.doctorMobileNumber;
      delete orderUpdate.consultingDoctorName;
      delete orderUpdate.consultingDoctorMobileNumber;
      delete orderUpdate.selectedTeeth;
      delete orderUpdate.teethGroup;
      const orderToInsert = await this.orderInsert(
        orderUpdate,
        order.patientId || "",
        order.clinicInformationId || "",
        order.selectedTeethId || "",
        true
        // Indicate this is an update operation
      );
      const [updatedOrder] = await db.update(orderSchema).set(orderToInsert).where(eq9(orderSchema.id, id)).returning();
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }
  async initializeData() {
    console.log("Starting order database initialization...");
    const existingOrders = await this.getOrders();
    if (existingOrders.length > 0) {
      console.log("Orders database already has data, skipping initialization");
      return;
    }
    try {
      console.log("Creating sample orders...");
      console.log("Order sample data created successfully");
    } catch (error) {
      console.error("Error creating order sample data:", error);
    }
  }
  async orderInsert(insertOrder, insertPatient, clinicInformation2, teethGroup, isUpdate = false) {
    const fixDate = (val) => {
      if (!val) return null;
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    };
    const orderToInsert = {
      ...insertOrder,
      patientId: insertPatient,
      clinicInformationId: clinicInformation2,
      selectedTeethId: teethGroup,
      orderById: insertOrder.orderById,
      // Set orderById from the input data, preserve existing value during updates
      // Defensive: ensure all array fields are arrays
      prescriptionTypesId: Array.isArray(insertOrder.prescriptionTypesId) ? insertOrder.prescriptionTypesId : [],
      subPrescriptionTypesId: Array.isArray(insertOrder.subPrescriptionTypesId) ? insertOrder.subPrescriptionTypesId : [],
      accessorios: Array.isArray(insertOrder.accessorios) ? insertOrder.accessorios : [],
      selectedTeeth: Array.isArray(insertOrder.selectedTeeth) ? insertOrder.selectedTeeth : [],
      teethGroup: Array.isArray(insertOrder.teethGroup) ? insertOrder.teethGroup : [],
      teethNumber: Array.isArray(insertOrder.teethNumber) ? insertOrder.teethNumber : [],
      products: Array.isArray(insertOrder.products) ? insertOrder.products : [],
      pickupData: Array.isArray(insertOrder.pickupData) ? insertOrder.pickupData : [],
      courierData: insertOrder.courierData,
      lifeCycle: Array.isArray(insertOrder.lifeCycle) ? insertOrder.lifeCycle : [],
      // Safely handle date fields
      acceptedDileveryData: fixDate(insertOrder.acceptedDileveryData),
      orderDate: fixDate(insertOrder.orderDate),
      updateDate: fixDate(insertOrder.updateDate),
      createdAt: isUpdate && insertOrder.createdAt ? fixDate(insertOrder.createdAt) : /* @__PURE__ */ new Date(),
      // Preserve original createdAt for updates, use current date for new orders
      updatedAt: /* @__PURE__ */ new Date(),
      // Always set to current date for new orders
      files: {
        addPatientPhotos: Array.isArray(insertOrder.files?.addPatientPhotos) ? insertOrder.files.addPatientPhotos : [],
        faceScan: Array.isArray(insertOrder.files?.faceScan) ? insertOrder.files.faceScan : [],
        intraOralScan: Array.isArray(insertOrder.files?.intraOralScan) ? insertOrder.files.intraOralScan : [],
        referralImages: Array.isArray(insertOrder.files?.referralImages) ? insertOrder.files.referralImages : []
      }
    };
    return orderToInsert;
  }
};
var orderStorage = new OrderStorage();

// server/src/message/messageController.ts
import { eq as eq10, asc as asc2 } from "drizzle-orm";

// server/src/company/companyschema.ts
import { pgTable as pgTable14, text as text12, uuid as uuid14 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema7 } from "drizzle-zod";
var companies = pgTable14("companies", {
  id: uuid14("id").primaryKey().defaultRandom(),
  name: text12("name")
});
var insertCompanySchema = createInsertSchema7(companies).omit({
  id: true
});

// server/src/message/messageController.ts
var MessageStorage = class {
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
    const orderChats = await db.select().from(chats).where(eq10(chats.orderId, orderId));
    if (orderChats.length === 0) return [];
    return await db.select().from(messages).where(eq10(messages.chatId, orderChats[0].id));
  }
  async getMessagesByChat(chatId) {
    return await db.select().from(messages).where(eq10(messages.chatId, chatId)).orderBy(asc2(messages.createdAt));
  }
  async initializeData() {
    console.log("Starting database initialization...");
    const existingOrders = await orderStorage.getOrders();
    if (existingOrders.length > 0) {
      console.log("Database already has data, skipping initialization");
      return;
    }
    try {
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
    console.log(chatId, userId, "this is a alll");
    if (!userId) {
      console.log("No userId provided, returning 0");
      return 0;
    }
    const chat = await chatStorage.getChat(chatId);
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
    const messageList = await db.select().from(messages).where(eq10(messages.chatId, chatId));
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
    const messageList = await db.select().from(messages).where(eq10(messages.chatId, chatId));
    for (const messageItem of messageList) {
      const currentReadBy = messageItem.readBy || [];
      if (!currentReadBy.includes(userId)) {
        const updatedReadBy = [...currentReadBy, userId];
        await db.update(messages).set({ readBy: updatedReadBy }).where(eq10(messages.id, messageItem.id));
      }
    }
  }
};
var messageStorage = new MessageStorage();

// server/src/chat/chatRoute.ts
var setupChatRoutes = (app2) => {
  app2.get("/api/chats/:clinicId", async (req, res) => {
    try {
      const { userId } = req.query;
      const clinicId = req.params.clinicId;
      const chats2 = await chatStorage.getChatsByClinic(clinicId);
      console.log(userId, "this is a user id");
      if (userId && typeof userId === "string") {
        console.log(`Calculating unread counts for user: ${userId}`);
        const chatsWithUnreadCount = await Promise.all(
          chats2.map(async (chat) => {
            console.log(
              `Processing chat ${chat.title} (${chat.id}) with participants:`,
              chat.participants
            );
            const participants = chat.participants || [];
            const isParticipant = participants.some((participant) => {
              const exactMatch = participant.toLowerCase() === userId.toLowerCase();
              const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) || userId.toLowerCase().includes(participant.toLowerCase());
              return exactMatch || containsMatch;
            });
            console.log(
              `User ${userId} isParticipant in chat ${chat.title}: ${isParticipant}`
            );
            if (!isParticipant) {
              return null;
            }
            const unreadCount = await messageStorage.getUnreadMessageCount(
              chat.id,
              userId
            );
            console.log(
              `Chat ${chat.title} (${chat.id}): ${unreadCount} unread messages for user ${userId}`
            );
            return {
              ...chat,
              unreadCount
            };
          })
        );
        const filteredChats = chatsWithUnreadCount.filter(Boolean);
        console.log("Final chats with unread counts:", filteredChats, userId);
        res.json(filteredChats);
      } else {
        console.log(
          "No userId provided, returning chats without unread counts"
        );
        res.json(chats2);
      }
    } catch (error) {
      console.log("Error fetching chats", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });
  app2.get("/api/chat/:id", async (req, res) => {
    try {
      console.log("Fetching chat", req.params.id);
      const chat = await chatStorage.getChat(req.params.id);
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
      const chats2 = await chatStorage.getChatsByType(req.params.type);
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
      const chat = await chatStorage.createChat(chatData);
      res.status(201).json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Invalid chat data" });
    }
  });
  app2.get("/api/chats/:id/messages", async (req, res) => {
    try {
      const messages2 = await messageStorage.getMessagesByChat(req.params.id);
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
      const message = await messageStorage.createMessage(messageData);
      const io = req.app.get("io") || req.app.io;
      const userSocketMap2 = req.app.get("userSocketMap") || req.app.userSocketMap;
      const chat = await chatStorage.getChat(req.params.id);
      if (io && userSocketMap2 && chat) {
        for (const participant of chat.participants || []) {
          const socketId = userSocketMap2.get(participant);
          if (socketId) {
            const unreadCount = await messageStorage.getUnreadMessageCount(req.params.id, participant);
            io.to(socketId).emit("unread-count-update", { chatId: req.params.id, unreadCount });
          }
        }
      }
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
      await messageStorage.markAllMessagesAsRead(chatId, userId);
      const io = req.app.get("io") || req.app.io;
      const userSocketMap2 = req.app.get("userSocketMap") || req.app.userSocketMap;
      if (io && userSocketMap2 && userId) {
        const socketId = userSocketMap2.get(userId);
        if (socketId) {
          const unreadCount = await messageStorage.getUnreadMessageCount(
            chatId,
            userId
          );
          io.to(socketId).emit("unread-count-update", { chatId, unreadCount });
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
      const chat = await chatStorage.getChat(chatId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      await chatStorage.deleteChat(chatId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chat" });
    }
  });
  app2.patch("/api/chats/:id/archive", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await chatStorage.updateChat(chatId, { isActive: false });
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
      const currentChat = await chatStorage.getChat(chatId);
      const currentParticipants = currentChat?.participants || [];
      const newParticipants = participants.filter(
        (p) => !currentParticipants.includes(p)
      );
      const removedParticipants = currentParticipants.filter(
        (p) => !participants.includes(p)
      );
      const chat = await chatStorage.updateChat(chatId, { participants });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      const io = req.app.io;
      if (io) {
        io.emit("participants-updated", {
          chatId,
          participants,
          newParticipants,
          removedParticipants,
          updatedBy: req.body.updatedBy || "Unknown"
        });
        console.log(
          `Participants updated for chat ${chatId}, broadcasting to all users`
        );
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participants" });
    }
  });
};

// server/src/clinic/clinicRoute.ts
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
var setupClinicRoutes = (app2) => {
  app2.get("/api/clinics/mobile/:mobileNumber", async (req, res) => {
    try {
      const { mobileNumber } = req.params;
      console.log("Finding clinic by mobile number:", mobileNumber);
      const clinic2 = await clinicStorage.getClinicByMobileNumber(mobileNumber);
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
  app2.put("/api/clinic/:id", async (req, res) => {
    try {
      console.log("clinic update endpoint", req.params.id);
      console.log("clinic update body", req.body);
      const updates = mapClinicFields(req.body);
      console.log("updates==>", updates);
      const clinic2 = await clinicStorage.updateClinic(req.params.id, updates);
      if (!clinic2) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json(clinic2);
    } catch (error) {
      console.log("clinic update error", error);
      res.status(400).json({
        error: "Invalid clinic update data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/clinics/name/:clinicName", async (req, res) => {
    try {
      const { clinicName } = req.params;
      const clinics = await clinicStorage.getClinics();
      const clinic2 = clinics.find((c) => c.clinicName === clinicName);
      if (!clinic2) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json({ id: clinic2.id, clinicName: clinic2.clinicName });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/clinics", async (req, res) => {
    try {
      const clinics = await clinicStorage.getClinics();
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/clinics/:id", async (req, res) => {
    console.log("clinic name by id", req.params.id);
    try {
      console.log("clinic name by id", req.params.id);
      const { id } = req.params;
      const clinic2 = await clinicStorage.getClinic(id);
      if (!clinic2) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json({ id: clinic2.id, clinicName: clinic2.clinicName });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

// server/src/lifeCycle/lifeCycleSchema.ts
import { date as date9, pgTable as pgTable15, text as text13, timestamp as timestamp9, uuid as uuid15 } from "drizzle-orm/pg-core";
var lifecycleStages = pgTable15("lifecycle_stages", {
  id: uuid15("id").primaryKey().defaultRandom(),
  title: text13("title").notNull(),
  date: date9("date"),
  time: text13("time"),
  person: text13("person").notNull(),
  role: text13("role").notNull(),
  icon: text13("icon"),
  createdAt: timestamp9("created_at").defaultNow(),
  updatedAt: timestamp9("updated_at").defaultNow()
});

// server/src/lifeCycle/lifeCycleController.ts
var LifeCycleStorage = class {
  async getLifecycleStages() {
    return await db.select().from(lifecycleStages).orderBy(lifecycleStages.createdAt);
  }
};
var lifeCycleStorage = new LifeCycleStorage();

// server/src/lifeCycle/lifeCycleRoute.ts
var setupLifeCycleRoutes = async (app2) => {
  app2.get("/api/lifecycle-stages", async (req, res) => {
    try {
      const stages = await lifeCycleStorage.getLifecycleStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lifecycle stages" });
    }
  });
};

// server/src/message/messageRoute.ts
var setupMessageRoutes = (app2) => {
};

// server/src/order/orderRoute.ts
var setupOrderRoutes = (app2) => {
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await orderStorage.getOrdersByClinicId(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.get("/api/orderData/:id", async (req, res) => {
    try {
      const order = await orderStorage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  });
  app2.get("/api/qa/filter/order", async (req, res) => {
    try {
      const status = req.query.status;
      const filterBody = { status };
      const order = await orderStorage.getOrderByStatus(filterBody);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const order = await orderStorage.getOrders();
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const user = req.user;
      const order = await orderStorage.createOrder(req.body, user);
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  });
  app2.patch("/api/updateOrders/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const orderData = req.body;
      const order = await orderStorage.updateOrder(orderId, orderData);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({
        error: "Failed to update order",
        details: error.message || "Unknown error occurred"
      });
    }
  });
  app2.patch("/api/qa/status/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const body = req.body;
      const updateData = await orderStorage.updateStatus(orderId, body);
      res.status(201).json(updateData);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      const message = error.message || "Something went wrong";
      return res.status(statusCode).json({ error: message });
    }
  });
  app2.get("/api/orders/:orderId/chat", async (req, res) => {
    try {
      const chat = await chatStorage.getChatByOrderId(req.params.orderId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found for this order" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat for order" });
    }
  });
};

// server/src/teamMember/teamMemberRoute.ts
import bcrypt2 from "bcrypt";
var setupTeamMemberRoutes = (app2) => {
  app2.get("/api/team-members/:clinicId", async (req, res) => {
    try {
      const clinicId = req.params.clinicId;
      const clinicName = await clinicStorage.getClinicById(clinicId);
      const teamMemberData = await teamMemberStorage.getTeamMembersByClinic(clinicName.clinicName);
      return res.json(teamMemberData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });
  app2.get("/api/team-member/:id", async (req, res) => {
    try {
      const teamMember = await teamMemberStorage.getTeamMember(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json(teamMember);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team member" });
    }
  });
  app2.post("/api/create/team-members", async (req, res) => {
    try {
      const { roleName, ...teamMemberData } = req.body;
      const existingTeamMemberByMobile = await teamMemberStorage.getTeamMemberByMobileNumber(
        teamMemberData.contactNumber
      );
      if (existingTeamMemberByMobile) {
        return res.status(400).json({ error: "Mobile number is already in use by a team member" });
      }
      const existingClinicByMobile = await clinicStorage.getClinicByMobileNumber(
        teamMemberData.contactNumber
      );
      if (existingClinicByMobile) {
        return res.status(400).json({ error: "Mobile number is already in use by a clinic" });
      }
      let roleId;
      if (roleName) {
        const role2 = await RolesStorage.getRoleByName(roleName);
        if (!role2) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        roleId = role2.id;
      } else {
        return res.status(400).json({ error: "Role name is required" });
      }
      let teamMemberToSave = { ...teamMemberData, roleId };
      if (teamMemberToSave.password) {
        teamMemberToSave.password = await bcrypt2.hash(teamMemberToSave.password, 10);
      }
      const teamMember = await teamMemberStorage.createTeamMember(teamMemberToSave);
      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ error: "Invalid team member data" });
    }
  });
  app2.patch("/api/update/team-member/:id", async (req, res) => {
    try {
      const teamMemberId = req.params.id;
      const updateData = { ...req.body };
      if (updateData.password) {
        updateData.password = await bcrypt2.hash(updateData.password, 10);
      }
      const updatedTeamMember = await teamMemberStorage.updateTeamMember(teamMemberId, updateData);
      if (!updatedTeamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      const io = req.app.get("io") || req.app.io;
      if (io) {
        io.emit("team-member-updated", updatedTeamMember);
      }
      res.json(updatedTeamMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ error: "Failed to update team member" });
    }
  });
  app2.delete("/api/team-member/:id", async (req, res) => {
    try {
      const member = await teamMemberStorage.getTeamMember(req.params.id);
      const fullName = member?.fullName;
      let affectedChats = [];
      let allChats = [];
      if (fullName) {
        allChats = await chatStorage.getChats();
        affectedChats = allChats.filter(
          (chat) => Array.isArray(chat.participants) && chat.participants.includes(fullName)
        );
      }
      await teamMemberStorage.deleteTeamMember(req.params.id);
      const io = req.app.get("io") || req.app.io;
      if (io && fullName) {
        for (const chat of affectedChats) {
          const updatedParticipants = (chat.participants || []).filter(
            (p) => p !== fullName
          );
          io.emit("participants-updated", {
            chatId: chat.id,
            participants: updatedParticipants,
            newParticipants: [],
            removedParticipants: [fullName],
            updatedBy: "System"
          });
        }
      }
      res.status(200).send({ message: "team member delete successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });
};

// server/src/role/roleRoute.ts
var setuRoleRoutes = (app2) => {
  app2.get("/api/roles/:roleId", async (req, res) => {
    try {
      const { roleId } = req.params;
      const role2 = await RolesStorage.getRoleById(roleId);
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
      const role2 = await RolesStorage.getRoleByName(roleName);
      if (!role2) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json({ id: role2.id, name: role2.name });
    } catch (error) {
      console.error("Error fetching role by name:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

// server/src/draftOrder/draftOrderRoute.ts
import { Router } from "express";

// server/src/draftOrder/draftOrderSchema.ts
import {
  pgTable as pgTable16,
  uuid as uuid16,
  text as text14,
  jsonb as jsonb12,
  timestamp as timestamp10,
  date as date10,
  time
} from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema8 } from "drizzle-zod";
var draftOrderSchema = pgTable16("draft_order", {
  id: uuid16("id").primaryKey().defaultRandom(),
  refId: text14("ref_id"),
  orderType: text14("order_type"),
  orderStatus: text14("order_status"),
  paymentType: text14("payment_type"),
  clinicId: text14("clinic_id"),
  firstName: text14("first_name"),
  lastName: text14("last_name"),
  age: text14("age"),
  sex: text14("sex"),
  // Case Info
  caseHandleBy: text14("case_handle_by"),
  doctorMobileNumber: text14("doctor_mobile_number"),
  consultingDoctorName: text14("consulting_doctor_name"),
  consultingDoctorMobileNumber: text14("consulting_doctor_mobile_number"),
  // Order Details
  prescriptionTypesId: jsonb12("prescription_types_id"),
  // JSONB array
  subPrescriptionTypesId: jsonb12("sub_prescription_types_id"),
  // JSONB array
  prescriptionType: text14("prescription_type"),
  subPrescriptionTypes: text14("sub_prescription_types"),
  orderMethod: text14("order_method"),
  teethGroup: jsonb12("teeth_group"),
  selectedTeeth: jsonb12("selected_teeth"),
  // File uploads
  files: jsonb12("files"),
  // Accessories
  accessorios: jsonb12("accessorios"),
  handllingType: text14("handlling_type"),
  // Pickup
  pickupDate: date10("pickup_date"),
  pickupTime: time("pickup_time"),
  pickupRemarks: text14("pickup_remarks"),
  // Scan Booking
  scanBooking: jsonb12("scan_booking"),
  courierData: jsonb12("courier_data"),
  pickupData: jsonb12("pickup_data"),
  createdAt: timestamp10("created_at", { withTimezone: true }).defaultNow()
});
var insertDraftOrderSchema = createInsertSchema8(draftOrderSchema).omit({
  id: true,
  createdAt: true
}).partial();

// server/src/draftOrder/draftOrderController.ts
import { eq as eq11 } from "drizzle-orm";
var DraftOrderStorage = class {
  async getDraftOrder(id) {
    const [order] = await db.select().from(draftOrderSchema).where(eq11(draftOrderSchema.id, id));
    return order;
  }
  async createDraftOrder(order) {
    const [created] = await db.insert(draftOrderSchema).values(order).returning();
    return created;
  }
  async getDraftOrdersByClinicId(clinicId) {
    return await db.select().from(draftOrderSchema).where(eq11(draftOrderSchema.clinicId, clinicId));
  }
  async deleteDraftOrder(id) {
    await db.delete(draftOrderSchema).where(eq11(draftOrderSchema.id, id));
  }
};
var draftOrderStorage = new DraftOrderStorage();
async function getDraftOrderById(req, res) {
  try {
    const order = await draftOrderStorage.getDraftOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Draft order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch draft order" });
  }
}
async function getDraftOrdersByClinicId(req, res) {
  try {
    const orders = await draftOrderStorage.getDraftOrdersByClinicId(req.params.clinicId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch draft orders" });
  }
}
function parseJsonbField(val) {
  if (Array.isArray(val) || typeof val === "object" && val !== null) {
    return val;
  }
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      if (/^{.*}$/.test(val)) {
        return val.slice(1, -1).split(",").map((s) => s.replace(/^"|"$/g, ""));
      }
      return [];
    }
  }
  return [];
}
async function createDraftOrder(req, res) {
  try {
    const body = req.body || {};
    console.log(body, "body");
    const prescriptionTypesId = parseJsonbField(body.prescriptionTypesId);
    const subPrescriptionTypesId = parseJsonbField(body.subPrescriptionTypesId);
    const accessorios = parseJsonbField(body.accessorios);
    const teethGroup = parseJsonbField(body.teethGroup);
    const selectedTeeth = parseJsonbField(body.selectedTeeth);
    const files = parseJsonbField(body.files);
    const scanBooking = parseJsonbField(body.scanBooking);
    const courierData = parseJsonbField(body.courierData);
    const pickupData = parseJsonbField(body.pickupData);
    const refId = body.refId || `REF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const orderType = body.orderType || "";
    const orderStatus = body.orderStatus || "";
    const paymentType = body.paymentType || "";
    const clinicId = body.clinicId || "";
    const firstName = body.firstName || "";
    const lastName = body.lastName || "";
    const sex = body.sex || "";
    const age = body.age || "";
    const caseHandleBy = body.caseHandleBy || "";
    const doctorMobileNumber = body.doctorMobileNumber || "";
    const consultingDoctorName = body.consultingDoctorName || "";
    const consultingDoctorMobileNumber = body.consultingDoctorMobileNumber || "";
    const orderMethod = body.orderMethod || "";
    const handllingType = body.handllingType || "";
    const pickupRemarks = body.pickupRemarks || "";
    const prescriptionType = body.prescriptionType || "";
    const subPrescriptionTypes = body.subPrescriptionTypes || "";
    const pickupDate = body.pickupDate || null;
    const pickupTime = body.pickupTime ? body.pickupTime : null;
    const draftOrder = {
      refId,
      orderType,
      orderStatus,
      paymentType,
      clinicId,
      firstName,
      lastName,
      age,
      sex,
      caseHandleBy,
      doctorMobileNumber,
      consultingDoctorName,
      consultingDoctorMobileNumber,
      prescriptionTypesId,
      subPrescriptionTypesId,
      orderMethod,
      teethGroup,
      selectedTeeth,
      files,
      accessorios,
      handllingType,
      pickupDate,
      pickupTime,
      pickupRemarks,
      courierData,
      pickupData,
      prescriptionType,
      subPrescriptionTypes
    };
    const parseResult = insertDraftOrderSchema.safeParse(draftOrder);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const order = await draftOrderStorage.createDraftOrder(parseResult.data);
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}
async function deleteDraftOrder(req, res) {
  try {
    const order = await draftOrderStorage.getDraftOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Draft order not found" });
    }
    await draftOrderStorage.deleteDraftOrder(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete draft order" });
  }
}

// server/src/draftOrder/draftOrderRoute.ts
var draftOrderRouter = Router();
draftOrderRouter.get("/:id", getDraftOrderById);
draftOrderRouter.get("/clinic/:clinicId", getDraftOrdersByClinicId);
draftOrderRouter.post("/", createDraftOrder);
draftOrderRouter.delete("/:id", deleteDraftOrder);
function setupDraftOrderRoutes(app2) {
  app2.use("/api/draft-orders", draftOrderRouter);
}

// server/src/qa/qaController.ts
import { eq as eq12, sql as sql5, and as and5, inArray as inArray4 } from "drizzle-orm";

// server/src/qa/qaSchema.ts
import { pgTable as pgTable17, uuid as uuid17, text as text15, date as date11, timestamp as timestamp11, jsonb as jsonb13, boolean as boolean10 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema9 } from "drizzle-zod";
var qaDailyReportSchema = pgTable17("qa_daily_reports", {
  id: uuid17("id").primaryKey().defaultRandom(),
  qaId: text15("qa_id"),
  // QA user id or reference
  reportDate: date11("report_date"),
  summary: text15("summary"),
  approvedOrderIds: jsonb13("approved_order_ids").default([]),
  // string[]
  rejectedOrderIds: jsonb13("rejected_order_ids").default([]),
  // string[]
  rescanOrderIds: jsonb13("rescan_order_ids").default([]),
  // string[]
  placeOrderIds: jsonb13("place_order_ids").default([]),
  // string[]
  modifiedOrderIds: jsonb13("modified_order_ids").default([]),
  // string[]
  accessoriesPendingOrderIds: jsonb13("accessories_pending_order_ids").default([]),
  // string[]
  createdAt: timestamp11("created_at").defaultNow(),
  updatedAt: timestamp11("updated_at").defaultNow()
});
var insertQaDailyReportSchema = createInsertSchema9(qaDailyReportSchema).partial({
  id: true,
  createdAt: true,
  updatedAt: true
});
var qaUserSchema = pgTable17("qa_users", {
  id: uuid17("id").primaryKey().defaultRandom(),
  email: text15("email").notNull().unique(),
  passwordHash: text15("password_hash").notNull(),
  name: text15("name").notNull(),
  roleId: uuid17("role_id").notNull(),
  isActive: boolean10("is_active").default(true).notNull(),
  createdAt: timestamp11("created_at").defaultNow(),
  updatedAt: timestamp11("updated_at").defaultNow()
});
var insertQaUserSchema = createInsertSchema9(qaUserSchema).partial({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true
});

// server/src/qa/qaController.ts
import jwt2 from "jsonwebtoken";

// server/src/helpers/authHelpers.ts
import bcrypt3 from "bcrypt";
async function hashPassword(password) {
  return bcrypt3.hash(password, 10);
}
async function comparePassword(password, hash) {
  return bcrypt3.compare(password, hash);
}
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password
  );
}
function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// server/src/qa/qaController.ts
var JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
var qaController = {
  // --- QA Auth & Management ---
  // Register a new QA
  async registerQa(req, res) {
    try {
      const { email, password, name } = req.body;
      const qaRoleName = "qa";
      console.log("email", email);
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields (email, password, name)" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (!isStrongPassword(password)) {
        return res.status(400).json({ error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character" });
      }
      const existing = await db.select().from(qaUserSchema).where(eq12(qaUserSchema.email, email));
      if (existing.length > 0)
        return res.status(409).json({ error: "Email already registered" });
      const roleData = await RolesStorage.getRoleByName(qaRoleName);
      const roleId = roleData?.id;
      const passwordHash = await hashPassword(password);
      const qaData = {
        email,
        passwordHash,
        name,
        roleId,
        roleName: roleData?.name
      };
      const [user] = await db.insert(qaUserSchema).values(qaData).returning();
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        roleName: roleData?.name
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to register QA" });
    }
  },
  // Login QA
  async loginQa(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });
      const [user] = await db.select().from(qaUserSchema).where(eq12(qaUserSchema.email, email));
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });
      const token = jwt2.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      const role2 = await RolesStorage.getRoleById(user.roleId);
      res.status(200).json({
        token,
        user: { id: user.id, email: user.email, fullName: user.name, roleId: user.roleId, roleName: role2?.name || "" }
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to login QA" });
    }
  },
  // Dummy logout (for stateless JWT, just clear token on client)
  async logoutQa(_req, res) {
    res.status(200).json({ message: "Logged out (client should clear token)" });
  },
  // Delete QA
  async deleteQa(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Missing QA id" });
      const [deleted] = await db.delete(qaUserSchema).where(eq12(qaUserSchema.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "QA not found" });
      res.status(200).json({ message: "QA deleted", id });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to delete QA" });
    }
  },
  // Submit a new daily report
  async submitDailyReport(req, res) {
    try {
      const { qaId, reportDate, approvedOrderIds, rejectedOrderIds, rescanOrderIds, modifiedOrderIds, ...rest } = req.body;
      if (!qaId || !reportDate) {
        return res.status(400).json({ error: "qaId and reportDate are required" });
      }
      const dateStr = typeof reportDate === "string" ? reportDate.slice(0, 10) : new Date(reportDate).toISOString().slice(0, 10);
      const [existing] = await db.select().from(qaDailyReportSchema).where(
        and5(
          eq12(qaDailyReportSchema.qaId, qaId),
          eq12(qaDailyReportSchema.reportDate, dateStr)
        )
      );
      const mergeIds = (oldArr, newArr) => {
        if (!Array.isArray(oldArr)) oldArr = [];
        if (!Array.isArray(newArr)) newArr = [];
        return Array.from(/* @__PURE__ */ new Set([...oldArr || [], ...newArr || []]));
      };
      if (existing) {
        const updatedFields = {};
        if (approvedOrderIds) {
          updatedFields.approvedOrderIds = mergeIds(existing.approvedOrderIds, approvedOrderIds);
        }
        if (rejectedOrderIds) {
          updatedFields.rejectedOrderIds = mergeIds(existing.rejectedOrderIds, rejectedOrderIds);
        }
        if (rescanOrderIds) {
          updatedFields.rescanOrderIds = mergeIds(existing.rescanOrderIds, rescanOrderIds);
        }
        if (modifiedOrderIds) {
          updatedFields.modifiedOrderIds = mergeIds(existing.modifiedOrderIds, modifiedOrderIds);
        }
        Object.assign(updatedFields, rest);
        const [updated] = await db.update(qaDailyReportSchema).set({
          ...updatedFields,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq12(qaDailyReportSchema.id, existing.id)).returning();
        return res.status(200).json(updated);
      } else {
        const [created] = await db.insert(qaDailyReportSchema).values({
          qaId,
          reportDate: dateStr,
          approvedOrderIds: approvedOrderIds || [],
          rejectedOrderIds: rejectedOrderIds || [],
          rescanOrderIds: rescanOrderIds || [],
          modifiedOrderIds: modifiedOrderIds || [],
          ...rest
        }).returning();
        return res.status(201).json(created);
      }
    } catch (error) {
      res.status(400).json({ error: error.message || "Failed to submit daily report" });
    }
  },
  // Get all daily reports for a particular QA (with pagination)
  async getAllDailyReports(req, res) {
    try {
      const { qaId, page = 1, pageSize = 20, withOrderDetails } = req.query;
      const offset = (Number(page) - 1) * Number(pageSize);
      const where = qaId ? eq12(qaDailyReportSchema.qaId, qaId) : void 0;
      const query = db.select().from(qaDailyReportSchema).where(where).offset(offset).limit(Number(pageSize));
      const reports = await query;
      const total = await db.select({ count: sql5`count(*)` }).from(qaDailyReportSchema).where(where);
      if (withOrderDetails === "true") {
        for (const report of reports) {
          const fetchOrders = async (ids) => {
            const arr = Array.isArray(ids) ? ids : [];
            return db.select().from(orderSchema).where(inArray4(orderSchema.id, arr));
          };
          report.approvedOrderDetails = await fetchOrders(
            report.approvedOrderIds
          );
          report.rejectedOrderDetails = await fetchOrders(
            report.rejectedOrderIds
          );
          report.rescanOrderDetails = await fetchOrders(
            report.rescanOrderIds
          );
          report.placeOrderDetails = await fetchOrders(
            report.placeOrderIds
          );
          report.accessoriesPendingOrderDetails = await fetchOrders(
            report.accessoriesPendingOrderIds
          );
        }
      }
      res.status(200).json({ data: reports, total: total[0]?.count || 0 });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to fetch daily reports" });
    }
  },
  // Get today's daily report(s) for a particular QA
  async getTodaysDailyReport(req, res) {
    try {
      const { qaId } = req.query;
      if (!qaId) return res.status(400).json({ error: "qaId is required" });
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const reports = await db.select().from(qaDailyReportSchema).where(
        and5(
          eq12(qaDailyReportSchema.qaId, qaId),
          sql5`${qaDailyReportSchema.createdAt} >= ${today.toISOString()} AND ${qaDailyReportSchema.createdAt} < ${tomorrow.toISOString()}`
        )
      );
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({
        error: error.message || "Failed to fetch today's daily report"
      });
    }
  },
  // Get daily reports by filter (monthly, yearly, or custom date range, with pagination)
  async getFilteredDailyReports(req, res) {
    try {
      const {
        qaId,
        month,
        year,
        startDate,
        endDate,
        page = 1,
        pageSize = 20
      } = req.body;
      const offset = (Number(page) - 1) * Number(pageSize);
      const conditions = [];
      if (qaId) {
        conditions.push(eq12(qaDailyReportSchema.qaId, qaId));
      }
      if (month && year) {
        conditions.push(
          sql5`EXTRACT(MONTH FROM ${qaDailyReportSchema.reportDate}) = ${Number(
            month
          )}`
        );
        conditions.push(
          sql5`EXTRACT(YEAR FROM ${qaDailyReportSchema.reportDate}) = ${Number(
            year
          )}`
        );
      } else if (startDate && endDate) {
        conditions.push(
          sql5`${qaDailyReportSchema.reportDate} BETWEEN ${startDate} AND ${endDate}`
        );
      } else if (year) {
        conditions.push(
          sql5`EXTRACT(YEAR FROM ${qaDailyReportSchema.reportDate}) = ${Number(
            year
          )}`
        );
      }
      const whereClause = conditions.length > 1 ? sql5`${sql5.join(conditions, sql5` AND `)}` : conditions[0];
      const reports = await db.select().from(qaDailyReportSchema).where(whereClause).offset(offset).limit(Number(pageSize));
      const total = await db.select({ count: sql5`count(*)` }).from(qaDailyReportSchema).where(whereClause);
      res.status(200).json({ data: reports, total: total[0]?.count || 0 });
    } catch (error) {
      res.status(500).json({
        error: error.message || "Failed to fetch filtered daily reports"
      });
    }
  }
};

// server/src/qa/qaRoute.ts
var setupQaRoutes = (app2) => {
  app2.post("/api/qa/register", qaController.registerQa);
  app2.post("/api/qa/login", qaController.loginQa);
  app2.post("/api/qa/logout", qaController.logoutQa);
  app2.delete("/api/qa/:id", qaController.deleteQa);
  app2.post("/api/qa/daily-report", qaController.submitDailyReport);
  app2.get("/api/qa/daily-report/today", qaController.getTodaysDailyReport);
  app2.get("/api/qa/daily-report", qaController.getAllDailyReports);
  app2.post("/api/qa/daily-report/filter", qaController.getFilteredDailyReports);
};

// server/src/orderHistory/orderHistorySchema.ts
import { pgTable as pgTable18, uuid as uuid18, text as text16, jsonb as jsonb14, timestamp as timestamp12 } from "drizzle-orm/pg-core";
var orderHistorySchema = pgTable18("order_history", {
  id: uuid18("id").primaryKey().defaultRandom(),
  orderId: text16("order_id"),
  history: jsonb14("history").default([]),
  // stores list as JSON array
  updatedBy: text16("updated_by"),
  updatedAt: timestamp12("updated_at").defaultNow()
});

// server/src/orderHistory/orderHistoryController.ts
import { eq as eq13 } from "drizzle-orm";
var orderHistoryController = {
  // Create or append to order history
  async createOrderHistory(req, res) {
    try {
      const { orderId, historyEntry, updatedBy } = req.body;
      if (!orderId || !historyEntry) {
        return res.status(400).json({ error: "orderId and historyEntry are required" });
      }
      const [created] = await db.insert(orderHistorySchema).values({
        orderId,
        history: [historyEntry],
        updatedBy: updatedBy || null,
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to create order history" });
    }
  },
  // Get order history by orderId
  async getOrderHistory(req, res) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ error: "orderId is required" });
      }
      const [history] = await db.select().from(orderHistorySchema).where(eq13(orderHistorySchema.orderId, orderId));
      if (!history) {
        return res.status(404).json({ error: "Order history not found" });
      }
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to fetch order history" });
    }
  }
};

// server/src/orderHistory/orderHistoryRoute.ts
var setupOrderHistoryRoutes = (app2) => {
  app2.post("/api/order-history", orderHistoryController.createOrderHistory);
  app2.get("/api/order-history/:orderId", orderHistoryController.getOrderHistory);
};

// server/storage.ts
import { z as z4 } from "zod";
var teamMemberInsertSchema = z4.object({
  fullName: z4.string().min(1, "Full name is required"),
  email: z4.string().email("Invalid email format").optional(),
  contactNumber: z4.string().optional(),
  profilePicture: z4.string().optional(),
  role: z4.string().min(1, "Role is required"),
  permissions: z4.array(z4.string()).default([]),
  status: z4.string().default("active"),
  password: z4.string().optional(),
  clinicName: z4.string().optional()
});
var teamMemberUpdateSchema = z4.object({
  fullName: z4.string().min(1, "Full name is required").optional(),
  email: z4.string().email("Invalid email format").optional(),
  contactNumber: z4.string().optional(),
  profilePicture: z4.string().optional(),
  role: z4.string().min(1, "Role is required").optional(),
  permissions: z4.array(z4.string()).optional(),
  status: z4.string().optional(),
  password: z4.string().optional(),
  clinicName: z4.string().optional()
});
var DatabaseStorage = class {
  async getProducts() {
    return await db.select().from(products);
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      done(null, { username });
    })
  );
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  app2.get("/api/wifi", async (req, res) => {
    const expectedWifiName = "DentalCareWiFi";
    const userWifiName = req.query.name;
    if (typeof userWifiName !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'name' query parameter" });
    }
    const isMatch = userWifiName === expectedWifiName;
    res.json({ result: isMatch });
  });
  setupAuthenticationRoutes(app2);
  setupChatRoutes(app2);
  setupClinicRoutes(app2);
  setupQaRoutes(app2);
  setupLifeCycleRoutes(app2);
  setupMessageRoutes(app2);
  setupOrderHistoryRoutes(app2);
  setupOrderRoutes(app2);
  setupTeamMemberRoutes(app2);
  setuRoleRoutes(app2);
  setupDraftOrderRoutes(app2);
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
import { createServer as createServer2 } from "http";
import dotenv2 from "dotenv";

// server/src/middleWare/middleWare.ts
import jwt3 from "jsonwebtoken";
var JWT_SECRET2 = process.env.JWT_SECRET || "your_jwt_secret_key";
function authMiddleware(req, res, next) {
  console.log(req.path);
  if (req.path === "/login" || req.path === "/register" || req.path === "/wifi" || req.path === "/qa/login" || req.path === "/prescriptions/16ca5d24-1dd5-41f7-b3d8-5c3d04cafff6/icon") {
    return next();
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Enter Authorization Token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt3.verify(token, JWT_SECRET2);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// server/socket/socket.ts
import { Server } from "socket.io";
import { eq as eq14 } from "drizzle-orm";
function setupSocket(httpServer2, app2) {
  const io = new Server(httpServer2, {
    cors: {
      origin: ["http://localhost:5000", "http://192.168.29.46:5000"],
      methods: ["GET", "POST"]
    }
  });
  const userSocketMap2 = /* @__PURE__ */ new Map();
  const activeChatUsers = /* @__PURE__ */ new Map();
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("register-user", (userId) => {
      if (userId) {
        userSocketMap2.set(userId, socket.id);
        socket.userId = userId;
        console.log(`Current userSocketMap entries:`, Array.from(userSocketMap2.entries()));
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
        const savedMessage = await messageStorage.createMessage({
          ...data.message,
          chatId: data.chatId
        });
        console.log("savedMessage", savedMessage);
        await db.update(chats).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq14(chats.id, data.chatId));
        console.log("updatedChat");
        io.to(`chat-${data.chatId}`).emit("new-message", {
          chatId: data.chatId,
          message: savedMessage
        });
        const activeUsersInThisChat = activeChatUsers.get(data.chatId) || /* @__PURE__ */ new Set();
        const teamMembers2 = await teamMemberStorage.getTeamMembers();
        const clinics = await clinicStorage.getClinics();
        const allUsers = [
          ...teamMembers2.map((member) => ({
            id: member.fullName,
            type: "team_member",
            permissions: member.permissions || []
          })),
          ...clinics.map((clinic2) => ({
            id: `${clinic2?.firstname} ${clinic2?.lastname}`,
            type: "clinic",
            permissions: clinic2.permissions || []
          }))
        ];
        allUsers.forEach(async (user) => {
          const userId = user.id;
          if (userId && userId !== savedMessage.sender && !activeUsersInThisChat.has(userId)) {
            const socketId = userSocketMap2.get(userId);
            if (socketId) {
              const unreadCount = await messageStorage.getUnreadMessageCount(data.chatId, userId);
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
        userSocketMap2.delete(userId);
        activeChatUsers.forEach((users) => users.delete(userId));
        console.log(`User ${userId} disconnected and unregistered.`);
      }
      console.log("User disconnected:", socket.id);
    });
  });
  app2.io = io;
  app2.userSocketMap = userSocketMap2;
}

// server/index.ts
import path3 from "path";
import { fileURLToPath } from "url";

// server/sub/subPrescriptionRoute.tsx
import { Router as Router2 } from "express";

// server/sub/subPrescriptionSchema.tsx
import { z as z5 } from "zod";
import { pgTable as pgTable19, text as text17, jsonb as jsonb15, uuid as uuid19, customType as customType2 } from "drizzle-orm/pg-core";
var bytea2 = customType2({
  dataType() {
    return "bytea";
  }
});
var subPrescriptionSchema = z5.object({
  id: z5.string().uuid().optional(),
  name: z5.string().max(255),
  icon: z5.any().nullable(),
  // Accept Buffer or null
  iconMimeType: z5.string().nullable(),
  // Accept MIME type as string
  prescriptionId: z5.string().uuid(),
  description: z5.string().nullable(),
  style: z5.any().optional()
  // JSONB can be any valid JSON
});
var subPrescription = pgTable19("sub_prescription", {
  id: uuid19("id").primaryKey().defaultRandom(),
  name: text17("name"),
  icon: bytea2("icon"),
  iconMimeType: text17("icon_mime_type"),
  prescriptionId: text17("prescription_id"),
  description: text17("description"),
  style: jsonb15("style")
});

// server/src/prescription/prescriptionSchema.ts
import { z as z6 } from "zod";
import { pgTable as pgTable20, text as text18, jsonb as jsonb16, uuid as uuid20, customType as customType3 } from "drizzle-orm/pg-core";
var bytea3 = customType3({
  dataType() {
    return "bytea";
  }
});
var prescriptionSchema = z6.object({
  id: z6.string().uuid().optional(),
  name: z6.string().max(255),
  icon: z6.any().nullable(),
  // Accept Buffer or null
  iconMimeType: z6.string().nullable(),
  // Accept MIME type as string
  description: z6.string().nullable(),
  style: z6.any().optional()
  // JSONB can be any valid JSON
});
var prescription = pgTable20("prescription", {
  id: uuid20("id").primaryKey().defaultRandom(),
  name: text18("name").notNull(),
  icon: bytea3("icon"),
  iconMimeType: text18("icon_mime_type"),
  description: text18("description"),
  style: jsonb16("style")
});

// server/sub/subPrescriptionController.tsx
import { eq as eq15 } from "drizzle-orm";
var getAllSubPrescriptions = async (req, res) => {
  try {
    const subPrescriptions = await db.select().from(subPrescription);
    const baseUrl = req.protocol + "://" + req.get("host");
    const subPrescriptionsWithIconUrl = subPrescriptions.map((p) => {
      let hasIcon = false;
      if (p.icon) {
        if (typeof p.icon === "string") {
          hasIcon = p.icon.length > 0;
        } else if (p.icon instanceof Buffer) {
          hasIcon = p.icon.length > 0;
        }
      }
      return {
        ...p,
        iconUrl: hasIcon ? `${baseUrl}/api/sub-prescriptions/${p.id}/icon` : null
      };
    });
    res.json(subPrescriptionsWithIconUrl);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sub-prescriptions", details: error.message });
  }
};
var createSubPrescription = async (req, res) => {
  try {
    let icon = null;
    let iconMimeType = null;
    if (req.file) {
      icon = req.file.buffer.toString("base64");
      iconMimeType = req.file.mimetype;
    } else if (typeof req.body.icon === "string") {
      icon = Buffer.from(req.body.icon, "utf-8").toString("base64");
      iconMimeType = "image/svg+xml";
    }
    const data = { ...req.body, icon, iconMimeType };
    const prescriptionId = data.prescriptionId;
    const prescriptionExists = await db.select().from(prescription).where(eq15(prescription.id, prescriptionId));
    if (!prescriptionExists.length) {
      return res.status(400).json({ error: "Invalid prescriptionId: not found" });
    }
    const parseResult = subPrescriptionSchema.safeParse(data);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const insertData = parseResult.data;
    const [newSubPrescription] = await db.insert(subPrescription).values(insertData).returning();
    res.status(201).json(newSubPrescription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sub-prescription", details: error.message });
  }
};
var updateSubPrescription = async (req, res) => {
  const { id } = req.params;
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.icon = req.file.buffer;
      updateData.iconMimeType = req.file.mimetype;
    } else if (req.body.icon) {
      if (typeof req.body.icon === "string" && req.body.icon.startsWith("data:")) {
        const matches = req.body.icon.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          updateData.icon = Buffer.from(matches[2], "base64");
          updateData.iconMimeType = matches[1];
        }
      } else if (typeof req.body.icon === "string") {
        updateData.icon = Buffer.from(req.body.icon, "base64");
        updateData.iconMimeType = req.body.iconMimeType || "image/png";
      }
    }
    const parseResult = subPrescriptionSchema.partial().safeParse(updateData);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    Object.keys(updateData).forEach((key) => updateData[key] === void 0 && delete updateData[key]);
    const result = await db.update(subPrescription).set(updateData).where(eq15(subPrescription.id, id)).returning();
    if (!result[0]) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating sub-prescription", details: error.message });
  }
};
var deleteSubPrescription = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete(subPrescription).where(eq15(subPrescription.id, id));
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(204).send({ message: "Sub-prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sub-prescription", details: error.message });
  }
};

// server/sub/subPrescriptionRoute.tsx
import multer from "multer";
import { eq as eq16 } from "drizzle-orm";
var router = Router2();
var upload = multer({ storage: multer.memoryStorage() });
router.get("/", getAllSubPrescriptions);
router.get("/:id/icon", async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(subPrescription).where(eq16(subPrescription.id, id));
  const subPres = result[0];
  if (!subPres || !subPres.icon) {
    return res.status(404).send("Not found");
  }
  let iconBuffer;
  if (typeof subPres.icon === "string") {
    iconBuffer = Buffer.from(subPres.icon, "base64");
  } else if (subPres.icon instanceof Buffer) {
    iconBuffer = subPres.icon;
  } else {
    return res.status(400).send("Invalid icon data");
  }
  const mimeType = subPres.iconMimeType || "image/png";
  res.setHeader("Content-Type", mimeType);
  res.send(iconBuffer);
});
router.post("/", upload.single("icon"), createSubPrescription);
router.patch("/:id", upload.single("icon"), updateSubPrescription);
router.delete("/:id", deleteSubPrescription);
function setupSubPrescriptionRoutes(app2) {
  app2.use("/api/sub-prescriptions", router);
}

// server/src/prescription/prescriptionRoute.ts
import { Router as Router3 } from "express";

// server/src/prescription/prescriptionController.ts
import { eq as eq17 } from "drizzle-orm";
var prescriptions = [];
var getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions2 = await db.select().from(prescription);
    const baseUrl = req.protocol + "://" + req.get("host");
    const prescriptionsWithIconUrl = prescriptions2.map((p) => {
      let hasIcon = false;
      if (p.icon) {
        if (typeof p.icon === "string") {
          hasIcon = p.icon.length > 0;
        } else if (p.icon instanceof Buffer) {
          hasIcon = p.icon.length > 0;
        }
      }
      return {
        ...p,
        iconUrl: hasIcon ? `${baseUrl}/api/prescriptions/${p.id}/icon` : null
      };
    });
    res.json(prescriptionsWithIconUrl);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", details: error.message });
  }
};
var getPrescriptionById = (req, res) => {
  const { id } = req.params;
  const prescription2 = prescriptions.find((p) => p.id === id);
  if (!prescription2) return res.status(404).json({ message: "Not found" });
  res.json(prescription2);
};
var createPrescription = async (req, res) => {
  try {
    let icon = null;
    let iconMimeType = null;
    if (req.file) {
      icon = req.file.buffer.toString("base64");
      iconMimeType = req.file.mimetype;
    } else if (typeof req.body.icon === "string") {
      icon = Buffer.from(req.body.icon, "utf-8").toString("base64");
      iconMimeType = "image/svg+xml";
    }
    const data = { ...req.body, icon, iconMimeType };
    const parseResult = prescriptionSchema.safeParse(data);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const insertData = parseResult.data;
    const [newPrescription] = await db.insert(prescription).values(insertData).returning();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create prescription", details: error.message });
  }
};
var updatePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.icon = req.file.buffer;
      updateData.iconMimeType = req.file.mimetype;
    } else if (req.body.icon) {
      if (typeof req.body.icon === "string" && req.body.icon.startsWith("data:")) {
        const matches = req.body.icon.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          updateData.icon = Buffer.from(matches[2], "base64");
          updateData.iconMimeType = matches[1];
        }
      } else if (typeof req.body.icon === "string") {
        updateData.icon = Buffer.from(req.body.icon, "base64");
        updateData.iconMimeType = req.body.iconMimeType || "image/png";
      }
    }
    const parseResult = prescriptionSchema.partial().safeParse(updateData);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    Object.keys(updateData).forEach((key) => updateData[key] === void 0 && delete updateData[key]);
    const result = await db.update(prescription).set(updateData).where(eq17(prescription.id, id)).returning();
    if (!result[0]) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating prescription", details: error.message });
  }
};
var deletePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete(prescription).where(eq17(prescription.id, id));
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(204).send({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting prescription", details: error.message });
  }
};

// server/src/prescription/prescriptionRoute.ts
import multer2 from "multer";
import { eq as eq18 } from "drizzle-orm";
var router2 = Router3();
var upload2 = multer2({ storage: multer2.memoryStorage() });
router2.get("/", getAllPrescriptions);
router2.get("/:id", getPrescriptionById);
router2.get("/:id/icon", async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(prescription).where(eq18(prescription.id, id));
  const pres = result[0];
  if (!pres || !pres.icon) {
    return res.status(404).send("Not found");
  }
  let iconBuffer;
  if (typeof pres.icon === "string") {
    iconBuffer = Buffer.from(pres.icon, "base64");
  } else if (pres.icon instanceof Buffer) {
    iconBuffer = pres.icon;
  } else {
    return res.status(400).send("Invalid icon data");
  }
  const mimeType = pres.iconMimeType || "image/png";
  res.setHeader("Content-Type", mimeType);
  res.send(iconBuffer);
});
router2.post("/", upload2.single("icon"), createPrescription);
router2.patch("/:id", upload2.single("icon"), updatePrescription);
router2.delete("/:id", deletePrescription);
function setupPrescriptionRoutes(app2) {
  app2.use("/api/prescriptions", router2);
}

// server/src/technician/technicianRoute.ts
import { Router as Router4 } from "express";
import multer3 from "multer";

// server/src/technician/technicianController.ts
import { and as and6, eq as eq19 } from "drizzle-orm";
import bcrypt4 from "bcrypt";
import jwt4 from "jsonwebtoken";
var JWT_SECRET3 = process.env.JWT_SECRET || "your_jwt_secret_key";
var TechnicianStorage = class {
  async getTechnicianByEmail(email) {
    const [technician] = await db.select().from(technicianUser).where(eq19(technicianUser.email, email));
    return technician;
  }
  async getTechnicianByMobileNumber(mobileNumber) {
    const [technician] = await db.select().from(technicianUser).where(eq19(technicianUser.mobileNumber, mobileNumber));
    return technician;
  }
  async getTechnicianByEmployeeId(employeeId) {
    const [technician] = await db.select().from(technicianUser).where(eq19(technicianUser.employeeId, employeeId));
    return technician;
  }
  async getTechnicianById(id) {
    const [technician] = await db.select().from(technicianUser).where(eq19(technicianUser.id, id));
    return technician;
  }
  async createTechnician(data) {
    const [newTechnician] = await db.insert(technicianUser).values(data).returning();
    return newTechnician;
  }
  async updateTechnician(id, updates) {
    const [updatedTechnician] = await db.update(technicianUser).set(updates).where(eq19(technicianUser.id, id)).returning();
    return updatedTechnician;
  }
  async deleteTechnician(id) {
    const [deletedTechnician] = await db.delete(technicianUser).where(eq19(technicianUser.id, id)).returning();
    return deletedTechnician;
  }
};
var technicianStorage = new TechnicianStorage();
async function registerTechnician(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      departmentId,
      employeeId,
      password
    } = req.body;
    const existingEmail = await technicianStorage.getTechnicianByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingMobile = await technicianStorage.getTechnicianByMobileNumber(
      mobileNumber
    );
    if (existingMobile) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }
    const existingEmployeeId = await technicianStorage.getTechnicianByEmployeeId(employeeId);
    if (existingEmployeeId) {
      return res.status(400).json({ error: "Employee ID already exists" });
    }
    const technicianRoleName = "technician";
    const roleData = await RolesStorage.getRoleByName(technicianRoleName);
    const roleId = roleData?.id;
    let profilePic = void 0;
    let profilePicMimeType = void 0;
    if (req.file) {
      profilePic = req.file.buffer.toString("base64");
      profilePicMimeType = req.file.mimetype;
    }
    const hashedPassword = await bcrypt4.hash(password, 10);
    const newTechnician = await technicianStorage.createTechnician({
      firstName,
      lastName,
      email,
      mobileNumber,
      departmentId,
      roleId,
      employeeId,
      password: hashedPassword,
      profilePic,
      profilePicMimeType
    });
    return res.status(201).json({ id: newTechnician.id, email: newTechnician.email });
  } catch (error) {
    console.error("Technician registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}
async function loginTechnician(req, res) {
  try {
    const { mobileNumber, password } = req.body;
    if (!mobileNumber || !password) {
      return res.status(400).json({ error: "Mobile number and password are required" });
    }
    const technician = await technicianStorage.getTechnicianByMobileNumber(
      mobileNumber
    );
    if (!technician) {
      return res.status(401).json({ error: "Technician not found" });
    }
    const isPasswordValid = await bcrypt4.compare(
      password,
      technician.password || ""
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt4.sign({ id: technician.id }, JWT_SECRET3, {
      expiresIn: "7d"
    });
    return res.json({ token });
  } catch (error) {
    console.error("Technician login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}
async function updateTechnician(req, res) {
  try {
    const { id } = req.params;
    let updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt4.hash(updates.password, 10);
    }
    if (req.file) {
      updates.profilePic = req.file.buffer.toString("base64");
      updates.profilePicMimeType = req.file.mimetype;
    }
    const updatedTechnician = await technicianStorage.updateTechnician(
      id,
      updates
    );
    if (!updatedTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    return res.json({
      message: "Technician updated successfully",
      updatedTechnician
    });
  } catch (error) {
    console.error("Technician update error:", error);
    return res.status(500).json({ error: "Update failed" });
  }
}
async function deleteTechnician(req, res) {
  try {
    const { id } = req.params;
    const deletedTechnician = await technicianStorage.deleteTechnician(id);
    if (!deletedTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    return res.json({
      message: "Technician deleted successfully",
      deletedTechnician
    });
  } catch (error) {
    console.error("Technician delete error:", error);
    return res.status(500).json({ error: "Delete failed" });
  }
}
async function getTechnicianById(req, res) {
  try {
    const { id } = req.params;
    const technician = await technicianStorage.getTechnicianById(id);
    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    let profilePicUrl = null;
    if (technician.profilePic) {
      const baseUrl = req.protocol + "://" + req.get("host");
      profilePicUrl = `${baseUrl}/api/technician/${technician.id}/profile-pic`;
    }
    const role2 = await RolesStorage.getRoleById(technician.roleId);
    return res.json({
      ...technician,
      profilePic: profilePicUrl,
      roleName: role2?.name
    });
  } catch (error) {
    console.error("Get technician by id error:", error);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
async function getTechnicianProfilePic(req, res) {
  try {
    const { id } = req.params;
    const technician = await technicianStorage.getTechnicianById(id);
    if (!technician || !technician.profilePic) {
      return res.status(404).send("Not found");
    }
    const buffer = Buffer.from(technician.profilePic, "base64");
    const mimeType = technician.profilePicMimeType || "image/png";
    res.setHeader("Content-Type", mimeType);
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error serving profile pic");
  }
}
async function getAssignedOrders(req, res) {
  try {
    const { technicianId } = req.params;
    if (!technicianId) {
      return res.status(400).json({ error: "Technician ID is required" });
    }
    const assignedOrders = await db.select({
      flowId: orderFlowSchema.id,
      orderId: orderFlowSchema.orderId,
      status: orderFlowSchema.status,
      orderNumber: labOrderSchema.orderNumber,
      priority: labOrderSchema.priority,
      dueDate: labOrderSchema.dueDate,
      createdAt: labOrderSchema.createdAt
    }).from(orderFlowSchema).innerJoin(labOrderSchema, eq19(orderFlowSchema.orderId, labOrderSchema.id)).where(
      and6(
        eq19(orderFlowSchema.technicianId, technicianId),
        eq19(orderFlowSchema.status, "assigned_pending"),
        eq19(orderFlowSchema.isCurrent, true)
      )
    );
    return res.status(200).json({
      message: "Assigned orders retrieved successfully",
      data: assignedOrders
    });
  } catch (error) {
    console.error("Error getting assigned orders:", error);
    return res.status(500).json({ error: "Failed to get assigned orders" });
  }
}
async function acceptAssignment(req, res) {
  try {
    const { orderId } = req.params;
    const { technicianId } = req.body;
    if (!technicianId || !orderId) {
      return res.status(400).json({ error: "Order ID and Technician ID are required" });
    }
    await db.update(orderFlowSchema).set({ status: "in_progress" }).where(
      and6(
        eq19(orderFlowSchema.orderId, orderId),
        eq19(orderFlowSchema.technicianId, technicianId),
        eq19(orderFlowSchema.isCurrent, true)
      )
    );
    return res.status(200).json({
      message: "Order marked as in progress"
    });
  } catch (error) {
    console.error("Error accepting assignment:", error);
    return res.status(500).json({ error: "Failed to accept assignment" });
  }
}
async function markAsCompleted(req, res) {
  try {
    const { orderId } = req.params;
    const { technicianId } = req.body;
    if (!technicianId || !orderId) {
      return res.status(400).json({ error: "Order ID and Technician ID are required" });
    }
    await db.update(orderFlowSchema).set({ status: "outward_pending" }).where(
      and6(
        eq19(orderFlowSchema.orderId, orderId),
        eq19(orderFlowSchema.technicianId, technicianId),
        eq19(orderFlowSchema.isCurrent, true),
        eq19(orderFlowSchema.status, "in_progress")
      )
    );
    return res.status(200).json({
      message: "Order marked as completed (outward pending)"
    });
  } catch (error) {
    console.error("Error marking order as completed:", error);
    return res.status(500).json({ error: "Failed to mark order as completed" });
  }
}

// server/src/technician/technicianRoute.ts
var technicianRouter = Router4();
var upload3 = multer3({ storage: multer3.memoryStorage() });
technicianRouter.post(
  "/register",
  upload3.single("profilePic"),
  registerTechnician
);
technicianRouter.post("/login", loginTechnician);
technicianRouter.patch("/:id", upload3.single("profilePic"), updateTechnician);
technicianRouter.delete("/:id", deleteTechnician);
technicianRouter.get("/:id", getTechnicianById);
technicianRouter.get("/:id/profile-pic", getTechnicianProfilePic);
technicianRouter.get("/assigned/:technicianId", getAssignedOrders);
technicianRouter.post("/accept/:orderId", acceptAssignment);
technicianRouter.post("/complete/:orderId", markAsCompleted);
function setupTechnicianRoutes(app2) {
  app2.use("/api/technician", technicianRouter);
}

// server/src/attendence/attendenceRoute.ts
import { Router as Router5 } from "express";

// server/src/attendence/attendenceSchema.ts
import { pgTable as pgTable21, text as text19, uuid as uuid21 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema10 } from "drizzle-zod";
var attendance = pgTable21("attendance", {
  id: uuid21("id").primaryKey().defaultRandom(),
  techId: text19("tech_id").notNull(),
  inTime: text19("in").notNull(),
  outTime: text19("out"),
  totalHours: text19("total_hours")
});
var insertAttendanceSchema = createInsertSchema10(attendance).omit({
  id: true
});

// server/src/attendence/attendenceController.ts
import { eq as eq20, and as and7, isNull } from "drizzle-orm";
import dayjs from "dayjs";
async function checkIn(req, res) {
  try {
    const { tech_id } = req.body;
    if (!tech_id) return res.status(400).json({ error: "tech_id is required" });
    const now = /* @__PURE__ */ new Date();
    const formattedInTime = dayjs(now).format("hh:mm A");
    const [row] = await db.insert(attendance).values({ techId: tech_id, inTime: formattedInTime }).returning();
    return res.status(201).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
}
async function checkOut(req, res) {
  try {
    const { tech_id } = req.body;
    if (!tech_id) return res.status(400).json({ error: "tech_id is required" });
    const [row] = await db.select().from(attendance).where(and7(
      eq20(attendance.techId, tech_id),
      isNull(attendance.outTime)
    ));
    if (!row) return res.status(404).json({ error: "No check-in found for today" });
    const outTime = /* @__PURE__ */ new Date();
    const formattedOutTime = dayjs(outTime).format("hh:mm A");
    const today = dayjs().format("YYYY-MM-DD");
    const inTimeObj = dayjs(`${today} ${row.inTime}`, "YYYY-MM-DD hh:mm A");
    const outTimeObj = dayjs(`${today} ${formattedOutTime}`, "YYYY-MM-DD hh:mm A");
    let diffMin = outTimeObj.diff(inTimeObj, "minute");
    let totalHours = "";
    if (isNaN(diffMin) || diffMin < 0) {
      totalHours = "0 min";
    } else if (diffMin < 60) {
      totalHours = `${diffMin} min`;
    } else {
      const hours = Math.floor(diffMin / 60);
      const mins = diffMin % 60;
      totalHours = mins === 0 ? `${hours} hour` : `${hours} hour ${mins} min`;
    }
    const [updated] = await db.update(attendance).set({ outTime: formattedOutTime, totalHours }).where(eq20(attendance.id, row.id)).returning();
    return res.status(200).json(updated);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
}

// server/src/attendence/attendenceRoute.ts
var attendanceRouter = Router5();
attendanceRouter.post("/checkin", checkIn);
attendanceRouter.post("/checkout", checkOut);
function setupAttendanceRoutes(app2) {
  app2.use("/api/attendance", attendanceRouter);
}

// server/src/leaveRequest/leaveRequestRoute.ts
import { Router as Router6 } from "express";

// server/src/leaveRequest/leaveRequestSchema.ts
import { pgTable as pgTable22, text as text20, uuid as uuid22 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema11 } from "drizzle-zod";
var leaveRequest = pgTable22("leave_request", {
  id: uuid22("id").primaryKey().defaultRandom(),
  techId: text20("tech_id"),
  leaveType: text20("leave_type"),
  leaveDate: text20("leave_date"),
  leaveTime: text20("leave_time"),
  reason: text20("reason"),
  leaveStatus: text20("leave_status")
});
var insertLeaveRequestSchema = createInsertSchema11(leaveRequest).omit({
  id: true
});

// server/src/leaveRequest/leaveRequestController.ts
import { eq as eq21 } from "drizzle-orm";
async function createLeaveRequest(req, res) {
  try {
    const { tech_id, leave_type, leave_date, leave_time, reason } = req.body;
    if (!tech_id || !leave_type || !leave_date || !leave_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [row] = await db.insert(leaveRequest).values({
      techId: tech_id,
      leaveType: leave_type,
      leaveDate: leave_date,
      leaveTime: leave_time,
      reason
    }).returning();
    return res.status(201).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
}
async function updateLeaveStatus(req, res) {
  try {
    const { id } = req.params;
    const { leave_status } = req.body;
    if (!leave_status) return res.status(400).json({ error: "leave_status is required" });
    const [row] = await db.update(leaveRequest).set({ leaveStatus: leave_status }).where(eq21(leaveRequest.id, id)).returning();
    if (!row) return res.status(404).json({ error: "Leave request not found" });
    return res.status(200).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
}
async function getAllLeaveRequests(req, res) {
  try {
    const rows = await db.select().from(leaveRequest);
    return res.status(200).json(rows);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
}
async function getLeaveRequestById(req, res) {
  try {
    const { id } = req.params;
    const [row] = await db.select().from(leaveRequest).where(eq21(leaveRequest.id, id));
    if (!row) return res.status(404).json({ error: "Leave request not found" });
    return res.status(200).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
}

// server/src/leaveRequest/leaveRequestRoute.ts
var leaveRequestRouter = Router6();
leaveRequestRouter.post("/", createLeaveRequest);
leaveRequestRouter.patch("/:id/status", updateLeaveStatus);
leaveRequestRouter.get("/", getAllLeaveRequests);
leaveRequestRouter.get("/:id", getLeaveRequestById);
function setupLeaveRequestRoutes(app2) {
  app2.use("/api/leave-request", leaveRequestRouter);
}

// server/src/departmentHead/departmentHeadRoute.ts
import { Router as Router7 } from "express";

// server/src/departmentHead/departmentHeadController.ts
import { and as and8, eq as eq22, isNull as isNull2, sql as sql6 } from "drizzle-orm";
import bcrypt5 from "bcrypt";
import jwt5 from "jsonwebtoken";
var JWT_SECRET4 = process.env.JWT_SECRET;
function normalizeToArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}
var departmentHeadController = {
  // Create Department Head (admin/seed)
  async create(req, res) {
    try {
      const { name, email, password, roleId } = req.body;
      let departmentIds = normalizeToArray(req.body.departmentIds);
      if (!name || !email || !password || !roleId || !departmentIds.length) {
        return res.status(400).json({
          error: "Missing required fields: name, email, password, roleId, and at least one departmentId are required"
        });
      }
      const existingUser = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.email, email));
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }
      if (departmentIds.length > 0) {
        const allDepartmentHeads = await db.select().from(departmentHeadSchema);
        for (const deptId of departmentIds) {
          for (const existingHead of allDepartmentHeads) {
            const headDepts = normalizeToArray(existingHead.departmentIds);
            if (headDepts.includes(deptId)) {
              return res.status(409).json({
                error: `Department with ID ${deptId} is already assigned to department head: ${existingHead.name}`
              });
            }
          }
        }
      }
      const hashedPassword = await bcrypt5.hash(password, 10);
      const [created] = await db.insert(departmentHeadSchema).values({
        name,
        email,
        password: hashedPassword,
        roleId,
        departmentIds
      }).returning();
      res.status(201).json({
        message: "Department head created successfully",
        user: {
          id: created.id,
          name: created.name,
          email: created.email,
          roleId: created.roleId,
          departmentIds: created.departmentIds,
          isActive: created.isActive
        }
      });
    } catch (error) {
      console.error("Error creating department head:", error);
      res.status(500).json({ error: "Failed to create department head" });
    }
  },
  // Login Department Head
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required"
        });
      }
      const [user] = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.email, email));
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password"
        });
      }
      if (!user.isActive) {
        return res.status(401).json({
          error: "Account is deactivated. Please contact administrator."
        });
      }
      const validPassword = await bcrypt5.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          error: "Invalid email or password"
        });
      }
      if (!JWT_SECRET4) {
        return res.status(500).json({
          error: "Authentication service is not properly configured. Please contact administrator."
        });
      }
      const token = jwt5.sign(
        {
          email: user.email,
          roleId: user.roleId,
          type: "department_head"
          // Add type for better token management
        },
        JWT_SECRET4
      );
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          departmentIds: user.departmentIds,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error("Error during department head login:", error);
      res.status(500).json({
        error: "Login failed. Please try again."
      });
    }
  },
  // Reset Password
  async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res.status(400).json({
          error: "Email and new password are required"
        });
      }
      const [existingUser] = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.email, email));
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!existingUser.isActive) {
        return res.status(400).json({
          error: "Cannot reset password for deactivated account"
        });
      }
      const hashedPassword = await bcrypt5.hash(newPassword, 10);
      const [updated] = await db.update(departmentHeadSchema).set({
        password: hashedPassword,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq22(departmentHeadSchema.email, email)).returning();
      res.status(200).json({
        message: "Password reset successful",
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          isActive: updated.isActive
        }
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        error: "Failed to reset password. Please try again."
      });
    }
  },
  // Get all Department Heads
  async getAll(_req, res) {
    try {
      const all = await db.select().from(departmentHeadSchema);
      res.status(200).json({
        message: "Department heads retrieved successfully",
        count: all.length,
        data: all
      });
    } catch (error) {
      console.error("Error fetching department heads:", error);
      res.status(500).json({
        error: "Failed to fetch department heads"
      });
    }
  },
  // Get Department Head by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Department head ID is required" });
      }
      const [found] = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.id, id));
      if (!found) {
        return res.status(404).json({ error: "Department head not found" });
      }
      const departmentIds = normalizeToArray(found.departmentIds);
      let departments = [];
      if (departmentIds.length > 0) {
        const departmentPromises = departmentIds.map(async (deptId) => {
          const [dept] = await db.select().from(departmentSchema).where(eq22(departmentSchema.id, deptId));
          return dept;
        });
        departments = await Promise.all(departmentPromises);
        departments = departments.filter((dept) => dept);
      }
      const activeDepartmentId = departmentIds.length > 0 ? departmentIds[0] : null;
      const responseData = {
        ...found,
        departments: departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          isActive: dept.isActive
        })),
        activeDepartmentId
      };
      res.status(200).json({
        message: "Department head retrieved successfully",
        data: responseData
      });
    } catch (error) {
      console.error("Error fetching department head:", error);
      res.status(500).json({
        error: "Failed to fetch department head"
      });
    }
  },
  // Update Department Head
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, roleId, departmentIds, isActive } = req.body;
      const [existingHead] = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.id, id));
      if (!existingHead) {
        return res.status(404).json({ error: "Department head not found" });
      }
      const updateData = {
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (name !== void 0) {
        updateData.name = name;
      }
      if (email !== void 0) {
        if (email !== existingHead.email) {
          const emailExists = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.email, email));
          if (emailExists.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
          }
        }
        updateData.email = email;
      }
      if (roleId !== void 0) {
        updateData.roleId = roleId;
      }
      if (isActive !== void 0) {
        updateData.isActive = isActive;
      }
      if (password !== void 0) {
        updateData.password = await bcrypt5.hash(password, 10);
      }
      if (departmentIds !== void 0) {
        const normalizedDeptIds = normalizeToArray(departmentIds);
        if (normalizedDeptIds.length > 0) {
          const allDepartmentHeads = await db.select().from(departmentHeadSchema);
          for (const deptId of normalizedDeptIds) {
            for (const otherHead of allDepartmentHeads) {
              if (otherHead.id === id) continue;
              const headDepts = normalizeToArray(otherHead.departmentIds);
              if (headDepts.includes(deptId)) {
                return res.status(409).json({
                  error: `Department with ID ${deptId} is already assigned to department head: ${otherHead.name}`
                });
              }
            }
          }
        }
        updateData.departmentIds = normalizedDeptIds;
      }
      const [updated] = await db.update(departmentHeadSchema).set(updateData).where(eq22(departmentHeadSchema.id, id)).returning();
      res.status(200).json({
        message: "Department head updated successfully",
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          roleId: updated.roleId,
          departmentIds: updated.departmentIds,
          isActive: updated.isActive
        }
      });
    } catch (error) {
      console.error("Error updating department head:", error);
      res.status(500).json({ error: "Failed to update department head" });
    }
  },
  // Delete Department Head
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Department head ID is required" });
      }
      const [existingHead] = await db.select().from(departmentHeadSchema).where(eq22(departmentHeadSchema.id, id));
      if (!existingHead) {
        return res.status(404).json({ error: "Department head not found" });
      }
      const [deleted] = await db.delete(departmentHeadSchema).where(eq22(departmentHeadSchema.id, id)).returning();
      res.status(200).json({
        message: "Department head deleted successfully",
        deletedUser: {
          id: deleted.id,
          name: deleted.name,
          email: deleted.email
        }
      });
    } catch (error) {
      console.error("Error deleting department head:", error);
      res.status(500).json({
        error: "Failed to delete department head"
      });
    }
  },
  // Get available departments (not assigned to any head)
  async getAvailableDepartments(_req, res) {
    try {
      const allDepartments = await db.select().from(departmentSchema);
      const allDepartmentHeads = await db.select().from(departmentHeadSchema);
      const assignedDepartmentIds = /* @__PURE__ */ new Set();
      allDepartmentHeads.forEach((head) => {
        const headDepts = normalizeToArray(head.departmentIds);
        headDepts.forEach((deptId) => assignedDepartmentIds.add(deptId));
      });
      const availableDepartments = allDepartments.filter(
        (dept) => !assignedDepartmentIds.has(dept.id)
      );
      res.status(200).json({
        message: "Available departments retrieved successfully",
        count: availableDepartments.length,
        data: availableDepartments
      });
    } catch (error) {
      console.error("Error getting available departments:", error);
      res.status(500).json({ error: "Failed to get available departments" });
    }
  },
  // ✅ GET orders assigned to a department and waiting for inward
  async getWaitingInward(req, res) {
    try {
      const { departmentId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      if (!departmentId) {
        return res.status(400).json({ error: "Department ID is required" });
      }
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100"
        });
      }
      const totalCountResult = await db.select({ count: sql6`count(*)` }).from(orderFlowSchema).innerJoin(
        labOrderSchema,
        eq22(orderFlowSchema.orderId, labOrderSchema.orderId)
      ).innerJoin(orderSchema, eq22(labOrderSchema.orderId, orderSchema.id)).where(
        and8(
          eq22(orderFlowSchema.departmentId, departmentId),
          eq22(orderFlowSchema.isCurrent, true),
          eq22(orderFlowSchema.status, "waiting_inward")
        )
      );
      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const waitingOrders = await db.select({
        id: orderFlowSchema.id,
        flowStatus: orderFlowSchema.status,
        orderFlowCreatedAt: orderFlowSchema.createdAt,
        departmentId: orderFlowSchema.departmentId,
        orderId: labOrderSchema.orderId,
        // actual order.id (not lab order id)
        orderNumber: labOrderSchema.orderNumber,
        priority: labOrderSchema.priority,
        dueDate: labOrderSchema.dueDate,
        labCreatedAt: labOrderSchema.createdAt,
        prescriptionTypesId: orderSchema.prescriptionTypesId,
        patientName: sql6`${patients.firstName} || ' ' || ${patients.lastName}`.as(
          "patientName"
        ),
        doctorName: clinicInformation.caseHandleBy,
        clinicName: clinic.clinicName
      }).from(orderFlowSchema).innerJoin(
        labOrderSchema,
        eq22(orderFlowSchema.orderId, labOrderSchema.orderId)
        // join lab_order using flow.orderId
      ).innerJoin(
        orderSchema,
        eq22(labOrderSchema.orderId, orderSchema.id)
        // join orders using lab_order.orderId = orders.id
      ).leftJoin(
        clinicInformation,
        eq22(orderSchema.clinicInformationId, clinicInformation.id)
      ).leftJoin(
        patients,
        eq22(orderSchema.patientId, patients.id)
        // join patient using order.patientId
      ).leftJoin(clinic, eq22(orderSchema.clinicId, clinic.id)).where(
        and8(
          eq22(orderFlowSchema.departmentId, departmentId),
          eq22(orderFlowSchema.isCurrent, true),
          eq22(orderFlowSchema.status, "waiting_inward")
        )
      ).orderBy(orderFlowSchema.createdAt).limit(limit).offset(offset);
      return res.status(200).json({
        message: "Waiting inward orders retrieved successfully",
        data: waitingOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error) {
      console.error("Error getting waiting inward orders:", error);
      return res.status(500).json({ error: "Failed to get waiting inward orders" });
    }
  },
  // ✅ Mark order as inwarded by head
  async inward(req, res) {
    try {
      const { flowId } = req.params;
      const [flow] = await db.select().from(orderFlowSchema).where(eq22(orderFlowSchema.id, flowId));
      if (!flow) return res.status(404).json({ error: "Order flow not found" });
      if (flow.status !== "waiting_inward")
        return res.status(400).json({ error: "Order is not in inward stage" });
      await db.update(orderFlowSchema).set({ status: "inward_pending" }).where(eq22(orderFlowSchema.id, flowId));
      return res.status(200).json({ message: "Order inwarded successfully" });
    } catch (error) {
      console.error("Error in inward:", error);
      res.status(500).json({ error: "Failed to inward order" });
    }
  },
  // ✅ Get orders that are inwarded but not assigned to technician
  async getInwardPending(req, res) {
    try {
      const { departmentId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      if (!departmentId) {
        return res.status(400).json({ error: "Department ID is required" });
      }
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100"
        });
      }
      const totalCountResult = await db.select({ count: sql6`count(*)` }).from(orderFlowSchema).innerJoin(
        labOrderSchema,
        eq22(orderFlowSchema.orderId, labOrderSchema.orderId)
      ).innerJoin(orderSchema, eq22(labOrderSchema.orderId, orderSchema.id)).where(
        and8(
          eq22(orderFlowSchema.departmentId, departmentId),
          eq22(orderFlowSchema.isCurrent, true),
          eq22(orderFlowSchema.status, "inward_pending"),
          isNull2(orderFlowSchema.technicianId)
        )
      );
      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const inwardPendingOrders = await db.select({
        id: orderFlowSchema.id,
        flowStatus: orderFlowSchema.status,
        orderFlowCreatedAt: orderFlowSchema.createdAt,
        departmentId: orderFlowSchema.departmentId,
        technicianId: orderFlowSchema.technicianId,
        orderId: labOrderSchema.orderId,
        // actual order.id (not lab order id)
        orderNumber: labOrderSchema.orderNumber,
        priority: labOrderSchema.priority,
        dueDate: labOrderSchema.dueDate,
        labCreatedAt: labOrderSchema.createdAt,
        prescriptionTypesId: orderSchema.prescriptionTypesId,
        patientName: sql6`${patients.firstName} || ' ' || ${patients.lastName}`.as(
          "patientName"
        ),
        doctorName: clinicInformation.caseHandleBy,
        clinicName: clinic.clinicName
      }).from(orderFlowSchema).innerJoin(
        labOrderSchema,
        eq22(orderFlowSchema.orderId, labOrderSchema.orderId)
        // join lab_order using flow.orderId
      ).innerJoin(
        orderSchema,
        eq22(labOrderSchema.orderId, orderSchema.id)
        // join orders using lab_order.orderId = orders.id
      ).leftJoin(
        clinicInformation,
        eq22(orderSchema.clinicInformationId, clinicInformation.id)
      ).leftJoin(
        patients,
        eq22(orderSchema.patientId, patients.id)
        // join patient using order.patientId
      ).leftJoin(clinic, eq22(orderSchema.clinicId, clinic.id)).where(
        and8(
          eq22(orderFlowSchema.departmentId, departmentId),
          eq22(orderFlowSchema.isCurrent, true),
          eq22(orderFlowSchema.status, "inward_pending"),
          isNull2(orderFlowSchema.technicianId)
        )
      ).orderBy(orderFlowSchema.createdAt).limit(limit).offset(offset);
      return res.status(200).json({
        message: "Inward pending orders retrieved successfully",
        data: inwardPendingOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error) {
      console.error("Error getting inward pending orders:", error);
      return res.status(500).json({ error: "Failed to get inward pending orders" });
    }
  },
  // ✅ Get orders that are inwarded but not assigned to technician
  async getAssignedPending(req, res) {
    try {
      const { departmentId } = req.params;
      const orders = await db.select().from(orderFlowSchema).where(
        and8(
          eq22(orderFlowSchema.departmentId, departmentId),
          eq22(orderFlowSchema.isCurrent, true),
          eq22(orderFlowSchema.status, "inward_pending")
        )
      );
      return res.status(200).json({ message: "Assigned pending orders fetched", data: orders });
    } catch (error) {
      console.error("Error in getAssignedPending:", error);
      res.status(500).json({ error: "Failed to fetch assigned pending orders" });
    }
  },
  // ✅ Assign technician to order
  async assignTechnician(req, res) {
    try {
      const { flowId } = req.params;
      const { technicianId } = req.body;
      const [flow] = await db.select().from(orderFlowSchema).where(eq22(orderFlowSchema.orderId, flowId));
      if (!flow) return res.status(404).json({ error: "Order flow not found" });
      if (flow.status !== "inward_pending")
        return res.status(400).json({ error: "Order not ready for technician assignment" });
      await db.update(orderFlowSchema).set({
        status: "assigned_pending",
        technicianId
      }).where(eq22(orderFlowSchema.id, flowId));
      return res.status(200).json({ message: "Technician assigned successfully" });
    } catch (error) {
      console.error("Error in assignTechnician:", error);
      res.status(500).json({ error: "Failed to assign technician" });
    }
  },
  // ✅ Get orders where technician is assigned but not started
  async getOutwardPending(req, res) {
    try {
      const { departmentId } = req.params;
      const orders = await db.select().from(orderFlowSchema).where(
        and8(
          eq22(orderFlowSchema.departmentId, departmentId),
          eq22(orderFlowSchema.isCurrent, true),
          eq22(orderFlowSchema.status, "outward_pending")
        )
      );
      return res.status(200).json({ message: "Outward pending orders fetched", data: orders });
    } catch (error) {
      console.error("Error in getOutwardPending:", error);
      res.status(500).json({ error: "Failed to fetch outward pending orders" });
    }
  },
  // ✅ Mark the order as outward and create next step for next department
  async outward(req, res) {
    try {
      const { flowId } = req.params;
      const [currentFlow] = await db.select().from(orderFlowSchema).where(eq22(orderFlowSchema.id, flowId));
      if (!currentFlow)
        return res.status(404).json({ error: "Order flow not found" });
      if (currentFlow.status !== "outward_pending")
        return res.status(400).json({ error: "Order is not ready for outward" });
      await db.update(orderFlowSchema).set({ isCurrent: false }).where(eq22(orderFlowSchema.id, flowId));
      const [labOrder] = await db.select().from(labOrderSchema).where(eq22(labOrderSchema.id, currentFlow.orderId));
      if (!labOrder)
        return res.status(404).json({ error: "Lab order not found" });
      const sequence = labOrder.sequence;
      const currentIndex = sequence.findIndex(
        (id) => id === currentFlow.departmentId
      );
      const nextDepartmentId = sequence[currentIndex + 1];
      if (nextDepartmentId) {
        await db.insert(orderFlowSchema).values({
          orderId: currentFlow.orderId,
          departmentId: nextDepartmentId,
          flowStep: currentFlow.flowStep + 1,
          isCurrent: true,
          status: "waiting_inward"
        });
      }
      return res.status(200).json({ message: "Order outwarded successfully" });
    } catch (error) {
      console.error("Error in outward:", error);
      res.status(500).json({ error: "Failed to outward order" });
    }
  }
  // // mnage the order cycle
  // async getWaitingInward(req: Request, res: Response) {
  //   try {
  //     const { departmentId } = req.params;
  //     console.log("departmentId", departmentId);
  //     if (!departmentId) {
  //       return res.status(400).json({ error: "Department ID is required" });
  //     }
  //     // Fetch orders in 'waiting_inward' for the specified department
  //     const waitingOrders = await db
  //       .select({
  //         flowId: orderFlowSchema.id,
  //         orderId: orderFlowSchema.orderId,
  //         departmentId: orderFlowSchema.departmentId,
  //         status: orderFlowSchema.status,
  //         orderNumber: labOrderSchema.orderNumber,
  //         priority: labOrderSchema.priority,
  //         dueDate: labOrderSchema.dueDate,
  //         createdAt: labOrderSchema.createdAt,
  //       })
  //       .from(orderFlowSchema)
  //       .innerJoin(
  //         labOrderSchema,
  //         eq(orderFlowSchema.orderId, labOrderSchema.id)
  //       )
  //       .where(
  //         and(
  //           eq(orderFlowSchema.departmentId, departmentId),
  //           eq(orderFlowSchema.isCurrent, true),
  //           eq(orderFlowSchema.status, "waiting_inward")
  //         )
  //       )
  //       .orderBy(orderFlowSchema.createdAt);
  //     console.log("waitingOrders", waitingOrders);
  //     return res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: waitingOrders,
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     return res
  //       .status(500)
  //       .json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
  // async inward(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
  // async getAssignedPending(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
  // async assignTechnician(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
  // async getOutwardPending(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
  // async outward(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
};

// server/src/middleWare/departmentHeadMiddleware.ts
import jwt6 from "jsonwebtoken";
import { eq as eq23 } from "drizzle-orm";
var JWT_SECRET5 = process.env.JWT_SECRET;
async function departmentHeadAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    const token = authHeader.split(" ")[1];
    if (!JWT_SECRET5) {
      return res.status(500).json({ error: "Authentication service not configured" });
    }
    const decoded = jwt6.verify(token, JWT_SECRET5);
    if (!decoded.email || !decoded.type) {
      return res.status(401).json({ error: "Invalid token structure" });
    }
    if (decoded.type !== "department_head") {
      return res.status(403).json({ error: "Access denied. Department head token required" });
    }
    console.log("Token decoded:", decoded);
    console.log("Looking for email:", decoded.email);
    const [departmentHead] = await db.select().from(departmentHeadSchema).where(eq23(departmentHeadSchema.email, decoded.email));
    console.log("Database query result:", departmentHead);
    if (!departmentHead) {
      return res.status(401).json({ error: "Department head not found" });
    }
    if (!departmentHead.isActive) {
      return res.status(403).json({
        error: "Account is deactivated. Please contact administrator."
      });
    }
    if (departmentHead.roleId !== decoded.roleId) {
      return res.status(401).json({ error: "Token role mismatch" });
    }
    req.user = {
      id: departmentHead.id,
      email: departmentHead.email,
      name: departmentHead.name,
      roleId: departmentHead.roleId,
      departmentIds: departmentHead.departmentIds,
      type: "department_head"
    };
    const departmentId = req.params.departmentId;
    console.log("departmentId", departmentId);
    if (departmentId) {
      const userDepartmentIds = Array.isArray(departmentHead.departmentIds) ? departmentHead.departmentIds : [];
      console.log("userDepartmentIds", userDepartmentIds);
      console.log(
        "!userDepartmentIds.includes(departmentId",
        !userDepartmentIds.includes(departmentId)
      );
      if (!userDepartmentIds.includes(departmentId)) {
        return res.status(403).json({
          error: "Access denied. You don't have permission to access this department."
        });
      }
    }
    const targetId = req.params.id;
    if (targetId && (req.method === "PUT" || req.method === "DELETE")) {
      if (targetId === departmentHead.id) {
        return res.status(403).json({
          error: "Department heads cannot update or delete their own accounts. Please contact administrator."
        });
      }
    }
    next();
  } catch (err) {
    if (err instanceof jwt6.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    if (err instanceof jwt6.TokenExpiredError) {
      return res.status(401).json({ error: "Token has expired" });
    }
    console.error("Department head middleware error:", err);
    return res.status(500).json({ error: "Authentication service error" });
  }
}

// server/src/departmentHead/departmentHeadRoute.ts
var departmentHeadRouter = Router7();
departmentHeadRouter.post("/login", departmentHeadController.login);
departmentHeadRouter.post(
  "/reset-password",
  departmentHeadController.resetPassword
);
departmentHeadRouter.post(
  "/",
  departmentHeadAuthMiddleware,
  departmentHeadController.create
);
departmentHeadRouter.get(
  "/",
  departmentHeadAuthMiddleware,
  departmentHeadController.getAll
);
departmentHeadRouter.delete(
  "/:id",
  departmentHeadAuthMiddleware,
  departmentHeadController.delete
);
departmentHeadRouter.get(
  "/available-departments",
  departmentHeadAuthMiddleware,
  departmentHeadController.getAvailableDepartments
);
departmentHeadRouter.put(
  "/:id",
  departmentHeadAuthMiddleware,
  departmentHeadController.update
);
departmentHeadRouter.get(
  "/:id",
  departmentHeadAuthMiddleware,
  departmentHeadController.getById
);
departmentHeadRouter.get(
  "/waiting-inward/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getWaitingInward
);
departmentHeadRouter.post(
  "/inward/:flowId",
  departmentHeadAuthMiddleware,
  departmentHeadController.inward
);
departmentHeadRouter.get(
  "/inward-pending/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getInwardPending
);
departmentHeadRouter.get(
  "/assigned-pending/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getAssignedPending
);
departmentHeadRouter.post(
  "/assign-technician/:flowId",
  departmentHeadAuthMiddleware,
  departmentHeadController.assignTechnician
);
departmentHeadRouter.get(
  "/outward-pending/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getOutwardPending
);
departmentHeadRouter.post(
  "/outward/:flowId",
  departmentHeadAuthMiddleware,
  departmentHeadController.outward
);
function setupDepartmentHeadRoutes(app2) {
  app2.use("/api/head", departmentHeadRouter);
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
dotenv2.config();
var app = express2();
var httpServer = createServer2(app);
var userSocketMap = /* @__PURE__ */ new Map();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use("/uploads", express2.static(path3.join(__dirname, "../uploads")));
app.userSocketMap = userSocketMap;
setupPrescriptionRoutes(app);
setupSubPrescriptionRoutes(app);
setupTechnicianRoutes(app);
setupAttendanceRoutes(app);
setupLeaveRequestRoutes(app);
setupDepartmentHeadRoutes(app);
app.use("/api", authMiddleware);
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyObj, ...args) {
    capturedJsonResponse = bodyObj;
    return originalResJson.apply(res, [bodyObj, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 80)}`;
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  setupSocket(httpServer, app);
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
