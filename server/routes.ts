import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateTherapistResponse, 
  generateAdvice, 
  analyzeUserInsights, 
  generateMoodInsights 
} from "./openai";
import { 
  insertJournalEntrySchema, 
  insertAdviceRequestSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Journal entry routes
  app.post('/api/journal-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertJournalEntrySchema.parse({
        ...req.body,
        userId
      });

      const entry = await storage.createJournalEntry(entryData);
      
      // Generate AI response in background
      generateTherapistResponse(entry.content)
        .then(async (aiResponse) => {
          await storage.createAiResponse({
            entryId: entry.id,
            response: aiResponse.response,
            followUpQuestions: aiResponse.followUpQuestions,
            insights: aiResponse.insights,
            responseType: 'initial'
          });
        })
        .catch(error => {
          console.error("Error generating AI response:", error);
        });

      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  app.get('/api/journal-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getUserJournalEntries(userId);
      
      // Get AI responses for each entry
      const entriesWithResponses = await Promise.all(
        entries.map(async (entry) => {
          const aiResponses = await storage.getAiResponsesForEntry(entry.id);
          return {
            ...entry,
            aiResponses
          };
        })
      );
      
      res.json(entriesWithResponses);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.get('/api/journal-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const entry = await storage.getJournalEntry(entryId);
      
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }

      // Check if user owns this entry
      if (entry.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      const aiResponses = await storage.getAiResponsesForEntry(entryId);
      res.json({
        ...entry,
        aiResponses
      });
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  // AI follow-up response
  app.post('/api/journal-entries/:id/follow-up', isAuthenticated, async (req: any, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const { followUpAnswer } = req.body;
      const userId = req.user.claims.sub;

      const entry = await storage.getJournalEntry(entryId);
      if (!entry || entry.userId !== userId) {
        return res.status(404).json({ message: "Journal entry not found" });
      }

      // Get user's recent entries for context
      const recentEntries = await storage.getUserJournalEntries(userId);
      const recentContents = recentEntries.slice(0, 3).map(e => e.content);

      const aiResponse = await generateTherapistResponse(
        `${entry.content}\n\nFollow-up response: ${followUpAnswer}`,
        recentContents
      );

      const response = await storage.createAiResponse({
        entryId,
        response: aiResponse.response,
        followUpQuestions: aiResponse.followUpQuestions,
        insights: aiResponse.insights,
        responseType: 'follow_up'
      });

      res.json(response);
    } catch (error) {
      console.error("Error generating follow-up response:", error);
      res.status(500).json({ message: "Failed to generate follow-up response" });
    }
  });

  // Advice generation routes
  app.post('/api/advice', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = insertAdviceRequestSchema.parse({
        ...req.body,
        userId
      });

      const adviceRequest = await storage.createAdviceRequest(requestData);

      // Get user's recent entries for context
      const recentEntries = await storage.getUserJournalEntries(userId);
      const recentContents = recentEntries.slice(0, 5).map(e => e.content);

      const adviceResponse = await generateAdvice(
        requestData.topic || 'general',
        requestData.request,
        recentContents
      );

      const updatedRequest = await storage.updateAdviceRequest(
        adviceRequest.id,
        adviceResponse.advice,
        adviceResponse.techniques
      );

      res.json({
        ...updatedRequest,
        ...adviceResponse
      });
    } catch (error) {
      console.error("Error generating advice:", error);
      res.status(500).json({ message: "Failed to generate advice" });
    }
  });

  app.get('/api/advice', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const adviceRequests = await storage.getUserAdviceRequests(userId);
      res.json(adviceRequests);
    } catch (error) {
      console.error("Error fetching advice requests:", error);
      res.status(500).json({ message: "Failed to fetch advice requests" });
    }
  });

  // User insights routes
  app.get('/api/insights', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const insights = await storage.getUserInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  app.post('/api/insights/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getUserJournalEntries(userId);
      
      if (entries.length < 3) {
        return res.json({ message: "Need more journal entries to generate insights" });
      }

      const entryContents = entries.map(e => e.content);
      const analysis = await analyzeUserInsights(entryContents);

      // Store insights in database
      const insights = [];
      
      for (const pattern of analysis.patterns) {
        const insight = await storage.createUserInsight({
          userId,
          insightType: 'pattern',
          title: pattern.type,
          description: pattern.description,
          confidence: pattern.confidence
        });
        insights.push(insight);
      }

      for (const area of analysis.growthAreas) {
        const insight = await storage.createUserInsight({
          userId,
          insightType: 'growth_area',
          title: 'Growth Opportunity',
          description: area,
          confidence: 80
        });
        insights.push(insight);
      }

      for (const strength of analysis.strengths) {
        const insight = await storage.createUserInsight({
          userId,
          insightType: 'strength',
          title: 'Personal Strength',
          description: strength,
          confidence: 90
        });
        insights.push(insight);
      }

      res.json({ insights, recommendations: analysis.recommendations });
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  // Mood analytics
  app.get('/api/mood-analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getUserJournalEntries(userId);
      
      const moodData = entries
        .filter(e => e.mood)
        .map(e => ({
          mood: e.mood!,
          date: e.createdAt!.toISOString(),
          content: e.content
        }));

      if (moodData.length === 0) {
        return res.json({ message: "No mood data available" });
      }

      const moodInsights = await generateMoodInsights(moodData);
      res.json(moodInsights);
    } catch (error) {
      console.error("Error generating mood analytics:", error);
      res.status(500).json({ message: "Failed to generate mood analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
