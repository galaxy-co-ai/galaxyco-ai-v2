"use client";

import { COLORS, SPACING } from "@/lib/design-system";

interface KnowledgeItemCardProps {
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
  onClick?: () => void;
}

const TYPE_ICONS = {
  document: "📄",
  url: "🔗",
  text: "📝",
  image: "🖼️",
};

const STATUS_COLORS = {
  processing: COLORS.text.secondary,
  ready: COLORS.accent.primary,
  error: "#ef4444",
};

const STATUS_LABELS = {
  processing: "Processing...",
  ready: "Ready",
  error: "Error",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function KnowledgeItemCard({
  id,
  title,
  type,
  status,
  fileName,
  fileSize,
  sourceUrl,
  tags = [],
  isFavorite,
  createdAt,
  processedAt,
  onClick,
}: KnowledgeItemCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
      style={{
        backgroundColor: COLORS.background.secondary,
        border: `1px solid ${COLORS.border.primary}`,
        borderRadius: SPACING.radius.lg,
        padding: SPACING.md,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.accent.primary;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border.primary;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header with Icon and Status */}
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: SPACING.sm }}
      >
        {/* Type Icon */}
        <div
          style={{
            fontSize: "32px",
            lineHeight: "1",
            flexShrink: 0,
          }}
        >
          {TYPE_ICONS[type]}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: COLORS.text.primary,
              marginBottom: SPACING.xs,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.4",
            }}
          >
            {title}
          </h3>

          {/* Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: SPACING.xs,
              fontSize: "11px",
              fontWeight: "500",
              color: STATUS_COLORS[status],
              backgroundColor: `${STATUS_COLORS[status]}15`,
              padding: `${SPACING.xs} ${SPACING.sm}`,
              borderRadius: SPACING.radius.full,
              marginBottom: SPACING.sm,
            }}
          >
            {status === "processing" && (
              <span style={{ animation: "spin 1s linear infinite" }}>⚙️</span>
            )}
            {STATUS_LABELS[status]}
          </div>

          {/* Metadata */}
          <div
            style={{
              fontSize: "12px",
              color: COLORS.text.secondary,
              display: "flex",
              flexDirection: "column",
              gap: SPACING.xs,
            }}
          >
            {fileName && (
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {fileName}
              </div>
            )}

            <div
              style={{ display: "flex", alignItems: "center", gap: SPACING.sm }}
            >
              <span>{formatDate(createdAt)}</span>
              {fileSize && (
                <>
                  <span>•</span>
                  <span>{formatFileSize(fileSize)}</span>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: SPACING.xs,
                marginTop: SPACING.sm,
              }}
            >
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "11px",
                    padding: `2px ${SPACING.xs}`,
                    backgroundColor: COLORS.background.tertiary,
                    color: COLORS.text.secondary,
                    borderRadius: SPACING.radius.sm,
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span
                  style={{
                    fontSize: "11px",
                    padding: `2px ${SPACING.xs}`,
                    color: COLORS.text.secondary,
                  }}
                >
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Favorite Star */}
        {isFavorite && (
          <div style={{ fontSize: "16px", flexShrink: 0 }}>⭐</div>
        )}
      </div>
    </div>
  );
}
