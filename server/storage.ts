import {
  users,
  files,
  convertedFiles,
  conversionJobs,
  userPreferences,
  type User,
  type UpsertUser,
  type InsertFile,
  type File,
  type InsertConvertedFile,
  type ConvertedFile,
  type InsertConversionJob,
  type ConversionJob,
  type InsertUserPreferences,
  type UserPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Email/password authentication
  getUserByEmail(email: string): Promise<User | undefined>;
  createUserWithPassword(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User>;
  
  // File operations
  createFile(file: InsertFile): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
  getFilesByUser(userId: string): Promise<File[]>;
  updateFileStatus(id: number, status: string, progress?: number): Promise<File>;
  deleteFile(id: number): Promise<void>;
  
  // Converted file operations
  createConvertedFile(convertedFile: InsertConvertedFile): Promise<ConvertedFile>;
  getConvertedFilesByOriginal(originalFileId: number): Promise<ConvertedFile[]>;
  getConvertedFilesByUser(userId: string): Promise<ConvertedFile[]>;
  
  // Conversion job operations
  createConversionJob(job: InsertConversionJob): Promise<ConversionJob>;
  updateConversionJob(id: number, updates: Partial<ConversionJob>): Promise<ConversionJob>;
  getConversionJobsByFile(fileId: number): Promise<ConversionJob[]>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUserWithPassword(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const { v4: uuidv4 } = await import('uuid');
    const bcrypt = await import('bcrypt');
    
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const userId = uuidv4();
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        authProvider: 'email',
      })
      .returning();
    return user;
  }

  // File operations
  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async getFilesByUser(userId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .orderBy(desc(files.createdAt));
  }

  async updateFileStatus(id: number, status: string, progress?: number): Promise<File> {
    const updateData: any = { status, updatedAt: new Date() };
    if (progress !== undefined) {
      updateData.conversionProgress = progress;
    }
    
    const [updatedFile] = await db
      .update(files)
      .set(updateData)
      .where(eq(files.id, id))
      .returning();
    return updatedFile;
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  // Converted file operations
  async createConvertedFile(convertedFile: InsertConvertedFile): Promise<ConvertedFile> {
    const [newConvertedFile] = await db
      .insert(convertedFiles)
      .values(convertedFile)
      .returning();
    return newConvertedFile;
  }

  async getConvertedFilesByOriginal(originalFileId: number): Promise<ConvertedFile[]> {
    return await db
      .select()
      .from(convertedFiles)
      .where(eq(convertedFiles.originalFileId, originalFileId))
      .orderBy(desc(convertedFiles.createdAt));
  }

  async getConvertedFilesByUser(userId: string): Promise<ConvertedFile[]> {
    return await db
      .select({
        id: convertedFiles.id,
        originalFileId: convertedFiles.originalFileId,
        targetLanguage: convertedFiles.targetLanguage,
        filename: convertedFiles.filename,
        outputFormat: convertedFiles.outputFormat,
        size: convertedFiles.size,
        downloadUrl: convertedFiles.downloadUrl,
        createdAt: convertedFiles.createdAt,
      })
      .from(convertedFiles)
      .innerJoin(files, eq(convertedFiles.originalFileId, files.id))
      .where(eq(files.userId, userId))
      .orderBy(desc(convertedFiles.createdAt));
  }

  // Conversion job operations
  async createConversionJob(job: InsertConversionJob): Promise<ConversionJob> {
    const [newJob] = await db.insert(conversionJobs).values(job).returning();
    return newJob;
  }

  async updateConversionJob(id: number, updates: Partial<ConversionJob>): Promise<ConversionJob> {
    const [updatedJob] = await db
      .update(conversionJobs)
      .set(updates)
      .where(eq(conversionJobs.id, id))
      .returning();
    return updatedJob;
  }

  async getConversionJobsByFile(fileId: number): Promise<ConversionJob[]> {
    return await db
      .select()
      .from(conversionJobs)
      .where(eq(conversionJobs.fileId, fileId))
      .orderBy(desc(conversionJobs.createdAt));
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [upsertedPreferences] = await db
      .insert(userPreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedPreferences;
  }
}

export const storage = new DatabaseStorage();
