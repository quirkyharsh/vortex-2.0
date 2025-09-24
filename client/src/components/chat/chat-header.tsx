import { Moon, Sun, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
  isTyping: boolean;
}

export function ChatHeader({ onClearChat, messageCount, isTyping }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Eye className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Varta.AI</h1>
            <p className="text-blue-100 text-sm">
              {isTyping ? "Analyzing..." : "Analyze. Summarize. Detect Bias."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-blue-100 text-sm hidden md:block">
            {messageCount} messages
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white h-auto"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white h-auto"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
