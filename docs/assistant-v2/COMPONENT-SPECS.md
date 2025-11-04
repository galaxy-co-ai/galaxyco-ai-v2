# 🧩 AI Assistant V2 - Component Specifications

**Date:** November 4, 2025  
**Purpose:** Detailed specs for every component in the new assistant

---

## 📁 Component Hierarchy

```
AssistantPage (Server Component)
├── ChatContainer (Client Component - Main orchestrator)
    ├── ConversationSidebar (Collapsible history)
    │   ├── ConversationList
    │   ├── ConversationItem
    │   └── SearchBar
    ├── ChatArea (Main conversation)
    │   ├── ChatHeader
    │   │   ├── ModelSelector
    │   │   ├── ConversationTitle
    │   │   └── SettingsMenu
    │   ├── MessageList (Virtualized scroll)
    │   │   ├── MessageBubble (user/assistant messages)
    │   │   │   ├── MarkdownContent
    │   │   │   ├── CodeBlock
    │   │   │   ├── MessageActions
    │   │   │   └── Timestamp
    │   │   ├── ToolCallCard (function executions)
    │   │   └── SystemMessage (status updates)
    │   ├── StreamingIndicator (typing animation)
    │   └── ChatInput
    │       ├── TextareaAutosize
    │       ├── FileAttachments
    │       ├── ActionBar
    │       │   ├── FileUploadButton
    │       │   ├── VoiceInputButton
    │       │   └── SendButton
    │       └── PromptSuggestions (when empty)
```

---

## 🎨 Component Specifications

### **1. ChatContainer** (Main Orchestrator)

**Purpose:** Top-level state management and layout  
**Type:** Client Component  
**State:** Messages, loading, model, conversation ID

```tsx
'use client';

import { useChat } from 'ai/react';
import { useChatStore } from '@/stores/chat-store';

interface ChatContainerProps {
  initialConversationId?: string;
  workspaceId: string;
}

export function ChatContainer({ initialConversationId, workspaceId }: ChatContainerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');

  // Vercel AI SDK - handles streaming, optimistic updates, errors
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    append,
  } = useChat({
    api: '/api/assistant/chat',
    id: initialConversationId,
    body: {
      workspaceId,
      model: selectedModel,
    },
    onFinish: (message) => {
      // Auto-save conversation
      saveChatAction(initialConversationId, messages);

      // Update sidebar
      queryClient.invalidateQueries(['conversations']);
    },
    onError: (error) => {
      toast.error('Failed to send message. Please try again.');
    },
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - collapsible */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-80 border-r"
          >
            <ConversationSidebar
              currentId={initialConversationId}
              onSelect={switchConversation}
              onNew={createNewConversation}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          model={selectedModel}
          onModelChange={setSelectedModel}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          onRegenerate={reload}
          onStop={stop}
        />

        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isLoading}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}
```

**Props:**

- `initialConversationId?: string` - Load existing conversation
- `workspaceId: string` - Multi-tenant isolation

**State:**

- `isSidebarOpen: boolean` - Sidebar visibility
- `selectedModel: string` - Current AI model
- `messages: Message[]` - Managed by Vercel AI SDK
- `isLoading: boolean` - Managed by Vercel AI SDK

---

### **2. MessageBubble** (Individual Message)

**Purpose:** Render user/assistant messages with markdown + code  
**Type:** Client Component  
**Features:** Markdown, code highlighting, copy button, actions

```tsx
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MessageBubbleProps {
  message: Message;
  onCopy?: () => void;
  onEdit?: () => void;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, onCopy, onEdit, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-4 px-6 py-4 group', isUser ? 'justify-end' : 'justify-start')}
    >
      {/* Avatar */}
      {!isUser && (
        <Avatar className="size-10 shrink-0">
          <AvatarImage src="/ai-avatar.png" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={cn('flex-1 max-w-3xl space-y-2', isUser && 'flex flex-col items-end')}>
        {/* Author + timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{isUser ? user.firstName : 'GalaxyCo AI'}</span>
          <span>•</span>
          <RelativeTime timestamp={message.createdAt} />
        </div>

        {/* Message bubble */}
        <Card
          className={cn(
            'p-6 rounded-2xl transition-all duration-200',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-card hover:shadow-lg',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom code blocks
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              },

              // Custom links
              a({ node, href, children, ...props }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                    {...props}
                  >
                    {children}
                    <ExternalLink className="size-3" />
                  </a>
                );
              },

              // Custom lists
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1">{children}</ol>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Tool invocations */}
          {message.toolInvocations?.map((tool) => (
            <ToolCallCard key={tool.toolCallId} tool={tool} />
          ))}
        </Card>

        {/* Message actions (hover to show) */}
        <div
          className={cn(
            'flex items-center gap-2 transition-opacity',
            'opacity-0 group-hover:opacity-100',
          )}
        >
          <Button size="sm" variant="ghost" onClick={onCopy}>
            <Copy className="size-3 mr-1" /> Copy
          </Button>

          {!isUser && (
            <Button size="sm" variant="ghost" onClick={onRegenerate}>
              <RotateCw className="size-3 mr-1" /> Regenerate
            </Button>
          )}

          {isUser && (
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Edit className="size-3 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>{user.firstName[0]}</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
```

