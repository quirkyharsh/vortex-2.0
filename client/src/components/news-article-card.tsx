import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages, Share2, Bookmark, Smile, Meh, Frown, ChevronDown, ChevronUp, ExternalLink, Calendar, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import { VerificationBadge } from "@/components/verification-badge";
import type { Article, Translation } from "@shared/schema";
import { BIAS_COLORS, SENTIMENT_COLORS, CATEGORY_COLORS } from "@/lib/types";

interface NewsArticleCardProps {
  article: Article;
  onTranslate: (article: Article) => void;
}

export function NewsArticleCard({ article, onTranslate }: NewsArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return published.toLocaleDateString();
  };

  const getBiasColor = (bias: string) => {
    return BIAS_COLORS[bias as keyof typeof BIAS_COLORS] || BIAS_COLORS.neutral;
  };

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.general;
  };

  const getSentimentIcon = () => {
    switch (article.emotionalTone) {
      case 'positive': return <Smile className="h-3 w-3 text-green-500" />;
      case 'negative': return <Frown className="h-3 w-3 text-red-500" />;
      default: return <Meh className="h-3 w-3 text-gray-500" />;
    }
  };

  const getLanguageIndicators = () => {
    const languageMap: Record<string, { code: string; color: string }> = {
      'hi': { code: 'हि', color: 'bg-blue-100 text-blue-600' },
      'mr': { code: 'म', color: 'bg-red-100 text-red-600' },
      'ta': { code: 'த', color: 'bg-green-100 text-green-600' },
      'te': { code: 'తె', color: 'bg-purple-100 text-purple-600' },
    };

    return article.availableLanguages.map((lang) => {
      const langInfo = languageMap[lang];
      if (!langInfo) return null;
      
      return (
        <span 
          key={lang}
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium border-2 border-white ${langInfo.color}`}
          title={`Available in ${lang}`}
        >
          {langInfo.code}
        </span>
      );
    }).filter(Boolean);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || '',
          url: article.url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy to clipboard
      await navigator.clipboard.writeText(article.url);
    }
  };

  const handleAskAI = () => {
    // Prepare the article content for AI analysis
    const articleContent = `Title: ${article.title}\n\nSummary: ${article.summary || 'No summary available'}\n\nContent: ${article.content}\n\nSource: ${article.source}\nPublished: ${new Date(article.publishedAt).toLocaleDateString()}`;
    
    // Store the article content in sessionStorage so it can be retrieved by the chat page
    sessionStorage.setItem('articleForAnalysis', articleContent);
    
    // Navigate to the chat page
    setLocation('/chat');
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-300 hover-lift border ${
      theme === 'creative' ? 'glass-morphism' : 'bg-card border-border'
    }`}>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge 
            style={{ backgroundColor: getCategoryColor(article.category) }}
            className={`text-white capitalize transition-all duration-200 ${
              theme === 'creative' ? 'shadow-lg hover:scale-105' : ''
            }`}
          >
            {article.category}
          </Badge>
          
          <div className="flex items-center space-x-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getBiasColor(article.politicalBias) }}
              title={`${article.politicalBias} bias`}
            ></div>
            <span className="text-xs text-gray-500 capitalize">{article.politicalBias}-leaning</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {getSentimentIcon()}
            <span className="text-xs text-gray-500 capitalize">{article.emotionalTone} tone</span>
          </div>
          
          <VerificationBadge sourceUrl={article.source} className="ml-auto" />
          
          <span className="text-xs text-gray-400">{formatTimeAgo(article.publishedAt)}</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {article.title}
            </h2>
            
            {article.summary && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {article.summary}
              </p>
            )}

            {/* Expandable Content */}
            {isExpanded && (
              <div className="space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-primary">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Full Article</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {article.content}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Article Details
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Published: {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                      <div>Source: {article.source}</div>
                      {article.author && <div>Author: {article.author}</div>}
                      <div>Category: <span className="capitalize">{article.category}</span></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">AI Analysis</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getBiasColor(article.politicalBias) }}
                        ></div>
                        <span>Political Bias: <span className="capitalize">{article.politicalBias}</span> (Confidence: {Math.round(article.biasConfidence * 100)}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSentimentIcon()}
                        <span>Sentiment Score: {article.sentimentScore > 0 ? '+' : ''}{article.sentimentScore.toFixed(2)}</span>
                      </div>
                      <div>Emotional Tone: <span className="capitalize">{article.emotionalTone}</span></div>
                    </div>
                  </div>
                </div>
                
                {article.url && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t.readMore}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* See More/Less Button */}
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {t.close}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {t.readMore}
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{article.source}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                {article.author && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">By {article.author}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {article.availableLanguages.length > 0 && (
                  <div className="flex -space-x-1">
                    {getLanguageIndicators()}
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onTranslate(article)}
                  className="text-primary hover:text-primary/80"
                >
                  <Languages className="h-4 w-4 mr-1" />
                  {t.translate}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAskAI}
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                  title="Analyze article with AI"
                  data-testid="button-ask-ai"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Ask AI
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShare}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? "text-yellow-500" : "text-gray-500 hover:text-gray-700"}
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>
          
          {article.imageUrl && (
            <div className="w-32 h-24 flex-shrink-0">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
