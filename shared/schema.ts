import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  mood: varchar("mood"), // emoji or mood identifier
  moodScore: integer("mood_score"), // 1-5 scale
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI responses table
export const aiResponses = pgTable("ai_responses", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id").notNull(),
  response: text("response").notNull(),
  followUpQuestions: jsonb("follow_up_questions"), // array of questions
  insights: jsonb("insights"), // structured insights from AI
  responseType: varchar("response_type").default("initial"), // initial, follow_up, advice
  createdAt: timestamp("created_at").defaultNow(),
});

// User insights/patterns table
export const userInsights = pgTable("user_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  insightType: varchar("insight_type").notNull(), // pattern, growth_area, strength
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: integer("confidence"), // 1-100 confidence score
  createdAt: timestamp("created_at").defaultNow(),
});

// Advice requests table
export const adviceRequests = pgTable("advice_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  topic: varchar("topic"), // stress, anxiety, relationships, etc.
  request: text("request").notNull(),
  response: text("response"),
  techniques: jsonb("techniques"), // array of coping techniques
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(journalEntries),
  userInsights: many(userInsights),
  adviceRequests: many(adviceRequests),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
  aiResponses: many(aiResponses),
}));

export const aiResponsesRelations = relations(aiResponses, ({ one }) => ({
  journalEntry: one(journalEntries, {
    fields: [aiResponses.entryId],
    references: [journalEntries.id],
  }),
}));

export const userInsightsRelations = relations(userInsights, ({ one }) => ({
  user: one(users, {
    fields: [userInsights.userId],
    references: [users.id],
  }),
}));

export const adviceRequestsRelations = relations(adviceRequests, ({ one }) => ({
  user: one(users, {
    fields: [adviceRequests.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiResponseSchema = createInsertSchema(aiResponses).omit({
  id: true,
  createdAt: true,
});

export const insertUserInsightSchema = createInsertSchema(userInsights).omit({
  id: true,
  createdAt: true,
});

export const insertAdviceRequestSchema = createInsertSchema(adviceRequests).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type AiResponse = typeof aiResponses.$inferSelect;
export type InsertAiResponse = z.infer<typeof insertAiResponseSchema>;
export type UserInsight = typeof userInsights.$inferSelect;
export type InsertUserInsight = z.infer<typeof insertUserInsightSchema>;
export type AdviceRequest = typeof adviceRequests.$inferSelect;
export type InsertAdviceRequest = z.infer<typeof insertAdviceRequestSchema>;
