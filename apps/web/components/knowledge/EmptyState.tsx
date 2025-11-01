'use client';

import { COLORS, SPACING } from '@/lib/design-system';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${SPACING.xxl} ${SPACING.md}`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: SPACING.lg }}>{icon}</div>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: COLORS.text.primary,
          marginBottom: SPACING.sm,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: COLORS.text.secondary,
          marginBottom: action ? SPACING.lg : 0,
          maxWidth: '400px',
        }}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: `${SPACING.sm} ${SPACING.lg}`,
            fontSize: '14px',
            fontWeight: '500',
            color: '#fff',
            backgroundColor: COLORS.accent.primary,
            border: 'none',
            borderRadius: SPACING.radius.md,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: SPACING.md,
      }}
    >
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: COLORS.background.secondary,
            border: `1px solid ${COLORS.border.primary}`,
            borderRadius: SPACING.radius.lg,
            padding: SPACING.md,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <div style={{ display: 'flex', gap: SPACING.sm }}>
            {/* Icon Skeleton */}
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: COLORS.background.tertiary,
                borderRadius: SPACING.radius.sm,
              }}
            />
            {/* Content Skeleton */}
            <div style={{ flex: 1 }}>
              {/* Title */}
              <div
                style={{
                  height: '16px',
                  backgroundColor: COLORS.background.tertiary,
                  borderRadius: SPACING.radius.sm,
                  marginBottom: SPACING.xs,
                  width: '80%',
                }}
              />
              {/* Status Badge */}
              <div
                style={{
                  height: '20px',
                  backgroundColor: COLORS.background.tertiary,
                  borderRadius: SPACING.radius.full,
                  marginBottom: SPACING.sm,
                  width: '60px',
                }}
              />
              {/* Metadata Lines */}
              <div
                style={{
                  height: '12px',
                  backgroundColor: COLORS.background.tertiary,
                  borderRadius: SPACING.radius.sm,
                  marginBottom: SPACING.xs,
                  width: '90%',
                }}
              />
              <div
                style={{
                  height: '12px',
                  backgroundColor: COLORS.background.tertiary,
                  borderRadius: SPACING.radius.sm,
                  width: '60%',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
