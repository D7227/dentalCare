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
  orderId: text("order_id"),
  refId: text("ref_id"),
  category: text("category"),
  type: text("type"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: text("age"),
  sex: text("sex"),

  caseHandledBy: text("case_handled_by"),
  doctorMobile: text("doctor_mobile"),
  consultingDoctor: text("consulting_doctor"),
  consultingDoctorMobile: text("consulting_doctor_mobile"),

  orderMethod: text("order_method"),
  prescriptionType: text("prescription_type"),
  subcategoryType: text("subcategory_type"),
  restorationType: text("restoration_type"),
  productSelection: text("product_selection"),
  orderType: text("order_type"),
  selectedFileType: text("selected_file_type"),

  selectedTeeth: jsonb("selected_teeth").$type<any[]>(),
  toothGroups: jsonb("tooth_groups").$type<any[]>(),
  toothNumbers: jsonb("tooth_numbers").$type<string[]>(),

  abutmentDetails: jsonb("abutment_details").$type<any>(),
  abutmentType: text("abutment_type"),
  restorationProducts: jsonb("restoration_products").$type<any[]>(),

  clinicId: text("clinic_id"),

  ponticDesign: text("pontic_design"),
  occlusalStaining: text("occlusal_staining"),
  shadeInstruction: text("shade_instruction"),
  clearance: text("clearance"),

  accessories: jsonb("accessories").$type<string[]>(),
  otherAccessory: text("other_accessory"),
  returnAccessories: boolean("return_accessories"),

  notes: text("notes"),
  files: jsonb("files").$type<any[]>(),

  expectedDeliveryDate: date("expected_delivery_date"),
  pickupDate: date("pickup_date"),
  pickupTime: text("pickup_time"),
  pickupRemarks: text("pickup_remarks"),

  scanBooking: jsonb("scan_booking").$type<any>(),

  previousOrderId: text("previous_order_id"),
  repairOrderId: text("repair_order_id"),
  issueDescription: text("issue_description"),
  repairType: text("repair_type"),
  returnWithTrial: boolean("return_with_trial"),
  teethEditedByUser: boolean("teeth_edited_by_user"),

  intraOralScans: jsonb("intra_oral_scans").$type<any>(),
  faceScans: jsonb("face_scans").$type<any>(),
  patientPhotos: jsonb("patient_photos").$type<any>(),
  referralFiles: jsonb("referral_files").$type<any>(),

  // --- Added fields from order table ---
  quantity: integer("quantity"),
  patientName: text("patient_name"),
  teethNo: text("teeth_no"),
  orderDate: text("order_date"),
  orderCategory: text("order_category"),
  orderStatus: text("order_status"),
  statusLabel: text("status_label"),
  percentage: integer("percentage"),
  chatConnection: boolean("chat_connection"),
  unreadMessages: integer("unread_messages"),
  messages: jsonb("messages").$type<any[]>(),
  isUrgent: boolean("is_urgent"),
  currency: text("currency"),
  exportQuality: text("export_quality"),
  paymentStatus: text("payment_status"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orderSchema)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Order = typeof orderSchema.$inferSelect;
