import { colors, radius, shadows, animation, typography } from '@/lib/constants/design-system';
import { CSSProperties, ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    border: 'none',
    borderRadius: radius.md,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: `all ${animation.timing.fast} ${animation.easing.default}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    textDecoration: 'none',
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: colors.primary[500],
      color: colors.neutral[0],
      boxShadow: shadows.sm,
    },
    secondary: {
      background: colors.neutral[0],
      color: colors.primary[500],
      border: `2px solid ${colors.primary[500]}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
      border: `1px solid ${colors.neutral[200]}`,
    },
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: typography.fontSize.lg,
    },
  };

  const hoverStyles = {
    transform: !disabled && !loading ? 'translateY(-1px)' : undefined,
    boxShadow: !disabled && !loading ? shadows.md : undefined,
    filter: !disabled && !loading ? 'brightness(1.05)' : undefined,
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, {
          transform: 'translateY(0)',
          boxShadow: variantStyles[variant].boxShadow || 'none',
          filter: 'brightness(1)',
        });
      }}
    >
      {loading && <span>⏳</span>}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
}
