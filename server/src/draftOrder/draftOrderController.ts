import { db } from "../../database/db";
import { draftOrderSchema, InsertDraftOrder, DraftOrder } from "./draftOrderSchema";
import { eq } from "drizzle-orm";

export interface DraftOrderStorage {
  createDraftOrder(data: InsertDraftOrder): Promise<DraftOrder>;
  getDraftOrdersByClinicId(clinicId: string): Promise<DraftOrder[]>;
}

function buildDraftOrderData(data: InsertDraftOrder): any {
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
    createdAt: undefined, // let DB handle
    id: undefined, // let DB handle
  };
}

export class DraftOrderStorage implements DraftOrderStorage {
  async createDraftOrder(data: InsertDraftOrder): Promise<DraftOrder> {
    const draftOrderData = buildDraftOrderData(data);
    const [draftOrder] = await db.insert(draftOrderSchema).values(draftOrderData).returning();
    return draftOrder;
  }

  async getDraftOrdersByClinicId(clinicId: string): Promise<DraftOrder[]> {
    return await db.select().from(draftOrderSchema).where(eq(draftOrderSchema.clinicId, clinicId));
  }
}

export const draftOrderStorage = new DraftOrderStorage();
