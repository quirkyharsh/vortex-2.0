/**
 * User profiling utilities for personalized recommendations
 */

import { calculateTimeDecay } from '../utils/mathUtils';
import type { UserInteraction } from '@shared/schema';

export interface UserProfile {
  categories: Record<string, number>;
  biasTypes: Record<string, number>;
  tfIdfVector: number[];
  totalInteractions: number;
}

export interface UserProfileData {
  preferredCategories: string[];
  preferredBiasTypes: string[];
  tfIdfProfile: string;
}

const INTERACTION_WEIGHTS: Record<string, number> = {
  'click': 1.0,
  'view': 2.0,
  'share': 3.0,
  'like': 2.5
};

export class UserProfiler {
  /**
   * Build comprehensive user profile from interactions
   */
  buildProfile(
    interactions: UserInteraction[], 
    articleVectors: Map<number, number[]>,
    vocabularySize: number
  ): UserProfile {
    const profile: UserProfile = {
      categories: {},
      biasTypes: {},
      tfIdfVector: new Array(vocabularySize).fill(0),
      totalInteractions: 0
    };

    let totalWeight = 0;

    for (const interaction of interactions) {
      const weight = INTERACTION_WEIGHTS[interaction.interactionType] || 1.0;
      const timeDecayFactor = calculateTimeDecay(new Date(interaction.timestamp));
      const finalWeight = weight * timeDecayFactor;

      // Update category preferences
      profile.categories[interaction.category] = 
        (profile.categories[interaction.category] || 0) + finalWeight;

      // Update bias preferences
      profile.biasTypes[interaction.politicalBias] = 
        (profile.biasTypes[interaction.politicalBias] || 0) + finalWeight;

      // Update TF-IDF profile
      const articleVector = articleVectors.get(interaction.articleId);
      if (articleVector) {
        for (let i = 0; i < profile.tfIdfVector.length; i++) {
          profile.tfIdfVector[i] += articleVector[i] * finalWeight;
        }
      }

      totalWeight += finalWeight;
      profile.totalInteractions++;
    }

    // Normalize vectors and preferences
    this.normalizeProfile(profile, totalWeight);
    
    return profile;
  }

  /**
   * Normalize profile data
   */
  private normalizeProfile(profile: UserProfile, totalWeight: number): void {
    // Normalize TF-IDF vector
    if (totalWeight > 0) {
      for (let i = 0; i < profile.tfIdfVector.length; i++) {
        profile.tfIdfVector[i] /= totalWeight;
      }
    }

    // Normalize category preferences
    const totalCategoryWeight = Object.values(profile.categories).reduce((sum, val) => sum + val, 0);
    if (totalCategoryWeight > 0) {
      Object.keys(profile.categories).forEach(key => {
        profile.categories[key] /= totalCategoryWeight;
      });
    }

    // Normalize bias preferences
    const totalBiasWeight = Object.values(profile.biasTypes).reduce((sum, val) => sum + val, 0);
    if (totalBiasWeight > 0) {
      Object.keys(profile.biasTypes).forEach(key => {
        profile.biasTypes[key] /= totalBiasWeight;
      });
    }
  }

  /**
   * Convert profile to storage format
   */
  exportProfileData(profile: UserProfile, vocabulary: string[]): UserProfileData {
    const sortedCategories = Object.entries(profile.categories)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category)
      .slice(0, 5);

    const sortedBiasTypes = Object.entries(profile.biasTypes)
      .sort(([,a], [,b]) => b - a)
      .map(([bias]) => bias)
      .slice(0, 3);

    return {
      preferredCategories: sortedCategories,
      preferredBiasTypes: sortedBiasTypes,
      tfIdfProfile: JSON.stringify({
        vector: profile.tfIdfVector,
        vocabulary,
        totalInteractions: profile.totalInteractions
      })
    };
  }
}