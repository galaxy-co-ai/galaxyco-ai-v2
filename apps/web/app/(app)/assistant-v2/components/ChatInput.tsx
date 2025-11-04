'use client';

import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Loader2, Square, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FilePreview } from './FilePreview';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  onStop?: () => void;
  onFilesAttached?: (files: File[]) => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  onStop,
  onFilesAttached,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith('image/') || file.type === 'application/pdf',
    );

    if (droppedFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...droppedFiles]);
      onFilesAttached?.(droppedFiles);
    }
  };

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...selectedFiles]);
      onFilesAttached?.(selectedFiles);
    }
    e.target.value = ''; // Reset input
  };

  // Remove file
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSubmit(e as any);
    }

    // Esc to clear
    if (e.key === 'Escape') {
      onChange({ target: { value: '' } } as any);
    }
  };

  return (
    <div className="border-t bg-background px-6 py-4">
      {/* Input area */}
      <div className="max-w-4xl mx-auto">
        {/* File previews */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, i) => (
              <FilePreview key={i} file={file} onRemove={() => removeFile(i)} />
            ))}
          </div>
        )}

        <div
          className={cn(
            'relative rounded-2xl border-2 transition-all duration-200',
            isDragging && 'border-primary bg-primary/5',
            !isDragging && 'border-border',
            'focus-within:border-primary/50 focus-within:shadow-lg',
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
              onKeyDown={handleKeyDown}
              placeholder={
                isDragging
                  ? 'Drop files here...'
                  : attachedFiles.length > 0
                    ? `Message with ${attachedFiles.length} file(s)...`
                    : 'Ask me anything about your workspace...'
              }
              className={cn(
                'w-full resize-none bg-transparent p-4 pr-14',
                'text-base placeholder:text-muted-foreground',
                'focus:outline-none',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              maxRows={10}
              minRows={1}
              disabled={disabled}
            />

            {/* Action buttons */}
            <div className="absolute right-3 bottom-3 flex items-center gap-1">
              {/* File upload button */}
              {!onStop && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="size-10 rounded-xl"
                    title="Attach files"
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </>
              )}

              {/* Send/Stop button */}
              {onStop ? (
                <Button
                  type="button"
                  size="icon"
                  onClick={onStop}
                  className="size-10 rounded-xl bg-destructive hover:bg-destructive/90"
                  title="Stop generating"
                >
                  <Square className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={disabled}
                  className="size-10 rounded-xl"
                  title="Send message (Enter)"
                >
                  {disabled ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Helper text */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd> to send •{' '}
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift + Enter</kbd> for
            new line
          </span>

          {value?.length > 0 && <span>{value.length} characters</span>}
        </div>
      </div>
    </div>
  );
}
