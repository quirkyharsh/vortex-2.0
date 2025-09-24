import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, BarChart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import type { NewsStats } from "@/lib/types";

interface StatsBarProps {
  onRefresh: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function StatsBar({ onRefresh, sortBy, onSortChange }: StatsBarProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  const { data: stats, isLoading } = useQuery<NewsStats>({
    queryKey: ['/api/stats'],
  });

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/refresh'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      onRefresh();
    },
  });

  if (isLoading) {
    return (
      <Card className={`p-4 mb-6 transition-all duration-300 ${
        theme === 'creative' ? 'glass-morphism' : 'bg-card border-border'
      }`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-12 w-20 bg-muted rounded"></div>
              <div className="h-12 w-20 bg-muted rounded"></div>
              <div className="h-12 w-20 bg-muted rounded"></div>
            </div>
            <div className="h-10 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 mb-6 hover-lift transition-all duration-300 ${
      theme === 'creative' ? 'glass-morphism' : 'bg-card border-border'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <BarChart className={`h-5 w-5 ${
              theme === 'creative' ? 'text-primary pulse-subtle' : 'text-muted-foreground'
            }`} />
            <div>
              <span className={`text-2xl font-bold ${
                theme === 'creative' ? 'gradient-primary bg-clip-text text-transparent' : 'text-foreground'
              }`}>
                {stats?.total || 0}
              </span>
              <p className="text-sm text-muted-foreground">{t.totalArticles}</p>
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary">{stats?.today || 0}</span>
            <p className="text-sm text-muted-foreground">{t.todayArticles}</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-secondary">{stats?.translated || 0}</span>
            <p className="text-sm text-muted-foreground">{t.translatedArticles}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            className={`hover-lift transition-all duration-300 ${
              theme === 'creative' 
                ? 'gradient-secondary text-secondary-foreground border-none' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            {t.refresh}
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{t.sortBy}:</span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className={`w-32 hover-lift ${
                theme === 'creative' ? 'glass-morphism' : ''
              }`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{t.latest}</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="translated">{t.mostTranslated}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
