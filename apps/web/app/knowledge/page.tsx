"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from "@/lib/constants/design-system";

/**
 * Knowledge Base Page
 * Wisebase-inspired document management with drag & drop
 */

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadedItems, setUploadedItems] = useState<any[]>([]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileUpload = async (files: File[]) => {
    // TODO: Get actual workspace ID from context/auth
    const workspaceId = "temp-workspace-id";

    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `/api/knowledge/upload?workspaceId=${workspaceId}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

        // Add to uploaded items
        setUploadedItems((prev) => [result.item, ...prev]);

        // Remove from progress after delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 2000);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background.tertiary,
        padding: spacing["2xl"],
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing["2xl"] }}>
        <h1
          style={{
            margin: 0,
            fontSize: typography.sizes["3xl"],
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          📚 Knowledge Base
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: typography.sizes.base,
            color: colors.text.secondary,
          }}
        >
          Upload documents, images, and URLs to build your AI-powered knowledge
          base
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDrag={handleDrag}
        onDragStart={handleDrag}
        onDragEnd={handleDrag}
        onDragOver={handleDragIn}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
        style={{
          background: colors.background.primary,
          border: `2px dashed ${isDragging ? colors.primary[500] : colors.border.default}`,
          borderRadius: radius.lg,
          padding: spacing["3xl"],
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: spacing["2xl"],
          boxShadow: isDragging ? shadows.lg : shadows.sm,
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: spacing.lg }}>
          {isDragging ? "📥" : "📎"}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          {isDragging
            ? "Drop files here"
            : "Drag & drop files, or click to browse"}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: typography.sizes.sm,
            color: colors.text.secondary,
            marginBottom: spacing.xl,
          }}
        >
          Supports: PDF, Word, Images, Text files (Max 10MB)
        </p>

        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <button
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-input")?.click();
            }}
            style={{
              background: colors.primary[500],
              color: colors.text.inverse,
              border: "none",
              borderRadius: radius.md,
              padding: `${spacing.md} ${spacing.xl}`,
              fontSize: typography.sizes.base,
              fontWeight: typography.weights.medium,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary[600];
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.primary[500];
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Choose Files
          </button>
        </label>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div
          style={{
            background: colors.background.primary,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginBottom: spacing["2xl"],
            boxShadow: shadows.sm,
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: typography.sizes.base,
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Uploading...
          </h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div
              key={fileId}
              style={{
                marginBottom: spacing.sm,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: spacing.xs,
                }}
              >
                <span style={{ fontSize: typography.sizes.sm }}>
                  {fileId.split("-")[0]}
                </span>
                <span
                  style={{
                    fontSize: typography.sizes.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {progress}%
                </span>
              </div>
              <div
                style={{
                  background: colors.neutral[200],
                  borderRadius: radius.full,
                  height: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: colors.primary[500],
                    height: "100%",
                    width: `${progress}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recently Uploaded */}
      {uploadedItems.length > 0 && (
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: typography.sizes.xl,
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
              marginBottom: spacing.lg,
            }}
          >
            Recently Uploaded
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: spacing.lg,
            }}
          >
            {uploadedItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: colors.background.primary,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  boxShadow: shadows.sm,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadows.cardHover;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = shadows.sm;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: spacing.sm }}>
                  {item.type === "document"
                    ? "📄"
                    : item.type === "image"
                      ? "🖼️"
                      : item.type === "url"
                        ? "🔗"
                        : "📝"}
                </div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: typography.sizes.base,
                    fontWeight: typography.weights.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.sizes.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {item.status === "processing" ? "Processing..." : "Ready"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedItems.length === 0 &&
        Object.keys(uploadProgress).length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: spacing["3xl"],
              color: colors.text.tertiary,
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: spacing.lg }}>📚</div>
            <p style={{ fontSize: typography.sizes.lg, margin: 0 }}>
              No items yet. Upload your first document to get started!
            </p>
          </div>
        )}
    </div>
  );
}
