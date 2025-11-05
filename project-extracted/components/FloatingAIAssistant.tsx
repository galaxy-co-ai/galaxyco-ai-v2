import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  FileText,
  Workflow,
  Brain,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI Assistant. I can help you create workflows, generate documents, analyze your CRM data, and much more. What would you like to do today?",
    timestamp: "Just now",
    suggestions: [
      "Create a new workflow",
      "Generate a project proposal",
      "Analyze my sales pipeline",
      "Set up an automation"
    ]
  }
];

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand you want to work on that. Let me help you get started. I can create a custom workflow or generate the necessary documentation for this task.",
        timestamp: "Just now",
        suggestions: [
          "Build a workflow for this",
          "Generate documentation",
          "Show me an example"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] transition-all duration-300 group relative overflow-hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 rounded-full"
              />
              <Sparkles className="h-6 w-6 text-white relative z-10" />
            </Button>
            
            {/* Notification Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white shadow-lg"
            >
              1
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-md p-0 flex flex-col"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <SheetHeader className="p-4 border-b bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-white">AI Assistant</SheetTitle>
                  <SheetDescription className="text-white/80">
                    Your intelligent AI companion for workflows and automation
                  </SheetDescription>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/80">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`flex-1 ${message.role === "user" ? "flex flex-col items-end" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="h-7 text-xs rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_16px_rgb(0,0,0,0.08)]"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-4 py-3 bg-muted">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="h-2 w-2 bg-muted-foreground rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 bg-muted-foreground rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 bg-muted-foreground rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-3 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-auto flex-col items-start p-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
              >
                <Workflow className="h-4 w-4 mb-1 text-blue-500" />
                <span className="text-xs">Build Workflow</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto flex-col items-start p-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
              >
                <FileText className="h-4 w-4 mb-1 text-purple-500" />
                <span className="text-xs">Generate Doc</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto flex-col items-start p-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
              >
                <Brain className="h-4 w-4 mb-1 text-green-500" />
                <span className="text-xs">Analyze Data</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto flex-col items-start p-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
              >
                <Zap className="h-4 w-4 mb-1 text-orange-500" />
                <span className="text-xs">Automate Task</span>
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-[0_4px_20px_rgb(0,0,0,0.1)]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
