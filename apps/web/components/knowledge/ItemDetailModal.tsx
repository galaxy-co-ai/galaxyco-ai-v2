"use client";

import { useState, useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { COLORS, SPACING } from "@/lib/design-system";

interface KnowledgeItem {
  id: string;
  title: string;
  type: "document" | "image" | "url" | "text";
  status: "processing" | "ready" | "error";
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  sourceUrl?: string | null;
  content?: string | null;
  summary?: string | null;
  tags?: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  processedAt?: string | null;
  metadata?: any;
}

interface ItemDetailModalProps {
  itemId: string;
  workspaceId: string;
  onClose: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

type TabType = "content" | "metadata" | "actions";

const TYPE_ICONS = {
  document: "📄",
  url: "🔗",
  text: "📝",
  image: "🖼️",
};

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "Unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ItemDetailModal({
  itemId,
  workspaceId,
  onClose,
  onUpdate,
  onDelete,
}: ItemDetailModalProps) {
  const [item, setItem] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/knowledge/items/${itemId}?workspaceId=${workspaceId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }

        const data = await response.json();
        setItem(data.item);
        setEditedTitle(data.item.title);
      } catch (err: any) {
        logger.error("Error fetching item", err);
        setError(err.message || "Failed to load item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [itemId, workspaceId]);

  // Handle title update
  const handleSaveTitle = async () => {
    if (!item || editedTitle === item.title) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/knowledge/items/${itemId}?workspaceId=${workspaceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editedTitle }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      const data = await response.json();
      setItem(data.item);
      setIsEditing(false);
      onUpdate?.();
    } catch (err: any) {
      logger.error("Error updating title", err);
      alert("Failed to update title: " + err.message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this item? This cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/knowledge/items/${itemId}?workspaceId=${workspaceId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      onDelete?.();
      onClose();
    } catch (err: any) {
      logger.error("Error deleting item", err);
      alert("Failed to delete item: " + err.message);
      setIsDeleting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.background.overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: SPACING.lg,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.background.primary,
          borderRadius: SPACING.radius.lg,
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: SPACING.lg,
            borderBottom: `1px solid ${COLORS.border.primary}`,
            display: "flex",
            alignItems: "flex-start",
            gap: SPACING.md,
          }}
        >
          {item && (
            <>
              <div style={{ fontSize: "32px", flexShrink: 0 }}>
                {TYPE_ICONS[item.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") setIsEditing(false);
                    }}
                    autoFocus
                    style={{
                      width: "100%",
                      fontSize: "20px",
                      fontWeight: "600",
                      padding: `${SPACING.xs} ${SPACING.sm}`,
                      border: `1px solid ${COLORS.accent.primary}`,
                      borderRadius: SPACING.radius.sm,
                      outline: "none",
                    }}
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditing(true)}
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "600",
                      color: COLORS.text.primary,
                      cursor: "pointer",
                      padding: `${SPACING.xs} ${SPACING.sm}`,
                      borderRadius: SPACING.radius.sm,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        COLORS.background.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {item.title}
                  </h2>
                )}
                <div
                  style={{
                    fontSize: "13px",
                    color: COLORS.text.secondary,
                    marginTop: SPACING.xs,
                  }}
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} •
                  Added {formatDate(item.createdAt)}
                </div>
              </div>
            </>
          )}
          <button
            onClick={onClose}
            style={{
              fontSize: "24px",
              color: COLORS.text.secondary,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: SPACING.xs,
              lineHeight: "1",
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: SPACING.xs,
            padding: `${SPACING.md} ${SPACING.lg} 0`,
            borderBottom: `1px solid ${COLORS.border.primary}`,
          }}
        >
          {(["content", "metadata", "actions"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: `${SPACING.sm} ${SPACING.md}`,
                fontSize: "14px",
                fontWeight: "500",
                color:
                  activeTab === tab
                    ? COLORS.accent.primary
                    : COLORS.text.secondary,
                backgroundColor: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab ? COLORS.accent.primary : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: SPACING.lg,
          }}
        >
          {isLoading && (
            <div
              style={{
                textAlign: "center",
                padding: SPACING.xxl,
                color: COLORS.text.secondary,
              }}
            >
              Loading...
            </div>
          )}

          {error && (
            <div
              style={{
                textAlign: "center",
                padding: SPACING.xxl,
                color: COLORS.error.DEFAULT,
              }}
            >
              {error}
            </div>
          )}

          {item && !isLoading && !error && (
            <>
              {/* Content Tab */}
              {activeTab === "content" && (
                <div>
                  {item.content ? (
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: COLORS.text.primary,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.content}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: SPACING.xxl,
                        color: COLORS.text.secondary,
                      }}
                    >
                      No content available
                      {item.status === "processing" && " - Still processing..."}
                    </div>
                  )}
                </div>
              )}

              {/* Metadata Tab */}
              {activeTab === "metadata" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: SPACING.md,
                  }}
                >
                  <MetadataRow label="ID" value={item.id} />
                  <MetadataRow label="Type" value={item.type} />
                  <MetadataRow label="Status" value={item.status} />
                  {item.fileName && (
                    <MetadataRow label="File Name" value={item.fileName} />
                  )}
                  {item.fileSize && (
                    <MetadataRow
                      label="File Size"
                      value={formatFileSize(item.fileSize)}
                    />
                  )}
                  {item.mimeType && (
                    <MetadataRow label="MIME Type" value={item.mimeType} />
                  )}
                  {item.sourceUrl && (
                    <MetadataRow
                      label="Source URL"
                      value={
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: COLORS.accent.primary,
                            textDecoration: "underline",
                          }}
                        >
                          {item.sourceUrl}
                        </a>
                      }
                    />
                  )}
                  <MetadataRow
                    label="Created"
                    value={formatDate(item.createdAt)}
                  />
                  {item.processedAt && (
                    <MetadataRow
                      label="Processed"
                      value={formatDate(item.processedAt)}
                    />
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <MetadataRow
                      label="Tags"
                      value={
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: SPACING.xs,
                          }}
                        >
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: "12px",
                                padding: `${SPACING.xs} ${SPACING.sm}`,
                                backgroundColor: COLORS.background.tertiary,
                                borderRadius: SPACING.radius.full,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  )}
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <MetadataRow
                      label="Additional Info"
                      value={
                        <pre
                          style={{
                            fontSize: "12px",
                            backgroundColor: COLORS.background.secondary,
                            padding: SPACING.sm,
                            borderRadius: SPACING.radius.sm,
                            overflow: "auto",
                          }}
                        >
                          {JSON.stringify(item.metadata, null, 2)}
                        </pre>
                      }
                    />
                  )}
                </div>
              )}

              {/* Actions Tab */}
              {activeTab === "actions" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: SPACING.md,
                  }}
                >
                  {item.sourceUrl && (
                    <ActionButton
                      label="Download / View Source"
                      description="Open the original source file or URL"
                      icon="📥"
                      onClick={() => window.open(item.sourceUrl!, "_blank")}
                    />
                  )}

                  <ActionButton
                    label="Edit Title"
                    description="Change the title of this item"
                    icon="✏️"
                    onClick={() => {
                      setActiveTab("content");
                      setIsEditing(true);
                    }}
                  />

                  <ActionButton
                    label="Delete Item"
                    description="Permanently remove this item from your knowledge base"
                    icon="🗑️"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant="danger"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: COLORS.text.secondary,
          marginBottom: SPACING.xs,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "14px", color: COLORS.text.primary }}>
        {typeof value === "string" ? value : value}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  description,
  icon,
  onClick,
  disabled = false,
  variant = "default",
}: {
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.background.secondary,
        border: `1px solid ${variant === "danger" ? COLORS.error.DEFAULT : COLORS.border.primary}`,
        borderRadius: SPACING.radius.md,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        width: "100%",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = COLORS.background.tertiary;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.background.secondary;
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color:
              variant === "danger" ? COLORS.error.DEFAULT : COLORS.text.primary,
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "12px", color: COLORS.text.secondary }}>
          {description}
        </div>
      </div>
    </button>
  );
}
