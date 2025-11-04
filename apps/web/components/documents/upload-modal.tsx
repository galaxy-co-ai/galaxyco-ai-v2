'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  category?: string;
  error?: string;
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      uploadFiles(files);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const uploadFiles = async (files: File[]) => {
    const newUploads: UploadingFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload with progress tracking
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadingFiles((prev) =>
              prev.map((upload, idx) =>
                upload.file === file ? { ...upload, progress: Math.round(progress) } : upload,
              ),
            );
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploadingFiles((prev) =>
              prev.map((upload) =>
                upload.file === file
                  ? {
                      ...upload,
                      progress: 100,
                      status: 'complete',
                      category: response.document?.category,
                    }
                  : upload,
              ),
            );
          } else {
            throw new Error('Upload failed');
          }
        });

        xhr.addEventListener('error', () => {
          setUploadingFiles((prev) =>
            prev.map((upload) =>
              upload.file === file
                ? { ...upload, status: 'error', error: 'Upload failed' }
                : upload,
            ),
          );
        });

        xhr.open('POST', '/api/documents/upload');
        xhr.send(formData);

        // Wait for upload to complete before starting next one
        await new Promise<void>((resolve) => {
          xhr.addEventListener('loadend', () => resolve());
        });
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((upload) =>
            upload.file === file ? { ...upload, status: 'error', error: 'Upload failed' } : upload,
          ),
        );
      }
    }

    // Notify parent after all uploads complete
    if (onUploadComplete) {
      setTimeout(() => {
        onUploadComplete();
      }, 500);
    }
  };

  const handleClose = () => {
    setUploadingFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  const allComplete =
    uploadingFiles.length > 0 && uploadingFiles.every((f) => f.status === 'complete');

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-lg border bg-white shadow-2xl dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Documents</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Upload PDFs, Word docs, images, and more
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop Zone */}
          {uploadingFiles.length === 0 && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700',
              )}
            >
              <Upload className="h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 font-semibold text-foreground">Drag and drop files here</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                or click to browse your files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
            </div>
          )}

          {/* Uploading Files */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-3">
              {uploadingFiles.map((upload, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-neutral-900">
                    {upload.status === 'complete' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : upload.status === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{upload.file.name}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      {upload.status === 'complete' ? (
                        <p className="text-xs text-green-600">
                          Complete • {upload.category?.replace(/_/g, ' ')}
                        </p>
                      ) : upload.status === 'error' ? (
                        <p className="text-xs text-red-600">{upload.error || 'Upload failed'}</p>
                      ) : (
                        <>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {upload.progress}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload More Button */}
              {allComplete && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-neutral-300 text-sm font-medium text-neutral-600 hover:border-neutral-400 hover:text-foreground dark:border-neutral-700 dark:text-neutral-400"
                >
                  <Upload className="h-4 w-4" />
                  Upload More Files
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={handleClose}
            className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {allComplete ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
