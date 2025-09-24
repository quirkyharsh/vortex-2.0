import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { newsService } from "./services/newsService";
import { translationService } from "./services/translationService";
import { recommendationService } from "./services/recommendationService";
import { initializeDatabase } from "./data/dataSeed";
import { FilterSchema, loginSchema, signupSchema, insertUserInteractionSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validation = signupSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: validation.error.issues 
        });
      }

      const { fullName, email, password } = validation.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Create user (password hashing would be done in a real app)
      const user = await storage.createUser({ fullName, email, password });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: validation.error.issues 
        });
      }

      const { email, password } = validation.data;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Get articles with filters
  app.get("/api/articles", async (req, res) => {
    try {
      // Parse query parameters properly
      const query = req.query;
      const filters = {
        categories: Array.isArray(query.categories) ? query.categories.filter(c => typeof c === 'string') as string[] : (query.categories ? [query.categories as string] : []),
        biasTypes: Array.isArray(query.biasTypes) ? query.biasTypes.filter(b => typeof b === 'string') as string[] : (query.biasTypes ? [query.biasTypes as string] : []),
        sentiments: Array.isArray(query.sentiments) ? query.sentiments.filter(s => typeof s === 'string') as string[] : (query.sentiments ? [query.sentiments as string] : []),
        timeRange: query.timeRange as string || '',
        language: query.language as string || 'en',
        search: query.search as string || '',
      };
      
      const limit = parseInt(query.limit as string) || 20;
      const offset = parseInt(query.offset as string) || 0;
      
      const articles = await storage.getArticles(filters, limit, offset);
      res.json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get single article
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Translate article
  app.post("/api/articles/:id/translate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { language } = req.body;
      
      if (!language) {
        return res.status(400).json({ message: "Language is required" });
      }
      
      const translation = await translationService.translateArticle(id, language);
      res.json(translation);
    } catch (error) {
      console.error('Error translating article:', error);
      res.status(500).json({ message: "Failed to translate article" });
    }
  });

  // Bulk translate all articles to a specific language
  app.post("/api/articles/translate-all", async (req, res) => {
    try {
      const { language } = req.body;
      
      if (!language) {
        return res.status(400).json({ message: "Language is required" });
      }
      
      if (language === 'en') {
        return res.status(400).json({ message: "Cannot translate to English as it is the source language" });
      }
      
      const result = await translationService.translateAllArticles(language);
      res.json({
        message: `Bulk translation completed: ${result.translated} articles translated, ${result.skipped} skipped, ${result.errors} errors`,
        ...result
      });
    } catch (error) {
      console.error('Error bulk translating articles:', error);
      res.status(500).json({ message: "Failed to translate articles" });
    }
  });

  // Get translation for article
  app.get("/api/articles/:id/translations/:language", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { language } = req.params;
      
      const translation = await storage.getTranslation(id, language);
      
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      
      res.json(translation);
    } catch (error) {
      console.error('Error fetching translation:', error);
      res.status(500).json({ message: "Failed to fetch translation" });
    }
  });

  // Get available languages
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await translationService.getAvailableLanguages();
      res.json(languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  // Get article statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getArticleStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Refresh news feed
  app.post("/api/refresh", async (req, res) => {
    try {
      await newsService.generateAndRefresh();
      res.json({ message: "News feed refreshed successfully with AI-generated content" });
    } catch (error) {
      console.error('Error refreshing news:', error);
      res.status(500).json({ message: "Failed to refresh news feed" });
    }
  });

  // Generate new articles using Gemini AI
  app.post("/api/generate", async (req, res) => {
    try {
      const { count = 3 } = req.body;
      await newsService.generateNewsArticles(count);
      res.json({ message: `Successfully generated ${count} new articles using Gemini AI` });
    } catch (error) {
      console.error('Error generating articles:', error);
      res.status(500).json({ message: "Failed to generate articles" });
    }
  });

  // Search articles
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const articles = await storage.getArticles({ search: query });
      res.json(articles);
    } catch (error) {
      console.error('Error searching articles:', error);
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  // User Interaction Routes
  app.post("/api/interact", async (req, res) => {
    try {
      // Create a simplified validation schema for the API
      const simpleInteractionSchema = z.object({
        userId: z.number(),
        articleId: z.number(),
        interactionType: z.string(),
        sessionDuration: z.number().optional()
      });

      const validation = simpleInteractionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid interaction data", 
          errors: validation.error.issues 
        });
      }

      // Fetch article details to get category and politicalBias
      const articles = await storage.getArticles();
      const article = articles.find(a => a.id === validation.data.articleId);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Create the complete interaction data
      const interactionData = {
        ...validation.data,
        category: article.category,
        politicalBias: article.politicalBias
      };

      const interaction = await storage.createUserInteraction(interactionData);
      
      // Update user preferences based on this interaction
      const userInteractions = await storage.getUserInteractions(validation.data.userId, 50);
      const allArticles = await storage.getArticles();
      
      // Build TF-IDF model if not already built
      await recommendationService.buildTfIdfModel(allArticles);
      
      // Generate updated user preferences
      const preferencesData = await recommendationService.generateUserPreferencesData(
        validation.data.userId, 
        userInteractions
      );
      
      await storage.createOrUpdateUserPreferences({
        userId: validation.data.userId,
        ...preferencesData
      });

      res.status(201).json(interaction);
    } catch (error) {
      console.error('Error storing user interaction:', error);
      res.status(500).json({ message: "Failed to store interaction" });
    }
  });

  // Personalized Recommendations Route
  app.get("/api/recommend/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const excludeViewed = req.query.excludeViewed === 'true';

      // Get user interactions
      const userInteractions = await storage.getUserInteractions(userId, 100);
      
      // Get all articles
      const articles = await storage.getArticles({}, 200); // Get more articles for better recommendations
      
      // Build TF-IDF model
      await recommendationService.buildTfIdfModel(articles);
      
      // Get articles user has already interacted with (to exclude)
      const excludeArticleIds = excludeViewed 
        ? userInteractions.map(interaction => interaction.articleId)
        : [];

      // Get personalized recommendations
      const recommendations = await recommendationService.getRecommendations(
        userId,
        userInteractions,
        articles,
        excludeArticleIds,
        limit
      );

      res.json({
        recommendations,
        totalInteractions: userInteractions.length,
        userId
      });

    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Intelligent Refresh Recommendations Route
  app.get("/api/recommend/:userId/refresh", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const count = parseInt(req.query.count as string) || 3;

      // Get user interactions, focusing on liked articles
      const userInteractions = await storage.getUserInteractions(userId, 100);
      const likedArticles = userInteractions.filter(interaction => 
        interaction.interactionType === 'like'
      );

      if (likedArticles.length === 0) {
        return res.json({
          newRecommendations: [],
          message: "Like some articles first to get smart refresh recommendations"
        });
      }

      // Extract preferred categories and bias types from liked articles
      const preferredCategories = Array.from(new Set(likedArticles.map(interaction => interaction.category)));
      const preferredBiasTypes = Array.from(new Set(likedArticles.map(interaction => interaction.politicalBias)));

      // Get all articles and filter by user preferences
      const allArticles = await storage.getArticles({}, 200);
      const interactedArticleIds = userInteractions.map(interaction => interaction.articleId);
      
      const filteredArticles = allArticles.filter(article => 
        !interactedArticleIds.includes(article.id) && // Not already interacted with
        (preferredCategories.includes(article.category) || 
         preferredBiasTypes.includes(article.politicalBias))
      );

      // Build TF-IDF model
      await recommendationService.buildTfIdfModel(allArticles);
      
      // Get smart recommendations from filtered articles
      const smartRecommendations = await recommendationService.getRecommendations(
        userId,
        userInteractions,
        filteredArticles,
        interactedArticleIds,
        count
      );

      res.json({
        newRecommendations: smartRecommendations,
        basedOnCategories: preferredCategories,
        basedOnBiasTypes: preferredBiasTypes,
        totalLikedArticles: likedArticles.length
      });

    } catch (error) {
      console.error('Error generating refresh recommendations:', error);
      res.status(500).json({ message: "Failed to generate refresh recommendations" });
    }
  });

  // Get user interaction history
  app.get("/api/users/:userId/interactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const interactions = await storage.getUserInteractions(userId, limit);
      
      res.json(interactions);
    } catch (error) {
      console.error('Error fetching user interactions:', error);
      res.status(500).json({ message: "Failed to fetch user interactions" });
    }
  });

  // Get user preferences
  app.get("/api/users/:userId/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }

      res.json(preferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  // Save/Update user preferences  
  app.post("/api/users/:userId/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Validate the request body
      const validation = insertUserPreferencesSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid preferences data", 
          errors: validation.error.issues 
        });
      }

      const preferences = await storage.createOrUpdateUserPreferences(validation.data);
      
      res.status(200).json(preferences);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ message: "Failed to save user preferences" });
    }
  });

  const httpServer = createServer(app);

  // Initialize database with seed data, then fetch fresh content
  setTimeout(async () => {
    try {
      await initializeDatabase();
      
      // Attempt to fetch fresh news content
      try {
        await newsService.generateAndRefresh();
      } catch (error) {
        console.log('External content fetch failed, using seed data');
      }
    } catch (error) {
      console.error('Failed to initialize application data:', error);
    }
  }, 2000);

  return httpServer;
}
