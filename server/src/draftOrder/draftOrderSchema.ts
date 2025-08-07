import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  date,
  time
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const draftOrderSchema = pgTable("draft_order", {
  id: uuid("id").primaryKey().defaultRandom(),

  refId: text("ref_id"),
  orderType: text("order_type"),
  orderStatus: text("order_status"),
  paymentType: text("payment_type"),

  clinicId: uuid("clinic_id"),

  firstName: text("first_name"),
  lastName: text("last_name"),
  age: text("age"),
  sex: text("sex"),

  // Case Info
  caseHandleBy: text("case_handle_by"),
  doctorMobileNumber: text("doctor_mobile_number"),
  consultingDoctorName: text("consulting_doctor_name"),
  consultingDoctorMobileNumber: text("consulting_doctor_mobile_number"),

  // Order Details
  prescriptionTypesId: jsonb("prescription_types_id"),        // JSONB array
  subPrescriptionTypesId: jsonb("sub_prescription_types_id"), // JSONB array
  prescriptionType: text("prescription_type"),
  subPrescriptionTypes: text("sub_prescription_types"),
  orderMethod: text("order_method"),

  teethGroup: jsonb("teeth_group"),
  selectedTeeth: jsonb("selected_teeth"),

  // File uploads
  files: jsonb("files"),

  // Accessories
  accessorios: jsonb("accessorios"),
  handllingType: text("handlling_type"),

  // Pickup
  pickupDate: date("pickup_date"),
  pickupTime: time("pickup_time"),
  pickupRemarks: text("pickup_remarks"),

  // Scan Booking
  scanBooking: jsonb("scan_booking"),
  courierData: jsonb("courier_data"),
  pickupData: jsonb("pickup_data"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertDraftOrderSchema = createInsertSchema(draftOrderSchema)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type InsertDraftOrder = z.infer<typeof insertDraftOrderSchema>;

export type DraftOrder = typeof draftOrderSchema.$inferSelect;
  
  