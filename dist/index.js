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
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var orderSchema = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: text("order_id"),
  refId: text("ref_id"),
  category: text("category"),
  type: text("type"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: text("age"),
  sex: text("sex"),
  caseHandledBy: text("case_handled_by"),
  doctorMobile: text("doctor_mobile"),
  consultingDoctor: text("consulting_doctor"),
  consultingDoctorMobile: text("consulting_doctor_mobile"),
  orderMethod: text("order_method"),
  prescriptionType: text("prescription_type"),
  subcategoryType: text("subcategory_type"),
  restorationType: text("restoration_type"),
  productSelection: text("product_selection"),
  orderType: text("order_type"),
  selectedFileType: text("selected_file_type"),
  selectedTeeth: jsonb("selected_teeth").$type(),
  toothGroups: jsonb("tooth_groups").$type(),
  toothNumbers: jsonb("tooth_numbers").$type(),
  abutmentDetails: jsonb("abutment_details").$type(),
  abutmentType: text("abutment_type"),
  restorationProducts: jsonb("restoration_products").$type(),
  clinicId: text("clinic_id"),
  ponticDesign: text("pontic_design"),
  occlusalStaining: text("occlusal_staining"),
  shadeInstruction: text("shade_instruction"),
  clearance: text("clearance"),
  accessories: jsonb("accessories").$type(),
  otherAccessory: text("other_accessory"),
  returnAccessories: boolean("return_accessories"),
  notes: text("notes"),
  files: jsonb("files").$type(),
  expectedDeliveryDate: date("expected_delivery_date"),
  pickupDate: date("pickup_date"),
  pickupTime: text("pickup_time"),
  pickupRemarks: text("pickup_remarks"),
  scanBooking: jsonb("scan_booking").$type(),
  previousOrderId: text("previous_order_id"),
  repairOrderId: text("repair_order_id"),
  issueDescription: text("issue_description"),
  repairType: text("repair_type"),
  crateNo: text("crate_no"),
  additionalNote: text("additional_note"),
  rejectionReason: text("rejection_reason"),
  returnWithTrial: boolean("return_with_trial"),
  teethEditedByUser: boolean("teeth_edited_by_user"),
  intraOralScans: jsonb("intra_oral_scans").$type(),
  faceScans: jsonb("face_scans").$type(),
  patientPhotos: jsonb("patient_photos").$type(),
  referralFiles: jsonb("referral_files").$type(),
  percentage: integer("percentage"),
  isUrgent: boolean("is_urgent"),
  currency: text("currency"),
  orderStatus: text("order_status"),
  totalAmount: text("total_amount"),
  exportQuality: text("export_quality"),
  paymentStatus: text("payment_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
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
  pgTable as pgTable4,
  text as text4,
  timestamp as timestamp3,
  uuid as uuid4
} from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema4 } from "drizzle-zod";
var patients = pgTable4("patients", {
  id: uuid4("id").primaryKey().defaultRandom(),
  firstName: text4("first_name").notNull(),
  lastName: text4("last_name").notNull(),
  age: text4("age"),
  sex: text4("sex"),
  contact: text4("contact"),
  createdAt: timestamp3("created_at").defaultNow()
});
var insertPatientSchema = createInsertSchema4(patients).omit({
  id: true,
  createdAt: true
});

// server/database/db.ts
import { drizzle as drizzle2 } from "drizzle-orm/node-postgres";
import { Pool as Pool2 } from "pg";
import dotenv2 from "dotenv";
dotenv2.config();
var pool2 = new Pool2({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "dental_lab_db",
  ssl: false
  // Always disable SSL for local testing
});
pool2.on("connect", (client) => {
  console.log("Database connected successfully");
});
pool2.on("error", (err) => {
  console.error("Database connection error:", err);
});
pool2.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err);
  } else {
    console.log("Database connection test successful:", res.rows[0]);
  }
});
var db2 = drizzle2(pool2, { schema: schema_exports });

// server/src/patient/patientController.ts
import { eq } from "drizzle-orm";
var PatientStorage = class {
  async getPatient(id) {
    const [patient] = await db2.select().from(patients).where(eq(patients.id, id));
    return patient;
  }
  async createPatient(insertPatient) {
    const patientData = {
      ...insertPatient,
      id: String(Math.floor(Math.random() * 1e6) + 1)
    };
    const [patient] = await db2.insert(patients).values(patientData).returning();
    return patient;
  }
  async getPatients() {
    return await db2.select().from(patients);
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
    if (patients2.length === 0) {
      await patientStorage.createPatient({
        firstName: "John",
        lastName: "Doe",
        age: "35",
        sex: "male"
      });
      await patientStorage.createPatient({
        firstName: "Jane",
        lastName: "Smith",
        age: "28",
        sex: "female"
      });
    }
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
import { pgTable as pgTable5, text as text5, timestamp as timestamp4, jsonb as jsonb3, uuid as uuid5 } from "drizzle-orm/pg-core";
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
  createdAt: timestamp4("created_at").defaultNow(),
  updatedAt: timestamp4("updated_at").defaultNow()
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
    const [clinicData] = await db2.select().from(clinic).where(eq3(clinic.id, id));
    return clinicData;
  }
  async getClinicByEmail(email) {
    const [clinicData] = await db2.select().from(clinic).where(eq3(clinic.email, email));
    return clinicData;
  }
  async getClinicByMobileNumber(mobileNumber) {
    const [clinicData] = await db2.select().from(clinic).where(eq3(clinic.phone, mobileNumber));
    return clinicData;
  }
  async createClinic(clinicData) {
    const [newClinic] = await db2.insert(clinic).values(clinicData).returning();
    return newClinic;
  }
  async getClinics() {
    return await db2.select().from(clinic);
  }
  async updateClinic(id, updates) {
    const [updatedClinic] = await db2.update(clinic).set(updates).where(eq3(clinic.id, id)).returning();
    console.log("updatedClinic==>", updatedClinic);
    return updatedClinic;
  }
  async getClinicByName(clinicName) {
    const [clinicData] = await db2.select().from(clinic).where(eq3(clinic.clinicName, clinicName));
    return clinicData;
  }
};
var clinicStorage = new ClinicStorage();

