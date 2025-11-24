import { pgTable, text, serial, integer, boolean, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Session storage table for Replit Auth
// IMPORTANT: This table is mandatory for Replit Auth - do not drop it
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
// IMPORTANT: This table is mandatory for Replit Auth - do not drop it
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Added schemas for Human AI Summarizer
export const humanizeRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters long"),
  style: z.enum(['casual', 'formal', 'academic', 'creative', 'technical', 'conversational']),
  emotion: z.enum(['neutral', 'positive', 'critical']),
  paraphrasingLevel: z.enum(['minimal', 'moderate', 'extensive']).default('moderate'),
  sentenceStructure: z.enum(['simple', 'varied', 'complex']).default('varied'),
  vocabularyLevel: z.enum(['basic', 'intermediate', 'advanced']).default('intermediate'),
  language: z.enum(['us-english', 'uk-english']).default('us-english'),
  bypassAiDetection: z.boolean().default(true),
  improveGrammar: z.boolean().default(true),
  preserveKeyPoints: z.boolean().default(true),
  model: z.enum(['deepseek-chat', 'deepseek-coder', 'deepseek-instruct', 'deepseek-v3']).default('deepseek-chat'),
});

export type HumanizeRequest = z.infer<typeof humanizeRequestSchema>;

export const aiDetectionTestSchema = z.object({
  detectorName: z.string(),
  humanScore: z.number(), // 0-100, higher = more human-like
  aiScore: z.number(), // 0-100, higher = more AI-like
  status: z.enum(["passed", "failed", "error"]),
  confidence: z.string()
});

export type AiDetectionTest = z.infer<typeof aiDetectionTestSchema>;

export const humanizeResponseSchema = z.object({
  text: z.string(),
  stats: z.object({
    wordCount: z.number(),
    readingTime: z.number(),
    aiDetectionRisk: z.enum(['Very Low', 'Low', 'Medium', 'High']),
  }),
  detectionTests: z.array(aiDetectionTestSchema).optional()
});

export type HumanizeResponse = z.infer<typeof humanizeResponseSchema>;
