import { articles, translations, users, userInteractions, userPreferences, type Article, type InsertArticle, type Translation, type InsertTranslation, type User, type InsertUser, type FilterState, type UserInteraction, type InsertUserInteraction, type UserPreferences, type InsertUserPreferences } from "@shared/schema";

export interface IStorage {
  // Articles
  getArticles(filters?: FilterState, limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined>;
  
  // Translations
  getTranslation(articleId: number, language: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  getTranslationsByArticle(articleId: number): Promise<Translation[]>;
  
  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stats
  getArticleStats(): Promise<{
    total: number;
    today: number;
    translated: number;
    byCategory: Record<string, number>;
    byBias: Record<string, number>;
    bySentiment: Record<string, number>;
  }>;

  // User Interactions
  createUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction>;
  getUserInteractions(userId: number, limit?: number): Promise<UserInteraction[]>;
  getUserInteractionsByArticle(articleId: number): Promise<UserInteraction[]>;

  // User Preferences
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private articles: Map<number, Article>;
  private translations: Map<string, Translation>;
  private users: Map<string, User>;
  private userInteractions: Map<number, UserInteraction>;
  private userPreferences: Map<number, UserPreferences>;
  private currentArticleId: number;
  private currentTranslationId: number;
  private currentUserId: number;
  private currentInteractionId: number;
  private currentPreferencesId: number;

  constructor() {
    this.articles = new Map();
    this.translations = new Map();
    this.users = new Map();
    this.userInteractions = new Map();
    this.userPreferences = new Map();
    this.currentArticleId = 1;
    this.currentTranslationId = 1;
    this.currentUserId = 1;
    this.currentInteractionId = 1;
    this.currentPreferencesId = 1;
  }

  async getArticles(filters?: FilterState, limit = 20, offset = 0): Promise<Article[]> {
    let articleList = Array.from(this.articles.values());

    // Apply filters
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        // Separate language filters from category filters
        const languageFilters = filters.categories.filter(c => 
          ['hindi', 'marathi', 'english', 'kannada', 'tamil', 'telugu'].includes(c)
        );
        const categoryFilters = filters.categories.filter(c => 
          !['hindi', 'marathi', 'english', 'kannada', 'tamil', 'telugu'].includes(c)
        );
        
        // Apply category filters
        if (categoryFilters.length > 0) {
          articleList = articleList.filter(a => categoryFilters.includes(a.category));
        }
        
        // Apply language filters - check if article title contains characters from that language
        if (languageFilters.length > 0) {
          articleList = articleList.filter(a => {
            const title = a.title;
            return languageFilters.some(lang => {
              switch (lang) {
                case 'hindi':
                  return /[\u0900-\u097F]/.test(title); // Devanagari script
                case 'marathi':
                  return /[\u0900-\u097F]/.test(title); // Devanagari script (same as Hindi)
                case 'english':
                  return /^[A-Za-z\s\W]*$/.test(title) && !/[\u0900-\u097F\u0C80-\u0CFF\u0B80-\u0BFF\u0C00-\u0C7F]/.test(title);
                case 'kannada':
                  return /[\u0C80-\u0CFF]/.test(title); // Kannada script
                case 'tamil':
                  return /[\u0B80-\u0BFF]/.test(title); // Tamil script
                case 'telugu':
                  return /[\u0C00-\u0C7F]/.test(title); // Telugu script
                default:
                  return false;
              }
            });
          });
        }
      }

      // Handle language-based content synchronization
      if (filters.language && filters.language !== 'en') {
        const targetLanguage = filters.language;
        const languageMap: { [key: string]: string } = {
          'hi': 'hindi',
          'mr': 'marathi', 
          'ta': 'tamil',
          'kn': 'kannada',
          'te': 'telugu',
          'ml': 'malayalam'
        };

        // For non-English languages, create translated versions of articles
        articleList = articleList.map(article => {
          const translation = this.getTranslationSync(article.id, targetLanguage);
          if (translation) {
            // Return article with translated content
            return {
              ...article,
              title: translation.translatedTitle,
              content: translation.translatedContent,
              summary: translation.translatedSummary || article.summary
            };
          } else {
            // Generate pseudo-translation for demo purposes
            const langName = languageMap[targetLanguage] || targetLanguage;
            return {
              ...article,
              title: `[${langName.toUpperCase()}] ${article.title}`,
              content: `[Translated to ${langName}] ${article.content}`,
              summary: article.summary ? `[${langName}] ${article.summary}` : article.summary
            };
          }
        });
      }
      
      if (filters.biasTypes && filters.biasTypes.length > 0) {
        articleList = articleList.filter(a => filters.biasTypes!.includes(a.politicalBias));
      }
      
      if (filters.sentiments && filters.sentiments.length > 0) {
        articleList = articleList.filter(a => filters.sentiments!.includes(a.emotionalTone));
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        articleList = articleList.filter(a => 
          a.title.toLowerCase().includes(searchLower) || 
          a.content.toLowerCase().includes(searchLower) ||
          a.summary?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.timeRange) {
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (filters.timeRange) {
          case 'Last 24 hours':
            cutoffDate.setHours(now.getHours() - 24);
            break;
          case 'Last week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'Last month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        articleList = articleList.filter(a => new Date(a.publishedAt) >= cutoffDate);
      }
    }

    // Sort by published date (newest first)
    articleList.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Apply pagination
    return articleList.slice(offset, offset + limit);
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = {
      ...insertArticle,
      id,
      summary: insertArticle.summary || null,
      imageUrl: insertArticle.imageUrl || null,
      author: insertArticle.author || null,
      biasConfidence: insertArticle.biasConfidence ?? 0.5,
      sentimentScore: insertArticle.sentimentScore ?? 0.0,
      availableLanguages: insertArticle.availableLanguages ?? [],
      createdAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...updates };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async getTranslation(articleId: number, language: string): Promise<Translation | undefined> {
    const key = `${articleId}-${language}`;
    return this.translations.get(key);
  }

  // Synchronous version for internal use
  getTranslationSync(articleId: number, language: string): Translation | undefined {
    const key = `${articleId}-${language}`;
    return this.translations.get(key);
  }

  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const id = this.currentTranslationId++;
    const translation: Translation = {
      ...insertTranslation,
      id,
      translatedSummary: insertTranslation.translatedSummary || null,
      createdAt: new Date(),
    };
    const key = `${translation.articleId}-${translation.language}`;
    this.translations.set(key, translation);
    return translation;
  }

  async getTranslationsByArticle(articleId: number): Promise<Translation[]> {
    return Array.from(this.translations.values()).filter(t => t.articleId === articleId);
  }

  async getArticleStats(): Promise<{
    total: number;
    today: number;
    translated: number;
    byCategory: Record<string, number>;
    byBias: Record<string, number>;
    bySentiment: Record<string, number>;
  }> {
    const articleList = Array.from(this.articles.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayArticles = articleList.filter(a => new Date(a.createdAt) >= today);
    const translatedArticles = articleList.filter(a => a.availableLanguages.length > 0);

    const byCategory: Record<string, number> = {};
    const byBias: Record<string, number> = {};
    const bySentiment: Record<string, number> = {};

    articleList.forEach(article => {
      // Count by traditional categories
      byCategory[article.category] = (byCategory[article.category] || 0) + 1;
      
      // Count by language based on title script detection
      const title = article.title;
      if (/[\u0900-\u097F]/.test(title)) {
        // Devanagari script - could be Hindi or Marathi
        if (title.includes('आहे') || title.includes('ते') || title.includes('करण्या') || title.includes('असून')) {
          byCategory['marathi'] = (byCategory['marathi'] || 0) + 1;
        } else {
          byCategory['hindi'] = (byCategory['hindi'] || 0) + 1;
        }
      } else if (/[\u0C80-\u0CFF]/.test(title)) {
        byCategory['kannada'] = (byCategory['kannada'] || 0) + 1;
      } else if (/[\u0B80-\u0BFF]/.test(title)) {
        byCategory['tamil'] = (byCategory['tamil'] || 0) + 1;
      } else if (/[\u0C00-\u0C7F]/.test(title)) {
        byCategory['telugu'] = (byCategory['telugu'] || 0) + 1;
      } else if (/^[A-Za-z\s\W]*$/.test(title) && !/[\u0900-\u097F\u0C80-\u0CFF\u0B80-\u0BFF\u0C00-\u0C7F]/.test(title)) {
        byCategory['english'] = (byCategory['english'] || 0) + 1;
      }
      
      byBias[article.politicalBias] = (byBias[article.politicalBias] || 0) + 1;
      bySentiment[article.emotionalTone] = (bySentiment[article.emotionalTone] || 0) + 1;
    });

    return {
      total: articleList.length,
      today: todayArticles.length,
      translated: translatedArticles.length,
      byCategory,
      byBias,
      bySentiment,
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.get(email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(user.email, user);
    return user;
  }

  // User Interactions methods
  async createUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    const id = this.currentInteractionId++;
    const userInteraction: UserInteraction = {
      ...interaction,
      id,
      timestamp: new Date(),
      sessionDuration: interaction.sessionDuration || null,
    };
    this.userInteractions.set(id, userInteraction);
    return userInteraction;
  }

  async getUserInteractions(userId: number, limit = 100): Promise<UserInteraction[]> {
    const interactions = Array.from(this.userInteractions.values())
      .filter(interaction => interaction.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    return interactions;
  }

  async getUserInteractionsByArticle(articleId: number): Promise<UserInteraction[]> {
    return Array.from(this.userInteractions.values())
      .filter(interaction => interaction.articleId === articleId);
  }

  // User Preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values())
      .find(pref => pref.userId === userId);
  }

  async createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.userId);
    
    if (existing) {
      const updated: UserPreferences = {
        ...existing,
        ...preferences,
        lastUpdated: new Date(),
      };
      this.userPreferences.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentPreferencesId++;
      const userPreferences: UserPreferences = {
        userId: preferences.userId,
        preferredCategories: preferences.preferredCategories || [],
        preferredLanguages: preferences.preferredLanguages || [],
        preferredTone: preferences.preferredTone || null,
        dislikedTopics: preferences.dislikedTopics || [],
        preferredBiasTypes: preferences.preferredBiasTypes || [],
        tfIdfProfile: preferences.tfIdfProfile || null,
        hasCompletedOnboarding: preferences.hasCompletedOnboarding || false,
        id,
        lastUpdated: new Date(),
      };
      this.userPreferences.set(id, userPreferences);
      return userPreferences;
    }
  }
}

export const storage = new MemStorage();
