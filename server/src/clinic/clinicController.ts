import { db } from "server/database/db";
import { clinic } from "@shared/schema";
import { eq, and, or, sql, gte, lte, inArray } from "drizzle-orm";

export interface ClinicStore {
    getClinic(id: string): Promise<any | undefined>;
    getClinicByEmail(email: string): Promise<any | undefined>;
    getClinicByMobileNumber(mobileNumber: string): Promise<any | undefined>;
    createClinic(clinicData: any): Promise<any>;
    getClinics(): Promise<any[]>;
    updateClinic(id: string, updates: Partial<any>): Promise<any | undefined>;
    getClinicByName(clinicName: string): Promise<any | undefined>;
}

export class ClinicStorage implements ClinicStore {
    async getClinic(id: string): Promise<any | undefined> {
        const [clinicData] = await db.select().from(clinic).where(eq(clinic.id, id));
        return clinicData;
      }
    
      async getClinicByEmail(email: string): Promise<any | undefined> {
        const [clinicData] = await db.select().from(clinic).where(eq(clinic.email, email));
        return clinicData;
      }
    
      async getClinicByMobileNumber(mobileNumber: string): Promise<any | undefined> {
        const [clinicData] = await db.select().from(clinic).where(eq(clinic.phone, mobileNumber));
        return clinicData;
      }
    
      async createClinic(clinicData: any): Promise<any> {
        const [newClinic] = await db.insert(clinic).values(clinicData).returning();
        return newClinic;
      }
    
      async getClinics(): Promise<any[]> {
        return await db.select().from(clinic);
      }
    
      async updateClinic(id: string, updates: Partial<any>): Promise<any | undefined> {
        const [updatedClinic] = await db.update(clinic).set(updates).where(eq(clinic.id, id)).returning();
        
        console.log("updatedClinic==>",updatedClinic);
        return updatedClinic;
      }
    
      async getClinicByName(clinicName: string): Promise<any | undefined> {
        const [clinicData] = await db.select().from(clinic).where(eq(clinic.clinicName, clinicName));
        return clinicData;
      }
}

export const clinicStorage = new ClinicStorage();