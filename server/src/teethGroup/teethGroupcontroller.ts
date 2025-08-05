import { db } from "../../database/db";
import { teethGroups } from "./teethGroupSchema";
import { eq } from "drizzle-orm";

export interface TeethGroupStore {
  createTeethGroup(data: any): Promise<any>;
  getTeethGroupById(id: string): Promise<any | undefined>;
  getTeethGroups(): Promise<any[]>;
}

export class TeethGroupStorage implements TeethGroupStore {
  async createTeethGroup(data: any): Promise<any> {
    const [newTeethGroup] = await db.insert(teethGroups).values(data).returning();
    return newTeethGroup;
  }

  async getTeethGroupById(id: string): Promise<any | undefined> {
    const [teethGroup] = await db.select().from(teethGroups).where(eq(teethGroups.id, id));
    return teethGroup;
  }

  async getTeethGroups(): Promise<any[]> {
    return await db.select().from(teethGroups);
  }

  async updateTeethGroup(id: string, updates: Partial<any>): Promise<any | undefined> {
    const [teethGroup] = await db.update(teethGroups).set(updates).where(eq(teethGroups.id, id)).returning();
    return teethGroup;
  }

  async deleteTeethGroup(id: string): Promise<void> {
    await db.delete(teethGroups).where(eq(teethGroups.id, id));
  }
}

export const teethGroupStorage = new TeethGroupStorage();
