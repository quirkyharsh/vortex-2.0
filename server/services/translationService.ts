import { storage } from '../storage';
import type { InsertTranslation } from '@shared/schema';

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
}

class TranslationService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://translation.googleapis.com/language/translate/v2';

  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[TranslationService] API key not found - translation features disabled');
    }
  }

  private async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Translate API key not configured');
    }

    try {
      const url = `${this.baseUrl}?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text',
        }),
      });

      if (!response.ok) {
        const errorMessage = `Translation API request failed: ${response.status} ${response.statusText}`;
        console.error('[TranslationService]', errorMessage);
        throw new Error(errorMessage);
      }

      const data: GoogleTranslateResponse = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('[TranslationService] Translation failed:', error);
      throw error;
    }
  }

  async translateArticle(articleId: number, language: string): Promise<InsertTranslation> {
    // Check if translation already exists
    const existingTranslation = await storage.getTranslation(articleId, language);
    if (existingTranslation) {
      return existingTranslation;
    }

    // Get the article
    const article = await storage.getArticleById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    try {
      // Translate title, content, and summary
      const [translatedTitle, translatedContent, translatedSummary] = await Promise.all([
        this.translateText(article.title, language),
        this.translateText(article.content, language),
        article.summary ? this.translateText(article.summary, language) : Promise.resolve(''),
      ]);

      // Create translation
      const translation: InsertTranslation = {
        articleId,
        language,
        translatedTitle,
        translatedContent,
        translatedSummary,
      };

      const savedTranslation = await storage.createTranslation(translation);

      // Update article's available languages
      const updatedLanguages = Array.from(new Set([...article.availableLanguages, language]));
      await storage.updateArticle(articleId, { availableLanguages: updatedLanguages });

      return savedTranslation;
    } catch (error) {
      console.error('Error translating article:', error);
      throw error;
    }
  }

  async translateAllArticles(language: string): Promise<{ translated: number; skipped: number; errors: number }> {
    if (language === 'en') {
      throw new Error('Cannot translate to English as it is the source language');
    }

    const allArticles = await storage.getArticles({ language: 'en' }, 1000, 0); // Get all articles
    let translated = 0;
    let skipped = 0;
    let errors = 0;

    console.log(`Starting bulk translation of ${allArticles.length} articles to ${language}`);

    // Process articles in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < allArticles.length; i += batchSize) {
      const batch = allArticles.slice(i, i + batchSize);
      
      const promises = batch.map(async (article) => {
        try {
          // Check if translation already exists
          const existingTranslation = await storage.getTranslation(article.id, language);
          if (existingTranslation) {
            skipped++;
            return { success: true, skipped: true };
          }

          await this.translateArticle(article.id, language);
          translated++;
          return { success: true, skipped: false };
        } catch (error) {
          console.error(`Error translating article ${article.id}:`, error);
          errors++;
          return { success: false, error };
        }
      });

      await Promise.allSettled(promises);
      
      // Add a small delay between batches to be respectful to the API
      if (i + batchSize < allArticles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Bulk translation completed: ${translated} translated, ${skipped} skipped, ${errors} errors`);
    return { translated, skipped, errors };
  }

  async getAvailableLanguages(): Promise<Array<{ code: string; name: string; nativeName: string }>> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    ];
  }
}

export const translationService = new TranslationService();
