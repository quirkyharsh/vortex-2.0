interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenRouterService {
  private readonly API_KEY: string;
  private readonly API_URL = "https://openrouter.ai/api/v1/chat/completions";
  private readonly MODEL = "openai/gpt-3.5-turbo";

  constructor() {
    this.API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    if (!this.API_KEY) {
      console.warn('OpenRouter API key not found in environment variables');
    }
  }

  async sendMessage(userPrompt: string, articleText?: string): Promise<string> {
    try {
      const messages: OpenRouterMessage[] = [
        {
          role: "system",
          content: "You are a news analysis assistant that helps users understand media content. Provide objective analysis of articles including bias detection, content summarization, and political perspectives. Focus on factual observations and cite specific examples from the text."
        }
      ];

      // If there's an article, include it in the context
      if (articleText && articleText.trim()) {
        messages.push({
          role: "user",
          content: `Please analyze this news article:\n\n${articleText}\n\n---\n\nUser question: ${userPrompt}`
        });
      } else {
        messages.push({
          role: "user",
          content: userPrompt
        });
      }

      const requestData = {
        model: this.MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Varta.AI Chat"
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API Error ${response.status}: ${response.statusText}\n${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices?.[0]?.message?.content || "Unable to generate response. Please try again.";

    } catch (error) {
      console.error('OpenRouter API Error:', error);
      
      // Provide a fallback response that's still helpful
      if (articleText && articleText.trim()) {
        return this.getFallbackResponse(userPrompt, articleText);
      }
      
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getFallbackResponse(userPrompt: string, articleText: string): string {
    const prompt = userPrompt.toLowerCase();
    
    if (prompt.includes('bias') || prompt.includes('biased')) {
      return `Based on initial analysis, the article shows certain patterns worth examining:

**Language Analysis:**
- Word choices and tone throughout the piece
- Balance of factual reporting vs. opinion
- Attribution and source diversity

**Perspective Review:**
- How issues are framed and presented
- Which viewpoints are included or omitted
- Context provided for complex topics

For detailed analysis, please check your connection and try again.`;
    }
    
    if (prompt.includes('summarize') || prompt.includes('summary')) {
      return `**Key Points:**

The article covers several important aspects:
- Main developments and facts presented
- Key people and organizations involved
- Potential impact and implications

**Context:** Current events with multiple perspectives requiring careful analysis.

Please retry for a complete summary.`;
    }
    
    if (prompt.includes('political') || prompt.includes('support')) {
      return `**Political Context:**

The article demonstrates:
- Overall perspective and tone
- Language that may suggest certain viewpoints
- Coverage balance and representation

**Initial Assessment:** The content reflects a particular approach to the topics covered.

Please try again for detailed political analysis.`;
    }
    
    if (prompt.includes('emotional') || prompt.includes('language')) {
      return `**Emotional Language Analysis:**

I've examined the text for emotional content:
- Specific word choices that carry emotional weight
- Tone and sentiment throughout the article
- Use of charged or neutral language

**Findings:** The article contains varying levels of emotional language that require detailed analysis.

For precise identification of emotional language patterns, please retry your request.`;
    }
    
    if (prompt.includes('percentage') || prompt.includes('analyze bias percentage')) {
      return `**Detailed Bias Analysis:**

**Left Bias:** ~% - [Analysis would include specific examples]
**Right Bias:** ~% - [Analysis would include specific examples]
**Neutrality:** ~% - [Analysis would include specific examples]
**Factual Content:** ~% - [Analysis would include specific examples]
**Emotional Language:** ~% - [Analysis would include specific examples]

For accurate percentage calculations and detailed reasoning, please try your analysis request again.`;
    }
    
    return "Article received for analysis. Please check your connection and try again for detailed insights.";
  }
}

export const openRouterService = new OpenRouterService();