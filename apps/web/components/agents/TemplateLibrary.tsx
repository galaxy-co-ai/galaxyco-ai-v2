'use client';

import { useState, useMemo } from 'react';
import {
  AGENT_TEMPLATES,
  AgentTemplate,
  TEMPLATE_CATEGORIES,
  searchTemplates,
  getTemplatesByCategory,
} from '@/lib/constants/agent-templates';
import { TemplateCard } from './TemplateCard';
import { colors, spacing, radius, shadows, typography, animation, zIndex } from '@/lib/constants/design-system';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AgentTemplate) => void;
  onStartFromScratch: () => void;
}

export function TemplateLibrary({
  isOpen,
  onClose,
  onSelectTemplate,
  onStartFromScratch,
}: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let templates = Object.values(AGENT_TEMPLATES);

    // Apply search filter
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }

    // Apply both filters if both are active
    if (searchQuery.trim() && selectedCategory !== 'all') {
      templates = searchTemplates(searchQuery).filter(
        (t) => t.category === selectedCategory
      );
    }

    return templates;
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: zIndex.modal,
          animation: 'fadeIn 200ms ease-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: colors.neutral[0],
          borderRadius: radius.xl,
          boxShadow: shadows.xl,
          zIndex: zIndex.modal + 1,
          width: '90vw',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 300ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing['2xl'],
            borderBottom: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.lg,
            }}
          >
            <h2
              style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
              }}
            >
              Choose a Template
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: typography.fontSize['2xl'],
                color: colors.neutral[500],
                cursor: 'pointer',
                padding: spacing.sm,
                lineHeight: 1,
                transition: `color ${animation.timing.fast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.neutral[900];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.neutral[500];
              }}
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: `${spacing.md} ${spacing.lg}`,
              fontSize: typography.fontSize.base,
              border: `2px solid ${colors.neutral[200]}`,
              borderRadius: radius.lg,
              outline: 'none',
              transition: `border-color ${animation.timing.fast}`,
              fontFamily: typography.fontFamily.sans,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary[500];
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.neutral[200];
            }}
          />
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            padding: `${spacing.lg} ${spacing['2xl']}`,
            borderBottom: `1px solid ${colors.neutral[200]}`,
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              border: 'none',
              borderRadius: radius.md,
              cursor: 'pointer',
              background:
                selectedCategory === 'all'
                  ? colors.primary[500]
                  : colors.neutral[100],
              color:
                selectedCategory === 'all'
                  ? colors.neutral[0]
                  : colors.neutral[700],
              transition: `all ${animation.timing.fast}`,
              whiteSpace: 'nowrap',
            }}
          >
            All Templates
          </button>
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                border: 'none',
                borderRadius: radius.md,
                cursor: 'pointer',
                background:
                  selectedCategory === category.id
                    ? colors.primary[500]
                    : colors.neutral[100],
                color:
                  selectedCategory === category.id
                    ? colors.neutral[0]
                    : colors.neutral[700],
                transition: `all ${animation.timing.fast}`,
                whiteSpace: 'nowrap',
              }}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing['2xl'],
          }}
        >
          {filteredTemplates.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing.xl,
              }}
            >
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={(t) => {
                    onSelectTemplate(t);
                    onClose();
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: spacing['4xl'],
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>
                🔍
              </div>
              <h3
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  marginBottom: spacing.sm,
                }}
              >
                No templates found
              </h3>
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.neutral[600],
                  marginBottom: spacing.xl,
                }}
              >
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing['2xl'],
            borderTop: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600],
            }}
          >
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? 's' : ''} available
          </span>
          <button
            onClick={() => {
              onStartFromScratch();
              onClose();
            }}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              background: colors.neutral[100],
              color: colors.neutral[900],
              border: `2px solid ${colors.neutral[300]}`,
              borderRadius: radius.lg,
              cursor: 'pointer',
              transition: `all ${animation.timing.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.neutral[200];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.neutral[100];
            }}
          >
            Start from Scratch
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
