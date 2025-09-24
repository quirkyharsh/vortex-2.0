import { GoogleGenAI } from "@google/genai";

interface ArticleAnalysis {
  summary: string;
  category: string;
  bias: 'left' | 'right' | 'neutral';
  biasConfidence: number;
  sentimentScore: number;
  emotionalTone: 'positive' | 'negative' | 'neutral';
}

class AIService {
  private gemini: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('[AIService] API key not found - using fallback analysis');
    }
    
    this.gemini = new GoogleGenAI({ apiKey });
  }

  async analyzeArticle(title: string, content: string): Promise<ArticleAnalysis> {
    if (!process.env.GEMINI_API_KEY) {
      // Return default analysis if no API key
      return this.getDefaultAnalysis(title, content);
    }

    try {
      const systemPrompt = `Analyze the news article and return structured JSON with these fields:
- summary: Key points in 2-3 sentences
- category: general, politics, technology, health, finance, or sports
- bias: left, right, or neutral
- biasConfidence: 0-1 confidence score
- sentimentScore: -1 (negative) to 1 (positive)
- emotionalTone: positive, negative, or neutral

Title: ${title}
Content: ${content.substring(0, 2000)}`;

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              category: { type: "string" },
              bias: { type: "string" },
              biasConfidence: { type: "number" },
              sentimentScore: { type: "number" },
              emotionalTone: { type: "string" }
            },
            required: ["summary", "category", "bias", "biasConfidence", "sentimentScore", "emotionalTone"]
          }
        },
        contents: `Analyze this news article: Title: ${title}\n\nContent: ${content.substring(0, 2000)}`
      });

      const analysisText = response.text;
      if (!analysisText) {
        const errorMessage = 'Empty response from AI service';
        console.error('[AIService]', errorMessage);
        throw new Error(errorMessage);
      }

      const analysis = JSON.parse(analysisText);
      
      // Validate and sanitize response
      return {
        summary: analysis.summary || this.generateFallbackSummary(content),
        category: this.validateCategory(analysis.category),
        bias: this.validateBias(analysis.bias),
        biasConfidence: Math.max(0, Math.min(1, analysis.biasConfidence || 0.5)),
        sentimentScore: Math.max(-1, Math.min(1, analysis.sentimentScore || 0)),
        emotionalTone: this.validateEmotionalTone(analysis.emotionalTone),
      };
    } catch (error) {
      console.error('[AIService] Analysis failed, using fallback:', error);
      return this.getDefaultAnalysis(title, content);
    }
  }

  private getDefaultAnalysis(title: string, content: string): ArticleAnalysis {
    return {
      summary: this.generateFallbackSummary(content),
      category: this.inferCategoryFromText(title + ' ' + content),
      bias: 'neutral',
      biasConfidence: 0.3,
      sentimentScore: 0,
      emotionalTone: 'neutral',
    };
  }

  private generateFallbackSummary(content: string): string {
    // Simple fallback: take first 2 sentences or first 200 chars
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ').trim() + '.';
    }
    return content.substring(0, 200).trim() + '...';
  }

  private inferCategoryFromText(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('government') || lowerText.includes('election') || lowerText.includes('parliament') || lowerText.includes('policy')) {
      return 'politics';
    }
    if (lowerText.includes('technology') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('startup')) {
      return 'technology';
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('hospital') || lowerText.includes('disease')) {
      return 'health';
    }
    if (lowerText.includes('economy') || lowerText.includes('market') || lowerText.includes('finance') || lowerText.includes('gdp') || lowerText.includes('rupee')) {
      return 'finance';
    }
    if (lowerText.includes('cricket') || lowerText.includes('football') || lowerText.includes('sports') || lowerText.includes('match')) {
      return 'sports';
    }
    
    return 'general';
  }

  private validateCategory(category: string): string {
    const validCategories = ['politics', 'technology', 'health', 'finance', 'sports'];
    return validCategories.includes(category) ? category : 'general';
  }

  private validateBias(bias: string): 'left' | 'right' | 'neutral' {
    const validBias = ['left', 'right', 'neutral'];
    return validBias.includes(bias) ? bias as 'left' | 'right' | 'neutral' : 'neutral';
  }

  private validateEmotionalTone(tone: string): 'positive' | 'negative' | 'neutral' {
    const validTones = ['positive', 'negative', 'neutral'];
    return validTones.includes(tone) ? tone as 'positive' | 'negative' | 'neutral' : 'neutral';
  }

  async generateNewsArticle(category: string, topic?: string): Promise<{title: string, content: string, urlToImage?: string}> {
    if (!process.env.GEMINI_API_KEY) {
      const errorMessage = 'AI API key not configured';
      console.error('[AIService]', errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const prompt = topic 
        ? `Generate a realistic news article about ${topic} in the ${category} category.`
        : `Generate a realistic news article in the ${category} category about current trending topics.`;

      const systemPrompt = `Generate a news article with proper journalistic structure. Return JSON with title, content (300-500 words), and urlToImage. Include realistic quotes and details while maintaining professional news writing standards.`;

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              urlToImage: { type: "string" }
            },
            required: ["title", "content"]
          }
        },
        contents: prompt
      });

      const articleText = response.text;
      if (!articleText) {
        const errorMessage = 'Empty response from AI service';
        console.error('[AIService]', errorMessage);
        throw new Error(errorMessage);
      }

      const article = JSON.parse(articleText);
      
      return {
        title: article.title || "Generated News Article",
        content: article.content || "Content generation failed.",
        urlToImage: article.urlToImage
      };
    } catch (error) {
      const errorMessage = `Failed to generate article: ${error}`;
      console.error('[AIService]', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const aiService = new AIService();
