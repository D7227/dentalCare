import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const clinicInformation = pgTable("clinic_information", {
    id: uuid("id").primaryKey().defaultRandom(),
    clinicId: text("clinic_id").notNull(),
    caseHandleBy: text("case_handle_by").notNull(),
    doctorMobileNumber: text("doctor_mobile_number").notNull(),
    consultingDoctorName: text("consulting_doctor_name").notNull(),
    consultingDoctorMobileNumber: text("consulting_doctor_mobile_number").notNull()
  });
  