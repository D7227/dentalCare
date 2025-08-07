import { db } from "../../database/db";
import { orderSchema } from "../order/orderSchema";
import { draftOrderSchema, insertDraftOrderSchema } from "./draftOrderSchema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export class DraftOrderStorage {
  async getDraftOrder(id: string): Promise<any | undefined> {
    const [order] = await db
      .select()
      .from(draftOrderSchema)
      .where(eq(draftOrderSchema.id, id));
    return order;
  }

  async createDraftOrder(order: any): Promise<any> {
    const [created] = await db
      .insert(draftOrderSchema)
      .values(order)
      .returning();
    return created;
  }

  async getDraftOrdersByClinicId(clinicId: string): Promise<any[]> {
    return await db
      .select()
      .from(draftOrderSchema)
      .where(eq(draftOrderSchema.clinicId, clinicId));
  }

  async deleteDraftOrder(id: string): Promise<void> {
    await db.delete(draftOrderSchema).where(eq(draftOrderSchema.id, id));
  }
}

const draftOrderStorage = new DraftOrderStorage();

export async function getDraftOrderById(req: Request, res: Response) {
  try {
    const order = await draftOrderStorage.getDraftOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Draft order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch draft order" });
  }
}

export async function getDraftOrdersByClinicId(req: Request, res: Response) {
  try {
    const orders = await draftOrderStorage.getDraftOrdersByClinicId(
      req.params.clinicId
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch draft orders" });
  }
}

function parseJsonbField(val: any) {
  if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
    return val;
  }
  if (typeof val === "string") {
    // Try JSON.parse first
    try {
      return JSON.parse(val);
    } catch {
      // Try to convert Postgres array literal to JSON array
      if (/^{.*}$/.test(val)) {
        // Remove curly braces and split by comma, trim quotes
        return val
          .slice(1, -1)
          .split(",")
          .map((s) => s.replace(/^"|"$/g, ""));
      }
      return [];
    }
  }
  return [];
}

export async function createDraftOrder(req: Request, res: Response) {
  try {
    // Defensive: ensure all fields are correct type/shape
    const body = req.body || {};
    console.log(body, "body");

    // All JSONB fields need proper parsing
    const prescriptionTypesId = parseJsonbField(body.prescriptionTypesId);
    const subPrescriptionTypesId = parseJsonbField(body.subPrescriptionTypesId);
    const accessorios = parseJsonbField(body.accessorios);
    const teethGroup = parseJsonbField(body.teethGroup);
    const selectedTeeth = parseJsonbField(body.selectedTeeth);
    const files = parseJsonbField(body.files);
    const scanBooking = parseJsonbField(body.scanBooking);
    const courierData = parseJsonbField(body.courierData);
    const pickupData = parseJsonbField(body.pickupData);

    // Strings
    const refId =
      body.refId ||
      `REF-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;
    const orderType = body.orderType || "";
    const orderStatus = body.orderStatus || "";
    const paymentType = body.paymentType || "";
    const clinicId = body.clinicId || "";
    const firstName = body.firstName || "";
    const lastName = body.lastName || "";
    const sex = body.sex || "";
    const age = body.age || "";
    const caseHandleBy = body.caseHandleBy || "";
    const doctorMobileNumber = body.doctorMobileNumber || "";
    const consultingDoctorName = body.consultingDoctorName || "";
    const consultingDoctorMobileNumber =
      body.consultingDoctorMobileNumber || "";
    const orderMethod = body.orderMethod || "";
    const handllingType = body.handllingType || "";
    const pickupRemarks = body.pickupRemarks || "";
    const prescriptionType = body.prescriptionType || "";
    const subPrescriptionTypes = body.subPrescriptionTypes || "";
    // Dates/times
    const pickupDate = body.pickupDate || null;
    const pickupTime = body.pickupTime ? body.pickupTime : null;

    // Compose the draft order object
    const draftOrder = {
      refId,
      orderType,
      orderStatus,
      paymentType,
      clinicId,
      firstName,
      lastName,
      age,
      sex,
      caseHandleBy,
      doctorMobileNumber,
      consultingDoctorName,
      consultingDoctorMobileNumber,
      prescriptionTypesId,
      subPrescriptionTypesId,
      orderMethod,
      teethGroup,
      selectedTeeth,
      files,
      accessorios,
      handllingType,
      pickupDate,
      pickupTime,
      pickupRemarks,
      courierData,
      pickupData,
      prescriptionType,
      subPrescriptionTypes,
    };

    const parseResult = insertDraftOrderSchema.safeParse(draftOrder);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const order = await draftOrderStorage.createDraftOrder(parseResult.data);
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
}

export async function deleteDraftOrder(req: Request, res: Response) {
  try {
    const order = await draftOrderStorage.getDraftOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Draft order not found" });
    }
    await draftOrderStorage.deleteDraftOrder(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete draft order" });
  }
}
