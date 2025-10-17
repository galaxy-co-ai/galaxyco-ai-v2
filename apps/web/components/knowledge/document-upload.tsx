"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  File,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UploadFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}

interface DocumentUploadProps {
  onUploadComplete?: () => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
}

export function DocumentUpload({
  onUploadComplete,
  maxFiles = 10,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "text/markdown",
    "text/x-markdown",
    ".md",
    ".txt",
    ".csv",
    "text/csv",
    "application/json",
    "text/html",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
}: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />;
    } else if (
      file.type === "application/pdf" ||
      file.type.includes("document")
    ) {
      return <FileText className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check by file extension for files without proper MIME types
    const fileName = file.name.toLowerCase();
    const fileExtension = "." + fileName.split(".").pop();

    const isAccepted =
      acceptedTypes.includes(file.type) ||
      acceptedTypes.includes(fileExtension) ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".markdown") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".csv") ||
      fileName.endsWith(".json");

    if (!isAccepted) {
      return `File type not supported. Accepted types: PDF, Word, Excel, Text, Markdown (.md), CSV, JSON, Images`;
    }

    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size: ${formatFileSize(maxSizeBytes)}`;
    }

    return null;
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const filesToAdd = Array.from(newFiles).slice(0, maxFiles - files.length);

      const uploadFiles: UploadFile[] = filesToAdd.map((file) => {
        const error = validateFile(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          status: error ? "error" : "pending",
          progress: 0,
          error: error || undefined,
        };
      });

      setFiles((prev) => [...prev, ...uploadFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files.length, maxFiles, maxSizeBytes, acceptedTypes],
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    if (uploadFile.status === "error") return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );

    const formData = new FormData();
    formData.append("file", uploadFile.file);
    formData.append("title", uploadFile.file.name);

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)),
          );
        }
      };

      // Handle completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, status: "processing", progress: 100 }
                : f,
            ),
          );

          // Simulate processing time (in real app, this would be handled by webhooks)
          setTimeout(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id ? { ...f, status: "success" } : f,
              ),
            );
          }, 2000);
        } else {
          throw new Error(`Upload failed with status: ${xhr.status}`);
        }
      };

      // Handle errors
      xhr.onerror = () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: "error",
                  error: "Upload failed. Please try again.",
                }
              : f,
          ),
        );
      };

      xhr.open("POST", "/api/documents/upload");
      xhr.send(formData);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f,
        ),
      );
    }
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");

    // Upload files sequentially to avoid overwhelming the server
    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    // Check if all files are processed
    setTimeout(() => {
      const allComplete = files.every(
        (f) => f.status === "success" || f.status === "error",
      );
      if (allComplete && onUploadComplete) {
        onUploadComplete();
      }
    }, 3000);
  };

  // Drag and drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [addFiles],
  );

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "Ready to upload";
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing...";
      case "success":
        return "Complete";
      case "error":
        return "Failed";
      default:
        return "";
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your files here, or click to browse
        </p>
        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
          Select Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={onFileSelect}
          className="hidden"
        />
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Supported formats: PDF, Word, Excel, Text, Markdown, CSV, JSON,
            Images
          </p>
          <p>
            Maximum file size: {formatFileSize(maxSizeBytes)} • Maximum files:{" "}
            {maxFiles}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Files ({files.length})</h4>
            {pendingCount > 0 && (
              <Button onClick={uploadAll}>
                Upload {pendingCount} File{pendingCount !== 1 ? "s" : ""}
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-64 overflow-auto">
            {files.map((uploadFile) => (
              <Card key={uploadFile.id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    {getFileIcon(uploadFile.file)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(uploadFile.status)}
                          <Badge variant="secondary" className="text-xs">
                            {getStatusText(uploadFile.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatFileSize(uploadFile.file.size)}</span>
                        {uploadFile.status !== "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {uploadFile.status === "uploading" && (
                        <Progress
                          value={uploadFile.progress}
                          className="mt-2 h-1"
                        />
                      )}

                      {uploadFile.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          {(successCount > 0 || errorCount > 0) && (
            <div className="flex items-center gap-4 text-sm">
              {successCount > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {successCount} uploaded
                </div>
              )}
              {errorCount > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errorCount} failed
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
