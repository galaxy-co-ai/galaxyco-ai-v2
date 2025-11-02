/**
 * Kibo UI - Dropzone Component (Temporary - Replace with official when available)
 * File upload area with drag and drop
 */

'use client';

import { cn } from '@/lib/utils';
import { Upload, X, File } from 'lucide-react';
import { useCallback, useState, type DragEvent, type ChangeEvent } from 'react';

export interface DropzoneProps {
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function Dropzone({
  onFilesChange,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept,
  multiple = true,
  className,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles).slice(0, maxFiles);
      const validFiles = fileArray.filter((file) => file.size <= maxSize);

      setFiles(validFiles);
      onFilesChange?.(validFiles);
    },
    [maxFiles, maxSize, onFilesChange],
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles],
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50',
        )}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Upload
          className={cn('mb-4 size-12', isDragging ? 'text-primary' : 'text-muted-foreground')}
        />
        <p className="mb-2 text-sm font-medium">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-xs text-muted-foreground">or click to browse</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Max {maxFiles} files, {(maxSize / 1024 / 1024).toFixed(0)}MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg border bg-muted p-3">
              <File className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="shrink-0 rounded-md p-1 hover:bg-background"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
