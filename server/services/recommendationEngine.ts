/**
 * Streamlined recommendation engine using modular components
 */

import { cosineSimilarity } from '../utils/mathUtils';
import { TfIdfProcessor } from '../ml/tfidfProcessor';
import { UserProfiler, type UserProfile } from '../ml/userProfiler';
import type { Article, UserInteraction } from '@shared/schema';

interface ArticleFeatures {
  id: number;
  category: string;
  politicalBias: string;
  sentimentScore: number;
}

interface Recommendation {
  article: Article;
  score: number;
  reason: string;
}

export class RecommendationEngine {
  private tfidfProcessor: TfIdfProcessor;
  private userProfiler: UserProfiler;
  private userProfiles: Map<number, UserProfile>;
  private articleFeatures: Map<number, ArticleFeatures>;

  constructor() {
    this.tfidfProcessor = new TfIdfProcessor();
    this.userProfiler = new UserProfiler();
    this.userProfiles = new Map();
    this.articleFeatures = new Map();
  }

  /**
   * Initialize the recommendation engine with articles
   */
  async initialize(articles: Article[]): Promise<void> {
    // Build TF-IDF model
    this.tfidfProcessor.buildModel(articles);

    // Cache article features
    this.articleFeatures.clear();
    for (const article of articles) {
      this.articleFeatures.set(article.id, {
        id: article.id,
        category: article.category,
        politicalBias: article.politicalBias,
        sentimentScore: article.sentimentScore
      });
    }
  }

  /**
   * Generate personalized recommendations
   */
  async getRecommendations(
    userId: number,
    interactions: UserInteraction[],
    articles: Article[],
    excludeIds: number[] = [],
    limit: number = 10
  ): Promise<Recommendation[]> {
    
    // Build or update user profile
    if (!this.userProfiles.has(userId) || interactions.length > 0) {
      await this.buildUserProfile(userId, interactions);
    }

    const userProfile = this.userProfiles.get(userId);
    if (!userProfile || !this.tfidfProcessor.isModelReady()) {
      return this.getFallbackRecommendations(articles, limit);
    }

    // Generate recommendations
    const candidates: Recommendation[] = [];
    
    for (const article of articles) {
      if (excludeIds.includes(article.id)) continue;

      const score = this.calculateRecommendationScore(userProfile, article);
      const reason = this.generateReason(userProfile, article, score);

      candidates.push({ article, score, reason });
    }

    // Sort and diversify
    candidates.sort((a, b) => b.score - a.score);
    return this.diversifyRecommendations(candidates, limit);
  }

  /**
   * Build user profile from interactions
   */
  private async buildUserProfile(userId: number, interactions: UserInteraction[]): Promise<void> {
    if (!this.tfidfProcessor.isModelReady()) {
      throw new Error('TF-IDF model not initialized');
    }

    const articleVectors = new Map<number, number[]>();
    for (const interaction of interactions) {
      const vector = this.tfidfProcessor.getArticleVector(interaction.articleId);
      if (vector) {
        articleVectors.set(interaction.articleId, vector);
      }
    }

    const vocabularySize = this.tfidfProcessor.getVocabulary().length;
    const profile = this.userProfiler.buildProfile(interactions, articleVectors, vocabularySize);
    
    this.userProfiles.set(userId, profile);
  }

  /**
   * Calculate recommendation score for an article
   */
  private calculateRecommendationScore(profile: UserProfile, article: Article): number {
    const articleVector = this.tfidfProcessor.getArticleVector(article.id);
    if (!articleVector) return 0;

    // Content similarity (70% weight)
    const contentScore = cosineSimilarity(profile.tfIdfVector, articleVector);
    
    // Category preference (20% weight)
    const categoryScore = profile.categories[article.category] || 0;
    
    // Bias preference (10% weight)
    const biasScore = profile.biasTypes[article.politicalBias] || 0;
    
    return (contentScore * 0.7) + (categoryScore * 0.2) + (biasScore * 0.1);
  }

  /**
   * Generate explanation for recommendation
   */
  private generateReason(profile: UserProfile, article: Article, score: number): string {
    const topCategory = this.getTopPreference(profile.categories);
    
    if (article.category === topCategory) {
      return `You frequently read ${topCategory} articles`;
    } else if (score > 0.7) {
      return "Highly relevant to your interests";
    } else if (score > 0.5) {
      return "Similar to articles you've enjoyed";
    }
    
    return "Based on your reading preferences";
  }

  /**
   * Get top preference from a preference map
   */
  private getTopPreference(preferences: Record<string, number>): string {
    return Object.keys(preferences)
      .reduce((a, b) => preferences[a] > preferences[b] ? a : b, '');
  }

  /**
   * Apply diversification to avoid category clustering
   */
  private diversifyRecommendations(recommendations: Recommendation[], limit: number): Recommendation[] {
    const result: Recommendation[] = [];
    const categoryCount: Record<string, number> = {};
    const maxPerCategory = Math.max(2, Math.floor(limit / 3));

    for (const rec of recommendations) {
      const category = rec.article.category;
      const currentCount = categoryCount[category] || 0;

      if (currentCount < maxPerCategory || result.length < limit * 0.7) {
        result.push(rec);
        categoryCount[category] = currentCount + 1;
      }

      if (result.length >= limit) break;
    }

    return result;
  }

  /**
   * Fallback recommendations for new users
   */
  private getFallbackRecommendations(articles: Article[], limit: number): Recommendation[] {
    return articles
      .map(article => ({
        article,
        score: Math.abs(article.sentimentScore) + this.getRecencyBonus(article),
        reason: "Trending article"
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate recency bonus for articles
   */
  private getRecencyBonus(article: Article): number {
    const daysOld = Math.min(7, Math.max(0, 
      (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return 1 - (daysOld / 7);
  }

  /**
   * Export user preferences for storage
   */
  async exportUserPreferences(userId: number, interactions: UserInteraction[]) {
    await this.buildUserProfile(userId, interactions);
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      throw new Error('User profile not found');
    }

    const vocabulary = this.tfidfProcessor.getVocabulary();
    return this.userProfiler.exportProfileData(profile, vocabulary);
  }
}

export const recommendationEngine = new RecommendationEngine();