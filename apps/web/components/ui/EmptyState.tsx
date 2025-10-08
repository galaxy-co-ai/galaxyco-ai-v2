import { ReactNode } from 'react';
import { colors, typography, spacing } from '@/lib/constants/design-system';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: spacing['4xl'],
        background: colors.neutral[50],
        borderRadius: '12px',
        border: `2px dashed ${colors.neutral[200]}`,
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: '4rem',
            marginBottom: spacing.xl,
            opacity: 0.8,
          }}
        >
          {icon}
        </div>
      )}
      
      <h3
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing.md,
        }}
      >
        {title}
      </h3>
      
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.neutral[600],
          marginBottom: spacing.xl,
          maxWidth: '400px',
          margin: '0 auto',
          marginBottom: spacing.xl,
        }}
      >
        {description}
      </p>

      {action && (
        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
          <Button onClick={action.onClick}>{action.label}</Button>
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
