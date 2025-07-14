import { Patient, patients } from "./patientSchema";
import { db } from "../../database/db";
import { eq } from "drizzle-orm";

export interface PatientStorage {
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: Omit<Patient, 'id'>): Promise<Patient>;
  getPatients(): Promise<Patient[]>;
}

export class PatientStorage implements PatientStorage {
  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(insertPatient: Omit<Patient, 'id'>): Promise<Patient> {
    const patientData = {
      ...insertPatient,
    };
    const [patient] = await db.insert(patients).values(patientData).returning();
    return patient;
  }

  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async deletePatient(id: string): Promise<void> {
    await db.delete(patients).where(eq(patients.id, id));
  }
}

export const patientStorage = new PatientStorage();