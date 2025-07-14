import { db } from "../../database/db";
import { clinicInformation } from "./clinicInformationSchema";
import { eq } from "drizzle-orm";

export interface ClinicInformationStore {
  createClinicInformation(data: any): Promise<any>;
  getClinicInformationById(id: string): Promise<any | undefined>;
  getClinicInformations(): Promise<any[]>;
}

export class ClinicInformationStorage implements ClinicInformationStore {
  async createClinicInformation(data: any): Promise<any> {
    const [newClinicInformation] = await db.insert(clinicInformation).values(data).returning();
    return newClinicInformation;
  }

  async getClinicInformationById(id: string): Promise<any | undefined> {
    const [info] = await db.select().from(clinicInformation).where(eq(clinicInformation.id, id));
    return info;
  }

  async getClinicInformations(): Promise<any[]> {
    return await db.select().from(clinicInformation);
  }

  async deleteClinicInformation(id: string): Promise<void> {
    await db.delete(clinicInformation).where(eq(clinicInformation.id, id));
  }
}

export const clinicInformationStorage = new ClinicInformationStorage();
