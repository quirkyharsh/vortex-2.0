import { Clock, Copy, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { toast } = useToast();
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast({
        title: "Copied to clipboard",
        description: "Message has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-start space-x-3 max-w-3xl animate-in slide-in-from-bottom-2 duration-300 ${isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${isUser ? 'from-emerald-500 to-teal-500' : 'from-indigo-500 to-violet-500'} rounded-full flex items-center justify-center`}>
        {isUser ? <User className="text-white text-sm" /> : <Bot className="text-white text-sm" />}
      </div>
      
      <div className={`message-bubble group relative max-w-md rounded-2xl p-4 shadow-sm ${
        isUser 
          ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-md' 
          : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-tl-md'
      }`}>
        <p className={`leading-relaxed whitespace-pre-wrap ${
          isUser ? 'text-white' : 'text-slate-700 dark:text-slate-200'
        }`}>
          {message.text}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs flex items-center space-x-1 ${
            isUser ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(message.timestamp)}</span>
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-auto p-1 ${
              isUser 
                ? 'text-indigo-100 hover:text-white hover:bg-white/10' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
