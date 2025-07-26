import { db } from "./database/db";
import { products } from "../shared/schema";
import { eq, asc, desc } from "drizzle-orm";
import { z } from "zod";
import { companies, Company, InsertCompany } from "./src/company/companyschema";
import { patientStorage } from "./src/patient/patientController";
import { Product } from "@/types/orderType";

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
  getProducts(): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products) as Product[];
  }


}

export const storage = new DatabaseStorage();