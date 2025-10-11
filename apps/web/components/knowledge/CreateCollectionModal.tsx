"use client";

import { useState } from "react";
import { COLORS, SPACING } from "@/lib/design-system";

interface CreateCollectionModalProps {
  workspaceId: string;
  onClose: () => void;
  onCreate?: () => void;
  editCollection?: {
    id: string;
    name: string;
    description?: string | null;
    color: string;
  } | null;
}

const PRESET_COLORS = [
  "#4d6fff", // Primary Blue
  "#7c3aed", // Purple
  "#ec4899", // Pink
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#ef4444", // Red
];

export default function CreateCollectionModal({
  workspaceId,
  onClose,
  onCreate,
  editCollection,
}: CreateCollectionModalProps) {
  const [name, setName] = useState(editCollection?.name || "");
  const [description, setDescription] = useState(
    editCollection?.description || "",
  );
  const [selectedColor, setSelectedColor] = useState(
    editCollection?.color || PRESET_COLORS[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = editCollection
        ? `/api/knowledge/collections/${editCollection.id}?workspaceId=${workspaceId}`
        : `/api/knowledge/collections?workspaceId=${workspaceId}`;

      const method = editCollection ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          color: selectedColor,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save collection");
      }

      onCreate?.();
      onClose();
    } catch (err: any) {
      console.error("Error saving collection:", err);
      setError(err.message || "Failed to save collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
          maxWidth: "500px",
          width: "100%",
          padding: SPACING.xl,
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: SPACING.lg,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: COLORS.text.primary,
            }}
          >
            {editCollection ? "Edit Collection" : "Create Collection"}
          </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div style={{ marginBottom: SPACING.lg }}>
            <label
              htmlFor="collection-name"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: COLORS.text.secondary,
                marginBottom: SPACING.xs,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Name *
            </label>
            <input
              id="collection-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Research Papers, Customer Docs"
              autoFocus
              style={{
                width: "100%",
                padding: `${SPACING.sm} ${SPACING.md}`,
                fontSize: "14px",
                border: `1px solid ${COLORS.border.primary}`,
                borderRadius: SPACING.radius.md,
                backgroundColor: COLORS.background.secondary,
                color: COLORS.text.primary,
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.accent.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border.primary;
              }}
            />
          </div>

          {/* Description Input */}
          <div style={{ marginBottom: SPACING.lg }}>
            <label
              htmlFor="collection-description"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: COLORS.text.secondary,
                marginBottom: SPACING.xs,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Description (Optional)
            </label>
            <textarea
              id="collection-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what goes in this collection..."
              rows={3}
              style={{
                width: "100%",
                padding: `${SPACING.sm} ${SPACING.md}`,
                fontSize: "14px",
                border: `1px solid ${COLORS.border.primary}`,
                borderRadius: SPACING.radius.md,
                backgroundColor: COLORS.background.secondary,
                color: COLORS.text.primary,
                outline: "none",
                transition: "border-color 0.2s ease",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.accent.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border.primary;
              }}
            />
          </div>

          {/* Color Picker */}
          <div style={{ marginBottom: SPACING.xl }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: COLORS.text.secondary,
                marginBottom: SPACING.sm,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Color
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: SPACING.sm,
              }}
            >
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: "100%",
                    height: "40px",
                    backgroundColor: color,
                    border:
                      selectedColor === color
                        ? `3px solid ${COLORS.text.primary}`
                        : `1px solid ${COLORS.border.primary}`,
                    borderRadius: SPACING.radius.md,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedColor !== color) {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {selectedColor === color && (
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: SPACING.sm,
                backgroundColor: `${COLORS.error.DEFAULT}15`,
                border: `1px solid ${COLORS.error.DEFAULT}`,
                borderRadius: SPACING.radius.md,
                color: COLORS.error.DEFAULT,
                fontSize: "13px",
                marginBottom: SPACING.lg,
              }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: SPACING.md,
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: `${SPACING.sm} ${SPACING.lg}`,
                fontSize: "14px",
                fontWeight: "500",
                border: `1px solid ${COLORS.border.primary}`,
                borderRadius: SPACING.radius.md,
                backgroundColor: COLORS.background.secondary,
                color: COLORS.text.primary,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              style={{
                padding: `${SPACING.sm} ${SPACING.lg}`,
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                borderRadius: SPACING.radius.md,
                backgroundColor: COLORS.accent.primary,
                color: "#fff",
                cursor:
                  isSubmitting || !name.trim() ? "not-allowed" : "pointer",
                opacity: isSubmitting || !name.trim() ? 0.5 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : editCollection
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
