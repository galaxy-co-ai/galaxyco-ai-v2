"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Plus, Settings } from "lucide-react";
import type { Iteration } from "@/lib/stores/agent-builder-store";
import { formatRelativeTime } from "@/lib/utils";

interface IterationChatProps {
  messages: Iteration[];
  onSendMessage: (content: string) => Promise<void>;
  isSending: boolean;
}

const SUGGESTED_ACTIONS = [
  "Add email notification",
  "Add error handling",
  "Include data validation",
  "Add Slack integration",
];

export function IterationChat({
  messages,
  onSendMessage,
  isSending,
}: IterationChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput("");
    await onSendMessage(message);
  };

  const handleSuggestedAction = (action: string) => {
    setInput(action);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-3 max-w-sm">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Refine Your Agent
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Describe changes you&apos;d like to make to your agent&apos;s
                workflow. You can add steps, modify logic, or integrate new
                services.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : message.role === "system"
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                  }`}
                >
                  {message.role !== "system" && (
                    <div className="mb-1 text-xs opacity-70">
                      {message.role === "user" ? "You" : "Agent Builder"} ·{" "}
                      {formatRelativeTime(message.timestamp)}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {message.workflowUpdate && message.role === "assistant" && (
                    <div className="mt-3 rounded-md bg-black/5 dark:bg-white/5 p-2 text-xs">
                      <div className="font-medium mb-1">✓ Workflow updated</div>
                      <div className="opacity-70">
                        {message.workflowUpdate.length} steps configured
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggested Actions */}
      {messages.length > 0 && !isSending && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
            Quick actions:
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleSuggestedAction(action)}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Plus className="h-3 w-3" />
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe changes to your agent..."
            className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={1}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
        <div className="mt-2 text-xs text-neutral-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
