/**
 * GalaxyCo.ai AI Assistant Page
 * ChatGPT-quality AI assistant with conversation history, file upload, and tool execution
 * November 2, 2025
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  PanelLeft,
  Plus,
  Sparkles,
  FileText,
  Code,
  TrendingUp,
  Zap,
  Paperclip,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAssistantChat } from '@/hooks/use-assistant-chat';
import { usePageContext } from '@/hooks/use-page-context';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import {
  ConversationHistory,
  FileUpload,
  VoiceInput,
  ExecutionPanel,
} from '@/components/assistant';
import { parseToolResult, getToolDisplayName } from '@/components/assistant/tool-utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
  messageCount?: number;
  isPinned?: boolean;
}

interface ToolExecution {
  id: string;
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  parameters?: any;
  result?: any;
  error?: string;
}

export default function AssistantPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasMessages, setHasMessages] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [toolExecutions, setToolExecutions] = useState<ToolExecution[]>([]);

  // Refs for keyboard shortcuts
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Capture page context for AI awareness
  const pageContext = usePageContext();

  // Streaming chat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } =
    useAssistantChat({
      api: '/api/assistant/chat',
      conversationId: activeConversationId,
      body: {
        context: pageContext,
        conversationId: activeConversationId,
      },
      onFinish: async (message) => {
        // Log message completion (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log('[Assistant] Message finished:', {
            role: message.role,
            contentLength: message.content?.length,
          });
        }

        // Save message to database
        if (activeConversationId) {
          try {
            await fetch('/api/assistant/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId: activeConversationId,
                messages: [
                  {
                    role: message.role,
                    content: message.content,
                    metadata: {},
                  },
                ],
              }),
            });
          } catch (error) {
            console.error('Failed to save message:', error);
          }
        }

        // Refresh conversations list
        fetchConversations();
      },
      onError: (error: Error) => {
        console.error('Chat error:', error);
        toast.error('Failed to send message. Please try again.');
      },
    });

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/assistant/conversations');
      const data = await res.json();
      setConversations(
        data.conversations.map((conv: any) => ({
          ...conv,
          updatedAt: new Date(conv.updatedAt),
        })),
      );
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, []);

  // Handle new conversation
  const handleNewConversation = useCallback(async () => {
    try {
      const res = await fetch('/api/assistant/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generateTitleFromContext(pageContext),
          context: pageContext,
        }),
      });

      const data = await res.json();
      setActiveConversationId(data.conversation.id);
      setMessages([]); // Clear messages
      setHasMessages(true); // Show chat interface
      await fetchConversations();
      toast.success('New conversation started');

      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to create conversation');
    }
  }, [pageContext, setMessages, fetchConversations]);

  // Custom submit handler that includes files (must be after useChat hook)
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!input.trim() && uploadedFiles.length === 0) return;
      if (isLoading) return;

      // Create new conversation if none exists
      if (!activeConversationId) {
        await handleNewConversation();
        // Wait a bit for conversation to be created
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Handle file uploads if any
      if (uploadedFiles.length > 0) {
        try {
          const formData = new FormData();
          uploadedFiles.forEach((file) => {
            formData.append('files', file);
          });

          const uploadRes = await fetch('/api/assistant/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error('File upload failed');
          }

          const uploadData = await uploadRes.json();

          // Check for upload errors
          if (uploadData.errors && uploadData.errors.length > 0) {
            toast.error(`Some files failed: ${uploadData.errors.join(', ')}`);
          }

          // Only proceed if at least one file uploaded successfully
          if (!uploadData.success || uploadData.files.length === 0) {
            return;
          }

          // Add file info to message context
          const fileContext = `[Files uploaded: ${uploadedFiles.map((f) => f.name).join(', ')}]`;
          const messageWithFiles = `${input}\n\n${fileContext}`;

          // Clear files after upload
          setUploadedFiles([]);

          // Submit message with file context
          append({
            role: 'user',
            content: messageWithFiles,
          });
        } catch (error) {
          console.error('File upload error:', error);
          toast.error('Failed to upload files');
          return;
        }
      } else {
        // Submit message normally
        handleSubmit(e as any);
      }
    },
    [
      input,
      uploadedFiles,
      isLoading,
      activeConversationId,
      handleNewConversation,
      handleSubmit,
      append,
    ],
  );

  // Handle conversation selection
  const handleSelectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id);
      setHasMessages(true);

      try {
        // Load messages from database
        const res = await fetch(`/api/assistant/messages?conversationId=${id}`);
        const data = await res.json();

        if (data.messages) {
          // Convert to AI SDK message format
          const loadedMessages = data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: new Date(msg.createdAt),
          }));

          setMessages(loadedMessages);
          toast.success('Conversation loaded');
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('Failed to load conversation');
      }
    },
    [setMessages],
  );

  // Handle rename conversation
  const handleRenameConversation = useCallback(
    async (id: string) => {
      const newTitle = prompt('Enter new title:');
      if (!newTitle) return;

      try {
        await fetch(`/api/assistant/conversations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });
        await fetchConversations();
        toast.success('Conversation renamed');
      } catch (error) {
        console.error('Failed to rename:', error);
        toast.error('Failed to rename conversation');
      }
    },
    [fetchConversations],
  );

  // Handle delete conversation
  const handleDeleteConversation = useCallback(
    async (id: string) => {
      if (!confirm('Delete this conversation? This cannot be undone.')) return;

      try {
        await fetch(`/api/assistant/conversations/${id}`, {
          method: 'DELETE',
        });

        if (activeConversationId === id) {
          setActiveConversationId(undefined);
          setMessages([]);
          setHasMessages(false);
        }

        await fetchConversations();
        toast.success('Conversation deleted');
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete conversation');
      }
    },
    [activeConversationId, setMessages, fetchConversations],
  );

  // Handle archive conversation (stub for now)
  const handleArchiveConversation = useCallback(async (id: string) => {
    toast.info('Archive feature coming soon');
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Cmd+K': () => {
      handleNewConversation();
    },
    'Cmd+/': () => {
      inputRef.current?.focus();
    },
    Escape: () => {
      setShowFileUpload(false);
    },
    ArrowUp: () => {
      // Edit last user message (hook handles the empty check)
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
      if (lastUserMessage) {
        handleInputChange({
          target: { value: lastUserMessage.content },
        } as any);
        inputRef.current?.focus();
      }
    },
  });

  // Example prompts for empty state
  const examplePrompts = [
    {
      icon: Zap,
      title: 'Create a workflow',
      description: 'Build a new automated workflow from description',
    },
    {
      icon: TrendingUp,
      title: 'Analyze data',
      description: 'Get insights from your business metrics',
    },
    {
      icon: Code,
      title: 'Build an agent',
      description: 'Create an AI agent for specific tasks',
    },
    {
      icon: FileText,
      title: 'Summarize documents',
      description: 'Upload files and get AI-powered summaries',
    },
  ];

  return (
    <div className="fixed inset-0 top-16 flex">
      {/* Conversation History Sidebar */}
      {isSidebarOpen && (
        <aside className="w-[280px] border-r border-border bg-card">
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
            onArchiveConversation={handleArchiveConversation}
          />
        </aside>
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Top Bar */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <PanelLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="font-semibold text-lg">AI Assistant</h1>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        {!hasMessages ? (
          <div className="flex-1 overflow-y-auto">
            {/* Empty State */}
            <div className="max-w-3xl mx-auto px-4 py-12">
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                  <Sparkles className="size-8 text-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground text-lg">
                  Ask me anything, upload files, or describe what you want to build
                </p>
              </div>

              {/* Example Prompts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examplePrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={async () => {
                        setHasMessages(true);
                        // Send example prompt
                        await append({
                          role: 'user',
                          content: `Help me ${prompt.title.toLowerCase()}`,
                        });
                      }}
                      className={cn(
                        'group relative p-6 rounded-xl border border-border',
                        'bg-card hover:bg-accent/50',
                        'text-left transition-all duration-200',
                        'hover:shadow-md hover:scale-[1.02]',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                            <Icon className="size-5 text-foreground" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {prompt.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{prompt.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Placeholder Input */}
            <div className="border-t border-border p-4">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="w-full rounded-xl bg-card border border-border px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onFocus={() => setHasMessages(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat Interface with Streaming
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="space-y-6">
                  {messages.map((message: any) => {
                    const toolResult = parseToolResult(message);

                    // Log tool invocations for debugging (only in development)
                    if (process.env.NODE_ENV === 'development' && message.toolInvocations) {
                      console.log('[Assistant] Tool invocations found:', {
                        messageId: message.id,
                        toolInvocations: message.toolInvocations,
                        parsedResult: toolResult,
                      });
                    }

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'group flex gap-4',
                          message.role === 'user' ? 'justify-end' : 'justify-start',
                        )}
                      >
                        {/* Avatar */}
                        {message.role === 'assistant' && (
                          <div className="flex-shrink-0 size-8 rounded-full bg-muted flex items-center justify-center">
                            <Sparkles className="size-4 text-foreground" />
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="flex flex-col gap-2 max-w-[80%]">
                          {/* Message Bubble */}
                          {message.content && (
                            <div
                              className={cn(
                                'rounded-2xl px-6 py-3 shadow-sm',
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted/30 text-foreground',
                              )}
                            >
                              <p className="text-base leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                            </div>
                          )}

                          {/* Tool Result (if present) */}
                          {toolResult && (
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                              <div className="flex items-center gap-2 mb-3">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-sm">
                                  {getToolDisplayName(toolResult.tool)}
                                </span>
                                {toolResult.pending && (
                                  <span className="text-xs text-muted-foreground">
                                    (Executing...)
                                  </span>
                                )}
                              </div>

                              {/* Workflow Preview */}
                              {toolResult.tool === 'create_workflow' &&
                                toolResult.result.workflow && (
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                        <Zap className="size-5 text-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold mb-1">
                                          {toolResult.result.workflow.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {toolResult.result.nodes?.length || 0} nodes
                                        </p>
                                        {toolResult.result.previewUrl && (
                                          <Button asChild size="sm" variant="outline">
                                            <Link href={toolResult.result.previewUrl}>
                                              <ExternalLink className="h-4 w-4 mr-2" />
                                              Open in Studio
                                            </Link>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                              {/* Agent Preview */}
                              {toolResult.tool === 'create_agent' && toolResult.result.agent && (
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                      <Sparkles className="size-5 text-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold mb-1">
                                        {toolResult.result.agent.name}
                                      </h4>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                          {toolResult.result.agent.type}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                          {toolResult.result.agent.status}
                                        </span>
                                      </div>
                                      {toolResult.result.previewUrl && (
                                        <Button asChild size="sm" variant="outline">
                                          <Link href={toolResult.result.previewUrl}>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Configure Agent
                                          </Link>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Search Results */}
                              {toolResult.tool === 'search_data' && toolResult.result.results && (
                                <div className="space-y-2">
                                  {toolResult.result.results
                                    .slice(0, 3)
                                    .map((result: any, i: number) => (
                                      <div
                                        key={i}
                                        className="p-2 bg-background rounded border border-border"
                                      >
                                        <p className="text-sm font-medium">{result.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {result.snippet}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              )}

                              {/* Metrics Analysis */}
                              {toolResult.tool === 'analyze_metrics' &&
                                toolResult.result.insights && (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="p-2 bg-background rounded border border-border">
                                        <p className="text-xs text-muted-foreground">Value</p>
                                        <p className="text-lg font-bold">
                                          {toolResult.result.value}
                                        </p>
                                      </div>
                                      <div className="p-2 bg-background rounded border border-border">
                                        <p className="text-xs text-muted-foreground">Change</p>
                                        <p className="text-lg font-bold text-muted-foreground">
                                          {toolResult.result.change}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium mb-1">Key Insights:</p>
                                      <ul className="text-sm space-y-1">
                                        {toolResult.result.insights.map(
                                          (insight: string, i: number) => (
                                            <li key={i} className="text-muted-foreground">
                                              • {insight}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>

                        {/* Avatar (user) */}
                        {message.role === 'user' && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-sm text-primary-foreground font-semibold">U</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Tool Executions */}
                  {toolExecutions.map((execution) => (
                    <ExecutionPanel
                      key={execution.id}
                      execution={execution}
                      onApprove={() => {
                        toast.success('Tool execution approved');
                        setToolExecutions((prev) => prev.filter((e) => e.id !== execution.id));
                      }}
                      onReject={() => {
                        toast.info('Tool execution cancelled');
                        setToolExecutions((prev) => prev.filter((e) => e.id !== execution.id));
                      }}
                    />
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="max-w-3xl mx-auto">
                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">{file.name}</span>
                        <button
                          onClick={() => {
                            setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleFormSubmit}>
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask anything... (Shift+Enter for new line)"
                      disabled={isLoading}
                      rows={1}
                      className={cn(
                        'w-full resize-none rounded-xl',
                        'bg-card border border-border',
                        'px-4 py-3 pr-28',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                        'placeholder:text-muted-foreground',
                        'text-base',
                        'disabled:opacity-50',
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          // Trigger form submit which will use handleFormSubmit
                          const form = e.currentTarget.closest('form');
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                    />

                    {/* Action Buttons */}
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      {/* File Upload Dialog */}
                      <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            type="button"
                            disabled={isLoading}
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Upload Files</DialogTitle>
                            <DialogDescription>
                              Upload documents, images, or data files for AI analysis
                            </DialogDescription>
                          </DialogHeader>
                          <FileUpload
                            onFilesUploaded={(files) => {
                              setUploadedFiles(files);
                              setShowFileUpload(false);
                              toast.success(`${files.length} file(s) uploaded`);
                            }}
                            maxFiles={5}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Voice Input */}
                      <VoiceInput
                        onTranscript={(text) => {
                          // Append transcribed text to input
                          handleInputChange({
                            target: { value: input + (input ? ' ' : '') + text },
                          } as any);
                        }}
                      />

                      {/* Send Button */}
                      <Button
                        type="submit"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>
                      Press <kbd className="px-1.5 py-0.5 rounded bg-muted">Enter</kbd> to send,{' '}
                      <kbd className="px-1.5 py-0.5 rounded bg-muted">Shift+Enter</kbd> for new line
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Generate title from page context
 */
function generateTitleFromContext(context: any): string {
  if (context.page?.includes('/agents')) return 'Agent Assistance';
  if (context.page?.includes('/workflows')) return 'Workflow Creation';
  if (context.page?.includes('/crm')) return 'CRM Discussion';
  if (context.page?.includes('/dashboard')) return 'Dashboard Review';
  return 'New Conversation';
}
