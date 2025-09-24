import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  source: text("source").notNull(),
  author: text("author"),
  category: text("category").notNull(), // politics, technology, health, finance, sports
  publishedAt: timestamp("published_at").notNull(),
  
  // AI Analysis
  politicalBias: text("political_bias").notNull(), // left, right, neutral
  biasConfidence: real("bias_confidence").notNull().default(0.5),
  sentimentScore: real("sentiment_score").notNull().default(0.0), // -1 to 1
  emotionalTone: text("emotional_tone").notNull(), // positive, negative, neutral
  
  // Translation status
  availableLanguages: text("available_languages").array().default([]).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").references(() => articles.id).notNull(),
  language: text("language").notNull(), // hi, mr, ta, te
  translatedTitle: text("translated_title").notNull(),
  translatedContent: text("translated_content").notNull(),
  translatedSummary: text("translated_summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type Article = typeof articles.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type User = typeof users.$inferSelect;

// Filter types for frontend
export const FilterSchema = z.object({
  categories: z.array(z.string()).optional(),
  biasTypes: z.array(z.string()).optional(),
  sentiments: z.array(z.string()).optional(),
  timeRange: z.string().optional(),
  search: z.string().optional(),
  language: z.string().optional(),
});

export type FilterState = z.infer<typeof FilterSchema>;

// Language type for frontend
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Message type for chat
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  sessionId: string;
  timestamp: Date;
}


// User Interactions for Recommendation System
export const userInteractions = pgTable("user_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  articleId: integer("article_id").references(() => articles.id).notNull(),
  interactionType: text("interaction_type").notNull(), // 'click', 'view', 'share', 'like'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionDuration: integer("session_duration"), // in seconds, for view interactions
  category: text("category").notNull(), // cached from article for faster queries
  politicalBias: text("political_bias").notNull(), // cached from article
});

// User Preferences derived from interactions
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  preferredCategories: text("preferred_categories").array().default([]).notNull(),
  preferredLanguages: text("preferred_languages").array().default([]).notNull(),
  preferredTone: text("preferred_tone"), // 'neutral', 'opinionated', 'emotional'
  dislikedTopics: text("disliked_topics").array().default([]).notNull(),
  preferredBiasTypes: text("preferred_bias_types").array().default([]).notNull(),
  tfIdfProfile: text("tf_idf_profile"), // JSON string of user's TF-IDF profile
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertUserInteractionSchema = createInsertSchema(userInteractions).omit({
  id: true,
  timestamp: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  lastUpdated: true,
});

// Schema for user onboarding preferences form
export const userOnboardingSchema = z.object({
  preferredCategories: z.array(z.string()).min(1, "Please select at least one category"),
  preferredLanguages: z.array(z.string()).min(1, "Please select at least one language"),
  preferredTone: z.string().min(1, "Please select a preferred tone"),
  dislikedTopics: z.array(z.string()).optional(),
});

export type InsertUserInteraction = z.infer<typeof insertUserInteractionSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserInteraction = typeof userInteractions.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type UserOnboardingData = z.infer<typeof userOnboardingSchema>;
