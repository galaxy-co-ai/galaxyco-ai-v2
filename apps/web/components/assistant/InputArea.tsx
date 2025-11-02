/**
 * GalaxyCo.ai InputArea
 * Text input with auto-resize, file attachment, and keyboard shortcuts
 * November 2, 2025
 */

'use client';

import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, Paperclip, Mic } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string, files?: File[]) => void;
  onVoiceInput?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function InputArea({
  onSendMessage,
  onVoiceInput,
  isLoading = false,
  placeholder = 'Ask anything... (Shift+Enter for new line)',
}: InputAreaProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  const handleSend = useCallback(() => {
    if (!input.trim() && files.length === 0) return;
    if (isLoading) return;

    onSendMessage(input.trim(), files);
    setInput('');
    setFiles([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, files, isLoading, onSendMessage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* File Attachments */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
            >
              <Paperclip className="h-3 w-3" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            'w-full resize-none rounded-xl',
            'bg-card border border-border',
            'px-4 py-3 pr-24',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'placeholder:text-muted-foreground',
            'text-base leading-relaxed',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Voice Input */}
          {onVoiceInput && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onVoiceInput}
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}

          {/* Send Button */}
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && files.length === 0)}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted">Enter</kbd> to send,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-muted">Shift+Enter</kbd> for new line
        </span>
      </div>
    </div>
  );
}
