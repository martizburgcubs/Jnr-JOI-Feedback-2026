import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const responses = sqliteTable("responses", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  school: text("school").notNull(),
  division: text("division").notNull(),
  communication: integer("communication").notNull(),
  infoPack: integer("info_pack").notNull(),
  gameFormat: integer("game_format").notNull(),
  scheduling: integer("scheduling").notNull(),
  officiating: integer("officiating").notNull(),
  facilities: integer("facilities").notNull(),
  organisation: integer("organisation").notNull(),
  hosting: integer("hosting").notNull(),
  accommodation: integer("accommodation").notNull(),
  meals: integer("meals").notNull(),
  overall: integer("overall").notNull(),
  schedulePace: text("schedule_pace").notNull(),
  strengths: text("strengths").notNull(),
  priorityArea: text("priority_area").notNull(),
  highlight: text("highlight").notNull().default(""),
  improvement: text("improvement").notNull().default(""),
  returnIntent: text("return_intent").notNull(),
  comments: text("comments").notNull().default(""),
});

export type TournamentResponse = typeof responses.$inferSelect;
