import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 2000;
  const isNearLimit = message.length > 1800;

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    
    onSendMessage(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // ~5 lines
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 min-h-[52px]"
            maxLength={maxLength}
            disabled={disabled}
            rows={1}
          />
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 h-auto p-1"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white p-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-auto"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Press Enter to send • Shift+Enter for new line</span>
        <span className={isNearLimit ? 'text-red-500' : ''}>
          {message.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
