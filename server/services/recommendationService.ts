import { recommendationEngine } from './recommendationEngine';
import type { Article, UserInteraction } from '@shared/schema';

/**
 * Backward compatibility adapter for the recommendation system
 */
export class RecommendationService {
  constructor() {
    // Using new modular recommendation engine
  }

  /**
   * Build TF-IDF model from all articles
   */
  async buildTfIdfModel(articles: Article[]): Promise<void> {
    await recommendationEngine.initialize(articles);
  }


  /**
   * Get personalized recommendations for a user
   */
  async getRecommendations(
    userId: number, 
    interactions: UserInteraction[], 
    articles: Article[], 
    excludeArticleIds: number[] = [],
    limit: number = 10
  ): Promise<Array<{article: Article, score: number, reason: string}>> {
    return recommendationEngine.getRecommendations(
      userId,
      interactions,
      articles,
      excludeArticleIds,
      limit
    );
  }


  /**
   * Update user preferences in storage format
   */
  async generateUserPreferencesData(userId: number, interactions: UserInteraction[]) {
    return recommendationEngine.exportUserPreferences(userId, interactions);
  }
}

export const recommendationService = new RecommendationService();