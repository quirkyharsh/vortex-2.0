import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Menu, Plus, Sparkles, Languages, Loader2, Settings, ArrowRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { NewsFilters } from "@/components/news-filters";
import { NewsArticleCard } from "@/components/news-article-card";
import { TranslationModal } from "@/components/translation-modal";
import { StatsBar } from "@/components/stats-bar";
import { Sidebar } from "@/components/sidebar";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import type { Article, FilterState, UserPreferences } from "@shared/schema";
import type { SupportedLanguage } from "@/lib/i18n";
import { Link } from "wouter";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    biasTypes: [],
    sentiments: [],
    timeRange: '',
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Simplified preferences loading - no auto-apply to prevent API loops
  const { data: userPreferences } = useQuery({
    queryKey: ['/api/users', user?.id, 'preferences'],
    enabled: false, // Disabled for now to prevent loops
    retry: false,
  });

  const { data: articles = [], isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles', filters, sortBy, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add language parameter to sync content language with UI language
      params.append('language', language);
      
      if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach(cat => params.append('categories', cat));
      }
      if (filters.biasTypes && filters.biasTypes.length > 0) {
        filters.biasTypes.forEach(bias => params.append('biasTypes', bias));
      }
      if (filters.sentiments && filters.sentiments.length > 0) {
        filters.sentiments.forEach(sent => params.append('sentiments', sent));
      }
      if (filters.timeRange) {
        params.append('timeRange', filters.timeRange);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleTranslate = (article: Article) => {
    setSelectedArticle(article);
    setIsTranslationModalOpen(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
  };

  // Bulk translate mutation
  const bulkTranslateMutation = useMutation({
    mutationFn: async (targetLanguage: string) => {
      const response = await fetch('/api/articles/translate-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: targetLanguage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to translate articles');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t.bulkTranslationComplete,
        description: `${data.translated} articles translated, ${data.skipped} skipped`,
      });
      // Refresh articles to show translated content
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: (error) => {
      toast({
        title: t.bulkTranslationError,
        description: error.message || "Failed to translate articles",
        variant: "destructive",
      });
    },
  });

  const handleBulkTranslate = () => {
    if (language === 'en') {
      toast({
        title: "Cannot translate to English",
        description: "English is the source language",
        variant: "destructive",
      });
      return;
    }
    bulkTranslateMutation.mutate(language);
  };



  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading News</h1>
          <p className="text-muted-foreground mb-4">Failed to fetch articles. Please try again.</p>
          <Button onClick={handleRefresh} className="hover-lift">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-all duration-500">
      {/* Header */}
      <header className="glass-morphism backdrop-blur-md border-b border-border sticky top-0 z-50 slide-in-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-primary">
                    {t.appTitle}
                  </h1>
                </div>
                <span className="text-xs text-muted-foreground">{t.appSubtitle}</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="pl-10 transition-all duration-200 hover-lift"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* UI Language Switcher */}
              <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
                <SelectTrigger className="w-36 hover-lift">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="ml">മലയാളം</SelectItem>
                </SelectContent>
              </Select>

              {/* Bulk Translate Button */}
              {language !== 'en' && (
                <Button
                  onClick={handleBulkTranslate}
                  disabled={bulkTranslateMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="hover-lift"
                  title={t.translateAllArticles}
                >
                  {bulkTranslateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t.bulkTranslating.split('...')[0]}...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      {t.translateAll}
                    </>
                  )}
                </Button>
              )}
              
              
              {/* User Info and Logout */}
              <div className="flex items-center space-x-2 border-l border-border pl-3">
                <span className="text-sm text-foreground hidden sm:block">
                  Welcome, {user?.fullName?.split(' ')[0] || 'User'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover-lift text-black border-blue-600 hover:bg-blue-50"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover-lift"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner for New Users */}
      {showWelcomeBanner && user && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Welcome to Varta.AI, {user.fullName}!</h3>
                <p className="text-sm opacity-90">Set up your preferences to get personalized news recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/preferences">
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-white/30">
                  <Settings className="h-4 w-4 mr-2" />
                  Set Preferences
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWelcomeBanner(false)}
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 fade-in">
            <div className="sticky top-20">
              <NewsFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 fade-in">
            <StatsBar onRefresh={handleRefresh} sortBy={sortBy} onSortChange={setSortBy} />

            {/* Articles */}
            {isLoading ? (
              <div className="space-y-6 fade-in">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg shadow-sm p-6 animate-pulse hover-lift">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-4 w-16 bg-muted rounded"></div>
                      <div className="h-4 w-20 bg-muted rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-full bg-muted rounded mb-1"></div>
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-card rounded-lg shadow-sm p-8 text-center hover-lift fade-in">
                <h3 className="text-lg font-medium text-foreground mb-2">{t.noArticlesFound}</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms to find more articles.
                </p>
                <Button onClick={handleRefresh} className="hover-lift">
                  {t.refresh} {t.articles}
                </Button>
              </div>
            ) : (
              <div className="space-y-6 fade-in">
                {articles.map((article, index) => (
                  <div 
                    key={article.id}
                    className="fade-in"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <NewsArticleCard
                      article={article}
                      onTranslate={handleTranslate}
                    />
                  </div>
                ))}
                
                {/* Load More Button */}
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handleRefresh}
                    className="hover-lift transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Load More {t.articles}
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Translation Modal */}
      <TranslationModal
        article={selectedArticle}
        isOpen={isTranslationModalOpen}
        onClose={() => {
          setIsTranslationModalOpen(false);
          setSelectedArticle(null);
        }}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 fade-in">
        <Button
          className="w-14 h-14 rounded-full shadow-lg hover-lift float-animation transition-all duration-300 bg-primary hover:bg-primary/90"
          onClick={handleRefresh}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}
