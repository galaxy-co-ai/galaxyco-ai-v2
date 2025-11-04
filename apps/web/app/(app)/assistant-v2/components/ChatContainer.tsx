'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { useAssistantChat } from '@/hooks/use-assistant-chat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { StreamingIndicator } from './StreamingIndicator';
import { ChatEmptyState } from './ChatEmptyState';
import { ConversationSidebar } from './ConversationSidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  createConversation,
  listConversations,
  getConversation,
  deleteConversation,
  updateConversation,
  saveMessages,
} from '@/lib/actions/assistant-actions';

interface ChatContainerProps {
  workspaceId: string;
}

interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  isPinned: boolean;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ChatContainer({ workspaceId }: ChatContainerProps) {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // Streaming chat hook (WORKING from /assistant)
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } =
    useAssistantChat({
      api: '/api/assistant-v2/chat',
      body: {
        workspaceId,
        model: selectedModel,
      },
      onFinish: async (message) => {
        // Auto-save after AI response completes
        if (currentConversationId && message.role === 'assistant') {
          try {
            await saveMessages({
              conversationId: currentConversationId,
              messages: [
                {
                  role: message.role,
                  content: message.content,
                  metadata: {},
                },
              ],
            });

            // Refresh conversations list
            await loadConversations();

            // Generate title from first user message if still "New Conversation"
            const conversation = conversations.find((c) => c.id === currentConversationId);
            if (conversation && conversation.title === 'New Conversation') {
              const firstUserMessage = messages.find((m) => m.role === 'user');
              if (firstUserMessage) {
                const generatedTitle = firstUserMessage.content.slice(0, 50);
                await updateConversation(currentConversationId, { title: generatedTitle });
                await loadConversations();
              }
            }
          } catch (error) {
            console.error('Failed to save message:', error);
          }
        }
      },
      onError: (error: Error) => {
        console.error('Chat error:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      },
    });

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const result = await listConversations(50, 0);

      if (result.success && result.conversations) {
        const conversationsWithDates = result.conversations.map((c) => ({
          ...c,
          lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt) : null,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        }));
        setConversations(conversationsWithDates);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const result = await createConversation();

      if (result.success && result.conversation) {
        setCurrentConversationId(result.conversation.id);
        setMessages([]);
        await loadConversations();

        toast({
          title: 'New Conversation',
          description: 'Started a new conversation',
        });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    try {
      const result = await getConversation(conversationId);

      if (result.success && result.conversation) {
        setCurrentConversationId(conversationId);

        // Load messages from conversation
        const loadedMessages = result.conversation.messages
          .reverse() // Messages are ordered desc, reverse to get chronological
          .map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            toolInvocations: msg.metadata?.toolInvocations,
            createdAt: new Date(msg.createdAt),
          }));

        setMessages(loadedMessages);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection

        toast({
          title: 'Loaded',
          description: 'Conversation loaded',
        });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const result = await deleteConversation(conversationId);

      if (result.success) {
        // If deleting current conversation, clear messages
        if (conversationId === currentConversationId) {
          setMessages([]);
          setCurrentConversationId(undefined);
        }

        await loadConversations();

        toast({
          title: 'Deleted',
          description: 'Conversation deleted',
        });
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive',
      });
    }
  };

  const handlePinConversation = async (conversationId: string) => {
    try {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      const result = await updateConversation(conversationId, {
        isPinned: !conversation.isPinned,
      });

      if (result.success) {
        await loadConversations();

        toast({
          title: conversation.isPinned ? 'Unpinned' : 'Pinned',
          description: conversation.isPinned
            ? 'Conversation unpinned'
            : 'Conversation pinned to top',
        });
      }
    } catch (error) {
      console.error('Error pinning conversation:', error);
    }
  };

  const handlePromptSelect = async (prompt: string) => {
    // Create conversation if none exists
    if (!currentConversationId) {
      const result = await createConversation();
      if (result.success && result.conversation) {
        setCurrentConversationId(result.conversation.id);
        await loadConversations();
      }
    }

    // Use append to send the message
    await append({ role: 'user', content: prompt });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input?.trim() || isLoading) return;

    // Create conversation if none exists
    if (!currentConversationId) {
      const result = await createConversation();
      if (result.success && result.conversation) {
        setCurrentConversationId(result.conversation.id);
        await loadConversations();
        // Small delay to ensure conversation is set
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Submit the message (hook handles it)
    handleSubmit(e as any);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentId={currentConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        onPin={handlePinConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          model={selectedModel}
          onModelChange={setSelectedModel}
          leftAction={
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
              title="Toggle sidebar"
            >
              <Menu className="size-5" />
            </Button>
          }
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <ChatEmptyState onSelectPrompt={handlePromptSelect} />
          ) : (
            <div className="max-w-4xl mx-auto w-full py-8 px-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onCopy={() => {
                      navigator.clipboard.writeText(message.content);
                      toast({
                        title: 'Copied',
                        description: 'Message copied to clipboard',
                      });
                    }}
                    onRegenerate={undefined}
                  />
                ))}

                {/* Streaming indicator */}
                {isLoading && (
                  <div className="flex items-center gap-3 px-6">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="size-5 text-primary animate-pulse" />
                    </div>
                    <StreamingIndicator />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleFormSubmit}
          disabled={isLoading}
          onStop={isLoading ? undefined : undefined}
        />
      </div>
    </div>
  );
}
