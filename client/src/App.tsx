import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { BlockchainProvider } from "@/contexts/blockchain-context";
import { useEffect } from "react";
import type { UserPreferences } from "@shared/schema";
import Home from "@/pages/home";
import ChatPage from "@/pages/chat";
import CommunityPage from "@/pages/community";
import BlockchainPage from "@/pages/blockchain";
import { RecommendationsPage } from "@/pages/recommendations";
import UserPreferencesPage from "@/pages/user-preferences";

import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/preferences" component={UserPreferencesPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/blockchain" component={BlockchainPage} />
      <Route path="/recommendations" component={RecommendationsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <BlockchainProvider>
              <TooltipProvider>
                <Toaster />
                <AuthenticatedRouter />
              </TooltipProvider>
            </BlockchainProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
