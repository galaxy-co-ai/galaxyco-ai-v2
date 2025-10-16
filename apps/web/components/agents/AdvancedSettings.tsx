"use client";

import React, { useState } from "react";
import { FormInput as Input } from "@/components/ui/form-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormTextarea as Textarea } from "@/components/ui/form-textarea";
import {
  colors,
  spacing,
  typography,
  radius,
} from "@/lib/constants/design-system";

interface AdvancedSettingsProps {
  settings: {
    timeout?: number;
    maxRetries?: number;
    rateLimitPerMinute?: number;
    enableLogging?: boolean;
    enableCaching?: boolean;
    cacheTTL?: number;
  };
  onChange: (updates: Partial<AdvancedSettingsProps["settings"]>) => void;
  disabled?: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginBottom: spacing["2xl"] }}>
      {/* Section Header (Collapsible) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${spacing.md} 0`,
          backgroundColor: "transparent",
          border: "none",
          borderTop: `1px solid ${colors.border.default}`,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h3
            style={{
              fontSize: typography.sizes.lg,
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
              marginBottom: spacing.xs,
            }}
          >
            ⚙️ Advanced Settings
          </h3>
          <p
            style={{
              fontSize: typography.sizes.sm,
              color: colors.text.tertiary,
            }}
          >
            {isExpanded
              ? "Click to collapse"
              : "Configure timeouts, retries, and rate limits"}
          </p>
        </div>
        <span
          style={{
            fontSize: typography.sizes["2xl"],
            color: colors.text.tertiary,
            transition: "transform 200ms",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div
          style={{
            marginTop: spacing.lg,
            padding: spacing.lg,
            backgroundColor: colors.background.secondary,
            borderRadius: radius.lg,
            animation: "slideDown 200ms ease-out",
          }}
        >
          {/* Performance Settings */}
          <div style={{ marginBottom: spacing.xl }}>
            <h4
              style={{
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.semibold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Performance
            </h4>

            {/* Timeout */}
            <Input
              label="Timeout (seconds)"
              type="number"
              value={settings.timeout?.toString() || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined;
                onChange({ timeout: value });
              }}
              placeholder="e.g., 30"
              disabled={disabled}
              min={1}
              max={300}
              helperText="Maximum time to wait for agent execution (1-300 seconds)"
            />

            {/* Max Retries */}
            <Input
              label="Max Retries"
              type="number"
              value={settings.maxRetries?.toString() || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined;
                onChange({ maxRetries: value });
              }}
              placeholder="e.g., 3"
              disabled={disabled}
              min={0}
              max={10}
              helperText="Number of retry attempts on failure (0-10)"
            />

            {/* Rate Limit */}
            <Input
              label="Rate Limit (per minute)"
              type="number"
              value={settings.rateLimitPerMinute?.toString() || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined;
                onChange({ rateLimitPerMinute: value });
              }}
              placeholder="e.g., 60"
              disabled={disabled}
              min={1}
              max={1000}
              helperText="Maximum executions per minute (1-1000)"
            />
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: colors.border.default,
              margin: `${spacing.lg} 0`,
            }}
          />

          {/* Monitoring & Caching */}
          <div style={{ marginBottom: spacing.md }}>
            <h4
              style={{
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.semibold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Monitoring & Caching
            </h4>

            {/* Enable Logging Toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.md,
                marginBottom: spacing.md,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={settings.enableLogging ?? true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ enableLogging: e.target.checked })
                }
                disabled={disabled}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    color: colors.text.primary,
                  }}
                >
                  Enable Logging
                </div>
                <div
                  style={{
                    fontSize: typography.sizes.xs,
                    color: colors.text.tertiary,
                  }}
                >
                  Track all agent executions and errors
                </div>
              </div>
            </label>

            {/* Enable Caching Toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.md,
                marginBottom: spacing.md,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={settings.enableCaching ?? false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ enableCaching: e.target.checked })
                }
                disabled={disabled}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    color: colors.text.primary,
                  }}
                >
                  Enable Caching
                </div>
                <div
                  style={{
                    fontSize: typography.sizes.xs,
                    color: colors.text.tertiary,
                  }}
                >
                  Cache responses for identical inputs
                </div>
              </div>
            </label>

            {/* Cache TTL (only show if caching enabled) */}
            {settings.enableCaching && (
              <Input
                label="Cache TTL (seconds)"
                type="number"
                value={settings.cacheTTL?.toString() || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined;
                  onChange({ cacheTTL: value });
                }}
                placeholder="e.g., 3600"
                disabled={disabled}
                min={60}
                max={86400}
                helperText="How long to keep cached responses (60-86400 seconds)"
              />
            )}
          </div>

          {/* Help Text */}
          <div
            style={{
              marginTop: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.background.primary,
              borderRadius: radius.md,
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <p
              style={{
                fontSize: typography.sizes.xs,
                color: colors.text.secondary,
                margin: 0,
              }}
            >
              💡 <strong>Tip:</strong> Leave settings empty to use defaults.
              These settings help optimize performance and prevent rate limit
              issues.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
