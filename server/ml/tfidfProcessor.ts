/**
 * TF-IDF processing utilities for content-based recommendations
 */

import { preprocessText, calculateTermFrequency, buildVocabulary } from '../utils/textProcessor';
import type { Article } from '@shared/schema';

export interface TfIdfModel {
  vocabulary: string[];
  documentTermMatrix: Map<number, Map<string, number>>;
  articleVectors: Map<number, number[]>;
}

export class TfIdfProcessor {
  private model: TfIdfModel | null = null;

  /**
   * Build TF-IDF model from articles
   */
  buildModel(articles: Article[]): TfIdfModel {
    const documentTermMatrix = new Map<number, Map<string, number>>();
    const processedDocs: string[][] = [];

    // Process each article and build term frequency maps
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const text = `${article.title} ${article.content} ${article.summary || ''}`;
      const tokens = preprocessText(text);
      const termFreq = calculateTermFrequency(tokens);
      
      documentTermMatrix.set(i, termFreq);
      processedDocs.push(tokens);
    }

    // Build vocabulary
    const vocabulary = buildVocabulary(processedDocs);
    
    // Create TF-IDF vectors
    const articleVectors = new Map<number, number[]>();
    for (let i = 0; i < articles.length; i++) {
      const vector = this.createTfIdfVector(i, articles.length, vocabulary, documentTermMatrix);
      articleVectors.set(articles[i].id, vector);
    }

    this.model = {
      vocabulary,
      documentTermMatrix,
      articleVectors
    };

    return this.model;
  }

  /**
   * Create TF-IDF vector for a document
   */
  private createTfIdfVector(
    docIndex: number, 
    totalDocs: number, 
    vocabulary: string[],
    documentTermMatrix: Map<number, Map<string, number>>
  ): number[] {
    const vector = new Array(vocabulary.length).fill(0);
    const docTerms = documentTermMatrix.get(docIndex);
    
    if (!docTerms) return vector;
    
    const docLength = Array.from(docTerms.values()).reduce((sum, freq) => sum + freq, 0);
    
    for (let i = 0; i < vocabulary.length; i++) {
      const term = vocabulary[i];
      const termFreq = docTerms.get(term) || 0;
      
      if (termFreq > 0) {
        const tf = termFreq / docLength;
        
        // Calculate IDF
        let docsWithTerm = 0;
        for (let j = 0; j < totalDocs; j++) {
          const otherDocTerms = documentTermMatrix.get(j);
          if (otherDocTerms && otherDocTerms.has(term)) {
            docsWithTerm++;
          }
        }
        
        const idf = Math.log(totalDocs / (docsWithTerm + 1));
        vector[i] = tf * idf;
      }
    }
    
    return vector;
  }

  /**
   * Get article vector by ID
   */
  getArticleVector(articleId: number): number[] | null {
    return this.model?.articleVectors.get(articleId) || null;
  }

  /**
   * Get vocabulary
   */
  getVocabulary(): string[] {
    return this.model?.vocabulary || [];
  }

  /**
   * Check if model is built
   */
  isModelReady(): boolean {
    return this.model !== null;
  }
}