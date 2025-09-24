import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Copy, Loader2, Languages } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Article, Translation, Language } from "@shared/schema";

interface TranslationModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TranslationModal({ article, isOpen, onClose }: TranslationModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const { toast } = useToast();

  const { data: languages } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const { data: translation, isLoading: isLoadingTranslation } = useQuery<Translation>({
    queryKey: ['/api/articles', article?.id, 'translations', selectedLanguage],
    enabled: !!article && isOpen,
  });

  const translateMutation = useMutation({
    mutationFn: (data: { articleId: number; language: string }) =>
      apiRequest('POST', `/api/articles/${data.articleId}/translate`, { language: data.language }),
    onSuccess: () => {
      toast({
        title: "Translation completed",
        description: "Article has been successfully translated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Translation failed",
        description: error.message || "Failed to translate article",
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!article) return;
    translateMutation.mutate({
      articleId: article.id,
      language: selectedLanguage,
    });
  };

  const handleCopyTranslation = async () => {
    if (!translation) return;
    
    const textToCopy = `${translation.translatedTitle}\n\n${translation.translatedSummary}\n\n${translation.translatedContent}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard",
        description: "Translation has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy translation to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getLanguageName = (code: string) => {
    return languages?.find(l => l.code === code)?.nativeName || code;
  };

  if (!article) return null;

  const isTranslating = translateMutation.isPending;
  const hasTranslation = translation && !isTranslating;
  const canTranslate = !hasTranslation && !isLoadingTranslation;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Article Translation</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Article */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Original (English)</h4>
              <Card className="bg-gray-50 p-4">
                <h5 className="font-semibold mb-2 line-clamp-2">{article.title}</h5>
                {article.summary && (
                  <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                )}
                <p className="text-xs text-gray-500 line-clamp-3">
                  {article.content.substring(0, 200)}...
                </p>
              </Card>
            </div>
            
            {/* Translation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Translation</h4>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.filter(l => l.code !== 'en').map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Card className="bg-blue-50 p-4 min-h-[200px] flex flex-col">
                {isLoadingTranslation && (
                  <div className="flex items-center justify-center flex-1">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-blue-600">Loading translation...</span>
                  </div>
                )}
                
                {isTranslating && (
                  <div className="flex items-center justify-center flex-1">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-blue-600">Translating article...</span>
                  </div>
                )}
                
                {hasTranslation && (
                  <>
                    <h5 className="font-semibold mb-2">{translation.translatedTitle}</h5>
                    {translation.translatedSummary && (
                      <p className="text-sm text-gray-600 mb-2">{translation.translatedSummary}</p>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {translation.translatedContent.substring(0, 200)}...
                    </p>
                  </>
                )}
                
                {canTranslate && (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">
                        No translation available for {getLanguageName(selectedLanguage)}
                      </p>
                      <Button onClick={handleTranslate} className="bg-primary hover:bg-primary/90">
                        Translate to {getLanguageName(selectedLanguage)}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {hasTranslation && (
            <Button onClick={handleCopyTranslation} className="bg-primary hover:bg-primary/90">
              <Copy className="h-4 w-4 mr-2" />
              Copy Translation
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
