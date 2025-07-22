import {
  boolean,
  integer,
  jsonb,
  numeric,
  PgJsonBuilder,
  pgTable,
  text,
  timestamp,
  uuid,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orderSchema = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id"),
  clinicId: text("clinic_id"),
  qaId: text("qa_id"),
  clinicInformationId: text("clinic_information_id"),
  orderMethod: text("order_method"),
  prescriptionTypesId: text("prescription_types_id").array(),
  subPrescriptionTypesId: text("sub_prescription_types_id").array(),
  selectedTeethId: text("selected_teeth_id"),
  files: jsonb("files"),
  accessorios: jsonb("accessorios"),
  handllingType: text("handlling_type"),
  pickupData: jsonb("pickup_data"),
  courierData: jsonb("courier_data"),
  resonOfReject: text("reson_of_reject"),
  resonOfRescan: text("reson_of_rescan"),
  rejectNote: text("reject_note"),
  orderId: text("order_id"),
  crateNo: text("crate_no"),
  notes: text("notes"),
  additionalNote: text("additional_note"),
  extraAdditionalNote: text("extra_additional_note"),
  orderBy: text("order_by"),
  acpectedDileveryData: timestamp("acpected_dilevery_data"),
  lifeCycle: jsonb("life_cycle"),
  orderStatus: text("order_status"),
  refId: text("ref_id"),
  orderDate: timestamp("order_date"),
  updateDate: timestamp("update_date"),
  totalAmount: text("total_amount"),
  paymentType: text("payment_type"),
  paymentStatus: text("payment_status"),
  percentage: text("percentage"),
  doctorNote: text("doctor_note"),
  orderType: text("order_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});


export const insertOrderSchema = createInsertSchema(orderSchema)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Order = typeof orderSchema.$inferSelect;
