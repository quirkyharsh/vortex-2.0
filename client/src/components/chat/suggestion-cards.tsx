import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, FileText, Users, Heart, BarChart3 } from "lucide-react";

interface SuggestionCardsProps {
  onSuggestionClick: (suggestion: string) => void;
  hasArticleText: boolean;
}

export function SuggestionCards({ onSuggestionClick, hasArticleText }: SuggestionCardsProps) {
  const suggestions = [
    {
      icon: Scale,
      text: "Is this article biased?",
      prompt: hasArticleText ? "Is this article biased? Please analyze the content for any political, ideological, or emotional bias." : "Is this article biased?",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: FileText,
      text: "Summarize this news",
      prompt: hasArticleText ? "Please provide a comprehensive summary of this news article, highlighting the main points and key information." : "Summarize this news",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      text: "Which political side does this support?",
      prompt: hasArticleText ? "Which political side does this article support? Analyze the political leanings and perspectives presented." : "Which political side does this support?",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Heart,
      text: "Any emotional language in this?",
      prompt: hasArticleText ? "Identify any emotional language in this article. Point out specific words, phrases, or techniques used to evoke emotional responses." : "Any emotional language in this?",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      text: "Analyze bias percentage",
      prompt: hasArticleText ? "Give a detailed bias analysis of this news article in terms of Left Bias %, Right Bias %, Neutrality %, Factual Content %, and Emotional Language %. Provide specific percentages and explain your reasoning." : "Analyze bias percentage (Left, Right, Neutral, Factual, Emotional)",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
        Quick Analysis Options
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <Card 
              key={index} 
              className="border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onSuggestionClick(suggestion.prompt)}
            >
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-0 text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{suggestion.text}</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}