**Props:**

- `message: Message` - Message object from Vercel AI SDK
- `onCopy?: () => void` - Copy message to clipboard
- `onEdit?: () => void` - Edit and resend
- `onRegenerate?: () => void` - Generate new response

---

### **3. CodeBlock** (Syntax Highlighting)

**Purpose:** Beautiful code blocks with copy button  
**Type:** Client Component  
**Features:** Syntax highlighting, copy to clipboard, language badge

```tsx
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border">
      {/* Language badge + copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
        <Badge variant="outline" className="text-xs font-mono">
          {language}
        </Badge>

        <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7">
          {copied ? (
            <>
              <Check className="size-3 mr-1" /> Copied!
            </>
          ) : (
            <>
              <Copy className="size-3 mr-1" /> Copy
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'hsl(222 47% 11%)', // VS Code dark
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
```

---

### **4. ChatInput** (Powerful Input Field)

**Purpose:** Multi-line input with file upload, voice, shortcuts  
**Type:** Client Component  
**Features:** Auto-resize, drag-drop files, voice, shortcuts

```tsx
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Paperclip, Mic, Loader2 } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  onFileUpload?: (files: File[]) => void;
}

export function ChatInput({ value, onChange, onSubmit, disabled, onFileUpload }: ChatInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
    onFileUpload?.(droppedFiles);
  };

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="border-t bg-background p-6">
      {/* File previews */}
      {files.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <FilePreview
              key={i}
              file={file}
              onRemove={() => {
                setFiles(files.filter((_, idx) => idx !== i));
              }}
            />
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        className={cn(
          'relative rounded-xl border-2 transition-all duration-200',
          isDragging && 'border-primary bg-primary/5',
          !isDragging && 'border-border',
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <form onSubmit={onSubmit}>
          <TextareaAutosize
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={
              isDragging ? 'Drop files here...' : 'Ask me anything about your workspace...'
            }
            className={cn(
              'w-full resize-none bg-transparent p-4 pr-32',
              'text-base placeholder:text-muted-foreground',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            maxRows={10}
            minRows={1}
            disabled={disabled}
            onKeyDown={(e) => {
              // Enter to send (Shift+Enter for new line)
              if (e.key === 'Enter' && !e.shiftKey && !disabled) {
                e.preventDefault();
                onSubmit(e as any);
              }

              // Esc to clear
              if (e.key === 'Escape') {
                onChange({ target: { value: '' } } as any);
              }
            }}
          />

          {/* Action buttons */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* File upload */}
            <FileUploadButton onUpload={(newFiles) => setFiles((prev) => [...prev, ...newFiles])} />

            {/* Voice input (optional) */}
            <VoiceInputButton
              onTranscript={(text) => {
                onChange({ target: { value: value + text } } as any);
              }}
            />

            {/* Send button */}
            <Button
              type="submit"
              size="icon"
              disabled={disabled || !value.trim()}
              className="size-10 rounded-lg"
            >
              {disabled ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </form>
      </div>

      {/* Helper text */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <Kbd>Enter</Kbd> to send • <Kbd>Shift + Enter</Kbd> for new line
        </span>

        <span>{value.length > 0 && `${value.length} characters`}</span>
      </div>
    </div>
  );
}
```

---

### **5. ConversationSidebar** (History Management)

**Purpose:** Show conversation history with search  
**Type:** Client Component  
**Features:** Search, pin, delete, timestamps

```tsx
export function ConversationSidebar({ currentId, onSelect, onNew }: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // React Query for conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', workspaceId],
    queryFn: () => fetchConversations(workspaceId),
  });

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations?.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-background-elevated">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Conversations</h2>
          <Button size="sm" onClick={onNew}>
            <Plus className="size-4 mr-1" /> New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && <ConversationsSkeleton />}

        {filteredConversations?.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start a new conversation to get started"
          />
        )}

        {/* Grouped by date */}
        <ConversationList
          conversations={filteredConversations}
          currentId={currentId}
          onSelect={onSelect}
          onDelete={deleteConversation}
          onPin={pinConversation}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="size-4 mr-2" /> Settings
        </Button>
      </div>
    </div>
  );
}
```

---

### **6. ToolCallCard** (Function Execution Display)

**Purpose:** Show function calls in progress/completed  
**Type:** Client Component  
**Features:** Real-time status, results, errors

