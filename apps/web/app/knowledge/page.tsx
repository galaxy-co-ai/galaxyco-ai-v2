"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { COLORS, SPACING } from "@/lib/design-system";
import KnowledgeItemCard from "@/components/knowledge/KnowledgeItemCard";
import SearchFilterBar from "@/components/knowledge/SearchFilterBar";
import { EmptyState, LoadingSkeleton } from "@/components/knowledge/EmptyState";
import ItemDetailModal from "@/components/knowledge/ItemDetailModal";

interface KnowledgeItem {
  id: string;
  title: string;
  type: "document" | "image" | "url" | "text";
  status: "processing" | "ready" | "error";
  fileName?: string | null;
  fileSize?: number | null;
  sourceUrl?: string | null;
  tags?: string[];
  isFavorite: boolean;
  createdAt: string;
  processedAt?: string | null;
}

export default function KnowledgeBasePage() {
  const { userId } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Data state
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Fetch knowledge items
  const fetchItems = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Get actual workspace ID from context
      const workspaceId = "temp-workspace-id";

      const params = new URLSearchParams({
        workspaceId,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (selectedType) params.append("type", selectedType);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/knowledge/list?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch knowledge items");
      }

      const data = await response.json();
      setItems(data.items || []);
      setTotalItems(data.pagination?.total || 0);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError(err.message || "Failed to load knowledge items");
    } finally {
      setIsLoading(false);
    }
  }, [
    userId,
    currentPage,
    itemsPerPage,
    sortBy,
    searchQuery,
    selectedType,
    selectedStatus,
  ]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedStatus, sortBy]);

  // Drag and drop handlers
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

        // Refresh the list
        fetchItems();

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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.background.tertiary,
        padding: SPACING.xxl,
      }}
      onDrag={handleDrag}
      onDragStart={handleDrag}
      onDragEnd={handleDrag}
      onDragOver={handleDragIn}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div style={{ marginBottom: SPACING.xxl }}>
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            color: COLORS.text.primary,
            marginBottom: SPACING.sm,
          }}
        >
          📚 Knowledge Base
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            color: COLORS.text.secondary,
          }}
        >
          Upload documents, images, and URLs to build your AI-powered knowledge
          base
        </p>
      </div>

      {/* Compact Upload Area */}
      <div
        style={{
          backgroundColor: COLORS.background.primary,
          border: `2px dashed ${isDragging ? COLORS.accent.primary : COLORS.border.primary}`,
          borderRadius: SPACING.radius.lg,
          padding: SPACING.xl,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: SPACING.xxl,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: SPACING.md,
          }}
        >
          <div style={{ fontSize: "32px" }}>{isDragging ? "📥" : "📎"}</div>
          <div style={{ textAlign: "left" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: COLORS.text.primary,
                marginBottom: "2px",
              }}
            >
              {isDragging
                ? "Drop files here"
                : "Drag & drop files, or click to browse"}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: COLORS.text.secondary,
              }}
            >
              Supports: PDF, Word, Images, Text files (Max 10MB)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{ marginLeft: "auto" }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("file-input")?.click();
              }}
              style={{
                backgroundColor: COLORS.accent.primary,
                color: "#fff",
                border: "none",
                borderRadius: SPACING.radius.md,
                padding: `${SPACING.sm} ${SPACING.lg}`,
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Choose Files
            </button>
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div
          style={{
            backgroundColor: COLORS.background.primary,
            borderRadius: SPACING.radius.lg,
            padding: SPACING.lg,
            marginBottom: SPACING.xxl,
            border: `1px solid ${COLORS.border.primary}`,
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
              color: COLORS.text.primary,
              marginBottom: SPACING.md,
            }}
          >
            Uploading...
          </h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} style={{ marginBottom: SPACING.sm }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: SPACING.xs,
                  fontSize: "13px",
                }}
              >
                <span>{fileId.split("-")[0]}</span>
                <span style={{ color: COLORS.text.secondary }}>
                  {progress}%
                </span>
              </div>
              <div
                style={{
                  backgroundColor: COLORS.background.tertiary,
                  borderRadius: SPACING.radius.full,
                  height: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    backgroundColor: COLORS.accent.primary,
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

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Results Header */}
      {!isLoading && items.length > 0 && (
        <div
          style={{
            marginBottom: SPACING.lg,
            fontSize: "14px",
            color: COLORS.text.secondary,
          }}
        >
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          items
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <EmptyState
          icon="⚠️"
          title="Error Loading Items"
          description={error}
          action={{
            label: "Try Again",
            onClick: fetchItems,
          }}
        />
      )}

      {/* Items Grid */}
      {!isLoading && !error && items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: SPACING.md,
            marginBottom: SPACING.xxl,
          }}
        >
          {items.map((item) => (
            <KnowledgeItemCard
              key={item.id}
              {...item}
              onClick={() => setSelectedItemId(item.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          icon={searchQuery || selectedType || selectedStatus ? "🔍" : "📚"}
          title={
            searchQuery || selectedType || selectedStatus
              ? "No items found"
              : "No knowledge items yet"
          }
          description={
            searchQuery || selectedType || selectedStatus
              ? "Try adjusting your filters or search query"
              : "Upload your first document to get started!"
          }
          action={
            searchQuery || selectedType || selectedStatus
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("");
                    setSelectedType(null);
                    setSelectedStatus(null);
                  },
                }
              : undefined
          }
        />
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: SPACING.md,
            marginTop: SPACING.xxl,
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              padding: `${SPACING.sm} ${SPACING.md}`,
              fontSize: "14px",
              border: `1px solid ${COLORS.border.primary}`,
              borderRadius: SPACING.radius.md,
              backgroundColor: COLORS.background.primary,
              color: COLORS.text.primary,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <span style={{ fontSize: "14px", color: COLORS.text.secondary }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: `${SPACING.sm} ${SPACING.md}`,
              fontSize: "14px",
              border: `1px solid ${COLORS.border.primary}`,
              borderRadius: SPACING.radius.md,
              backgroundColor: COLORS.background.primary,
              color: COLORS.text.primary,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          workspaceId="temp-workspace-id"
          onClose={() => setSelectedItemId(null)}
          onUpdate={() => {
            // Refresh the list after update
            fetchItems();
          }}
          onDelete={() => {
            // Refresh the list after delete
            fetchItems();
          }}
        />
      )}
    </div>
  );
}
