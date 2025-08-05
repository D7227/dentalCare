import { z } from "zod";
import { pgTable, text, jsonb, uuid, customType } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer }>({
    dataType() {
      return "bytea";
    },
  });

export const prescriptionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(255),
  icon: z.any().nullable(), // Accept Buffer or null
  iconMimeType: z.string().nullable(), // Accept MIME type as string
  description: z.string().nullable(),
  style: z.any().optional(), // JSONB can be any valid JSON
});


export const prescription = pgTable("prescription", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    icon: bytea("icon"),
    iconMimeType: text("icon_mime_type"),
    description: text("description"),
    style: jsonb("style"),
  });
  

export type Prescription = z.infer<typeof prescriptionSchema>;
