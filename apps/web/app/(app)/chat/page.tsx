'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Sparkles, Send, RotateCcw, Loader2 } from 'lucide-react';
import { useState } from 'react';

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    role: 'assistant',
    content:
      "Hello! I'm your AI assistant. I can help you with workflow automation, data analysis, content generation, and more. How can I assist you today?",
    timestamp: '2025-01-16T10:00:00Z',
  },
  {
    id: 'msg_002',
    role: 'user',
    content: 'Can you help me create a workflow to qualify sales leads?',
    timestamp: '2025-01-16T10:01:00Z',
  },
  {
    id: 'msg_003',
    role: 'assistant',
    content:
      "Absolutely! I can help you create a sales lead qualification workflow. Here's what I recommend:\n\n1. **Lead Capture**: Automatically collect leads from your forms and CRM\n2. **Data Enrichment**: Add company and contact information\n3. **Scoring**: Score leads based on criteria like company size, industry, and engagement\n4. **Routing**: Route qualified leads to the right sales rep\n5. **Notifications**: Alert your team when high-value leads come in\n\nWould you like me to set this up for you?",
    timestamp: '2025-01-16T10:01:30Z',
  },
  {
    id: 'msg_004',
    role: 'user',
    content: 'Yes, that sounds perfect. What scoring criteria do you recommend?',
    timestamp: '2025-01-16T10:02:00Z',
  },
  {
    id: 'msg_005',
    role: 'assistant',
    content:
      'Great! Here are the recommended scoring criteria:\n\n**Company Fit (40 points)**\n- Company size: 100+ employees (20 pts), 50-99 (10 pts)\n- Industry match: Target industries (15 pts)\n- Location: Target regions (5 pts)\n\n**Engagement (35 points)**\n- Requested demo (20 pts)\n- Downloaded resources (10 pts)\n- Multiple page visits (5 pts)\n\n**Intent Signals (25 points)**\n- Job title: Decision maker (15 pts)\n- Budget authority (10 pts)\n\nLeads scoring 70+ points are considered hot and routed immediately. Would you like to adjust these criteria?',
    timestamp: '2025-01-16T10:02:45Z',
  },
  {
    id: 'msg_006',
    role: 'user',
    content: 'This looks good. Can you also help with follow-up emails?',
    timestamp: '2025-01-16T10:03:15Z',
  },
  {
    id: 'msg_007',
    role: 'assistant',
    content:
      'Definitely! I can set up automated follow-up sequences based on lead scores:\n\n**Hot Leads (70+ points)**\n- Immediate personal outreach from sales rep\n- Follow-up call scheduled within 24 hours\n\n**Warm Leads (50-69 points)**\n- Day 1: Personalized intro email\n- Day 3: Value proposition + case study\n- Day 7: Book a demo invitation\n\n**Cold Leads (below 50)**\n- Educational nurture sequence\n- Monthly newsletter with tips and resources\n\nI can also generate the email templates for you. Would you like me to create those now?',
    timestamp: '2025-01-16T10:04:00Z',
  },
];

const suggestedPrompts = [
  'Create a content calendar for social media',
  'Analyze sales data from last quarter',
  'Generate product descriptions for my catalog',
  'Build a customer onboarding workflow',
  'Help me write a blog post about AI automation',
];

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar
        src={isUser ? 'https://api.dicebear.com/7.x/initials/svg?seed=YOU' : undefined}
        alt={isUser ? 'You' : 'AI Assistant'}
        fallback={isUser ? 'You' : <Sparkles className="h-4 w-4" />}
        size="default"
        className={!isUser ? 'bg-primary text-primary-foreground' : ''}
      />
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`inline-block max-w-2xl rounded-lg p-4 ${
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'I understand your request. Let me help you with that...',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const handleClearChat = () => {
    setMessages([mockMessages[0]]);
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <PageShell
      title="AI Chat"
      subtitle="Get instant help from your AI assistant"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Chat' }]}
      actions={
        <Button variant="outline" onClick={handleClearChat}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear Chat
        </Button>
      }
    >
      <Card className="flex h-[calc(100vh-16rem)] flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          {isThinking && (
            <div className="flex gap-4">
              <Avatar
                fallback={<Sparkles className="h-4 w-4" />}
                size="default"
                className="bg-primary text-primary-foreground"
              />
              <div className="flex-1">
                <div className="inline-block rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && !input && (
          <div className="border-t border-border px-6 py-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-6">
          <div className="flex gap-2">
            <textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-12 max-h-32 flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={1}
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isThinking} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
