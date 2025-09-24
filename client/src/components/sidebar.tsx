import { useState } from "react";
import { useLocation } from "wouter";
import { X, MessageCircle, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSectionClick = (section: string) => {
    if (section === 'chatbot') {
      setLocation('/chat');
      onClose();
    } else if (section === 'community') {
      setLocation('/community');
      onClose();
    } else if (section === 'blockchain') {
      setLocation('/blockchain');
      onClose();
    } else {
      // For other sections, we'll show placeholder content
      setActiveSection(activeSection === section ? null : section);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => handleSectionClick('chatbot')}
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Chatbot</div>
                <div className="text-sm text-muted-foreground">AI assistant for news queries</div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => handleSectionClick('community')}
            >
              <Users className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Community Chats & Forums</div>
                <div className="text-sm text-muted-foreground">Join discussions with other readers</div>
              </div>
            </Button>
            
            
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => handleSectionClick('blockchain')}
            >
              <Shield className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Verified Sources</div>
                <div className="text-sm text-muted-foreground">Blockchain-verified news sources</div>
              </div>
            </Button>
          </nav>
        </div>
        
        {/* Active Section Content */}
        
        {activeSection === 'community' && (
          <div className="flex-1 border-t border-border p-4">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Community Features</h3>
              <p className="text-sm">Connect with fellow news readers, share opinions, and engage in meaningful discussions about current events.</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-left p-3 bg-muted/50 rounded">
                  <strong>Discussion Forums</strong> - Topic-based conversations
                </div>
                <div className="text-sm text-left p-3 bg-muted/50 rounded">
                  <strong>Live Chat Rooms</strong> - Real-time discussions
                </div>
                <div className="text-sm text-left p-3 bg-muted/50 rounded">
                  <strong>Expert AMAs</strong> - Ask journalists anything
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </>
  );
}