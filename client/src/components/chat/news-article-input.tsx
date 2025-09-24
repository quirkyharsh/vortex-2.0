import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";

interface NewsArticleInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function NewsArticleInput({ value, onChange, onClear }: NewsArticleInputProps) {
  const maxLength = 5000;
  const isNearLimit = value.length > 4500;

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-slate-700 dark:text-slate-300">News Article</h3>
          </div>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-slate-500 hover:text-red-500 h-auto p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste News Article Here..."
          className="min-h-[120px] max-h-[300px] resize-none border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={maxLength}
        />
        
        <div className="flex justify-between items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Paste your news article to analyze</span>
          <span className={isNearLimit ? 'text-red-500' : ''}>
            {value.length}/{maxLength}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}