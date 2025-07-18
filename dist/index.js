var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/database/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bills: () => bills,
  insertBillSchema: () => insertBillSchema,
  insertClinicSchema: () => insertClinicSchema,
  insertOrderSchema: () => insertOrderSchema2,
  insertPickupRequestSchema: () => insertPickupRequestSchema,
  insertProductSchema: () => insertProductSchema,
  insertScanBookingSchema: () => insertScanBookingSchema,
  insertToothGroupSchema: () => insertToothGroupSchema,
  insertUserSchema: () => insertUserSchema,
  pickupRequests: () => pickupRequests,
  products: () => products,
  scanBookings: () => scanBookings,
  toothGroups: () => toothGroups,
  toothGroupsRelations: () => toothGroupsRelations,
  users: () => users
});
import { pgTable as pgTable2, text as text2, timestamp as timestamp2, jsonb as jsonb2, uuid as uuid2 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema2 } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// server/src/order/orderSchema.ts
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var orderSchema = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id"),
  clinicId: text("clinic_id"),
  clinicInformationId: text("clinic_information_id"),
  orderMethod: text("order_method"),
  prescriptionTypesId: text("prescription_types_id").array(),
  subPrescriptionTypesId: text("sub_prescription_types_id").array(),
  selectedTeethId: text("selected_teeth_id"),
  files: jsonb("files"),
  accessorios: jsonb("accessorios"),
  handllingType: text("handlling_type"),
  pickupData: jsonb("pickup_data"),
  courierData: jsonb("courier_data"),
  resonOfReject: text("reson_of_reject"),
  resonOfRescan: text("reson_of_rescan"),
  rejectNote: text("reject_note"),
  orderId: text("order_id"),
  crateNo: text("crate_no"),
  qaNote: text("qa_note"),
  orderBy: text("order_by"),
  acpectedDileveryData: timestamp("acpected_dilevery_data"),
  lifeCycle: jsonb("life_cycle"),
  orderStatus: text("order_status"),
  refId: text("ref_id"),
  orderDate: timestamp("order_date"),
  updateDate: timestamp("update_date"),
  totalAmount: text("total_amount"),
  paymentType: text("payment_type"),
  paymentStatus: text("payment_status"),
  percentage: text("percentage"),
  doctorNote: text("doctor_note"),
  orderType: text("order_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertOrderSchema = createInsertSchema(orderSchema).omit({
  id: true,
  createdAt: true
}).partial();

