"use client";

import React, { useState } from "react";
import { FormInput as Input } from "@/components/ui/form-input";
import { FormTextarea as Textarea } from "@/components/ui/form-textarea";
import { AgentBuilderState } from "@/hooks/use-agent-builder";
import {
  colors,
  spacing,
  typography,
  radius,
} from "@/lib/constants/design-system";

interface BasicInfoFormProps {
  basicInfo: AgentBuilderState["basicInfo"];
  errors: Record<string, string>;
  onChange: (updates: Partial<AgentBuilderState["basicInfo"]>) => void;
  disabled?: boolean;
}

// Common emojis for agent icons
const AGENT_EMOJIS = [
  "🤖",
  "📧",
  "📄",
  "🎫",
  "🎯",
  "✍️",
  "💡",
  "🔍",
  "📊",
  "🚀",
  "⚡",
  "🎨",
  "🛠️",
  "📱",
  "💬",
  "🔔",
];

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  basicInfo,
  errors,
  onChange,
  disabled = false,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleTagAdd = () => {
    if (tagInput.trim() && !basicInfo.tags.includes(tagInput.trim())) {
      onChange({ tags: [...basicInfo.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange({ tags: basicInfo.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagAdd();
    } else if (
      e.key === "Backspace" &&
      !tagInput &&
      basicInfo.tags.length > 0
    ) {
      // Remove last tag if input is empty and backspace is pressed
      handleTagRemove(basicInfo.tags[basicInfo.tags.length - 1]);
    }
  };

  return (
    <div style={{ marginBottom: spacing["2xl"] }}>
      {/* Section Header */}
      <div style={{ marginBottom: spacing.xl }}>
        <h2
          style={{
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}
        >
          Basic Information
        </h2>
        <p
          style={{
            fontSize: typography.sizes.sm,
            color: colors.text.secondary,
          }}
        >
          Set up the core details for your agent
        </p>
      </div>

      {/* Icon Picker */}
      <div style={{ marginBottom: spacing.lg }}>
        <label
          style={{
            display: "block",
            marginBottom: spacing.xs,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            color: colors.text.primary,
          }}
        >
          Icon
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            style={{
              width: "60px",
              height: "60px",
              fontSize: "32px",
              backgroundColor: colors.background.secondary,
              border: `2px solid ${colors.border.default}`,
              borderRadius: radius.lg,
              cursor: disabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 200ms",
              opacity: disabled ? 0.6 : 1,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = colors.primaryColor;
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.borderColor = colors.border.default;
            }}
          >
            {basicInfo.icon}
          </button>
          <p
            style={{
              fontSize: typography.sizes.sm,
              color: colors.text.tertiary,
            }}
          >
            Click to change icon
          </p>
        </div>

        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div
            style={{
              marginTop: spacing.sm,
              padding: spacing.md,
              backgroundColor: colors.background.primary,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.lg,
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: spacing.xs,
              maxWidth: "400px",
            }}
          >
            {AGENT_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onChange({ icon: emoji });
                  setShowEmojiPicker(false);
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  fontSize: "24px",
                  backgroundColor:
                    basicInfo.icon === emoji
                      ? colors.background.secondary
                      : "transparent",
                  border: "none",
                  borderRadius: radius.md,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 200ms",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (basicInfo.icon !== emoji) {
                    e.currentTarget.style.backgroundColor =
                      colors.background.secondary;
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (basicInfo.icon !== emoji) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Name Input */}
      <Input
        label="Agent Name"
        value={basicInfo.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({ name: e.target.value })
        }
        error={errors.name}
        placeholder="e.g., Email Analyzer, Document Summarizer"
        required
        disabled={disabled}
        maxLength={50}
        helperText={`${basicInfo.name.length}/50 characters`}
      />

      {/* Description Textarea */}
      <Textarea
        label="Description"
        value={basicInfo.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ description: e.target.value })
        }
        error={errors.description}
        placeholder="Describe what this agent does and how it helps your workflow"
        required
        disabled={disabled}
        maxLength={500}
        helperText={`${basicInfo.description.length}/500 characters`}
        style={{ minHeight: "120px" }}
      />

      {/* Tags Input */}
      <div style={{ marginBottom: spacing.lg }}>
        <label
          style={{
            display: "block",
            marginBottom: spacing.xs,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            color: colors.text.primary,
          }}
        >
          Tags (Optional)
        </label>

        {/* Tag Pills */}
        {basicInfo.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacing.xs,
              marginBottom: spacing.sm,
            }}
          >
            {basicInfo.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: spacing.xs,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: colors.background.secondary,
                  color: colors.text.secondary,
                  fontSize: typography.sizes.sm,
                  borderRadius: radius.full,
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  disabled={disabled}
                  style={{
                    background: "none",
                    border: "none",
                    color: colors.text.tertiary,
                    cursor: disabled ? "not-allowed" : "pointer",
                    fontSize: typography.sizes.sm,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tag Input */}
        <div style={{ display: "flex", gap: spacing.sm }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag..."
            disabled={disabled}
            style={{
              flex: 1,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.sizes.base,
              fontFamily: typography.fontFamily.sans,
              color: colors.text.primary,
              backgroundColor: colors.background.primary,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              outline: "none",
              opacity: disabled ? 0.6 : 1,
            }}
          />
          <button
            type="button"
            onClick={handleTagAdd}
            disabled={disabled || !tagInput.trim()}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              color: colors.background.primary,
              backgroundColor: colors.primaryColor,
              border: "none",
              borderRadius: radius.md,
              cursor: disabled || !tagInput.trim() ? "not-allowed" : "pointer",
              opacity: disabled || !tagInput.trim() ? 0.5 : 1,
              transition: "opacity 200ms",
            }}
          >
            Add
          </button>
        </div>
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
          }}
        >
          Press Enter to add tags quickly
        </p>
      </div>
    </div>
  );
};
