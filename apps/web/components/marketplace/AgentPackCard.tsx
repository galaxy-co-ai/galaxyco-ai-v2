'use client';

import { colors, shadows, radius } from '@/lib/constants/design-system';
import { useState } from 'react';

interface AgentPackCardProps {
  pack: {
    id: string;
    name: string;
    description: string;
    category: string;
    agentCount: number;
    agentNames: string[];
    badgeText?: string;
    rating: number;
    reviewCount: number;
    installCount: number;
    installs7d?: number;
    kpis?: {
      timeSavedPerWeek?: string;
      setupTime?: string;
      completionRate?: number;
    };
    integrations: string[];
    tags: string[];
  };
  onInstall?: (packId: string) => void;
  onPreview?: (packId: string) => void;
}

export default function AgentPackCard({ pack, onInstall, onPreview }: AgentPackCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const ratingStars = (pack.rating / 100).toFixed(1);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: colors.background.primary,
        border: `1px solid ${isHovered ? colors.border.focus : colors.border.default}`,
        borderRadius: radius.lg,
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isHovered ? shadows.cardHover : shadows.card,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Badge */}
      {pack.badgeText && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.25rem 0.75rem',
            background: pack.badgeText.includes('STARTER')
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : pack.badgeText === 'POPULAR'
                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                : colors.success.DEFAULT,
            color: 'white',
            borderRadius: radius.sm,
            fontSize: '0.75rem',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}
        >
          {pack.badgeText}
        </div>
      )}

      {/* Category */}
      <div
        style={{
          fontSize: '0.75rem',
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '0.75rem',
        }}
      >
        {pack.category} • {pack.agentCount} Agents
      </div>

      {/* Pack Name */}
      <h3
        style={{
          fontSize: '1.375rem',
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: '0.75rem',
          lineHeight: '1.3',
        }}
      >
        {pack.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.9375rem',
          color: colors.text.secondary,
          marginBottom: '1rem',
          lineHeight: '1.6',
          flex: 1,
        }}
      >
        {pack.description}
      </p>

      {/* Included Agents */}
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1rem',
          background: colors.background.secondary,
          borderRadius: radius.md,
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: colors.text.tertiary,
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Included Agents
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
        >
          {pack.agentNames.map((agentName, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: colors.text.primary,
              }}
            >
              <span style={{ color: colors.primary[500] }}>✓</span>
              <span>{agentName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pack KPIs */}
      {pack.kpis && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: pack.kpis.completionRate ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            padding: '1rem',
            background:
              'linear-gradient(135deg, rgba(77, 111, 255, 0.05) 0%, rgba(77, 111, 255, 0.02) 100%)',
            borderRadius: radius.md,
            border: `1px solid ${colors.primary[100]}`,
          }}
        >
          {pack.kpis.timeSavedPerWeek && (
            <div>
              <div style={{ fontSize: '0.75rem', color: colors.text.tertiary }}>Time Saved</div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                }}
              >
                {pack.kpis.timeSavedPerWeek}
              </div>
            </div>
          )}
          {pack.kpis.setupTime && (
            <div>
              <div style={{ fontSize: '0.75rem', color: colors.text.tertiary }}>Setup Time</div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                }}
              >
                {pack.kpis.setupTime}
              </div>
            </div>
          )}
          {pack.kpis.completionRate && (
            <div>
              <div style={{ fontSize: '0.75rem', color: colors.text.tertiary }}>Success Rate</div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                }}
              >
                {pack.kpis.completionRate}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integrations */}
      {pack.integrations && pack.integrations.length > 0 && (
        <div
          style={{
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: colors.text.tertiary,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Integrations
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {pack.integrations.slice(0, 4).map((integration) => (
              <span
                key={integration}
                style={{
                  padding: '0.25rem 0.625rem',
                  background: colors.background.secondary,
                  color: colors.text.secondary,
                  borderRadius: radius.sm,
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                {integration}
              </span>
            ))}
            {pack.integrations.length > 4 && (
              <span
                style={{
                  padding: '0.25rem 0.625rem',
                  color: colors.text.tertiary,
                  fontSize: '0.75rem',
                  fontWeight: '500',
                }}
              >
                +{pack.integrations.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
          paddingTop: '1rem',
          borderTop: `1px solid ${colors.border.default}`,
        }}
      >
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: colors.warning.DEFAULT }}>⭐</span>
          <span style={{ fontWeight: '600', color: colors.text.primary }}>{ratingStars}</span>
          <span style={{ fontSize: '0.875rem', color: colors.text.tertiary }}>
            ({pack.reviewCount})
          </span>
        </div>

        {/* Installs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            {pack.installCount.toLocaleString()} installs
          </span>
          {pack.installs7d && pack.installs7d > 50 && (
            <span
              style={{
                fontSize: '0.75rem',
                color: colors.success.DEFAULT,
                fontWeight: '600',
              }}
            >
              +{pack.installs7d} this week
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInstall?.(pack.id);
          }}
          style={{
            flex: 1,
            padding: '0.875rem',
            background: colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: radius.md,
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[600];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary[500];
          }}
        >
          Install Pack
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview?.(pack.id);
          }}
          style={{
            padding: '0.875rem 1.25rem',
            background: 'transparent',
            color: colors.primary[500],
            border: `1px solid ${colors.primary[500]}`,
            borderRadius: radius.md,
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[50];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Preview
        </button>
      </div>

      {/* Tags */}
      {pack.tags && pack.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '1rem',
          }}
        >
          {pack.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: '0.25rem 0.5rem',
                background: colors.primary[50],
                color: colors.primary[600],
                borderRadius: radius.sm,
                fontSize: '0.75rem',
                fontWeight: '500',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
