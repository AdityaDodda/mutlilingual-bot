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
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (supports both Replit Auth and email/password)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  preferredLanguage: varchar("preferred_language").default("en"),
  authProvider: varchar("auth_provider").default("email"), // 'email' or 'replit'
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Files table for storing uploaded and converted files
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  originalName: varchar("original_name").notNull(),
  filename: varchar("filename").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(),
  sourceLanguage: varchar("source_language"),
  targetLanguages: text("target_languages").array(),
  status: varchar("status").notNull().default("uploaded"), // uploaded, processing, completed, failed
  conversionProgress: real("conversion_progress").default(0),
  outputFormats: text("output_formats").array(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Converted files table for storing conversion results
export const convertedFiles = pgTable("converted_files", {
  id: serial("id").primaryKey(),
  originalFileId: integer("original_file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
  targetLanguage: varchar("target_language").notNull(),
  filename: varchar("filename").notNull(),
  outputFormat: varchar("output_format").notNull(),
  size: integer("size").notNull(),
  downloadUrl: varchar("download_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Conversion jobs table for tracking processing status
export const conversionJobs = pgTable("conversion_jobs", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("pending"), // pending, processing, completed, failed
  progress: real("progress").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  notificationSettings: jsonb("notification_settings").default({}),
  defaultSourceLanguage: varchar("default_source_language").default("auto"),
  defaultTargetLanguages: text("default_target_languages").array(),
  theme: varchar("theme").default("light"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Translation logs table for storing translation logs
export const translationLogs = pgTable("translation_logs", {
  id: serial("id").primaryKey(),
  convertedFileId: integer("converted_file_id").notNull().references(() => convertedFiles.id, { onDelete: "cascade" }),
  logFilename: varchar("log_filename").notNull(),
  downloadUrl: varchar("download_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConvertedFileSchema = createInsertSchema(convertedFiles).omit({
  id: true,
  createdAt: true,
});

export const insertConversionJobSchema = createInsertSchema(conversionJobs).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertConvertedFile = z.infer<typeof insertConvertedFileSchema>;
export type ConvertedFile = typeof convertedFiles.$inferSelect;
export type InsertConversionJob = z.infer<typeof insertConversionJobSchema>;
export type ConversionJob = typeof conversionJobs.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertTranslationLog = typeof translationLogs.$inferInsert;
export type TranslationLog = typeof translationLogs.$inferSelect;
