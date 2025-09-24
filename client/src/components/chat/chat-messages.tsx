import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { Eye } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 space-y-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start space-x-3 max-w-3xl">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Eye className="text-white text-sm" />
            </div>
            <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-md p-4 shadow-sm border border-slate-200 dark:border-slate-600 max-w-md">
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                Welcome to <strong>Varta.AI</strong>! I'm here to help you analyze news articles with precision and clarity.
              </p>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed mt-2">
                <strong>Analyze. Summarize. Detect Bias.</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-3">
                Paste a news article in the text area and use the suggestion cards to get started, or ask me any questions about bias detection, political analysis, or content summarization.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>Varta.AI</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
