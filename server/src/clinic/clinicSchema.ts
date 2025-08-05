import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, numeric, date } from "drizzle-orm/pg-core";
import { z } from "zod";

export const clinic = pgTable("clinic", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    clinicName: text("clinic_name"),
    clinicLicenseNumber: text("clinic_license_number"),
    clinicAddressLine1: text("clinic_address_line1"),
    clinicAddressLine2: text("clinic_address_line2"),
    clinicCity: text("clinic_city"),
    clinicState: text("clinic_state"),
    clinicPincode: text("clinic_pincode"),
    clinicCountry: text("clinic_country"),
    gstNumber: text("gst_number"),
    panNumber: text("pan_number"),
    billingAddressLine1: text("billing_address_line1"),
    billingAddressLine2: text("billing_address_line2"),
    billingCity: text("billing_city"),
    billingState: text("billing_state"),
    billingPincode: text("billing_pincode"),
    billingCountry: text("billing_country"),
    password: text("password").notNull(),
    roleId: uuid("role_id").notNull(),
    permissions: jsonb("permissions").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  });

  export const insertClinicSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicName: z.string(),
    clinicLicenseNumber: z.string(),
    gstNumber: z.string(),
    panNumber: z.string(),
    password: z.string(),
    roleId: z.string(),
    permissions: z.array(z.string()),
    clinicAddressLine1: z.string().optional(),
    clinicAddressLine2: z.string().optional(),
    clinicCity: z.string().optional(),
    clinicState: z.string().optional(),
    clinicPincode: z.string().optional(),
    clinicCountry: z.string().optional(),
    billingAddressLine1: z.string().optional(),
    billingAddressLine2: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingPincode: z.string().optional(),
    billingCountry: z.string().optional(),
  });


export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type Clinic = typeof clinic.$inferSelect;
  