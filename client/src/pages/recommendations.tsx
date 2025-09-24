import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, Eye, Share2, TrendingUp, RotateCcw, Clock, User, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  source: string;
  category: string;
  politicalBias: string;
  sentimentScore: number;
  emotionalTone: string;
  publishedAt: string;
}

interface Recommendation {
  article: Article;
  score: number;
  reason: string;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  totalInteractions: number;
  userId: number;
}

interface UserInteraction {
  userId: number;
  articleId: number;
  interactionType: 'click' | 'view' | 'share' | 'like';
  category: string;
  politicalBias: string;
  sessionDuration?: number;
}

export function RecommendationsPage() {
  const [userId, setUserId] = useState<number>(1); // Default user for demo
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('vartaAI_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  // Fetch recommendations
  const { data: recommendationData, isLoading: isLoadingRecommendations, refetch } = useQuery<RecommendationResponse>({
    queryKey: ['/api/recommend', userId],
    queryFn: async () => {
      const response = await fetch(`/api/recommend/${userId}?limit=10&excludeViewed=true`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
    enabled: !!userId
  });

  // Fetch user interactions
  const { data: interactions } = useQuery<UserInteraction[]>({
    queryKey: ['/api/users', userId, 'interactions'],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/interactions?limit=20`);
      if (!response.ok) throw new Error('Failed to fetch interactions');
      return response.json();
    },
    enabled: !!userId
  });

  // Record interaction mutation
  const recordInteraction = useMutation({
    mutationFn: async (interaction: UserInteraction) => {
      const response = await fetch('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interaction)
      });
      if (!response.ok) throw new Error('Failed to record interaction');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch recommendations after recording interaction
      queryClient.invalidateQueries({ queryKey: ['/api/recommend', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'interactions'] });
    }
  });

  // Smart refresh recommendations mutation
  const smartRefreshMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/recommend/${userId}/refresh?count=3`);
      if (!response.ok) {
        throw new Error('Failed to get smart recommendations');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.newRecommendations && data.newRecommendations.length > 0) {
        toast({
          title: "Smart Recommendations Added!",
          description: `Found ${data.newRecommendations.length} new articles based on your liked categories: ${data.basedOnCategories.join(', ')}`,
        });
        // Refresh the main recommendations to include new ones
        refetch();
      } else {
        toast({
          title: "No New Recommendations",
          description: data.message || "No new articles found matching your preferences",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get smart recommendations",
        variant: "destructive",
      });
    }
  });

  const handleInteraction = async (article: Article, type: 'click' | 'view' | 'share' | 'like') => {
    if (!userId) return;

    await recordInteraction.mutateAsync({
      userId,
      articleId: article.id,
      interactionType: type,
      category: article.category,
      politicalBias: article.politicalBias,
      sessionDuration: type === 'view' ? Math.floor(Math.random() * 300) + 30 : undefined
    });
  };

  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case 'left': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'right': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSentimentColor = (tone: string) => {
    switch (tone.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoadingRecommendations) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Personalized News Recommendations</h1>
        <p className="text-muted-foreground">
          AI-powered recommendations based on your reading preferences using content-based filtering
        </p>
        {recommendationData && (
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>Total interactions: {recommendationData.totalInteractions}</span>
            <span>Recommendations: {recommendationData.recommendations.length}</span>
            <div className="flex gap-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={recordInteraction.isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
              <Button
                onClick={() => smartRefreshMutation.mutate()}
                variant="default"
                size="sm"
                disabled={smartRefreshMutation.isPending}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {smartRefreshMutation.isPending ? 'Finding...' : 'Smart Refresh'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Recommendations */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          
          {recommendationData?.recommendations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start reading articles to get personalized recommendations
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Browse Articles
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {recommendationData?.recommendations.map((rec, index) => (
                <Card key={rec.article.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{rec.article.source}</Badge>
                        <span>•</span>
                        <span>{rec.article.category}</span>
                        <span>•</span>
                        <span>Score: {(rec.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <CardTitle 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => {
                        setSelectedArticle(rec.article);
                        handleInteraction(rec.article, 'click');
                      }}
                    >
                      {rec.article.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground italic">
                      {rec.reason}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {rec.article.summary || rec.article.content.substring(0, 200) + '...'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={getBiasColor(rec.article.politicalBias)}>
                          {rec.article.politicalBias}
                        </Badge>
                        <Badge className={getSentimentColor(rec.article.emotionalTone)}>
                          {rec.article.emotionalTone}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInteraction(rec.article, 'view')}
                          disabled={recordInteraction.isPending}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInteraction(rec.article, 'like')}
                          disabled={recordInteraction.isPending}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInteraction(rec.article, 'share')}
                          disabled={recordInteraction.isPending}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Interactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {interactions?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No interactions yet</p>
              ) : (
                <div className="space-y-3">
                  {interactions?.slice(0, 5).map((interaction, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {interaction.interactionType === 'click' && <Eye className="h-4 w-4" />}
                        {interaction.interactionType === 'view' && <Eye className="h-4 w-4" />}
                        {interaction.interactionType === 'like' && <Heart className="h-4 w-4" />}
                        {interaction.interactionType === 'share' && <Share2 className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium capitalize">{interaction.interactionType}</p>
                        <p className="text-muted-foreground">
                          {interaction.category} • {interaction.politicalBias}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Algorithm Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Our recommendation system uses:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>TF-IDF content analysis</li>
                <li>Cosine similarity matching</li>
                <li>Category preferences (20%)</li>
                <li>Political bias patterns (10%)</li>
                <li>Content similarity (70%)</li>
              </ul>
              <p className="mt-3 text-xs">
                Recommendations improve as you interact with more articles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="mb-2">{selectedArticle.title}</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{selectedArticle.source}</Badge>
                    <Badge className={getBiasColor(selectedArticle.politicalBias)}>
                      {selectedArticle.politicalBias}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}