// shared/schema.ts
var users = pgTable2("users", {
  id: uuid2("id").primaryKey().defaultRandom(),
  mobileNumber: text2("mobile_number").notNull().unique(),
  password: text2("password").notNull()
});
var products = pgTable2("products", {
  id: uuid2("id").primaryKey().defaultRandom(),
  name: text2("name").notNull(),
  category: text2("category").notNull(),
  material: text2("material").notNull(),
  description: text2("description")
});
var toothGroups = pgTable2("tooth_groups", {
  id: uuid2("id").primaryKey().defaultRandom(),
  orderId: uuid2("order_id"),
  groupId: text2("group_id").notNull(),
  teeth: jsonb2("teeth").$type().notNull(),
  type: text2("type").notNull(),
  notes: text2("notes"),
  material: text2("material"),
  shade: text2("shade"),
  warning: text2("warning")
});
var scanBookings = pgTable2("scan_bookings", {
  id: uuid2("id").primaryKey().defaultRandom(),
  orderId: uuid2("order_id").references(() => orderSchema.id),
  areaManagerId: text2("area_manager_id"),
  scanDate: text2("scan_date"),
  scanTime: text2("scan_time"),
  notes: text2("notes"),
  status: text2("status").default("pending"),
  createdAt: timestamp2("created_at").defaultNow()
});
var pickupRequests = pgTable2("pickup_requests", {
  id: uuid2("id").primaryKey().defaultRandom(),
  orderId: uuid2("order_id").references(() => orderSchema.id),
  pickupDate: text2("pickup_date"),
  pickupTime: text2("pickup_time"),
  remarks: text2("remarks"),
  status: text2("status").default("pending"),
  createdAt: timestamp2("created_at").defaultNow()
});
var bills = pgTable2("bills", {
  id: uuid2("id").primaryKey().defaultRandom(),
  orderId: uuid2("order_id").references(() => orderSchema.id),
  amount: text2("amount").notNull(),
  status: text2("status").default("unpaid"),
  dueDate: timestamp2("due_date"),
  paidDate: timestamp2("paid_date"),
  paymentMethod: text2("payment_method"),
  createdAt: timestamp2("created_at").defaultNow()
});
var toothGroupsRelations = relations(toothGroups, ({ one }) => ({
  order: one(orderSchema, {
    fields: [toothGroups.orderId],
    references: [orderSchema.id]
  })
}));
var insertUserSchema = createInsertSchema2(users);
var insertOrderSchema2 = createInsertSchema2(orderSchema).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertToothGroupSchema = createInsertSchema2(toothGroups).omit({
  id: true
});
var insertScanBookingSchema = createInsertSchema2(scanBookings).omit({
  id: true,
  createdAt: true
});
var insertPickupRequestSchema = createInsertSchema2(pickupRequests).omit({
  id: true,
  createdAt: true
});
var insertBillSchema = createInsertSchema2(bills).omit({
  id: true,
  createdAt: true
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
var insertProductSchema = createInsertSchema2(products).omit({
  id: true
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

// server/storage.ts
import { eq as eq2 } from "drizzle-orm";
import { z as z2 } from "zod";

// server/src/company/companyschema.ts
import { pgTable as pgTable3, text as text3, uuid as uuid3 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema3 } from "drizzle-zod";
var companies = pgTable3("companies", {
  id: uuid3("id").primaryKey().defaultRandom(),
  name: text3("name")
});
var insertCompanySchema = createInsertSchema3(companies).omit({
  id: true
});

// server/src/patient/patientSchema.ts
import {
  integer as integer3,
  pgTable as pgTable4,
  text as text4,
  uuid as uuid4
} from "drizzle-orm/pg-core";
var patients = pgTable4("patient", {
  id: uuid4("id").primaryKey().defaultRandom(),
  firstName: text4("first_name").notNull(),
  lastName: text4("last_name").notNull(),
  age: integer3("age").notNull(),
  sex: text4("sex").notNull()
});

// server/src/patient/patientController.ts
import { eq } from "drizzle-orm";
var PatientStorage = class {
  async getPatient(id) {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
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
    await db.delete(patients).where(eq(patients.id, id));
  }
  async updatePatient(id, updates) {
    const [patient] = await db.update(patients).set(updates).where(eq(patients.id, id)).returning();
    return patient;
  }
};
var patientStorage = new PatientStorage();

// server/storage.ts
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
    const [user] = await db.select().from(users).where(eq2(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq2(users.mobileNumber, username));
    return user;
  }
  async getUserByMobileNumber(mobileNumber) {
    const [user] = await db.select().from(users).where(eq2(users.mobileNumber, mobileNumber));
    return user;
  }
  async createUser(insertUser) {
    const userData = {
      ...insertUser,
      id: String(Math.floor(Math.random() * 1e6) + 1)
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async getAllUsers() {
    const user = await db.select().from(users);
    return user;
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
    return await db.select().from(toothGroups).where(eq2(toothGroups.orderId, orderId));
  }
  async getProducts() {
    return await db.select().from(products);
  }
  async getCompanies() {
    return await db.select().from(companies);
  }
  async getCompanyById(id) {
    const [company] = await db.select().from(companies).where(eq2(companies.id, id));
    return company;
  }
  async getCompanyNameById(id) {
    const [company] = await db.select({ name: companies.name }).from(companies).where(eq2(companies.id, id));
    return company?.name || void 0;
  }
  async createCompany(company) {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }
  async initializeData() {
    const patients2 = await patientStorage.getPatients();
    const companies2 = await this.getCompanies();
    if (companies2.length === 0) {
      await this.createCompany({ name: "Nobel Biocare" });
      await this.createCompany({ name: "Straumann" });
      await this.createCompany({ name: "Dentsply Sirona" });
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// server/src/clinic/clinicSchema.ts
import { pgTable as pgTable5, text as text5, timestamp as timestamp3, jsonb as jsonb3, uuid as uuid5 } from "drizzle-orm/pg-core";
import { z as z3 } from "zod";
var clinic = pgTable5("clinic", {
  id: uuid5("id").primaryKey().defaultRandom(),
  firstname: text5("firstname").notNull(),
  lastname: text5("lastname").notNull(),
  email: text5("email").notNull().unique(),
  phone: text5("phone"),
  clinicName: text5("clinic_name"),
  clinicLicenseNumber: text5("clinic_license_number"),
  clinicAddressLine1: text5("clinic_address_line1"),
  clinicAddressLine2: text5("clinic_address_line2"),
  clinicCity: text5("clinic_city"),
  clinicState: text5("clinic_state"),
  clinicPincode: text5("clinic_pincode"),
  clinicCountry: text5("clinic_country"),
  gstNumber: text5("gst_number"),
  panNumber: text5("pan_number"),
  billingAddressLine1: text5("billing_address_line1"),
  billingAddressLine2: text5("billing_address_line2"),
  billingCity: text5("billing_city"),
  billingState: text5("billing_state"),
  billingPincode: text5("billing_pincode"),
  billingCountry: text5("billing_country"),
  password: text5("password").notNull(),
  roleId: uuid5("role_id").notNull(),
  permissions: jsonb3("permissions").$type().default([]),
  createdAt: timestamp3("created_at").defaultNow(),
  updatedAt: timestamp3("updated_at").defaultNow()
});
var insertClinicSchema2 = z3.object({
  firstname: z3.string(),
  lastname: z3.string(),
  email: z3.string().email(),
  phone: z3.string(),
  clinicName: z3.string(),
  clinicLicenseNumber: z3.string(),
  gstNumber: z3.string(),
  panNumber: z3.string(),
  password: z3.string(),
  roleId: z3.string(),
  permissions: z3.array(z3.string()),
  clinicAddressLine1: z3.string().optional(),
  clinicAddressLine2: z3.string().optional(),
  clinicCity: z3.string().optional(),
  clinicState: z3.string().optional(),
  clinicPincode: z3.string().optional(),
  clinicCountry: z3.string().optional(),
  billingAddressLine1: z3.string().optional(),
  billingAddressLine2: z3.string().optional(),
  billingCity: z3.string().optional(),
  billingState: z3.string().optional(),
  billingPincode: z3.string().optional(),
  billingCountry: z3.string().optional()
});

// server/src/clinic/clinicController.ts
import { eq as eq3 } from "drizzle-orm";
var ClinicStorage = class {
  async getClinic(id) {
    const [clinicData] = await db.select().from(clinic).where(eq3(clinic.id, id));
    return clinicData;
  }
  async getClinicById(id) {
    const [clinicData] = await db.select().from(clinic).where(eq3(clinic.id, id));
    return clinicData;
  }
  async getClinicByEmail(email) {
    const [clinicData] = await db.select().from(clinic).where(eq3(clinic.email, email));
    return clinicData;
  }
  async getClinicByMobileNumber(mobileNumber) {
    const [clinicData] = await db.select().from(clinic).where(eq3(clinic.phone, mobileNumber));
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
    const [updatedClinic] = await db.update(clinic).set(updates).where(eq3(clinic.id, id)).returning();
    console.log("updatedClinic==>", updatedClinic);
    return updatedClinic;
  }
  async getClinicByName(clinicName) {
    const [clinicData] = await db.select().from(clinic).where(eq3(clinic.clinicName, clinicName));
    return clinicData;
  }
};
var clinicStorage = new ClinicStorage();

// server/src/role/roleController.ts
import { eq as eq4 } from "drizzle-orm";

// server/src/role/roleSchema.ts
import { pgTable as pgTable6, text as text6, uuid as uuid6 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema4 } from "drizzle-zod";
var role = pgTable6("role", {
  id: uuid6("id").primaryKey().defaultRandom(),
  name: text6("name").notNull().unique()
});
var insertRoleSchema = createInsertSchema4(role).omit({
  id: true
});

// server/src/role/roleController.ts
var RoleStorage = class {
  async getRoleById(roleId) {
    const [roleData] = await db.select().from(role).where(eq4(role.id, roleId));
    return roleData;
  }
  async getRoleByName(roleName) {
    const [roleData] = await db.select().from(role).where(eq4(role.name, roleName));
    return roleData;
  }
};
var RolesStorage = new RoleStorage();

// server/src/teamMember/teamMemberController.ts
import { eq as eq5 } from "drizzle-orm";

// server/src/teamMember/teamMemberschema.ts
import { pgTable as pgTable7, text as text7, timestamp as timestamp5, jsonb as jsonb5, uuid as uuid7 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema5 } from "drizzle-zod";
var teamMembers = pgTable7("team_members", {
  id: uuid7("id").primaryKey().defaultRandom(),
  fullName: text7("full_name").notNull(),
  email: text7("email").notNull(),
  contactNumber: text7("contact_number"),
  profilePicture: text7("profile_picture"),
  roleId: uuid7("role_id").notNull(),
  permissions: jsonb5("permissions").$type().default([]),
  status: text7("status").default("active"),
  password: text7("password"),
  joinDate: timestamp5("join_date").defaultNow(),
  lastLogin: timestamp5("last_login"),
  createdAt: timestamp5("created_at").defaultNow(),
  updatedAt: timestamp5("updated_at").defaultNow(),
  clinicName: text7("clinic_name")
});
var insertTeamMemberSchema = createInsertSchema5(teamMembers).omit({
  id: true,
  joinDate: true,
  lastLogin: true
});

// server/src/teamMember/teamMemberController.ts
var TeamMemberStorage = class {
  async getTeamMember(id) {
    const [user] = await db.select().from(teamMembers).where(eq5(teamMembers.id, id));
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
    const members = await db.select().from(teamMembers).where(eq5(teamMembers.clinicName, clinicName));
    return members;
  }
  async updateTeamMember(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [teamMember] = await db.update(teamMembers).set(updateData).where(eq5(teamMembers.id, id)).returning();
    return teamMember;
  }
  async deleteTeamMember(id) {
    await db.delete(teamMembers).where(eq5(teamMembers.id, id));
  }
  async getTeamMemberByMobileNumber(mobileNumber) {
    const [teamMember] = await db.select().from(teamMembers).where(eq5(teamMembers.contactNumber, mobileNumber));
    return teamMember;
  }
  async getTeamMemberById(id) {
    const [member] = await db.select().from(teamMembers).where(eq5(teamMembers.id, id));
    return member;
  }
};
var teamMemberStorage = new TeamMemberStorage();

// server/src/authentication/authenticationRoute.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
var setupAuthenticationRoutes = (app2) => {
  const JWT_SECRET2 = process.env.JWT_SECRET || "your_jwt_secret_key";
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
        token: jwt.sign({ id: newClinic.id }, JWT_SECRET2, { expiresIn: "7d" })
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
            token: jwt.sign({ id: teamMember.id }, JWT_SECRET2, { expiresIn: "7d" })
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
            token: jwt.sign({ id: clinic2.id }, JWT_SECRET2, { expiresIn: "7d" })
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
import { eq as eq6 } from "drizzle-orm";

// server/src/chat/chatSchema.ts
import { createInsertSchema as createInsertSchema7 } from "drizzle-zod";
import { pgTable as pgTable9, text as text9, boolean as boolean7, timestamp as timestamp7, jsonb as jsonb7, uuid as uuid9 } from "drizzle-orm/pg-core";
import { relations as relations2 } from "drizzle-orm";

// server/src/message/messageSchema.ts
import { createInsertSchema as createInsertSchema6 } from "drizzle-zod";
import { pgTable as pgTable8, text as text8, timestamp as timestamp6, jsonb as jsonb6, uuid as uuid8 } from "drizzle-orm/pg-core";
var messages = pgTable8("messages", {
  id: uuid8("id").primaryKey().defaultRandom(),
  chatId: uuid8("chat_id"),
  orderId: uuid8("order_id").references(() => orderSchema.id),
  sender: text8("sender").notNull(),
  senderRole: text8("sender_role").notNull(),
  senderType: text8("sender_type").notNull(),
  // 'clinic', 'lab'
  content: text8("content").notNull(),
  messageType: text8("message_type").default("text"),
  attachments: jsonb6("attachments").$type().default([]),
  readBy: jsonb6("read_by").$type().default([]),
  createdAt: timestamp6("created_at").defaultNow(),
  sender_id: uuid8("sender_id")
});
var insertMessageSchema = createInsertSchema6(messages).omit({
  id: true,
  createdAt: true
});

// server/src/chat/chatSchema.ts
var chats = pgTable9("chats", {
  id: uuid9("id").primaryKey().defaultRandom(),
  orderId: uuid9("order_id"),
  type: text9("type").notNull(),
  title: text9("title"),
  participants: jsonb7("participants").$type().default([]),
  createdBy: text9("created_by"),
  createdAt: timestamp7("created_at").defaultNow(),
  updatedAt: timestamp7("updated_at").defaultNow(),
  clinicId: uuid9("clinic_id").notNull(),
  isActive: boolean7("is_active").notNull().default(true)
});
var chatsRelations = relations2(chats, ({ one, many }) => ({
  order: one(orderSchema, {
    fields: [chats.orderId],
    references: [orderSchema.id]
  }),
  messages: many(messages)
}));
var messagesRelations = relations2(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  }),
  order: one(orderSchema, {
    fields: [messages.orderId],
    references: [orderSchema.id]
  })
}));
var insertChatSchema = createInsertSchema7(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/src/chat/chatController.ts
var ChatStorage = class {
  async getChat(id) {
    console.log("Getting chat", id);
    const [chat] = await db.select().from(chats).where(eq6(chats.id, id));
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
    return await db.select().from(chats).where(eq6(chats.type, type));
  }
  async getChatsByClinic(clinicId) {
    return await db.select().from(chats).where(eq6(chats.clinicId, clinicId));
  }
  async updateChat(id, updates) {
    const updateData = { ...updates };
    if (updates.participants && Array.isArray(updates.participants)) {
      updateData.participants = updates.participants.map((p) => typeof p === "object" ? p.fullName : p);
    }
    const [chat] = await db.update(chats).set(updateData).where(eq6(chats.id, id)).returning();
    return chat;
  }
  async getChatByOrderId(orderId) {
    const [chat] = await db.select().from(chats).where(eq6(chats.orderId, orderId));
    return chat;
  }
  async deleteMessagesByChat(chatId) {
    await db.delete(messages).where(eq6(messages.chatId, chatId));
  }
  // Hard delete a chat and its messages
  async deleteChat(chatId) {
    await this.deleteMessagesByChat(chatId);
    await db.delete(chats).where(eq6(chats.id, chatId));
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
    const messageList = await db.select().from(messages).where(eq6(messages.chatId, chatId));
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
import { eq as eq9 } from "drizzle-orm";

// server/src/clinicInformation/clinicInformationSchema.ts
import { pgTable as pgTable10, text as text10, uuid as uuid10 } from "drizzle-orm/pg-core";
var clinicInformation = pgTable10("clinic_information", {
  id: uuid10("id").primaryKey().defaultRandom(),
  clinicId: text10("clinic_id"),
  caseHandleBy: text10("case_handle_by").notNull(),
  doctorMobileNumber: text10("doctor_mobile_number").notNull(),
  consultingDoctorName: text10("consulting_doctor_name"),
  consultingDoctorMobileNumber: text10("consulting_doctor_mobile_number")
});

// server/src/clinicInformation/clinicInformationController.ts
import { eq as eq7 } from "drizzle-orm";
var ClinicInformationStorage = class {
  async createClinicInformation(data) {
    const [newClinicInformation] = await db.insert(clinicInformation).values(data).returning();
    return newClinicInformation;
  }
  async getClinicInformationById(id) {
    const [info] = await db.select().from(clinicInformation).where(eq7(clinicInformation.id, id));
    return info;
  }
  async getClinicInformations() {
    return await db.select().from(clinicInformation);
  }
  async updateClinicInformation(id, updates) {
    const [info] = await db.update(clinicInformation).set(updates).where(eq7(clinicInformation.id, id)).returning();
    return info;
  }
  async deleteClinicInformation(id) {
    await db.delete(clinicInformation).where(eq7(clinicInformation.id, id));
  }
};
var clinicInformationStorage = new ClinicInformationStorage();

// server/src/teethGroup/teethGroupSchema.ts
import { jsonb as jsonb8, pgTable as pgTable11, uuid as uuid11 } from "drizzle-orm/pg-core";
var teethGroups = pgTable11("teeth_group", {
  id: uuid11("id").primaryKey().defaultRandom(),
  teethGroup: jsonb8("teeth_group").notNull(),
  selectedTeeth: jsonb8("selected_teeth").notNull()
});

// server/src/teethGroup/teethGroupcontroller.ts
import { eq as eq8 } from "drizzle-orm";
var TeethGroupStorage = class {
  async createTeethGroup(data) {
    const [newTeethGroup] = await db.insert(teethGroups).values(data).returning();
    return newTeethGroup;
  }
  async getTeethGroupById(id) {
    const [teethGroup] = await db.select().from(teethGroups).where(eq8(teethGroups.id, id));
    return teethGroup;
  }
  async getTeethGroups() {
    return await db.select().from(teethGroups);
  }
  async updateTeethGroup(id, updates) {
    const [teethGroup] = await db.update(teethGroups).set(updates).where(eq8(teethGroups.id, id)).returning();
    return teethGroup;
  }
  async deleteTeethGroup(id) {
    await db.delete(teethGroups).where(eq8(teethGroups.id, id));
  }
};
var teethGroupStorage = new TeethGroupStorage();

// server/src/order/orderController.ts
var OrderStorage = class {
  getOrdersByPatient(patientId) {
    throw new Error("Method not implemented.");
  }
  async getOrder(id) {
    const [order] = await db.select().from(orderSchema).where(eq9(orderSchema.id, id));
    const orderData = this.getFullOrderData(order);
    return orderData;
  }
  async createOrder(insertOrder) {
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
      console.log("dasdasdadasdwdqwdqwd", clinicInformationData);
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
      const orderToInsert = {
        ...insertOrder,
        patientId: insertPatient.id,
        clinicInformationId: clinicInformation2.id,
        selectedTeethId: teethGroup.id,
        // Defensive: ensure all array fields are arrays
        prescriptionTypesId: Array.isArray(insertOrder.prescriptionTypesId) ? insertOrder.prescriptionTypesId : [],
        subPrescriptionTypesId: Array.isArray(
          insertOrder.subPrescriptionTypesId
        ) ? insertOrder.subPrescriptionTypesId : [],
        accessorios: Array.isArray(insertOrder.accessorios) ? insertOrder.accessorios : [],
        selectedTeeth: Array.isArray(insertOrder.selectedTeeth) ? insertOrder.selectedTeeth : [],
        teethGroup: Array.isArray(insertOrder.teethGroup) ? insertOrder.teethGroup : [],
        teethNumber: Array.isArray(insertOrder.teethNumber) ? insertOrder.teethNumber : [],
        products: Array.isArray(insertOrder.products) ? insertOrder.products : [],
        pickupData: Array.isArray(insertOrder.pickupData) ? insertOrder.pickupData : [],
        courierData: insertOrder.courierData,
        lifeCycle: Array.isArray(insertOrder.lifeCycle) ? insertOrder.lifeCycle : [],
        files: {
          addPatientPhotos: Array.isArray(insertOrder.files?.addPatientPhotos) ? insertOrder.files.addPatientPhotos : [],
          faceScan: Array.isArray(insertOrder.files?.faceScan) ? insertOrder.files.faceScan : [],
          intraOralScan: Array.isArray(insertOrder.files?.intraOralScan) ? insertOrder.files.intraOralScan : [],
          referralImages: Array.isArray(insertOrder.files?.referralImages) ? insertOrder.files.referralImages : []
        }
      };
      console.log(orderToInsert, "orderToInsert");
      const fixDate = (val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === "string") {
          const d = new Date(val);
          return isNaN(d.getTime()) ? null : d;
        }
        return null;
      };
      orderToInsert.acpectedDileveryData = fixDate(
        orderToInsert.acpectedDileveryData
      );
      orderToInsert.orderDate = fixDate(orderToInsert.orderDate);
      orderToInsert.updateDate = fixDate(orderToInsert.updateDate);
      orderToInsert.createdAt = fixDate(orderToInsert.createdAt);
      orderToInsert.updatedAt = fixDate(orderToInsert.updatedAt);
      const [order] = await db.insert(orderSchema).values(orderToInsert).returning();
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
    const orderData = await orderStorage.getOrder(orderId);
    console.log(orderData, "orderData");
    if ((body?.status || "") === "active") {
      const chatData = await chatStorage.getChatByOrderId(orderId);
      console.log("chat Data", chatData);
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
        const updateOrder2 = {
          orderStatus: body?.status || "",
          orderId: body?.orderId || "",
          crateNo: body?.crateNo || "",
          qaNote: body?.qaNote || ""
        };
        const UpdateOrderData2 = orderStorage.updateOrder(orderId, updateOrder2);
        if (!UpdateOrderData2) return "Order Not Update";
        return UpdateOrderData2;
      }
      const chatParticipentList = chatData?.participants || [];
      if (!chatParticipentList.includes(body?.userName || "")) {
        const newParticipantsList = [...chatParticipentList, body?.userName || ""];
        const updateChatData = {
          ...chatData,
          participants: newParticipantsList
        };
        const updateParticipant = await chatStorage.updateChat(
          chatData?.id || "",
          updateChatData
        );
        if (!updateParticipant) return "Chat Is Not Update";
      } else {
        const updateOrder2 = {
          orderStatus: body?.status || "",
          orderId: body?.orderId || "",
          crateNo: body?.crateNo || "",
          qaNote: body?.qaNote || ""
        };
        const UpdateOrderData2 = orderStorage.updateOrder(orderId, updateOrder2);
        if (!UpdateOrderData2) return "Order Not Update";
        return UpdateOrderData2;
      }
    } else if ((body?.status || "") === "rejected") {
      const updateOrder2 = {
        orderStatus: body?.status || "",
        resonOfReject: body?.resonOfReject || ""
      };
      const UpdateOrderData2 = orderStorage.updateOrder(orderId, updateOrder2);
      if (!UpdateOrderData2) return "Order Not Update";
      return UpdateOrderData2;
    }
    const updateOrder = {
      orderStatus: body?.status || "",
      resonOfRescan: body?.resonOfRescan || "",
      rejectNote: body?.resonOfRescan || ""
    };
    const UpdateOrderData = orderStorage.updateOrder(orderId, updateOrder);
    if (!UpdateOrderData) return "Order Not Update";
    return UpdateOrderData;
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
        orderDate: order?.createdAt,
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
  async getToothGroupsByOrder(orderId) {
    console.log("orderId", orderId);
    return await db.select().from(toothGroups).where(eq9(toothGroups.orderId, orderId));
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
    console.log(clinicInformation2, "clinicInformation");
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
      acpectedDileveryData: order.acpectedDileveryData ? new Date(order.acpectedDileveryData) : /* @__PURE__ */ new Date(),
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
      orderBy: order.orderBy || "",
      lifeCycle: Array.isArray(order.lifeCycle) ? order.lifeCycle : [],
      orderStatus: order.orderStatus || "",
      refId: order.refId || "",
      orderDate: typeof order.orderDate === "string" ? order.orderDate : order.orderDate ? new Date(order.orderDate).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      updateDate: typeof order.updatedAt === "string" ? order.updatedAt : order.updatedAt ? new Date(order.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
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
    const [order] = await db.update(orderSchema).set({ orderStatus }).where(eq9(orderSchema.id, id)).returning();
    return order;
  }
  async updateOrder(id, updates) {
    const [order] = await db.select().from(orderSchema).where(eq9(orderSchema.id, id));
    if (!order) return void 0;
    let patientId = order.patientId;
    if (patientId && (updates.firstName || updates.lastName || updates.age || updates.sex)) {
      await patientStorage.updatePatient(patientId, {
        ...updates.firstName && { firstName: updates.firstName },
        ...updates.lastName && { lastName: updates.lastName },
        ...updates.age && { age: updates.age },
        ...updates.sex && { sex: updates.sex }
      });
    }
    let clinicInformationId = order.clinicInformationId;
    if (clinicInformationId && (updates.caseHandleBy || updates.doctorMobileNumber || updates.consultingDoctorName || updates.consultingDoctorMobileNumber)) {
      await clinicInformationStorage.updateClinicInformation(
        clinicInformationId,
        {
          ...updates.caseHandleBy && { caseHandleBy: updates.caseHandleBy },
          ...updates.doctorMobileNumber && {
            doctorMobileNumber: updates.doctorMobileNumber
          },
          ...updates.consultingDoctorName && {
            consultingDoctorName: updates.consultingDoctorName
          },
          ...updates.consultingDoctorMobileNumber && {
            consultingDoctorMobileNumber: updates.consultingDoctorMobileNumber
          }
        }
      );
    }
    let selectedTeethId = order.selectedTeethId;
    if (selectedTeethId && (updates.selectedTeeth || updates.teethGroup)) {
      await teethGroupStorage.updateTeethGroup(selectedTeethId, {
        ...updates.selectedTeeth && { selectedTeeth: updates.selectedTeeth },
        ...updates.teethGroup && { teethGroup: updates.teethGroup }
      });
    }
    const orderUpdate = { ...updates };
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
    const [updatedOrder] = await db.update(orderSchema).set(orderUpdate).where(eq9(orderSchema.id, id)).returning();
    return updatedOrder;
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
};
var orderStorage = new OrderStorage();

// server/src/message/messageController.ts
import { eq as eq10, asc as asc3 } from "drizzle-orm";
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
    return await db.select().from(messages).where(eq10(messages.chatId, chatId)).orderBy(asc3(messages.createdAt));
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
import { date as date8, pgTable as pgTable12, text as text11, timestamp as timestamp8, uuid as uuid12 } from "drizzle-orm/pg-core";
var lifecycleStages = pgTable12("lifecycle_stages", {
  id: uuid12("id").primaryKey().defaultRandom(),
  title: text11("title").notNull(),
  date: date8("date"),
  time: text11("time"),
  person: text11("person").notNull(),
  role: text11("role").notNull(),
  icon: text11("icon"),
  createdAt: timestamp8("created_at").defaultNow(),
  updatedAt: timestamp8("updated_at").defaultNow()
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
      const order = await orderStorage.createOrder(req.body);
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
      res.status(500).json({ error: "Failed to update order status" });
    }
  });
  app2.patch("/api/qa/status/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const body = req.body;
      console.log(body?.status, "body");
      const updateData = await orderStorage.updateStatus(orderId, body);
      console.log(updateData, "updateData");
      res.status(201).json("updateData");
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
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

// server/src/draftOrder/draftOrderSchema.tsx
import {
  pgTable as pgTable13,
  uuid as uuid13,
  text as text12,
  integer as integer10,
  jsonb as jsonb10,
  timestamp as timestamp9,
  date as date9
} from "drizzle-orm/pg-core";
var draftOrders = pgTable13("draft_order", {
  id: uuid13("id").defaultRandom().primaryKey(),
  firstName: text12("first_name"),
  lastName: text12("last_name"),
  age: integer10("age"),
  sex: text12("sex"),
  clinicId: text12("clinic_id"),
  caseHandleBy: text12("case_handle_by"),
  doctorMobileNumber: text12("doctor_mobile_number"),
  consultingDoctorName: text12("consulting_doctor_name"),
  consultingDoctorMobileNumber: text12("consulting_doctor_mobile_number"),
  orderMethod: text12("order_method"),
  // "Digital" or "Manual"
  prescriptionTypesId: jsonb10("prescription_types_id").$type(),
  subPrescriptionTypesId: jsonb10("sub_prescription_types_id").$type(),
  selectedTeeth: jsonb10("selected_teeth").$type(),
  teethGroup: jsonb10("teeth_group").$type(),
  teethNumber: jsonb10("teeth_number").$type(),
  products: jsonb10("products").$type(),
  files: jsonb10("files").$type(),
  accessorios: jsonb10("accessorios").$type(),
  handllingType: text12("handlling_type"),
  pickupData: jsonb10("pickup_data").$type(),
  courierData: jsonb10("courier_data").$type(),
  resonOfReject: text12("reson_of_reject"),
  resonOfRescan: text12("reson_of_rescan"),
  rejectNote: text12("reject_note"),
  orderId: text12("order_id"),
  crateNo: text12("crate_no"),
  qaNote: text12("qa_note"),
  orderBy: text12("order_by"),
  AcpectedDileveryData: date9("acpected_dilevery_data"),
  lifeCycle: jsonb10("life_cycle").$type(),
  orderStatus: text12("order_status"),
  refId: text12("ref_id"),
  orderDate: text12("order_date"),
  updateDate: text12("update_date"),
  totalAmount: text12("total_amount"),
  paymentType: text12("payment_type"),
  doctorNote: text12("doctor_note"),
  orderType: text12("order_type"),
  step: integer10("step"),
  createdAt: timestamp9("created_at", { withTimezone: true }).defaultNow()
});

// server/src/draftOrder/draftOrderController.tsx
import { eq as eq11 } from "drizzle-orm";
var DraftOrderStorage = class {
  async getDraftOrder(id) {
    const [order] = await db.select().from(draftOrders).where(eq11(draftOrders.id, id));
    return order;
  }
  async createDraftOrder(order) {
    const [created] = await db.insert(draftOrders).values(order).returning();
    return created;
  }
  async getDraftOrdersByClinicId(clinicId) {
    return await db.select().from(draftOrders).where(eq11(draftOrders.clinicId, clinicId));
  }
  async deleteDraftOrder(id) {
    await db.delete(draftOrders).where(eq11(draftOrders.id, id));
  }
};
var draftOrderStorage = new DraftOrderStorage();

// server/src/draftOrder/draftOrderRoute.tsx
var setupDraftOrderRoutes = (app2) => {
  app2.get("/api/draft-orders/:id", async (req, res) => {
    try {
      const order = await draftOrderStorage.getDraftOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Draft order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft order" });
    }
  });
  app2.get("/api/draft-orders/clinic/:clinicId", async (req, res) => {
    try {
      const orders = await draftOrderStorage.getDraftOrdersByClinicId(req.params.clinicId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft orders" });
    }
  });
  app2.post("/api/draft-orders", async (req, res) => {
    try {
      const order = await draftOrderStorage.createDraftOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  });
  app2.delete("/api/draft-orders/:id", async (req, res) => {
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
  });
};

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
      console.log(
        "Received tooth group data:",
        JSON.stringify(req.body, null, 2)
      );
      const toothGroupData = insertToothGroupSchema.parse(req.body);
      console.log(
        "Parsed tooth group data:",
        JSON.stringify(toothGroupData, null, 2)
      );
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
      const toothGroups2 = await storage.getToothGroupsByOrder(
        req.params.orderId
      );
      res.json(toothGroups2);
    } catch (error) {
      console.error("Error fetching tooth groups", error);
      res.status(500).json({ error: "Failed to fetch tooth groups" });
    }
  });
  setupAuthenticationRoutes(app2);
  setupChatRoutes(app2);
  setupClinicRoutes(app2);
  setupLifeCycleRoutes(app2);
  setupMessageRoutes(app2);
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
import jwt2 from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
function authMiddleware(req, res, next) {
  console.log(req.path);
  if (req.path === "/login" || req.path === "/register") {
    return next();
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Enter Authorization Token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt2.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// server/socket/socket.ts
import { Server } from "socket.io";
import { eq as eq12 } from "drizzle-orm";
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
        await db.update(chats).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq12(chats.id, data.chatId));
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
        activeChatUsers.forEach((users2) => users2.delete(userId));
        console.log(`User ${userId} disconnected and unregistered.`);
      }
      console.log("User disconnected:", socket.id);
    });
  });
  app2.io = io;
  app2.userSocketMap = userSocketMap2;
}

// server/index.ts
dotenv2.config();
var app = express2();
var httpServer = createServer2(app);
var userSocketMap = /* @__PURE__ */ new Map();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.userSocketMap = userSocketMap;
app.use("/api", authMiddleware);
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
