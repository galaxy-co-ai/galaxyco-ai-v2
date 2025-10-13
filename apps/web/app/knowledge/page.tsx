"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import KnowledgeItemCard from "@/components/knowledge/KnowledgeItemCard";
import SearchFilterBar from "@/components/knowledge/SearchFilterBar";
import { EmptyState, LoadingSkeleton } from "@/components/knowledge/EmptyState";
import ItemDetailModal from "@/components/knowledge/ItemDetailModal";
import CollectionsSidebar from "@/components/knowledge/CollectionsSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Database, FileText, Image, Link as LinkIcon } from "lucide-react";

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
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
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
      if (selectedCollectionId)
        params.append("collectionId", selectedCollectionId);

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
    selectedCollectionId,
  ]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedStatus, selectedCollectionId, sortBy]);

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
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Collections Sidebar */}
        <div className="w-64 border-r border-border bg-background">
          <CollectionsSidebar
            workspaceId="temp-workspace-id"
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={setSelectedCollectionId}
            totalItemsCount={totalItems}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-border py-6 px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
                  <p className="text-sm text-muted-foreground">
                    {totalItems} items • Organize and search your data
                  </p>
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.gif,.webp"
                />
                <label htmlFor="file-upload">
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </label>
              </div>
            </div>

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
          </header>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="p-4 border-b border-border bg-secondary/50">
              <h4 className="text-sm font-medium mb-2">Uploading files...</h4>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="mb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{fileId.split('-')[0]}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drop Zone */}
          <div
            className={`flex-1 relative ${isDragging ? 'bg-primary/5 border-primary border-dashed border-2' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isDragging && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Drop files to upload</p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDFs, documents, images, and more
                  </p>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-6">
              {/* Loading State */}
              {isLoading && <LoadingSkeleton />}

              {/* Error State */}
              {error && (
                <Card className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <Database className="w-6 h-6 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Failed to load knowledge items
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchItems}>
                      Try Again
                    </Button>
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {!isLoading && items.length === 0 && !error && (
                <EmptyState
                  icon="📭"
                  title={searchQuery ? "No results found" : "No knowledge items yet"}
                  description={searchQuery ? `No items match your search for "${searchQuery}". Try adjusting your filters or upload new content.` : "Start building your knowledge base by uploading documents, images, or other files."}
                  action={{
                    label: "Upload Files",
                    onClick: () => document.getElementById('file-upload')?.click()
                  }}
                />
              )}

              {/* Items Grid */}
              {!isLoading && items.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {items.map((item) => (
                      <KnowledgeItemCard
                        key={item.id}
                        {...item}
                        onClick={() => setSelectedItemId(item.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          workspaceId="temp-workspace-id"
          onClose={() => setSelectedItemId(null)}
          onUpdate={fetchItems}
          onDelete={fetchItems}
        />
      )}
    </div>
  );
}