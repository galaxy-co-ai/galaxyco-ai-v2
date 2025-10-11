"use client";

import { colors, radius } from "@/lib/constants/design-system";
import { useState, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isSearching?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search agents, categories, or tags...",
  isSearching = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
      }}
    >
      {/* Search Icon */}
      <div
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: colors.text.tertiary,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 40px 0 40px", // Space for icons
          fontSize: "0.9375rem",
          fontWeight: "400",
          color: colors.text.primary,
          background: colors.background.primary,
          border: `1px solid ${isFocused ? colors.border.focus : colors.border.default}`,
          borderRadius: radius.lg,
          outline: "none",
          transition: "all 0.2s ease",
          boxShadow: isFocused ? "0 0 0 3px rgba(77, 111, 255, 0.1)" : "none",
        }}
      />

      {/* Clear Button / Loading Indicator */}
      {(value || isSearching) && (
        <button
          onClick={() => {
            if (onClear) {
              onClear();
            } else {
              onChange("");
            }
          }}
          disabled={isSearching}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            borderRadius: "50%",
            cursor: isSearching ? "default" : "pointer",
            color: colors.text.tertiary,
            transition: "all 0.2s ease",
            opacity: isSearching ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isSearching) {
              e.currentTarget.style.background = colors.background.tertiary;
              e.currentTarget.style.color = colors.text.primary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = colors.text.tertiary;
          }}
          aria-label={isSearching ? "Searching..." : "Clear search"}
        >
          {isSearching ? (
            // Loading spinner
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: "spin 1s linear infinite",
              }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            // Clear X icon
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      )}

      {/* Add keyframe animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
