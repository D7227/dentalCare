import {
    pgTable,
    uuid,
    text,
    integer,
    jsonb,
    timestamp,
    date,
    numeric,
  } from "drizzle-orm/pg-core";
  
  export const draftOrders = pgTable("draft_order", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    firstName: text("first_name"),
    lastName: text("last_name"),
    age: integer("age"),
    sex: text("sex"),
  
    clinicId: text("clinic_id"),
    caseHandleBy: text("case_handle_by"),
    doctorMobileNumber: text("doctor_mobile_number"),
    consultingDoctorName: text("consulting_doctor_name"),
    consultingDoctorMobileNumber: text("consulting_doctor_mobile_number"),
  
    orderMethod: text("order_method"), // "Digital" or "Manual"
    prescriptionTypesId: jsonb("prescription_types_id").$type<string[]>(),
    subPrescriptionTypesId: jsonb("sub_prescription_types_id").$type<string[]>(),
  
    selectedTeeth: jsonb("selected_teeth").$type<any[]>(),
    teethGroup: jsonb("teeth_group").$type<any[]>(),
    teethNumber: jsonb("teeth_number").$type<any[]>(),
  
    products: jsonb("products").$type<any[]>(),
    files: jsonb("files").$type<any>(),
  
    accessorios: jsonb("accessorios").$type<any[]>(),
    handllingType: text("handlling_type"),
  
    pickupData: jsonb("pickup_data").$type<any[]>(),
    courierData: jsonb("courier_data").$type<any[]>(),
  
    resonOfReject: text("reson_of_reject"),
    resonOfRescan: text("reson_of_rescan"),
    rejectNote: text("reject_note"),
  
    orderId: text("order_id"),
    crateNo: text("crate_no"),
    qaNote: text("qa_note"),
    orderBy: text("order_by"),
  
    AcpectedDileveryData: date("acpected_dilevery_data"),
    lifeCycle: jsonb("life_cycle").$type<any[]>(),
  
    orderStatus: text("order_status"),
    refId: text("ref_id"),
    orderDate: text("order_date"),
    updateDate: text("update_date"),
  
    totalAmount: text("total_amount"),
    paymentType: text("payment_type"),
    doctorNote: text("doctor_note"),
    orderType: text("order_type"),
  
    step: integer("step"),
  
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  });
  