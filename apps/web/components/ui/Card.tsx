import { colors, radius, shadows, animation } from '@/lib/constants/design-system';
import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, hover = false, onClick, style, className }: CardProps) {
  const baseStyles: CSSProperties = {
    background: colors.neutral[0],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: radius.lg,
    boxShadow: shadows.card,
    padding: '1.5rem',
    transition: `all ${animation.timing.fast} ${animation.easing.default}`,
    cursor: onClick ? 'pointer' : 'default',
  };

  const hoverStyles = hover
    ? {
        boxShadow: shadows.cardHover,
        transform: 'translateY(-2px)',
        borderColor: colors.primary[200],
      }
    : {};

  return (
    <div
      className={className}
      onClick={onClick}
      style={{ ...baseStyles, ...style }}
      onMouseEnter={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = shadows.card;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = colors.neutral[200];
        }
      }}
    >
      {children}
    </div>
  );
}
