import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  badge?: string;
}

export function Header({ 
  title = "Varta.AI", 
  subtitle = "Analyze. Summarize. Detect Bias.",
  showBackButton = true,
  backUrl = "/",
  badge
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
            {showBackButton && (
              <Link href={backUrl}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Back to News</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2 lg:gap-3 min-w-0">
              <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">{title}</h1>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{subtitle}</p>
              </div>
            </div>
          </div>
          
          {badge && (
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {badge}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}