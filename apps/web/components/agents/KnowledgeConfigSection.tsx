"use client";

import React, { useState, useEffect } from "react";
import {
  colors,
  spacing,
  typography,
  radius,
} from "@/lib/constants/design-system";

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  itemCount: number;
}

interface KnowledgeBaseConfig {
  enabled: boolean;
  scope?: "all" | "collections";
  collectionIds?: string[];
  maxResults?: number;
}

interface KnowledgeConfigSectionProps {
  workspaceId: string;
  config: KnowledgeBaseConfig;
  onChange: (config: KnowledgeBaseConfig) => void;
  disabled?: boolean;
}

export const KnowledgeConfigSection: React.FC<KnowledgeConfigSectionProps> = ({
  workspaceId,
  config,
  onChange,
  disabled = false,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);

  // Fetch collections when knowledge base is enabled
  useEffect(() => {
    if (config.enabled && workspaceId) {
      fetchCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.enabled, workspaceId]);

  const fetchCollections = async () => {
    setIsLoadingCollections(true);
    try {
      const response = await fetch(
        `/api/knowledge/collections?workspaceId=${workspaceId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const handleEnabledChange = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        scope: "all",
        maxResults: 5,
        collectionIds: [],
      });
    } else {
      onChange({
        enabled: false,
        scope: undefined,
        maxResults: undefined,
        collectionIds: undefined,
      });
    }
  };

  const handleScopeChange = (scope: "all" | "collections") => {
    onChange({
      ...config,
      scope,
      collectionIds: scope === "all" ? [] : config.collectionIds || [],
    });
  };

  const handleCollectionToggle = (collectionId: string) => {
    const currentIds = config.collectionIds || [];
    const newIds = currentIds.includes(collectionId)
      ? currentIds.filter((id) => id !== collectionId)
      : [...currentIds, collectionId];

    onChange({
      ...config,
      collectionIds: newIds,
    });
  };

  const handleMaxResultsChange = (maxResults: number) => {
    onChange({
      ...config,
      maxResults: Math.max(1, Math.min(20, maxResults)),
    });
  };

  const selectedCollections = collections.filter((c) =>
    config.collectionIds?.includes(c.id),
  );

  return (
    <div style={{ marginBottom: spacing["2xl"] }}>
      {/* Section Header */}
      <div
        style={{
          marginBottom: spacing.xl,
          paddingBottom: spacing.lg,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
          <span style={{ fontSize: "24px" }}>📚</span>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.semibold,
                color: colors.text.primary,
                marginBottom: spacing.xs,
              }}
            >
              Knowledge Base Access
            </h3>
            <p
              style={{
                fontSize: typography.sizes.sm,
                color: colors.text.tertiary,
                margin: 0,
              }}
            >
              Enable semantic search over your uploaded documents, URLs, and
              notes
            </p>
          </div>
        </div>
      </div>

      {/* Enable/Disable Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: spacing.lg,
          backgroundColor: config.enabled
            ? colors.primary[100]
            : colors.background.secondary,
          borderRadius: radius.lg,
          marginBottom: spacing.lg,
          border: `2px solid ${config.enabled ? colors.primary[500] : colors.border.default}`,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
        onClick={() => !disabled && handleEnabledChange(!config.enabled)}
      >
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={(e) => handleEnabledChange(e.target.checked)}
          disabled={disabled}
          style={{
            width: "20px",
            height: "20px",
            cursor: disabled ? "not-allowed" : "pointer",
            marginRight: spacing.md,
          }}
        />
        <div>
          <label
            style={{
              fontSize: typography.sizes.base,
              fontWeight: typography.weights.medium,
              color: colors.text.primary,
              cursor: disabled ? "not-allowed" : "pointer",
              display: "block",
              marginBottom: spacing.xs,
            }}
          >
            Enable Knowledge Base Search
          </label>
          <p
            style={{
              fontSize: typography.sizes.sm,
              color: colors.text.tertiary,
              margin: 0,
            }}
          >
            {config.enabled
              ? "Agent can search and retrieve information from your knowledge base"
              : "Agent will not have access to your knowledge base"}
          </p>
        </div>
      </div>

      {/* Configuration Options (only show when enabled) */}
      {config.enabled && (
        <div
          style={{
            padding: spacing.xl,
            backgroundColor: colors.background.secondary,
            borderRadius: radius.lg,
            border: `1px solid ${colors.border.default}`,
          }}
        >
          {/* Search Scope */}
          <div style={{ marginBottom: spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Search Scope
            </label>

            {/* All Collections Option */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: spacing.md,
                marginBottom: spacing.sm,
                backgroundColor: colors.background.primary,
                borderRadius: radius.md,
                border: `2px solid ${config.scope === "all" ? colors.primaryColor : colors.border.default}`,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => !disabled && handleScopeChange("all")}
            >
              <input
                type="radio"
                checked={config.scope === "all"}
                onChange={() => handleScopeChange("all")}
                disabled={disabled}
                style={{
                  marginRight: spacing.md,
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
                  All Collections
                </div>
                <div
                  style={{
                    fontSize: typography.sizes.xs,
                    color: colors.text.tertiary,
                  }}
                >
                  Search across all documents in the knowledge base
                </div>
              </div>
            </div>

            {/* Specific Collections Option */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: spacing.md,
                backgroundColor: colors.background.primary,
                borderRadius: radius.md,
                border: `2px solid ${config.scope === "collections" ? colors.primaryColor : colors.border.default}`,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => !disabled && handleScopeChange("collections")}
            >
              <input
                type="radio"
                checked={config.scope === "collections"}
                onChange={() => handleScopeChange("collections")}
                disabled={disabled}
                style={{
                  marginRight: spacing.md,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    color: colors.text.primary,
                  }}
                >
                  Specific Collections
                </div>
                <div
                  style={{
                    fontSize: typography.sizes.xs,
                    color: colors.text.tertiary,
                  }}
                >
                  Limit search to selected collections only
                </div>
              </div>
            </div>
          </div>

          {/* Collection Selector (only show when scope is 'collections') */}
          {config.scope === "collections" && (
            <div style={{ marginBottom: spacing.xl }}>
              <label
                style={{
                  display: "block",
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Selected Collections ({selectedCollections.length})
              </label>

              {isLoadingCollections ? (
                <div
                  style={{
                    padding: spacing.lg,
                    textAlign: "center",
                    color: colors.text.tertiary,
                    fontSize: typography.sizes.sm,
                  }}
                >
                  Loading collections...
                </div>
              ) : collections.length === 0 ? (
                <div
                  style={{
                    padding: spacing.lg,
                    textAlign: "center",
                    backgroundColor: colors.background.primary,
                    borderRadius: radius.md,
                    border: `1px dashed ${colors.border.default}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      display: "block",
                      marginBottom: spacing.sm,
                    }}
                  >
                    📁
                  </span>
                  <p
                    style={{
                      fontSize: typography.sizes.sm,
                      color: colors.text.tertiary,
                      margin: 0,
                    }}
                  >
                    No collections yet. Create collections in the Knowledge Base
                    to organize your documents.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: radius.md,
                    backgroundColor: colors.background.primary,
                  }}
                >
                  {collections.map((collection) => {
                    const isSelected = config.collectionIds?.includes(
                      collection.id,
                    );
                    return (
                      <div
                        key={collection.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: spacing.md,
                          borderBottom: `1px solid ${colors.border.default}`,
                          cursor: disabled ? "not-allowed" : "pointer",
                          backgroundColor: isSelected
                            ? colors.primary[100]
                            : "transparent",
                          transition: "background-color 0.2s ease",
                        }}
                        onClick={() =>
                          !disabled && handleCollectionToggle(collection.id)
                        }
                        onMouseEnter={(e) => {
                          if (!disabled) {
                            e.currentTarget.style.backgroundColor =
                              colors.background.secondary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!disabled) {
                            e.currentTarget.style.backgroundColor = isSelected
                              ? colors.primary[100]
                              : "transparent";
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCollectionToggle(collection.id)}
                          disabled={disabled}
                          style={{
                            marginRight: spacing.md,
                            cursor: disabled ? "not-allowed" : "pointer",
                          }}
                        />
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: collection.color,
                            marginRight: spacing.sm,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: typography.sizes.sm,
                              fontWeight: typography.weights.medium,
                              color: colors.text.primary,
                            }}
                          >
                            {collection.name}
                          </div>
                          {collection.description && (
                            <div
                              style={{
                                fontSize: typography.sizes.xs,
                                color: colors.text.tertiary,
                              }}
                            >
                              {collection.description}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: typography.sizes.xs,
                            color: colors.text.tertiary,
                            padding: `${spacing.xs} ${spacing.sm}`,
                            backgroundColor: colors.background.secondary,
                            borderRadius: radius.sm,
                          }}
                        >
                          {collection.itemCount} items
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {config.scope === "collections" &&
                config.collectionIds &&
                config.collectionIds.length === 0 && (
                  <div
                    style={{
                      marginTop: spacing.sm,
                      padding: spacing.sm,
                      backgroundColor: colors.warning.light + "20",
                      borderRadius: radius.sm,
                      fontSize: typography.sizes.xs,
                      color: colors.warning.dark,
                    }}
                  >
                    ⚠️ Please select at least one collection
                  </div>
                )}
            </div>
          )}

          {/* Max Results */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Max Results per Query: {config.maxResults || 5}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={config.maxResults || 5}
              onChange={(e) => handleMaxResultsChange(parseInt(e.target.value))}
              disabled={disabled}
              style={{
                width: "100%",
                marginBottom: spacing.xs,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: typography.sizes.xs,
                color: colors.text.tertiary,
              }}
            >
              <span>1 (Faster)</span>
              <span>10 (Balanced)</span>
              <span>20 (Comprehensive)</span>
            </div>
            <p
              style={{
                marginTop: spacing.xs,
                fontSize: typography.sizes.sm,
                color: colors.text.tertiary,
              }}
            >
              More results provide better context but increase response time and
              token usage.
            </p>
          </div>
        </div>
      )}

      {/* Helper Info */}
      {config.enabled && (
        <div
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            backgroundColor: colors.info.light + "20",
            borderRadius: radius.md,
            border: `1px solid ${colors.info.light}`,
          }}
        >
          <div
            style={{
              fontSize: typography.sizes.sm,
              color: colors.info.dark,
              marginBottom: spacing.xs,
            }}
          >
            💡 <strong>Tip:</strong> The agent will automatically search your
            knowledge base when answering questions
          </div>
          <div
            style={{
              fontSize: typography.sizes.xs,
              color: colors.text.tertiary,
            }}
          >
            Make sure to include instructions in the system prompt about citing
            sources and handling cases where information isn&apos;t found in the
            knowledge base.
          </div>
        </div>
      )}
    </div>
  );
};
