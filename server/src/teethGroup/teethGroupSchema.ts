import { jsonb, pgTable, uuid } from "drizzle-orm/pg-core";

export const teethGroups = pgTable("teeth_group", {
    id: uuid("id").primaryKey().defaultRandom(),
    teethGroup: jsonb("teeth_group").notNull(),
    selectedTeeth: jsonb("selected_teeth").notNull()
  });
  