import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Added schemas for Human AI Summarizer
export const humanizeRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters long"),
  style: z.enum(['casual', 'formal', 'academic', 'creative', 'technical', 'conversational']),
  emotion: z.enum(['neutral', 'positive', 'critical']),
  paraphrasingLevel: z.enum(['minimal', 'moderate', 'extensive']).default('moderate'),
  sentenceStructure: z.enum(['simple', 'varied', 'complex']).default('varied'),
  vocabularyLevel: z.enum(['basic', 'intermediate', 'advanced']).default('intermediate'),
  bypassAiDetection: z.boolean().default(true),
  improveGrammar: z.boolean().default(true),
  preserveKeyPoints: z.boolean().default(true),
  model: z.enum(['deepseek-chat', 'deepseek-coder', 'deepseek-instruct', 'deepseek-v3']).default('deepseek-chat'),
});

export type HumanizeRequest = z.infer<typeof humanizeRequestSchema>;

export const humanizeResponseSchema = z.object({
  text: z.string(),
  stats: z.object({
    wordCount: z.number(),
    readingTime: z.number(),
    aiDetectionRisk: z.enum(['Very Low', 'Low', 'Medium', 'High']),
  }),
});

export type HumanizeResponse = z.infer<typeof humanizeResponseSchema>;
