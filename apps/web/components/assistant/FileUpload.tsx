/**
 * GalaxyCo.ai FileUpload Component
 * Drag & drop file upload with preview
 * November 2, 2025
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  extractedText?: string;
}

interface FileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export function FileUpload({ onFilesUploaded, maxFiles = 5 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      await uploadFiles(files);
    },
    [uploadedFiles, maxFiles],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      await uploadFiles(files);
    },
    [uploadedFiles, maxFiles],
  );

  const uploadFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newUploadingFiles = new Set(uploadingFiles);

    for (const file of files) {
      const tempId = `temp-${Date.now()}-${file.name}`;
      newUploadingFiles.add(tempId);
      setUploadingFiles(new Set(newUploadingFiles));

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/assistant/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();

        setUploadedFiles((prev) => {
          const newFiles = [...prev, data.file];
          onFilesUploaded?.(newFiles);
          return newFiles;
        });

        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        console.error('File upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        newUploadingFiles.delete(tempId);
        setUploadingFiles(new Set(newUploadingFiles));
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== fileId);
      onFilesUploaded?.(newFiles);
      return newFiles;
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.csv,.txt,.docx,.xlsx,.png,.jpg,.jpeg,.webp"
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Upload className="size-6 text-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
          <p className="text-xs text-muted-foreground">
            PDF, CSV, TXT, DOCX, XLSX, Images (Max 10MB)
          </p>
        </label>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 size-8 rounded bg-muted flex items-center justify-center">
                    <File className="size-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Check className="size-4 text-primary flex-shrink-0" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploadingFiles).map((fileId) => (
            <div
              key={fileId}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
