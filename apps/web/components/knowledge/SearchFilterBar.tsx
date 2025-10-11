"use client";

import { COLORS, SPACING } from "@/lib/design-system";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const TYPE_OPTIONS = [
  { value: "document", label: "📄 Documents", emoji: "📄" },
  { value: "url", label: "🔗 URLs", emoji: "🔗" },
  { value: "text", label: "📝 Text", emoji: "📝" },
  { value: "image", label: "🖼️ Images", emoji: "🖼️" },
];

const STATUS_OPTIONS = [
  { value: "ready", label: "Ready" },
  { value: "processing", label: "Processing" },
  { value: "error", label: "Error" },
];

const SORT_OPTIONS = [
  { value: "created_desc", label: "Newest First" },
  { value: "created_asc", label: "Oldest First" },
  { value: "title_asc", label: "A → Z" },
  { value: "title_desc", label: "Z → A" },
];

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}: SearchFilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: SPACING.md,
        marginBottom: SPACING.lg,
      }}
    >
      {/* Search and Sort Row */}
      <div
        style={{
          display: "flex",
          gap: SPACING.md,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            padding: `${SPACING.sm} ${SPACING.md}`,
            fontSize: "14px",
            border: `1px solid ${COLORS.border.primary}`,
            borderRadius: SPACING.radius.md,
            backgroundColor: COLORS.background.secondary,
            color: COLORS.text.primary,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Chips Row */}
      <div
        style={{
          display: "flex",
          gap: SPACING.sm,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Type Filters Label */}
        <span
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: COLORS.text.secondary,
          }}
        >
          Type:
        </span>

        {/* All Types Chip */}
        <button
          onClick={() => onTypeChange(null)}
          style={{
            padding: `${SPACING.xs} ${SPACING.sm}`,
            fontSize: "13px",
            fontWeight: "500",
            border: `1px solid ${selectedType === null ? COLORS.accent.primary : COLORS.border.primary}`,
            borderRadius: SPACING.radius.full,
            backgroundColor:
              selectedType === null
                ? `${COLORS.accent.primary}15`
                : COLORS.background.secondary,
            color:
              selectedType === null
                ? COLORS.accent.primary
                : COLORS.text.secondary,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          All
        </button>

        {/* Type Filter Chips */}
        {TYPE_OPTIONS.map((type) => (
          <button
            key={type.value}
            onClick={() =>
              onTypeChange(selectedType === type.value ? null : type.value)
            }
            style={{
              padding: `${SPACING.xs} ${SPACING.sm}`,
              fontSize: "13px",
              fontWeight: "500",
              border: `1px solid ${selectedType === type.value ? COLORS.accent.primary : COLORS.border.primary}`,
              borderRadius: SPACING.radius.full,
              backgroundColor:
                selectedType === type.value
                  ? `${COLORS.accent.primary}15`
                  : COLORS.background.secondary,
              color:
                selectedType === type.value
                  ? COLORS.accent.primary
                  : COLORS.text.secondary,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: SPACING.xs,
            }}
          >
            <span>{type.emoji}</span>
            <span>{type.label.split(" ")[1]}</span>
          </button>
        ))}

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "20px",
            backgroundColor: COLORS.border.primary,
            margin: `0 ${SPACING.xs}`,
          }}
        />

        {/* Status Filters Label */}
        <span
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: COLORS.text.secondary,
          }}
        >
          Status:
        </span>

        {/* All Status Chip */}
        <button
          onClick={() => onStatusChange(null)}
          style={{
            padding: `${SPACING.xs} ${SPACING.sm}`,
            fontSize: "13px",
            fontWeight: "500",
            border: `1px solid ${selectedStatus === null ? COLORS.accent.primary : COLORS.border.primary}`,
            borderRadius: SPACING.radius.full,
            backgroundColor:
              selectedStatus === null
                ? `${COLORS.accent.primary}15`
                : COLORS.background.secondary,
            color:
              selectedStatus === null
                ? COLORS.accent.primary
                : COLORS.text.secondary,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          All
        </button>

        {/* Status Filter Chips */}
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status.value}
            onClick={() =>
              onStatusChange(
                selectedStatus === status.value ? null : status.value,
              )
            }
            style={{
              padding: `${SPACING.xs} ${SPACING.sm}`,
              fontSize: "13px",
              fontWeight: "500",
              border: `1px solid ${selectedStatus === status.value ? COLORS.accent.primary : COLORS.border.primary}`,
              borderRadius: SPACING.radius.full,
              backgroundColor:
                selectedStatus === status.value
                  ? `${COLORS.accent.primary}15`
                  : COLORS.background.secondary,
              color:
                selectedStatus === status.value
                  ? COLORS.accent.primary
                  : COLORS.text.secondary,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
