import { db } from "./db";
import { 
  users, products, 
  type InsertUser, type User,
  type InsertScanBooking, type ScanBooking,
  type InsertPickupRequest, type PickupRequest,
  type InsertBill, type Bill,
  type InsertProduct, type Product,
  toothGroups,
  ToothGroup,
  InsertToothGroup,
} from "../shared/schema";
import { eq, asc, desc } from "drizzle-orm";
import { z } from "zod";
import { companies, Company, InsertCompany } from "./src/company/companyschema";
import { patientStorage } from "./src/patient/patientController";

const teamMemberInsertSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format").optional(),
  contactNumber: z.string().optional(),
  profilePicture: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  permissions: z.array(z.string()).default([]),
  status: z.string().default("active"),
  password: z.string().optional(),
  clinicName: z.string().optional(),
});

const teamMemberUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  contactNumber: z.string().optional(),
  profilePicture: z.string().optional(),
  role: z.string().min(1, "Role is required").optional(),
  permissions: z.array(z.string()).optional(),
  status: z.string().optional(),
  password: z.string().optional(),
  clinicName: z.string().optional(),
});

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByMobileNumber(mobileNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  createToothGroup(insertToothGroup: InsertToothGroup): Promise<ToothGroup>;
  getToothGroupsByOrder(orderId: string): Promise<ToothGroup[]>;
  getProducts(): Promise<Product[]>;
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | undefined>;
  getCompanyNameById(id: string): Promise<string | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, username));
    return user;
  }

  async getUserByMobileNumber(mobileNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userData = {
      ...insertUser,
      id: String(Math.floor(Math.random() * 1000000) + 1)
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const user = await db.select().from(users);
    return user;
  }

  
  async createToothGroup(insertToothGroup: InsertToothGroup): Promise<ToothGroup> {
    const toothGroupData = {
      ...insertToothGroup,
      teeth: Array.isArray(insertToothGroup.teeth) ? insertToothGroup.teeth as number[] : []
    };
    const [toothGroup] = await db.insert(toothGroups).values(toothGroupData).returning();
    return toothGroup;
  }

  async getToothGroupsByOrder(orderId: string): Promise<ToothGroup[]> {
    return await db.select().from(toothGroups).where(eq(toothGroups.orderId, orderId));
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyNameById(id: string): Promise<string | undefined> {
    const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, id));
    return company?.name || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async initializeData() {
    // Check if there are any patients or companies
    const patients = await patientStorage.getPatients();
    const companies = await this.getCompanies();

    if (companies.length === 0) {
      await this.createCompany({ name: "Nobel Biocare" });
      await this.createCompany({ name: "Straumann" });
      await this.createCompany({ name: "Dentsply Sirona" });
    }
  }
}

export const storage = new DatabaseStorage();