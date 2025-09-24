import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import type { FilterState } from "@shared/schema";
import type { NewsStats } from "@/lib/types";

interface NewsFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function NewsFilters({ filters, onFiltersChange }: NewsFiltersProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { data: stats } = useQuery<NewsStats>({
    queryKey: ['/api/stats'],
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleCategory = (category: string) => {
    const categories = filters.categories || [];
    if (categories.includes(category)) {
      updateFilter('categories', categories.filter((c: string) => c !== category));
    } else {
      updateFilter('categories', [...categories, category]);
    }
  };

  const toggleBias = (bias: string) => {
    const biasTypes = filters.biasTypes || [];
    if (biasTypes.includes(bias)) {
      updateFilter('biasTypes', biasTypes.filter((b: string) => b !== bias));
    } else {
      updateFilter('biasTypes', [...biasTypes, bias]);
    }
  };

  const toggleSentiment = (sentiment: string) => {
    const sentiments = filters.sentiments || [];
    if (sentiments.includes(sentiment)) {
      updateFilter('sentiments', sentiments.filter((s: string) => s !== sentiment));
    } else {
      updateFilter('sentiments', [...sentiments, sentiment]);
    }
  };

  const isAllCategoriesSelected = !filters.categories || filters.categories.length === 0;
  const isAllBiasSelected = !filters.biasTypes || filters.biasTypes.length === 0;

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: keyof typeof t } = {
      politics: 'politics',
      technology: 'technology',
      sports: 'sports',
      business: 'business',
      entertainment: 'entertainment',
      health: 'health',
      science: 'science',
      education: 'education',
    };
    return categoryMap[category] ? t[categoryMap[category]] : category;
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover-lift ${
      theme === 'creative' ? 'glass-morphism' : 'bg-card border-border'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className={`h-5 w-5 ${
          theme === 'creative' ? 'text-primary pulse-subtle' : 'text-foreground'
        }`} />
        <h3 className="font-semibold text-foreground">{t.filters}</h3>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">{t.categories}</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-categories" 
              checked={isAllCategoriesSelected}
              onCheckedChange={() => updateFilter('categories', [])}
            />
            <Label htmlFor="all-categories" className="text-sm text-gray-600">All Categories</Label>
          </div>
          
          {['general', 'politics', 'technology', 'health', 'finance', 'sports'].map((category) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={category}
                  checked={filters.categories?.includes(category) || false}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={category} className="text-sm text-gray-600 capitalize">{getCategoryName(category)}</Label>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {stats?.byCategory?.[category] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bias Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">{t.biasTypes}</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-bias" 
              checked={isAllBiasSelected}
              onCheckedChange={() => updateFilter('biasTypes', [])}
            />
            <Label htmlFor="all-bias" className="text-sm text-gray-600">All Bias Types</Label>
          </div>
          
          {[
            { key: 'neutral', label: t.neutral, color: 'bg-green-500' },
            { key: 'left', label: t.left, color: 'bg-blue-500' },
            { key: 'right', label: t.right, color: 'bg-red-500' },
          ].map((bias) => (
            <div key={bias.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={bias.key}
                  checked={filters.biasTypes?.includes(bias.key) || false}
                  onCheckedChange={() => toggleBias(bias.key)}
                />
                <Label htmlFor={bias.key} className="text-sm text-gray-600">{bias.label}</Label>
              </div>
              <div className={`w-3 h-3 ${bias.color} rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">{t.sentiments}</h4>
        <div className="space-y-2">
          {[
            { key: 'positive', label: t.positive, icon: Smile, color: 'text-green-500' },
            { key: 'neutral', label: t.neutral, icon: Meh, color: 'text-gray-500' },
            { key: 'negative', label: t.negative, icon: Frown, color: 'text-red-500' },
          ].map((sentiment) => (
            <div key={sentiment.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={sentiment.key}
                  checked={filters.sentiments?.includes(sentiment.key) || false}
                  onCheckedChange={() => toggleSentiment(sentiment.key)}
                />
                <Label htmlFor={sentiment.key} className="text-sm text-gray-600">{sentiment.label}</Label>
              </div>
              <sentiment.icon className={`h-4 w-4 ${sentiment.color}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">{t.timeRange}</h4>
        <Select value={filters.timeRange || 'all'} onValueChange={(value) => updateFilter('timeRange', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="Last 24 hours">{t.today}</SelectItem>
            <SelectItem value="Last week">{t.thisWeek}</SelectItem>
            <SelectItem value="Last month">{t.thisMonth}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
