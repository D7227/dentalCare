import { InsertPatient, Patient, patients } from "./patientSchema";
import { db } from "../../database/db";
import { eq } from "drizzle-orm";

export interface PatientStorage {
getPatient(id: string): Promise<Patient | undefined>;
createPatient(patient: InsertPatient): Promise<Patient>;
getPatients(): Promise<Patient[]>;
}

export class PatientStorage implements PatientStorage {
    async getPatient(id: string): Promise<Patient | undefined> {
        const [patient] = await db.select().from(patients).where(eq(patients.id, id));
        return patient;
      }
    
      async createPatient(insertPatient: InsertPatient): Promise<Patient> {
        const patientData = {
          ...insertPatient,
          id: String(Math.floor(Math.random() * 1000000) + 1)
        };
        const [patient] = await db.insert(patients).values(patientData).returning();
        return patient;
      }
    
      async getPatients(): Promise<Patient[]> {
        return await db.select().from(patients);
      }
    
}


export const patientStorage = new PatientStorage();