```tsx
export function ToolCallCard({ tool }: { tool: ToolInvocation }) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
    running: { icon: Loader2, color: 'text-primary', bg: 'bg-primary/10', spin: true },
    completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    failed: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  const config = statusConfig[tool.state];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('mt-4 p-4 rounded-xl border-2 transition-all', config.bg, 'border-transparent')}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className={cn('mt-0.5', config.color)}>
          <Icon className={cn('size-5', config.spin && 'animate-spin')} />
        </div>

        {/* Tool info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{getToolDisplayName(tool.toolName)}</span>
            <Badge variant="outline" className="text-xs">
              {tool.state}
            </Badge>
          </div>

          {/* Parameters */}
          {tool.args && (
            <CodeBlock language="json" code={JSON.stringify(tool.args, null, 2)} compact />
          )}

          {/* Result */}
          {tool.result && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">Result:</span>
              <div className="mt-1">{parseToolResult(tool.result)}</div>
            </div>
          )}

          {/* Error */}
          {tool.state === 'failed' && (
            <div className="mt-2 text-sm text-destructive">
              <strong>Error:</strong> {tool.error}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

---

### **7. ModelSelector** (AI Model Switcher)

**Purpose:** Switch between GPT-4, Claude, Gemini  
**Type:** Client Component  
**Features:** Model descriptions, pricing info

```tsx
const models = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Best for general tasks, fast responses',
    icon: '⚡',
    cost: '$0.01/1K tokens',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Best for complex reasoning, long context',
    icon: '🧠',
    cost: '$0.015/1K tokens',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Best for multimodal tasks',
    icon: '✨',
    cost: '$0.007/1K tokens',
  },
];

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-64">
        <div className="flex items-center gap-2">
          <span className="text-lg">{models.find((m) => m.id === value)?.icon}</span>
          <span className="font-medium">{models.find((m) => m.id === value)?.name}</span>
        </div>
      </SelectTrigger>

      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-start gap-3 py-2">
              <span className="text-2xl">{model.icon}</span>
              <div className="flex-1">
                <div className="font-semibold">{model.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{model.description}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {model.provider} • {model.cost}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

### **8. PromptTemplates** (Quick Start)

**Purpose:** Pre-made prompts to get started  
**Type:** Client Component  
**Features:** Click to use, categorized

```tsx
const templates = [
  {
    category: 'Agents',
    prompts: [
      {
        title: 'Create Email Agent',
        prompt: 'Help me create an AI agent that automatically responds to customer emails',
        icon: Mail,
      },
      {
        title: 'Research Agent',
        prompt: 'Set up a research agent that finds leads in my industry',
        icon: Search,
      },
    ],
  },
  {
    category: 'Analysis',
    prompts: [
      {
        title: 'Sales Insights',
        prompt: 'Analyze my sales data for the last 30 days and identify trends',
        icon: TrendingUp,
      },
      {
        title: 'Workflow Performance',
        prompt: 'Review my workflows and suggest optimizations',
        icon: Zap,
      },
    ],
  },
];

export function PromptTemplates({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">How can I help?</h2>
        <p className="text-lg text-muted-foreground">Choose a template or ask me anything</p>
      </div>

      {templates.map((category) => (
        <div key={category.category} className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {category.category}
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            {category.prompts.map((template) => (
              <Button
                key={template.title}
                variant="outline"
                className={cn(
                  'h-auto p-4 justify-start text-left',
                  'hover:bg-primary/5 hover:border-primary/20',
                  'transition-all duration-200 hover:scale-[1.02]',
                )}
                onClick={() => onSelect(template.prompt)}
              >
                <template.icon className="size-5 mr-3 text-primary" />
                <div className="flex-1">
                  <div className="font-semibold">{template.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{template.prompt}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 Hooks & Utilities

### **useAssistantChat** (Wrapper around Vercel AI SDK)

```typescript
export function useAssistantChat(config: UseChatConfig) {
  const { workspaceId } = useWorkspace();

  const chat = useChat({
    ...config,
    body: {
      ...config.body,
      workspaceId,
    },
    onFinish: async (message) => {
      // Save to database
      await saveChatMessage(config.id, message);

      // Call user's onFinish
      config.onFinish?.(message);
    },
  });

  // Add workspace-specific functionality
  const appendWithContext = useCallback(
    async (content: string) => {
      // Add workspace context
      const context = await getWorkspaceContext(workspaceId);

      chat.append({
        role: 'user',
        content,
        experimental_attachments: context,
      });
    },
    [chat, workspaceId],
  );

  return {
    ...chat,
    appendWithContext,
  };
}
```

---

## 🎯 Key Improvements Over Current

| Feature               | Current                     | New V2                        |
| --------------------- | --------------------------- | ----------------------------- |
| **Streaming**         | Custom buggy implementation | Vercel AI SDK (battle-tested) |
| **Components**        | 852-line monolith           | 8 small focused components    |
| **Code Highlighting** | None                        | Prism with 100+ languages     |
| **File Upload**       | Broken                      | Drag-drop + vision support    |
| **Tool Calling**      | None                        | 10+ workspace tools           |
| **RAG**               | None                        | Full vector search            |
| **Mobile**            | Broken layout               | Fully responsive              |
| **Animations**        | None                        | Framer Motion throughout      |
| **State**             | 10+ useState hooks          | Vercel AI SDK + Zustand       |
| **Error Handling**    | console.log                 | Toast + retry                 |
| **Testing**           | None                        | Full test coverage            |

---

**Ready to build this?** 🚀
