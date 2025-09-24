import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { NewsArticleInput } from "@/components/chat/news-article-input";
import { SuggestionCards } from "@/components/chat/suggestion-cards";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { apiRequest } from "@/lib/queryClient";
import { openRouterService } from "@/services/openrouterService";
import type { Message } from "@shared/schema";

// Generate a unique session ID for this chat session
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function ChatPage() {
  const [sessionId] = useState(generateSessionId);
  const [isTyping, setIsTyping] = useState(false);
  const [articleText, setArticleText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check for article content passed from news page
  useEffect(() => {
    const storedArticle = sessionStorage.getItem('articleForAnalysis');
    if (storedArticle) {
      setArticleText(storedArticle);
      // Clear the stored article after loading
      sessionStorage.removeItem('articleForAnalysis');
      
      // Show a welcome message when article is pre-loaded
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now().toString(),
        text: "I've received the article you selected for analysis. You can ask me questions about it using the suggestion buttons below, or type your own question!",
        sender: 'assistant',
        sessionId,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [sessionId]);

  // For now, we'll use local state for messages since the backend might not have the message endpoints
  // In a real implementation, we'd fetch from the API

  // Send message function with real AI integration
  const handleSendMessage = async (text: string) => {
    setIsTyping(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: articleText 
        ? `Article to analyze:\n\n${articleText}\n\n---\n\nUser question: ${text}`
        : text,
      sender: 'user',
      sessionId,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Get real AI response from OpenRouter
      const aiResponseText = await openRouterService.sendMessage(text, articleText);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'assistant',
        sessionId,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Show error message to user
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I'm having trouble connecting to the AI service right now. ${error instanceof Error ? error.message : 'Please try again in a moment.'}`,
        sender: 'assistant',
        sessionId,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Unable to get AI response. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };



  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    if (messages.length > 0) {
      if (confirm('Are you sure you want to clear the conversation?')) {
        setMessages([]);
        setArticleText("");
        toast({
          title: "Conversation cleared",
          description: "Your chat history has been cleared.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="w-80 border-r border-border p-4 space-y-4 hidden lg:block bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
        
        <NewsArticleInput
          value={articleText}
          onChange={setArticleText}
          onClear={() => setArticleText("")}
        />
        
        <SuggestionCards
          onSuggestionClick={handleSuggestionClick}
          hasArticleText={!!articleText}
        />
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col bg-card shadow-xl">
        {/* Chat Header */}
        <header className="p-4 shadow-lg bg-gradient-to-r from-primary to-primary/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Eye className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Varta.AI</h1>
                <p className="text-white/80 text-sm">
                  {isTyping ? "Analyzing..." : "Analyze. Summarize. Detect Bias."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-white/80 text-sm hidden md:block">
                {messages.length} messages
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white h-auto"
                title="Clear conversation"
              >
                Clear Chat
              </Button>
            </div>
          </div>
        </header>
        
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
        />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />

        {/* Mobile Article Input - shown on smaller screens */}
        <div className="lg:hidden border-t border-border p-4 space-y-3">
          <NewsArticleInput
            value={articleText}
            onChange={setArticleText}
            onClear={() => setArticleText("")}
          />
          
          <SuggestionCards
            onSuggestionClick={handleSuggestionClick}
            hasArticleText={!!articleText}
          />
        </div>
      </div>
    </div>
  );
}