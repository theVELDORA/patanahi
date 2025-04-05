import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User as UserIcon, Sparkles, MessageSquare, Save, History, Trash2, Search, Edit2, Calendar, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: "user" | "rimuru";
  timestamp: Date;
}

interface SavedChat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const API_URL = "http://localhost:8000/api/chat";

const updateCognitiveLevel = (xpAmount: number): void => {
  // Get current cognitive data
  const savedLevel = localStorage.getItem("cognitiveLevel");
  const savedXp = localStorage.getItem("cognitiveXp");
  
  const currentLevel = savedLevel ? parseInt(savedLevel) : 0;
  const currentXp = savedXp ? parseInt(savedXp) : 0;
  
  // Calculate XP needed for next level
  const xpForNextLevel = (currentLevel + 1) * 100;
  
  // Add XP and check for level up
  let newXp = currentXp + xpAmount;
  let newLevel = currentLevel;
  
  // Handle level up if needed
  if (newXp >= xpForNextLevel) {
    newLevel += 1;
    newXp -= xpForNextLevel;
    toast.success(`Level Up! You are now Level ${newLevel}!`, {
      description: "Your conversational cognitive skills are improving.",
      duration: 4000,
    });
  }
  
  // Save updated data
  localStorage.setItem("cognitiveLevel", newLevel.toString());
  localStorage.setItem("cognitiveXp", newXp.toString());
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/status');
      const data = await response.json();
      
      if (response.ok && data.status === 'connected') {
        setConnectionStatus('connected');
        toast.success('Connected to AI service');
      } else {
        setConnectionStatus('error');
        toast.error('Failed to connect to AI service: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error checking backend status:', error);
      setConnectionStatus('error');
      toast.error('Failed to connect to AI service: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    // Load saved chats from localStorage
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      setSavedChats(JSON.parse(saved));
    }

    // Load initial message
    setMessages([{
      id: "1",
      content: "Hello! I'm Rimuru, your friendly AI companion. How can I help you today?",
      sender: "rimuru",
      timestamp: new Date(),
    }]);

    // Check backend connection status
    checkBackendStatus();
  }, []);

  useEffect(() => {
    // Save chats to localStorage when they change
    localStorage.setItem('chatHistory', JSON.stringify(savedChats));
  }, [savedChats]);

  const saveCurrentChat = () => {
    if (messages.length <= 1) {
      toast.error("No messages to save");
      return;
    }

    const newChat: SavedChat = {
      id: Date.now().toString(),
      title: `Chat ${savedChats.length + 1}`,
      messages: messages,
      lastUpdated: new Date(),
    };

    setSavedChats(prev => [...prev, newChat]);
    toast.success("Chat saved successfully!");
  };

  const loadChat = (chatId: string) => {
    const chat = savedChats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setShowHistory(false);
      toast.success("Chat loaded successfully!");
    }
  };

  const deleteChat = (chatId: string) => {
    setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
    toast.success("Chat deleted successfully!");
  };

  const renameChat = (chatId: string) => {
    if (!editTitle.trim()) {
      toast.error("Please enter a valid title");
      return;
    }

    setSavedChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: editTitle } : chat
    ));
    setEditingChatId(null);
    setEditTitle("");
    toast.success("Chat renamed successfully!");
  };

  const filteredChats = savedChats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    // Add typing indicator when Rimuru is about to respond
    if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    // Hide welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (connectionStatus !== 'connected') {
      toast.error('Please wait for the AI service to connect');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    try {
      // Prepare the conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content
      }));

      // Add the new message to the history
      conversationHistory.push({
        role: "user",
        content: inputMessage
      });

      console.log("Sending request to backend:", conversationHistory);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.detail || "Failed to get response from AI");
      }

      const data = await response.json();
      console.log("Received response from backend:", data);

      if (!data.response) {
        throw new Error("Invalid response format from AI");
      }

      // Add the AI's response to the messages
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response.trim(),
        sender: "rimuru",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      
      // Count messages for XP rewards
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      
      // Award XP every 3 messages
      if (newCount % 3 === 0) {
        updateCognitiveLevel(10);
        toast("Cognitive XP gained!", {
          description: "Your communication skills are improving.",
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response from AI");
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to the AI service. Please try again later.",
        sender: "rimuru",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Add periodic status check
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[80vh] flex flex-col">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-t-xl p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 animate-pulse">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  RI
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Chat with Rimuru
                </h2>
                <p className="text-sm text-gray-300">Your AI therapeutic companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-gray-400">
                  {connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                  onClick={saveCurrentChat}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showHistory && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-300">Saved Chats</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="pl-8 bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {filteredChats.length === 0 ? (
                  <div className="text-center py-4">
                    <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No saved chats found</p>
                  </div>
                ) : (
                  filteredChats.map(chat => (
                    <div
                      key={chat.id}
                      className="group flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      {editingChatId === chat.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-gray-600/50 border-gray-500 text-gray-200"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => renameChat(chat.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingChatId(null);
                              setEditTitle("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => loadChat(chat.id)}
                          >
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-200">{chat.title}</p>
                              <span className="text-xs text-gray-400">
                                ({chat.messages.length} messages)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-400">
                                {formatDate(new Date(chat.lastUpdated))}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-blue-400"
                              onClick={() => {
                                setEditingChatId(chat.id);
                                setEditTitle(chat.title);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-400"
                              onClick={() => deleteChat(chat.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
          <div className="space-y-4">
            {showWelcome && (
              <div className="flex justify-center animate-fade-in">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <p className="text-sm text-gray-300">Start a conversation with Rimuru...</p>
                  </div>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 relative ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12 shadow-lg shadow-primary/20"
                      : "bg-gray-800/80 text-gray-200 mr-12 shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "rimuru" && (
                      <Bot className="h-5 w-5 text-blue-400" />
                    )}
                    <p className="text-sm">{message.content}</p>
                    {message.sender === "user" && (
                      <UserIcon className="h-5 w-5 text-purple-400" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-800/80 text-gray-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-b-xl border-t border-gray-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <div className="flex-1 relative group">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus-visible:ring-primary transition-all duration-200 focus:scale-[1.01] group-hover:border-primary/50"
              />
              {inputMessage.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 animate-fade-in">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
