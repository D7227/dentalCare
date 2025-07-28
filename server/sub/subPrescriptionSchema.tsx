import { z } from "zod";
import { pgTable, text, jsonb, uuid, customType } from "drizzle-orm/pg-core";
import { prescription } from "../prescription/prescriptionSchema";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const subPrescriptionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(255),
  icon: z.any().nullable(), // Accept Buffer or null
  iconMimeType: z.string().nullable(), // Accept MIME type as string
  prescriptionId: z.string().uuid(),
  description: z.string().nullable(),
  style: z.any().optional(), // JSONB can be any valid JSON
});

export const subPrescription = pgTable("sub_prescription", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  icon: bytea("icon"),
  iconMimeType: text("icon_mime_type"),
  prescriptionId: text("prescription_id"),
  description: text("description"),
  style: jsonb("style"),
});

export type SubPrescription = z.infer<typeof subPrescriptionSchema>;
