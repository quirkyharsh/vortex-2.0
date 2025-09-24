import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Send, Users, MessageSquare, ThumbsUp, Reply, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
  isCurrentUser?: boolean;
  likes: number;
  replies: number;
  articleRef?: string;
  userRole?: 'journalist' | 'expert' | 'citizen';
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'Dr. Sarah Chen',
      avatar: 'SC',
      message: 'The Parliament\'s data protection bill raises serious concerns about implementation timeline. As a cybersecurity researcher, I\'ve seen similar legislation fail due to lack of technical clarity. The 18-month compliance window seems unrealistic for smaller organizations.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isCurrentUser: false,
      likes: 12,
      replies: 3,
      articleRef: 'Parliament Passes Data Protection Bill',
      userRole: 'expert'
    },
    {
      id: '2', 
      user: 'Rajesh Kumar',
      avatar: 'RK',
      message: 'Valid points @Dr. Sarah Chen. But we can\'t keep delaying this. The EU\'s GDPR took years to implement properly, but at least they started somewhere. Indian citizens deserve data protection now, not in another 5 years.',
      timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
      isCurrentUser: false,
      likes: 8,
      replies: 2,
      userRole: 'citizen'
    },
    {
      id: '3',
      user: 'Maria Rodriguez', 
      avatar: 'MR',
      message: 'As a small business owner, the compliance costs are genuinely scary. We\'re talking about ₹5-10 lakhs just for initial setup. The bill should have included government subsidies or tax breaks for MSMEs. This could kill innovation in the startup ecosystem.',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      isCurrentUser: false,
      likes: 15,
      replies: 4,
      userRole: 'citizen'
    },
    {
      id: '4',
      user: 'Alex Thompson',
      avatar: 'AT', 
      message: 'I\'ve been covering tech policy for 8 years. The cross-border data transfer clauses are actually more flexible than expected. Unlike China\'s approach, this allows for "adequate protection" agreements. Could be good for IT services exports.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isCurrentUser: false,
      likes: 6,
      replies: 1,
      userRole: 'journalist'
    },
    {
      id: '5',
      user: 'Priya Sharma',
      avatar: 'PS',
      message: 'The enforcement part is what matters. We\'ve seen how poorly other digital laws are enforced. Will the Data Protection Board have enough resources? The ₹500 crore penalty sounds impressive but means nothing without proper auditing mechanisms.',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      isCurrentUser: false,
      likes: 9,
      replies: 2,
      userRole: 'expert'
    },
    {
      id: '6',
      user: 'Amit Singh',
      avatar: 'AS',
      message: 'Just read the full 200-page document. Section 43 on "significant data fiduciaries" is problematic. Who decides what\'s "significant"? This could become another tool for selective enforcement against companies the government doesn\'t like.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isCurrentUser: false,
      likes: 11,
      replies: 0,
      userRole: 'citizen'
    },
    {
      id: '7',
      user: 'Dr. Neha Gupta',
      avatar: 'NG',
      message: 'The "right to be forgotten" provision is weaker than GDPR. Indian citizens get limited control compared to Europeans. Also, the "grounds of public interest" exception is too broad - basically gives government carte blanche to access data.',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      isCurrentUser: false,
      likes: 7,
      replies: 1,
      userRole: 'expert'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState('You');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || newMessage.length > 500) return;

    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      avatar: 'YU',
      message: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
      likes: 0,
      replies: 0,
      userRole: 'citizen'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'journalist': return 'bg-green-100 text-green-800 border-green-200';
      case 'citizen': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Back to News</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">Community Discussions</h1>
                  <p className="text-xs lg:text-sm text-gray-500 truncate">Parliament Passes Data Protection Bill</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                <span className="hidden sm:inline">{messages.length} messages</span>
                <span className="sm:hidden">{messages.length}</span>
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-200 text-xs hidden sm:inline-flex">
                24 active users
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="p-2 lg:p-4 space-y-4 lg:space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-3 lg:gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs lg:text-sm">
                          {message.avatar}
                        </span>
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      {/* User Info */}
                      <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm lg:text-base">{message.user}</span>
                        {message.userRole && (
                          <Badge className={`text-xs ${getRoleColor(message.userRole)}`}>
                            {message.userRole}
                          </Badge>
                        )}
                        <span className="text-xs lg:text-sm text-gray-500">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      
                      {/* Article Reference */}
                      {message.articleRef && (
                        <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r">
                          <span className="text-xs text-blue-600 font-medium">Discussing:</span>
                          <p className="text-sm text-blue-800">{message.articleRef}</p>
                        </div>
                      )}
                      
                      {/* Message Text */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                      
                      {/* Interaction Buttons */}
                      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(message.id)}
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-auto p-1"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-sm">{message.likes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-auto p-1"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          <span className="text-sm">{message.replies}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-auto p-1"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">Share</span>
                        </Button>
                        
                        <div className="ml-auto text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white sticky bottom-0">
          <div className="p-3 lg:p-4">
            <div className="flex gap-2 lg:gap-3 items-end">
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs lg:text-sm">YU</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts on this article..."
                    className="border-0 bg-transparent focus:ring-0 p-0 text-gray-900 placeholder-gray-500 text-sm lg:text-base"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 lg:mt-2 gap-2">
                  <p className="text-xs text-gray-500 truncate">
                    <span className="hidden sm:inline">Join the discussion • Be respectful and constructive</span>
                    <span className="sm:hidden">Be respectful</span>
                  </p>
                  <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {newMessage.length}/500
                    </span>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || newMessage.length > 500}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-2 lg:px-3"
                    >
                      <Send className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-2 lg:mt-3 flex flex-wrap gap-1 lg:gap-2 overflow-x-auto pb-1">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-50 text-blue-600 border-blue-200 text-xs whitespace-nowrap"
                onClick={() => setNewMessage("I agree with this analysis because ")}
              >
                👍 Agree
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-orange-50 text-orange-600 border-orange-200 text-xs whitespace-nowrap"
                onClick={() => setNewMessage("I have concerns about ")}
              >
                🤔 Concerns
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200 text-xs whitespace-nowrap"
                onClick={() => setNewMessage("Here's additional context: ")}
              >
                💡 Add Context
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-purple-50 text-purple-600 border-purple-200 text-xs whitespace-nowrap"
                onClick={() => setNewMessage("What about the impact on ")}
              >
                ❓ Question
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}