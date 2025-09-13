"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Send, Hash, AtSign, Circle, Smile } from 'lucide-react';

const getInitials = (name: string = "") => {
  const names = name.split(' ');
  if (names.length > 1 && names[0] && names[names.length - 1]) return `${names[0][0]}${names[names.length - 1][0]}`;
  return names[0] ? names[0][0] : 'U';
};

export default function ChatPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (channelId: string) => {
    const messageData = await api.getMessagesForChannel(channelId);
    setMessages(messageData);
  }

  useEffect(() => {
    if (user) {
      const fetchInitialData = async () => {
        setIsLoading(true);
        const { channels: allChannels, users: userData } = await api.getChatData(user.id);
        setChannels(allChannels.filter(c => c.type !== 'dm'));
        setDms(allChannels.filter(c => c.type === 'dm'));
        setUsers(userData);
        if (allChannels.length > 0) {
          const initialChannel = allChannels.find(c => c.type !== 'dm') || allChannels[0];
          setActiveChannel(initialChannel);
          fetchMessages(initialChannel.id);
        }
        setIsLoading(false);
      };
      fetchInitialData();
    }
  }, [user]);

  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle user scrolling to prevent auto-scroll when user is manually scrolling
  const handleScroll = () => {
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set timeout to detect when user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
  };

  // Poll for new messages every 1 second when there's an active channel
  useEffect(() => {
    if (activeChannel) {
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(activeChannel.id);
      }, 1000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [activeChannel]);

  useEffect(() => {
    // Only auto-scroll if user is not manually scrolling
    if (!isUserScrolling && chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Use smooth scrolling for better UX
      scrollContainer.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      });
    }
  }, [messages, isUserScrolling]);

  // Cleanup timeout and polling on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleChannelSelect = (channel: any) => {
    setActiveChannel(channel);
    fetchMessages(channel.id);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!content || !content.trim()) return;
    if (!activeChannel || !user) return;

    setNewMessage(""); // Clear input immediately
    const result = await api.sendMessage({
      channelId: activeChannel.id, authorId: user.id, content
    });
    
    // Let the polling mechanism handle fetching new messages
    // This allows the auto-reply delay to work properly
    if (result.success) {
      // Immediately fetch to show the user's own message
      fetchMessages(activeChannel.id);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const getUserById = (id: string) => users.find(u => u.id === id) || { name: 'Unknown User' };
  const getDmName = (dm: any) => {
    if (!user) return "DM";
    const otherMemberId = dm.members.find((id: string) => id !== user.id);
    return getUserById(otherMemberId)?.name || "Unknown User";
  };

  if (isLoading) return <p>Loading chat...</p>;

  return (
    <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr_280px] h-[calc(100vh-145px)] border rounded-xl overflow-hidden">
      {/* Left Column (Unchanged) */}
      <div className="flex flex-col border-r bg-muted/20">
        {/* Left sidebar content - keeping it simple for now */}
        <div className="p-4">
          <h3 className="font-semibold mb-2">Channels</h3>
          {channels.map(channel => (
            <div key={channel.id} className="p-2 hover:bg-muted rounded cursor-pointer" onClick={() => handleChannelSelect(channel)}>
              #{channel.name}
            </div>
          ))}
          <h3 className="font-semibold mb-2 mt-4">Direct Messages</h3>
          {dms.map(dm => (
            <div key={dm.id} className="p-2 hover:bg-muted rounded cursor-pointer" onClick={() => handleChannelSelect(dm)}>
              {getDmName(dm)}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column - Chat Area */}
      <div className="flex flex-col bg-background min-h-0">
        {activeChannel ? (
          <>
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b">
              <h2 className="font-semibold">
                {activeChannel.type === 'dm' ? getDmName(activeChannel) : `#${activeChannel.name}`}
              </h2>
            </div>
            
            {/* Messages Container - Enhanced with smooth scrolling and message sticking */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 scroll-smooth chat-scrollbar"
              onScroll={handleScroll}
              style={{ 
                height: '100%', 
                maxHeight: '100%',
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain'
              }}
            >
              <div className="space-y-4 min-h-full flex flex-col justify-end">
                {messages.map((msg, index) => {
                  const author = getUserById(msg.authorId);
                  const isCurrentUser = author.id === user?.id;

                  return (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-200",
                        isCurrentUser && "flex-row-reverse",
                        "scroll-mt-4" // This helps with scroll positioning
                      )}
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className={cn(
                        "max-w-xs md:max-w-md rounded-lg overflow-hidden transition-all duration-200",
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                        "transform-gpu" // Enable hardware acceleration for smoother rendering
                      )}>
                        {/* Header with name and time */}
                        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                          <span className="font-semibold text-sm">{author.name}</span>
                          <span className="text-xs opacity-70">
                            {format(new Date(msg.timestamp), 'p')}
                          </span>
                        </div>
                        
                        {/* Message content */}
                        {msg.content && (
                          <p className="text-sm leading-snug px-3 pb-2 break-words">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>
            
            {/* Message Input - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t bg-muted/20">
              <div className="relative">
                <Input 
                  placeholder={`Message ${activeChannel.type === 'dm' ? getDmName(activeChannel) : '#' + activeChannel.name}`} 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(newMessage);
                    }
                  }} 
                  className="pr-24" 
                />
                <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleSendMessage(newMessage)}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a channel to start chatting.
          </div>
        )}
      </div>

      {/* Right Column (Unchanged) */}
      <div className="hidden lg:flex flex-col border-l bg-muted/20">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Online Users</h3>
          {users.slice(0, 5).map(user => (
            <div key={user.id} className="flex items-center gap-2 p-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}