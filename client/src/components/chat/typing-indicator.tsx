import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 max-w-3xl animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
        <Bot className="text-white text-sm" />
      </div>
      <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-md p-4 shadow-sm border border-slate-200 dark:border-slate-600">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>
    </div>
  );
}