// server/src/role/roleController.ts
import { eq as eq4 } from "drizzle-orm";

// server/src/role/roleSchema.ts
import { pgTable as pgTable6, text as text6, uuid as uuid6 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema5 } from "drizzle-zod";
var role = pgTable6("role", {
  id: uuid6("id").primaryKey().defaultRandom(),
  name: text6("name").notNull().unique()
});
var insertRoleSchema = createInsertSchema5(role).omit({
  id: true
});

// server/src/role/roleController.ts
var RoleStorage = class {
  async getRoleById(roleId) {
    const [roleData] = await db2.select().from(role).where(eq4(role.id, roleId));
    return roleData;
  }
  async getRoleByName(roleName) {
    const [roleData] = await db2.select().from(role).where(eq4(role.name, roleName));
    return roleData;
  }
};
var RolesStorage = new RoleStorage();

// server/src/teamMember/teamMemberController.ts
import { eq as eq5 } from "drizzle-orm";

// server/src/teamMember/teamMemberschema.ts
import { pgTable as pgTable7, text as text7, timestamp as timestamp6, jsonb as jsonb5, uuid as uuid7 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema6 } from "drizzle-zod";
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
  joinDate: timestamp6("join_date").defaultNow(),
  lastLogin: timestamp6("last_login"),
  createdAt: timestamp6("created_at").defaultNow(),
  updatedAt: timestamp6("updated_at").defaultNow(),
  clinicName: text7("clinic_name")
});
var insertTeamMemberSchema = createInsertSchema6(teamMembers).omit({
  id: true,
  joinDate: true,
  lastLogin: true
});

// server/src/teamMember/teamMemberController.ts
var TeamMemberStorage = class {
  async getTeamMember(id) {
    const [user] = await db2.select().from(teamMembers).where(eq5(teamMembers.id, id));
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
    const [teamMember] = await db2.insert(teamMembers).values(teamMemberData).returning();
    console.log("Team member created:", teamMember);
    return teamMember;
  }
  async getTeamMembers() {
    const members = await db2.select().from(teamMembers);
    return members;
  }
  async getTeamMembersByClinic(clinicName) {
    const members = await db2.select().from(teamMembers).where(eq5(teamMembers.clinicName, clinicName));
    return members;
  }
  async updateTeamMember(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [teamMember] = await db2.update(teamMembers).set(updateData).where(eq5(teamMembers.id, id)).returning();
    return teamMember;
  }
  async deleteTeamMember(id) {
    await db2.delete(teamMembers).where(eq5(teamMembers.id, id));
  }
  async getTeamMemberByMobileNumber(mobileNumber) {
    const [teamMember] = await db2.select().from(teamMembers).where(eq5(teamMembers.contactNumber, mobileNumber));
    return teamMember;
  }
  async getTeamMemberByFullName(fullName) {
    const [member] = await db2.select().from(teamMembers).where(eq5(teamMembers.fullName, fullName));
    return member;
  }
};
var teamMemberStorage = new TeamMemberStorage();

