'use client';

import React from 'react';
import Link from 'next/link';
import { colors, spacing, typography, radius, shadows } from '@/lib/constants/design-system';

interface AgentListCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'draft' | 'active' | 'paused' | 'archived';
    type: string;
    aiProvider: string;
    model: string;
  };
}

export const AgentListCard: React.FC<AgentListCardProps> = ({ agent }) => {
  const statusColors = {
    draft: colors.warning,
    active: colors.success,
    paused: colors.text.tertiary,
    archived: colors.text.tertiary,
  };

  return (
    <Link href={`/agents/${agent.id}`} style={{ textDecoration: 'none' }}>
      <div
        role="article"
        aria-label={`Agent: ${agent.name}`}
        tabIndex={0}
        style={{
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.lg,
          padding: spacing.lg,
          cursor: 'pointer',
          transition: 'all 200ms ease-out',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = shadows.lg;
          e.currentTarget.style.borderColor = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = colors.border.default;
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${colors.primary}`;
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'start', gap: spacing.md, marginBottom: spacing.md }}>
          <div
            style={{
              fontSize: '32px',
              lineHeight: 1,
            }}
          >
            {agent.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.semibold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.xs,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {agent.name}
            </h3>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: `${spacing.xs} ${spacing.sm}`,
                backgroundColor: statusColors[agent.status],
                color: colors.background.primary,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.medium,
                borderRadius: radius.full,
                textTransform: 'capitalize',
              }}
            >
              {agent.status}
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: typography.sizes.sm,
            color: colors.text.secondary,
            margin: 0,
            marginBottom: spacing.md,
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {agent.description}
        </p>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            gap: spacing.xs,
            paddingTop: spacing.md,
            borderTop: `1px solid ${colors.border.default}`,
          }}
        >
          <div
            style={{
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: colors.background.secondary,
              borderRadius: radius.sm,
              fontSize: typography.sizes.xs,
              color: colors.text.tertiary,
            }}
          >
            {agent.aiProvider}
          </div>
          <div
            style={{
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: colors.background.secondary,
              borderRadius: radius.sm,
              fontSize: typography.sizes.xs,
              color: colors.text.tertiary,
            }}
          >
            {agent.model}
          </div>
        </div>
      </div>
    </Link>
  );
};
