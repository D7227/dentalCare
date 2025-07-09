import { boolean, date, integer, jsonb, numeric, PgJsonBuilder, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const lifecycleStages = pgTable("lifecycle_stages", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    date: date("date"),
    time: text("time"), 
    person: text("person").notNull(),
    role: text("role").notNull(),
    icon: text("icon"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  });