import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  status: text("status").$type<"planned" | "ongoing" | "done">().default("planned").notNull(),
  additionalInfo: text("additional_info"),
  stepsCompleted: jsonb("steps_completed").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Release = typeof releases.$inferSelect;
export type NewRelease = typeof releases.$inferInsert;
