import {
  users,
  journalEntries,
  aiResponses,
  userInsights,
  adviceRequests,  //props, to fetch from other files where they were defined
  type User,
  type UpsertUser,
  type JournalEntry,
  type InsertJournalEntry,
  type AiResponse,
  type InsertAiResponse,
  type UserInsight,
  type InsertUserInsight,
  type AdviceRequest,
  type InsertAdviceRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Journal entries
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getUserJournalEntries(userId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: number): Promise<JournalEntry | undefined>;
  updateJournalEntry(id: number, entry: Partial<InsertJournalEntry>): Promise<JournalEntry>;
  
  // AI responses
  createAiResponse(response: InsertAiResponse): Promise<AiResponse>;
  getAiResponsesForEntry(entryId: number): Promise<AiResponse[]>;
  
  // User insights
  createUserInsight(insight: InsertUserInsight): Promise<UserInsight>;
  getUserInsights(userId: string): Promise<UserInsight[]>;
  
  // Advice requests
  createAdviceRequest(request: InsertAdviceRequest): Promise<AdviceRequest>;
  getUserAdviceRequests(userId: string): Promise<AdviceRequest[]>;
  updateAdviceRequest(id: number, response: string, techniques?: any[]): Promise<AdviceRequest>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

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

  // Journal entries
  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [journalEntry] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return journalEntry;
  }

  async getUserJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async getJournalEntry(id: number): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id));
    return entry;
  }

  async updateJournalEntry(id: number, entry: Partial<InsertJournalEntry>): Promise<JournalEntry> {
    const [updatedEntry] = await db
      .update(journalEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(journalEntries.id, id))
      .returning();
    return updatedEntry;
  }

  // AI responses
  async createAiResponse(response: InsertAiResponse): Promise<AiResponse> {
    const [aiResponse] = await db
      .insert(aiResponses)
      .values(response)
      .returning();
    return aiResponse;
  }

  async getAiResponsesForEntry(entryId: number): Promise<AiResponse[]> {
    return await db
      .select()
      .from(aiResponses)
      .where(eq(aiResponses.entryId, entryId))
      .orderBy(desc(aiResponses.createdAt));
  }

  // User insights
  async createUserInsight(insight: InsertUserInsight): Promise<UserInsight> {
    const [userInsight] = await db
      .insert(userInsights)
      .values(insight)
      .returning();
    return userInsight;
  }

  async getUserInsights(userId: string): Promise<UserInsight[]> {
    return await db
      .select()
      .from(userInsights)
      .where(eq(userInsights.userId, userId))
      .orderBy(desc(userInsights.createdAt));
  }

  // Advice requests
  async createAdviceRequest(request: InsertAdviceRequest): Promise<AdviceRequest> {
    const [adviceRequest] = await db
      .insert(adviceRequests)
      .values(request)
      .returning();
    return adviceRequest;
  }

  async getUserAdviceRequests(userId: string): Promise<AdviceRequest[]> {
    return await db
      .select()
      .from(adviceRequests)
      .where(eq(adviceRequests.userId, userId))
      .orderBy(desc(adviceRequests.createdAt));
  }

  async updateAdviceRequest(id: number, response: string, techniques?: any[]): Promise<AdviceRequest> {
    const [updatedRequest] = await db
      .update(adviceRequests)
      .set({ response, techniques })
      .where(eq(adviceRequests.id, id))
      .returning();
    return updatedRequest;
  }
}

export const storage = new DatabaseStorage();