// server/src/authentication/authenticationRoute.ts
var setupAuthenticationRoutes = (app2) => {
  app2.post("/api/clinic/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const clinic2 = await clinicStorage.getClinicByEmail(email);
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
  app2.post("/api/clinic/register", async (req, res) => {
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
      const newClinic = await clinicStorage.createClinic({
        ...clinicData,
        roleId: clinicRoleId,
        permissions: defaultPermissions
      });
      let roleName = "";
      try {
        const role2 = await RolesStorage.getRoleById(clinicRoleId);
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
        if (teamMember.password === password) {
          let roleName = "";
          if (teamMember.roleId) {
            const role2 = await RolesStorage.getRoleById(teamMember.roleId);
            roleName = role2?.name || "";
          }
          let clinicId = "";
          if (teamMember.clinicName) {
            const clinic3 = await clinicStorage.getClinicByName(
              teamMember.clinicName
            );
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
      const clinic2 = await clinicStorage.getClinicByMobileNumber(mobileNumber);
      if (clinic2) {
        if (clinic2.password === password) {
          let roleName = "";
          if (clinic2.roleId) {
            const role2 = await RolesStorage.getRoleById(clinic2.roleId);
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
  app2.get("/api/me", async (req, res) => {
    try {
      const mobileNumber = req.headers["x-mobile-number"];
      if (!mobileNumber || typeof mobileNumber !== "string") {
        return res.status(401).json({ error: "Not authenticated" });
      }
      let teamMember = await teamMemberStorage.getTeamMemberByMobileNumber(
        mobileNumber
      );
      let clinic2 = null;
      let userType = "teamMember";
      if (!teamMember) {
        clinic2 = await clinicStorage.getClinicByMobileNumber(mobileNumber);
        userType = "clinic";
      }
      if (!teamMember && !clinic2) {
        return res.status(404).json({ error: "User not found" });
      }
      let roleName = "";
      const roleId = teamMember?.roleId || clinic2?.roleId;
      if (roleId) {
        try {
          const role2 = await RolesStorage.getRoleById(roleId);
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
  app2.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logout successful" });
    });
  });
  app2.get("/api/userData/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("getUserData API called with ID:", id);
      let clinic2 = await clinicStorage.getClinic(id);
      console.log("Clinic lookup result:", clinic2 ? "Found" : "Not found");
      if (clinic2) {
        console.log(
          "Processing clinic data for:",
          clinic2.firstname,
          clinic2.lastname
        );
        let roleName = "";
        if (clinic2.roleId) {
          try {
            const role2 = await RolesStorage.getRoleById(clinic2.roleId);
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
      let teamMember = await teamMemberStorage.getTeamMember(id);
      console.log(
        "Team member lookup result:",
        teamMember ? "Found" : "Not found"
      );
      if (teamMember) {
        console.log("Processing team member data for:", teamMember.fullName);
        let roleName = "";
        if (teamMember.roleId) {
          try {
            const role2 = await RolesStorage.getRoleById(teamMember.roleId);
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
};

// server/src/chat/chatController.ts
import { eq as eq6 } from "drizzle-orm";

// server/src/chat/chatSchema.ts
import { createInsertSchema as createInsertSchema8 } from "drizzle-zod";
import { pgTable as pgTable9, text as text9, boolean as boolean7, timestamp as timestamp8, jsonb as jsonb7, uuid as uuid9 } from "drizzle-orm/pg-core";
import { relations as relations2 } from "drizzle-orm";

// server/src/message/messageSchema.ts
import { createInsertSchema as createInsertSchema7 } from "drizzle-zod";
import { pgTable as pgTable8, text as text8, timestamp as timestamp7, jsonb as jsonb6, uuid as uuid8 } from "drizzle-orm/pg-core";
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
  createdAt: timestamp7("created_at").defaultNow(),
  sender_id: uuid8("sender_id")
});
var insertMessageSchema = createInsertSchema7(messages).omit({
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
  createdAt: timestamp8("created_at").defaultNow(),
  updatedAt: timestamp8("updated_at").defaultNow(),
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
var insertChatSchema = createInsertSchema8(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/src/chat/chatController.ts
var ChatStorage = class {
  async getChat(id) {
    console.log("Getting chat", id);
    const [chat] = await db2.select().from(chats).where(eq6(chats.id, id));
    console.log("Chat", chat);
    return chat;
  }
  async createChat(data) {
    const chatData = {
      ...data,
      participants: Array.isArray(data.participants) ? data.participants : []
    };
    const [chat] = await db2.insert(chats).values(chatData).returning();
    return chat;
  }
  async getChats(userId) {
    const chatList = await db2.select().from(chats);
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
    return await db2.select().from(chats).where(eq6(chats.type, type));
  }
  async getChatsByClinic(clinicId) {
    return await db2.select().from(chats).where(eq6(chats.clinicId, clinicId));
  }
  async updateChat(id, updates) {
    const updateData = { ...updates };
    if (updates.participants && Array.isArray(updates.participants)) {
      updateData.participants = updates.participants;
    }
    const [chat] = await db2.update(chats).set(updateData).where(eq6(chats.id, id)).returning();
    return chat;
  }
  async getChatByOrderId(orderId) {
    const [chat] = await db2.select().from(chats).where(eq6(chats.orderId, orderId));
    return chat;
  }
  async deleteMessagesByChat(chatId) {
    await db2.delete(messages).where(eq6(messages.chatId, chatId));
  }
  // Hard delete a chat and its messages
  async deleteChat(chatId) {
    await this.deleteMessagesByChat(chatId);
    await db2.delete(chats).where(eq6(chats.id, chatId));
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
    const isParticipant = participants.some((participant) => {
      const exactMatch = participant.toLowerCase() === userId.toLowerCase();
      const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) || userId.toLowerCase().includes(participant.toLowerCase());
      return exactMatch || containsMatch;
    });
    if (!isParticipant) {
      console.log(`User ${userId} is not a participant in chat ${chatId}, returning 0`);
      return 0;
    }
    const messageList = await db2.select().from(messages).where(eq6(messages.chatId, chatId));
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
};
var chatStorage = new ChatStorage();

// server/src/order/orderController.ts
import { eq as eq7, and as and3, or as or3, sql as sql3, gte as gte3, lte as lte3, inArray as inArray3 } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
var OrderStorage = class {
  async getOrder(id) {
    const [order] = await db2.select().from(orderSchema).where(eq7(orderSchema.clinicId, id));
    return order;
  }
  async createOrder(insertOrder) {
    const orderData = {};
    orderData.refId = insertOrder.refId || null;
    orderData.orderId = insertOrder.orderId || null;
    orderData.category = insertOrder.category || null;
    orderData.type = insertOrder.type || null;
    orderData.firstName = insertOrder.firstName || null;
    orderData.lastName = insertOrder.lastName || null;
    orderData.age = insertOrder.age || null;
    orderData.sex = insertOrder.sex || null;
    orderData.caseHandledBy = insertOrder.caseHandledBy || null;
    orderData.doctorMobile = insertOrder.doctorMobile || null;
    orderData.consultingDoctor = insertOrder.consultingDoctor || null;
    orderData.consultingDoctorMobile = insertOrder.consultingDoctorMobile || null;
    orderData.orderMethod = insertOrder.orderMethod || null;
    orderData.prescriptionType = insertOrder.prescriptionType || null;
    orderData.subcategoryType = insertOrder.subcategoryType || null;
    orderData.restorationType = insertOrder.restorationType || null;
    orderData.productSelection = insertOrder.productSelection || null;
    orderData.orderType = insertOrder.orderType || null;
    orderData.selectedFileType = insertOrder.selectedFileType || null;
    orderData.selectedTeeth = Array.isArray(insertOrder.selectedTeeth) && insertOrder.selectedTeeth.length > 0 ? insertOrder.selectedTeeth : null;
    orderData.toothGroups = Array.isArray(insertOrder.toothGroups) && insertOrder.toothGroups.length > 0 ? insertOrder.toothGroups : null;
    orderData.toothNumbers = Array.isArray(insertOrder.toothNumbers) && insertOrder.toothNumbers.length > 0 ? insertOrder.toothNumbers : null;
    orderData.abutmentDetails = insertOrder.abutmentDetails || null;
    orderData.abutmentType = insertOrder.abutmentType || null;
    orderData.restorationProducts = Array.isArray(insertOrder.restorationProducts) && insertOrder.restorationProducts.length > 0 ? insertOrder.restorationProducts : null;
    orderData.clinicId = insertOrder.clinicId || null;
    orderData.ponticDesign = insertOrder.ponticDesign || null;
    orderData.occlusalStaining = insertOrder.occlusalStaining || null;
    orderData.shadeInstruction = insertOrder.shadeInstruction || null;
    orderData.clearance = insertOrder.clearance || null;
    orderData.accessories = Array.isArray(insertOrder.accessories) && insertOrder.accessories.length > 0 ? insertOrder.accessories : null;
    orderData.otherAccessory = insertOrder.otherAccessory || null;
    orderData.returnAccessories = Boolean(insertOrder.returnAccessories);
    orderData.notes = insertOrder.notes || null;
    orderData.files = Array.isArray(insertOrder.files) && insertOrder.files.length > 0 ? insertOrder.files : null;
    orderData.expectedDeliveryDate = insertOrder.expectedDeliveryDate ? new Date(insertOrder.expectedDeliveryDate) : null;
    orderData.pickupDate = insertOrder.pickupDate ? new Date(insertOrder.pickupDate) : null;
    orderData.pickupTime = insertOrder.pickupTime || null;
    orderData.pickupRemarks = insertOrder.pickupRemarks || null;
    orderData.scanBooking = insertOrder.scanBooking || null;
    orderData.previousOrderId = insertOrder.previousOrderId || null;
    orderData.repairOrderId = insertOrder.repairOrderId || null;
    orderData.issueDescription = insertOrder.issueDescription || null;
    orderData.repairType = insertOrder.repairType || null;
    orderData.returnWithTrial = Boolean(insertOrder.returnWithTrial);
    orderData.teethEditedByUser = Boolean(insertOrder.teethEditedByUser);
    orderData.intraOralScans = insertOrder.intraOralScans || null;
    orderData.faceScans = insertOrder.faceScans || null;
    orderData.patientPhotos = insertOrder.patientPhotos || null;
    orderData.referralFiles = insertOrder.referralFiles || null;
    orderData.quantity = insertOrder.quantity || 1;
    orderData.patientName = insertOrder.patientName || null;
    orderData.teethNo = insertOrder.teethNo || null;
    orderData.orderDate = insertOrder.orderDate || null;
    orderData.orderCategory = insertOrder.orderCategory || null;
    orderData.orderStatus = insertOrder.orderStatus || null;
    orderData.statusLabel = insertOrder.statusLabel || null;
    orderData.percentage = insertOrder.percentage || 0;
    orderData.chatConnection = Boolean(insertOrder.chatConnection);
    orderData.unreadMessages = insertOrder.unreadMessages || 0;
    orderData.messages = Array.isArray(insertOrder.messages) && insertOrder.messages.length > 0 ? insertOrder.messages : null;
    orderData.isUrgent = Boolean(insertOrder.isUrgent);
    orderData.currency = insertOrder.currency || "INR";
    orderData.exportQuality = insertOrder.exportQuality || "Standard";
    orderData.paymentStatus = insertOrder.paymentStatus || "pending";
    orderData.shade = Array.isArray(insertOrder.shade) && insertOrder.shade.length > 0 ? insertOrder.shade : null;
    orderData.shadeGuide = Array.isArray(insertOrder.shadeGuide) && insertOrder.shadeGuide.length > 0 ? insertOrder.shadeGuide : null;
    orderData.shadeNotes = insertOrder.shadeNotes || null;
    orderData.trial = insertOrder.trial || null;
    orderData.implantPhoto = insertOrder.implantPhoto || null;
    orderData.implantCompany = insertOrder.implantCompany || null;
    orderData.implantRemark = insertOrder.implantRemark || null;
    orderData.issueCategory = insertOrder.issueCategory || null;
    orderData.trialApproval = Boolean(insertOrder.trialApproval);
    orderData.reapirInstructions = insertOrder.reapirInstructions || null;
    orderData.additionalNotes = insertOrder.additionalNotes || null;
    orderData.selectedCompany = insertOrder.selectedCompany || null;
    orderData.handlingType = insertOrder.handlingType || null;
    orderData.id = uuidv4();
    const [order] = await db2.insert(orderSchema).values(orderData).returning();
    return order;
  }
  async getOrders() {
    return await db2.select().from(orderSchema);
  }
  async getOrdersByClinicId(clinicId) {
    return await db2.select().from(orderSchema).where(eq7(orderSchema.clinicId, clinicId));
  }
  async getOrdersWithFilters(filters) {
    const whereClauses = [];
    if (filters.paymentStatus) {
      whereClauses.push(eq7(orderSchema.paymentStatus, filters.paymentStatus));
    }
    if (filters.type) {
      whereClauses.push(eq7(orderSchema.type, filters.type));
    }
    if (filters.categories && filters.categories.length > 0) {
      whereClauses.push(inArray3(orderSchema.category, filters.categories));
    }
    if (filters.dateFrom) {
      whereClauses.push(gte3(orderSchema.createdAt, new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      whereClauses.push(lte3(orderSchema.createdAt, new Date(filters.dateTo)));
    }
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereClauses.push(
        or3(
          sql3`LOWER(${orderSchema.firstName}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.lastName}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.consultingDoctor}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.orderId}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.refId}) LIKE ${searchTerm}`
        )
      );
    }
    let query = db2.select().from(orderSchema);
    if (whereClauses.length > 0) {
      query = query.where(and3(...whereClauses));
    }
    if (filters.page && filters.pageSize) {
      query = query.limit(filters.pageSize).offset((filters.page - 1) * filters.pageSize);
    }
    return await query;
  }
  async getOrdersWithFiltersCount(filters) {
    const whereClauses = [];
    if (filters.paymentStatus) {
      whereClauses.push(eq7(orderSchema.paymentStatus, filters.paymentStatus));
    }
    if (filters.type) {
      whereClauses.push(eq7(orderSchema.type, filters.type));
    }
    if (filters.categories && filters.categories.length > 0) {
      whereClauses.push(inArray3(orderSchema.category, filters.categories));
    }
    if (filters.dateFrom) {
      whereClauses.push(gte3(orderSchema.createdAt, new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      whereClauses.push(lte3(orderSchema.createdAt, new Date(filters.dateTo)));
    }
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereClauses.push(
        or3(
          sql3`LOWER(${orderSchema.firstName}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.lastName}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.consultingDoctor}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.orderId}) LIKE ${searchTerm}`,
          sql3`LOWER(${orderSchema.refId}) LIKE ${searchTerm}`
        )
      );
    }
    const query = db2.select({ count: sql3`COUNT(*)` }).from(orderSchema);
    if (whereClauses.length > 0) {
      const result = await query.where(and3(...whereClauses));
      return Number(result[0]?.count || 0);
    } else {
      const result = await query;
      return Number(result[0]?.count || 0);
    }
  }
  async getOrdersByPatient(patientId) {
    return await db2.select().from(orderSchema).where(
      or3(
        eq7(orderSchema.firstName, patientId),
        eq7(orderSchema.lastName, patientId)
      )
    );
  }
  async getToothGroupsByOrder(orderId) {
    console.log("orderId", orderId);
    return await db2.select().from(toothGroups).where(eq7(toothGroups.orderId, orderId));
  }
  //   async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
  //     const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
  //     return chat;
  //   }
  async updateOrderStatus(id, orderStatus) {
    const [order] = await db2.update(orderSchema).set({ orderStatus }).where(eq7(orderSchema.id, id)).returning();
    return order;
  }
  async updateOrder(id, updates) {
    const orderData = {};
    orderData.refId = updates.refId || null;
    orderData.orderId = updates.orderId || null;
    orderData.category = updates.category || null;
    orderData.type = updates.type || null;
    orderData.firstName = updates.firstName || null;
    orderData.lastName = updates.lastName || null;
    orderData.age = updates.age || null;
    orderData.sex = updates.sex || null;
    orderData.caseHandledBy = updates.caseHandledBy || null;
    orderData.doctorMobile = updates.doctorMobile || null;
    orderData.consultingDoctor = updates.consultingDoctor || null;
    orderData.consultingDoctorMobile = updates.consultingDoctorMobile || null;
    orderData.orderMethod = updates.orderMethod || null;
    orderData.prescriptionType = updates.prescriptionType || null;
    orderData.subcategoryType = updates.subcategoryType || null;
    orderData.restorationType = updates.restorationType || null;
    orderData.productSelection = updates.productSelection || null;
    orderData.orderType = updates.orderType || null;
    orderData.selectedFileType = updates.selectedFileType || null;
    orderData.selectedTeeth = Array.isArray(updates.selectedTeeth) && updates.selectedTeeth.length > 0 ? updates.selectedTeeth : null;
    orderData.toothGroups = Array.isArray(updates.toothGroups) && updates.toothGroups.length > 0 ? updates.toothGroups : null;
    orderData.toothNumbers = Array.isArray(updates.toothNumbers) && updates.toothNumbers.length > 0 ? updates.toothNumbers : null;
    orderData.abutmentDetails = updates.abutmentDetails || null;
    orderData.abutmentType = updates.abutmentType || null;
    orderData.restorationProducts = Array.isArray(updates.restorationProducts) && updates.restorationProducts.length > 0 ? updates.restorationProducts : null;
    orderData.clinicId = updates.clinicId || null;
    orderData.ponticDesign = updates.ponticDesign || null;
    orderData.occlusalStaining = updates.occlusalStaining || null;
    orderData.shadeInstruction = updates.shadeInstruction || null;
    orderData.clearance = updates.clearance || null;
    orderData.accessories = Array.isArray(updates.accessories) && updates.accessories.length > 0 ? updates.accessories : null;
    orderData.otherAccessory = updates.otherAccessory || null;
    orderData.returnAccessories = Boolean(updates.returnAccessories);
    orderData.notes = updates.notes || null;
    orderData.files = Array.isArray(updates.files) && updates.files.length > 0 ? updates.files : null;
    orderData.expectedDeliveryDate = updates.expectedDeliveryDate ? new Date(updates.expectedDeliveryDate) : null;
    orderData.pickupDate = updates.pickupDate ? new Date(updates.pickupDate) : null;
    orderData.pickupTime = updates.pickupTime || null;
    orderData.pickupRemarks = updates.pickupRemarks || null;
    orderData.scanBooking = updates.scanBooking || null;
    orderData.previousOrderId = updates.previousOrderId || null;
    orderData.repairOrderId = updates.repairOrderId || null;
    orderData.issueDescription = updates.issueDescription || null;
    orderData.repairType = updates.repairType || null;
    orderData.returnWithTrial = Boolean(updates.returnWithTrial);
    orderData.teethEditedByUser = Boolean(updates.teethEditedByUser);
    orderData.intraOralScans = updates.intraOralScans || null;
    orderData.faceScans = updates.faceScans || null;
    orderData.patientPhotos = updates.patientPhotos || null;
    orderData.referralFiles = updates.referralFiles || null;
    orderData.quantity = updates.quantity || 1;
    orderData.patientName = updates.patientName || null;
    orderData.teethNo = updates.teethNo || null;
    orderData.orderDate = updates.orderDate || null;
    orderData.orderCategory = updates.orderCategory || null;
    orderData.orderStatus = updates.orderStatus || null;
    orderData.statusLabel = updates.statusLabel || null;
    orderData.percentage = updates.percentage || 0;
    orderData.chatConnection = Boolean(updates.chatConnection);
    orderData.unreadMessages = updates.unreadMessages || 0;
    orderData.messages = Array.isArray(updates.messages) && updates.messages.length > 0 ? updates.messages : null;
    orderData.isUrgent = Boolean(updates.isUrgent);
    orderData.currency = updates.currency || "INR";
    orderData.exportQuality = updates.exportQuality || "Standard";
    orderData.paymentStatus = updates.paymentStatus || "pending";
    orderData.shade = Array.isArray(updates.shade) && updates.shade.length > 0 ? updates.shade : null;
    orderData.shadeGuide = Array.isArray(updates.shadeGuide) && updates.shadeGuide.length > 0 ? updates.shadeGuide : null;
    orderData.shadeNotes = updates.shadeNotes || null;
    orderData.trial = updates.trial || null;
    orderData.implantPhoto = updates.implantPhoto || null;
    orderData.implantCompany = updates.implantCompany || null;
    orderData.implantRemark = updates.implantRemark || null;
    orderData.issueCategory = updates.issueCategory || null;
    orderData.trialApproval = Boolean(updates.trialApproval);
    orderData.reapirInstructions = updates.reapirInstructions || null;
    orderData.additionalNotes = updates.additionalNotes || null;
    orderData.selectedCompany = updates.selectedCompany || null;
    orderData.handlingType = updates.handlingType || null;
    orderData.crateNo = updates.crateNo || null;
    orderData.additionalNote = updates.additionalNote || null;
    orderData.rejectionReason = updates.rejectionReason || null;
    const [order] = await db2.update(orderSchema).set(orderData).where(eq7(orderSchema.id, id)).returning();
    return order;
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
import { eq as eq8, asc as asc3 } from "drizzle-orm";
var MessageStorage = class {
  async createMessage(insertMessage) {
    console.log("insertMessage", insertMessage);
    const messageData = {
      ...insertMessage,
      attachments: Array.isArray(insertMessage.attachments) ? insertMessage.attachments : [],
      readBy: [insertMessage.sender]
    };
    console.log("messageData", messageData);
    const [message] = await db2.insert(messages).values(messageData).returning();
    return message;
  }
  async getMessagesByOrder(orderId) {
    const orderChats = await db2.select().from(chats).where(eq8(chats.orderId, orderId));
    if (orderChats.length === 0) return [];
    return await db2.select().from(messages).where(eq8(messages.chatId, orderChats[0].id));
  }
  async getMessagesByChat(chatId) {
    return await db2.select().from(messages).where(eq8(messages.chatId, chatId)).orderBy(asc3(messages.createdAt));
  }
  async initializeData() {
    console.log("Starting database initialization...");
    const existingOrders = await orderStorage.getOrders();
    if (existingOrders.length > 0) {
      console.log("Database already has data, skipping initialization");
      return;
    }
    try {
      await db2.insert(companies).values([
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
    const messageList = await db2.select().from(messages).where(eq8(messages.chatId, chatId));
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
    const messageList = await db2.select().from(messages).where(eq8(messages.chatId, chatId));
    for (const messageItem of messageList) {
      const currentReadBy = messageItem.readBy || [];
      if (!currentReadBy.includes(userId)) {
        const updatedReadBy = [...currentReadBy, userId];
        await db2.update(messages).set({ readBy: updatedReadBy }).where(eq8(messages.id, messageItem.id));
      }
    }
  }
};
var messageStorage = new MessageStorage();

// server/src/chat/chatRoute.ts
var setupChatRoutes = (app2) => {
  app2.get("/api/chats", async (req, res) => {
    try {
      const { userId } = req.query;
      const chats2 = await chatStorage.getChats();
      console.log("chats", chats2);
      console.log("userId from query:", userId);
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
        console.log("Final chats with unread counts:", filteredChats);
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
  app2.get("/api/chats/:id", async (req, res) => {
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
      const io2 = req.app.get("io") || req.app.io;
      const userSocketMap2 = req.app.get("userSocketMap") || req.app.userSocketMap;
      if (io2 && userSocketMap2 && userId) {
        const socketId = userSocketMap2.get(userId);
        if (socketId) {
          const unreadCount = await messageStorage.getUnreadMessageCount(
            chatId,
            userId
          );
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
      const io2 = req.app.io;
      if (io2) {
        io2.emit("participants-updated", {
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
import { date as date8, pgTable as pgTable10, text as text10, timestamp as timestamp9, uuid as uuid10 } from "drizzle-orm/pg-core";
var lifecycleStages = pgTable10("lifecycle_stages", {
  id: uuid10("id").primaryKey().defaultRandom(),
  title: text10("title").notNull(),
  date: date8("date"),
  time: text10("time"),
  person: text10("person").notNull(),
  role: text10("role").notNull(),
  icon: text10("icon"),
  createdAt: timestamp9("created_at").defaultNow(),
  updatedAt: timestamp9("updated_at").defaultNow()
});

// server/src/lifeCycle/lifeCycleController.ts
var LifeCycleStorage = class {
  async getLifecycleStages() {
    return await db2.select().from(lifecycleStages).orderBy(lifecycleStages.createdAt);
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
      res.status(400).json({ error: "Failed to create order" });
    }
  });
  app2.put("/api/orders/:id", async (req, res) => {
    try {
      const order = await orderStorage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.log(error, "order update error");
      res.status(500).json({ error: "Failed to update order" });
    }
  });
  app2.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { orderStatus } = req.body;
      if (!orderStatus) {
        return res.status(400).json({ error: "Status is required" });
      }
      const order = await orderStorage.updateOrderStatus(req.params.id, orderStatus);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });
  app2.get("/api/orders/filters/count", async (req, res) => {
    try {
      const { search, paymentStatus, type, dateFrom, dateTo, categories } = req.query;
      const filters = {
        search,
        paymentStatus,
        type,
        dateFrom,
        dateTo,
        categories: categories ? Array.isArray(categories) ? categories : [categories] : void 0
      };
      const count = await orderStorage.getOrdersWithFiltersCount(filters);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders count" });
    }
  });
  app2.get("/api/orders/patient/:patientId", async (req, res) => {
    try {
      const orders = await orderStorage.getOrdersByPatient(
        req.params.patientId
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders for patient" });
    }
  });
  app2.get("/api/orders/:id/tooth-groups", async (req, res) => {
    try {
      const toothGroups2 = await orderStorage.getToothGroupsByOrder(
        req.params.id
      );
      res.json(toothGroups2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tooth groups for order" });
    }
  });
  app2.get("/api/orders/filter/:id", async (req, res) => {
    try {
      const clinicId = req.params.id;
      if (!clinicId) {
        return res.status(400).json({ error: "Clinic ID is required" });
      }
      const { patientName, prescription, refId, order_id } = req.query;
      let orders = await orderStorage.getOrdersByClinicId(clinicId);
      if (patientName) {
        const name = String(patientName).toLowerCase();
        orders = orders.filter(
          (order) => order.patientFirstName && order.patientFirstName.toLowerCase().includes(name) || order.patientLastName && order.patientLastName.toLowerCase().includes(name)
        );
      }
      if (prescription) {
        const presc = String(prescription).toLowerCase();
        orders = orders.filter(
          (order) => order.prescription && order.prescription.toLowerCase().includes(presc)
        );
      }
      if (refId) {
        orders = orders.filter(
          (order) => order.reference_id && order.reference_id == refId
        );
      }
      if (order_id) {
        orders = orders.filter(
          (order) => order.order_id && order.order_id == order_id
        );
      }
      res.json(orders);
    } catch (error) {
      console.log("order data ", error);
      res.status(500).json({ error });
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
var setupTeamMemberRoutes = (app2) => {
  app2.get("/api/team-members", async (req, res) => {
    try {
      const { clinicName } = req.query;
      if (clinicName && typeof clinicName === "string") {
        const teamMembers2 = await teamMemberStorage.getTeamMembersByClinic(
          clinicName
        );
        const teamMembersWithRoleName = await Promise.all(
          teamMembers2.map(async (member) => {
            let roleName = "";
            if (member.roleId) {
              const role2 = await RolesStorage.getRoleById(member.roleId);
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
        const teamMembers2 = await teamMemberStorage.getTeamMembers();
        const teamMembersWithRoleName = await Promise.all(
          teamMembers2.map(async (member) => {
            let roleName = "";
            if (member.roleId) {
              const role2 = await RolesStorage.getRoleById(member.roleId);
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
      const teamMember = await teamMemberStorage.getTeamMember(req.params.id);
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
      const teamMember = await teamMemberStorage.createTeamMember({
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
      const prevTeamMember = await teamMemberStorage.getTeamMember(
        req.params.id
      );
      const prevFullName = prevTeamMember?.fullName;
      if (roleName) {
        const role2 = await RolesStorage.getRoleByName(roleName);
        if (!role2) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        teamMemberData.roleId = role2.id;
      }
      const teamMember = await teamMemberStorage.updateTeamMember(
        req.params.id,
        teamMemberData
      );
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      const io2 = req.app.get("io") || req.app.io;
      const userSocketMap2 = global.userSocketMap || req.app.userSocketMap;
      const memberId = teamMember.fullName;
      console.log(teamMember.fullName, "teamMember.fullName");
      console.log("Update request body:", req.body);
      console.log(
        "userSocketMap:",
        Array.from(userSocketMap2?.entries?.() || [])
      );
      if (io2 && userSocketMap2 && memberId) {
        const socketId = userSocketMap2.get(memberId);
        if (socketId) {
          io2.to(socketId).emit("permissions-updated");
          console.log(
            `Emitted permissions-updated to ${memberId} (${socketId})`
          );
        } else {
          console.log(`No socketId found for memberId: ${memberId}`);
        }
      } else {
        if (!io2) console.log("Socket.io instance not found");
        if (!userSocketMap2) console.log("userSocketMap not found");
        if (!memberId) console.log("memberId not found");
      }
      if (prevFullName && teamMember.fullName && prevFullName !== teamMember.fullName) {
        const allChats = await chatStorage.getChats();
        for (const chat of allChats) {
          if (Array.isArray(chat.participants) && chat.participants.includes(prevFullName)) {
            const updatedParticipants = chat.participants.map(
              (p) => p === prevFullName ? teamMember.fullName : p
            );
            await chatStorage.updateChat(chat.id, {
              participants: updatedParticipants
            });
            if (io2) {
              io2.emit("participants-updated", {
                chatId: chat.id,
                participants: updatedParticipants,
                newParticipants: [teamMember.fullName],
                removedParticipants: [prevFullName],
                updatedBy: "System"
              });
              console.log(
                `Updated participants for chat ${chat.id} after name change:`,
                updatedParticipants
              );
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
      const io2 = req.app.get("io") || req.app.io;
      if (io2 && fullName) {
        for (const chat of affectedChats) {
          const updatedParticipants = (chat.participants || []).filter(
            (p) => p !== fullName
          );
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
      const teamMember = await teamMemberStorage.getTeamMemberByMobileNumber(
        mobileNumber
      );
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

// server/src/patient/patientRoute.ts
var setupPatientRoute = async (app2) => {
  app2.get("/api/patients", async (req, res) => {
    try {
      const patients2 = await patientStorage.getPatients();
      res.json(patients2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });
  app2.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await patientStorage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ error: "Invalid patient data" });
    }
  });
};

// server/src/draftOrder/draftOrderSchema.ts
import {
  boolean as boolean9,
  jsonb as jsonb9,
  pgTable as pgTable11,
  text as text11,
  timestamp as timestamp10,
  uuid as uuid11,
  date as date9
} from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema9 } from "drizzle-zod";
var draftOrderSchema = pgTable11("draft_order", {
  id: uuid11("id").primaryKey().defaultRandom(),
  orderId: text11("order_id"),
  refId: text11("ref_id"),
  category: text11("category"),
  type: text11("type"),
  firstName: text11("first_name"),
  lastName: text11("last_name"),
  age: text11("age"),
  sex: text11("sex"),
  caseHandledBy: text11("case_handled_by"),
  doctorMobile: text11("doctor_mobile"),
  consultingDoctor: text11("consulting_doctor"),
  consultingDoctorMobile: text11("consulting_doctor_mobile"),
  orderMethod: text11("order_method"),
  prescriptionType: text11("prescription_type"),
  subcategoryType: text11("subcategory_type"),
  restorationType: text11("restoration_type"),
  productSelection: text11("product_selection"),
  orderType: text11("order_type"),
  selectedFileType: text11("selected_file_type"),
  selectedTeeth: jsonb9("selected_teeth").$type(),
  toothGroups: jsonb9("tooth_groups").$type(),
  toothNumbers: jsonb9("tooth_numbers").$type(),
  abutmentDetails: jsonb9("abutment_details").$type(),
  abutmentType: text11("abutment_type"),
  restorationProducts: jsonb9("restoration_products").$type(),
  clinicId: text11("clinic_id"),
  ponticDesign: text11("pontic_design"),
  occlusalStaining: text11("occlusal_staining"),
  shadeInstruction: text11("shade_instruction"),
  clearance: text11("clearance"),
  accessories: jsonb9("accessories").$type(),
  otherAccessory: text11("other_accessory"),
  returnAccessories: boolean9("return_accessories"),
  notes: text11("notes"),
  files: jsonb9("files").$type(),
  expectedDeliveryDate: date9("expected_delivery_date"),
  pickupDate: date9("pickup_date"),
  pickupTime: text11("pickup_time"),
  step: text11("step"),
  pickupRemarks: text11("pickup_remarks"),
  scanBooking: jsonb9("scan_booking").$type(),
  intraOralScans: jsonb9("intra_oral_scans").$type(),
  faceScans: jsonb9("face_scans").$type(),
  patientPhotos: jsonb9("patient_photos").$type(),
  referralFiles: jsonb9("referral_files").$type(),
  createdAt: timestamp10("created_at", { withTimezone: true }).defaultNow()
});
var insertDraftOrderSchema = createInsertSchema9(draftOrderSchema).omit({
  id: true,
  createdAt: true
}).partial();

// server/src/draftOrder/draftOrderController.ts
import { eq as eq9 } from "drizzle-orm";
function buildDraftOrderData(data) {
  return {
    ...data,
    selectedTeeth: Array.isArray(data.selectedTeeth) && data.selectedTeeth.length > 0 ? data.selectedTeeth : null,
    toothGroups: Array.isArray(data.toothGroups) && data.toothGroups.length > 0 ? data.toothGroups : null,
    toothNumbers: Array.isArray(data.toothNumbers) && data.toothNumbers.length > 0 ? data.toothNumbers : null,
    restorationProducts: Array.isArray(data.restorationProducts) && data.restorationProducts.length > 0 ? data.restorationProducts : null,
    accessories: Array.isArray(data.accessories) && data.accessories.length > 0 ? data.accessories : null,
    files: Array.isArray(data.files) && data.files.length > 0 ? data.files : null,
    scanBooking: data.scanBooking || null,
    intraOralScans: data.intraOralScans || null,
    faceScans: data.faceScans || null,
    patientPhotos: data.patientPhotos || null,
    referralFiles: data.referralFiles || null,
    expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
    pickupDate: data.pickupDate ? new Date(data.pickupDate) : null,
    returnAccessories: Boolean(data.returnAccessories),
    createdAt: void 0,
    // let DB handle
    id: void 0
    // let DB handle
  };
}
var DraftOrderStorage = class {
  async createDraftOrder(data) {
    const draftOrderData = buildDraftOrderData(data);
    const [draftOrder] = await db2.insert(draftOrderSchema).values(draftOrderData).returning();
    return draftOrder;
  }
  async getDraftOrdersByClinicId(clinicId) {
    return await db2.select().from(draftOrderSchema).where(eq9(draftOrderSchema.clinicId, clinicId));
  }
};
var draftOrderStorage = new DraftOrderStorage();

// server/src/draftOrder/draftOrderRoute.ts
var setupDraftOrderRoutes = (app2) => {
  app2.post("/api/draft-orders", async (req, res) => {
    try {
      const draftOrderData = insertDraftOrderSchema.parse(req.body);
      const draftOrder = await draftOrderStorage.createDraftOrder(draftOrderData);
      res.status(201).json(draftOrder);
    } catch (error) {
      res.status(400).json({ error: "Invalid draft order data", details: error instanceof Error ? error.message : error });
    }
  });
  app2.get("/api/draft-orders/clinic/:clinicId", async (req, res) => {
    try {
      const { clinicId } = req.params;
      const draftOrders = await draftOrderStorage.getDraftOrdersByClinicId(clinicId);
      res.json(draftOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft orders" });
    }
  });
};

// server/routes.ts
async function registerRoutes(app2) {
  passport.use(
    new LocalStrategy(
      (username, password, done) => {
        done(null, { username });
      }
    )
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
  setupAuthenticationRoutes(app2);
  setupChatRoutes(app2);
  setupClinicRoutes(app2);
  setupLifeCycleRoutes(app2);
  setupMessageRoutes(app2);
  setupOrderRoutes(app2);
  setupTeamMemberRoutes(app2);
  setuRoleRoutes(app2);
  setupPatientRoute(app2);
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
import { eq as eq10 } from "drizzle-orm";
import { createServer as createServer2 } from "http";
import { Server } from "socket.io";
import dotenv3 from "dotenv";
dotenv3.config();
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
        const savedMessage = await messageStorage.createMessage({
          ...data.message,
          chatId: data.chatId
        });
        console.log("savedMessage", savedMessage);
        await db.update(chats).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq10(chats.id, data.chatId));
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
