import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatSession } from "@shared/schema";

interface ChatSidebarProps {
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ 
  currentSessionId, 
  onSessionSelect, 
  onNewSession, 
  isOpen, 
  onClose 
}: ChatSidebarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat sessions
  const { data: sessions = [], isLoading } = useQuery<ChatSession[]>({
    queryKey: ['/api/sessions'],
    refetchInterval: false,
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('DELETE', `/api/sessions/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      toast({
        title: "Session deleted",
        description: "Chat session has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting session",
        description: error instanceof Error ? error.message : "Failed to delete session.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat session?')) {
      deleteSessionMutation.mutate(sessionId);
      if (sessionId === currentSessionId) {
        onNewSession();
      }
    }
  };

  const sidebarClasses = `
    fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
    md:relative md:transform-none md:shadow-none md:z-auto
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-700 dark:text-slate-300">Chat History</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewSession}
                  className="h-auto p-2"
                  title="New Chat"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-auto p-2 md:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sessions list */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {isLoading ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chat sessions yet</p>
                  <p className="text-xs mt-1">Start a new conversation!</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <Card 
                    key={session.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      session.id === currentSessionId 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => {
                      onSessionSelect(session.id);
                      onClose();
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-slate-700 dark:text-slate-300 truncate">
                            {session.title || 'Untitled Chat'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {format(new Date(session.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="h-auto p-1 text-slate-400 hover:text-red-500 ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}