import { db } from "../../database/db";
import { draftOrders } from "./draftOrderSchema";
import { eq } from "drizzle-orm";

export interface DraftOrderStore {
  getDraftOrder(id: string): Promise<any | undefined>;
  createDraftOrder(order: any): Promise<any>;
  getDraftOrdersByClinicId(clinicId: string): Promise<any[]>;
  deleteDraftOrder(id: string): Promise<void>;
}

export class DraftOrderStorage implements DraftOrderStore {
  async getDraftOrder(id: string): Promise<any | undefined> {
    const [order] = await db.select().from(draftOrders).where(eq(draftOrders.id, id));
    return order;
  }

  async createDraftOrder(order: any): Promise<any> {
    const [created] = await db.insert(draftOrders).values(order).returning();
    return created;
  }

  async getDraftOrdersByClinicId(clinicId: string): Promise<any[]> {
    return await db.select().from(draftOrders).where(eq(draftOrders.clinicId, clinicId));
  }

  async deleteDraftOrder(id: string): Promise<void> {
    await db.delete(draftOrders).where(eq(draftOrders.id, id));
  }
}

export const draftOrderStorage = new DraftOrderStorage();
