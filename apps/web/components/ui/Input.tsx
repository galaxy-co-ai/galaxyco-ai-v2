import React from 'react';
import { colors, radius, spacing, typography, animation } from '@/lib/constants/design-system';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            color: colors.text.primary,
          }}
        >
          {label}
          {props.required && (
            <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}
      <input
        {...props}
        className={className}
        style={{
          width: '100%',
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: typography.sizes.base,
          fontFamily: typography.fontFamily,
          color: colors.text.primary,
          backgroundColor: colors.background.primary,
          border: `1px solid ${error ? colors.danger : colors.border.default}`,
          borderRadius: radius.md,
          outline: 'none',
          transition: `border-color ${animation.timing.fast}ms ${animation.easing.standard}`,
          ...(props.disabled && {
            backgroundColor: colors.background.tertiary,
            cursor: 'not-allowed',
            opacity: 0.6,
          }),
          ...props.style,
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = colors.primary;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = colors.border.default;
          }
          props.onBlur?.(e);
        }}
      />
      {error && (
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.danger,
            animation: `${animation.timing.fast}ms ${animation.easing.standard}`,
          }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            color: colors.text.primary,
          }}
        >
          {label}
          {props.required && (
            <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}
      <textarea
        {...props}
        className={className}
        style={{
          width: '100%',
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: typography.sizes.base,
          fontFamily: typography.fontFamily,
          color: colors.text.primary,
          backgroundColor: colors.background.primary,
          border: `1px solid ${error ? colors.danger : colors.border.default}`,
          borderRadius: radius.md,
          outline: 'none',
          transition: `border-color ${animation.timing.fast}ms ${animation.easing.standard}`,
          resize: 'vertical',
          minHeight: '100px',
          ...(props.disabled && {
            backgroundColor: colors.background.tertiary,
            cursor: 'not-allowed',
            opacity: 0.6,
          }),
          ...props.style,
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = colors.primary;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = colors.border.default;
          }
          props.onBlur?.(e);
        }}
      />
      {error && (
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.danger,
          }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  className = '',
  ...props
}) => {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            color: colors.text.primary,
          }}
        >
          {label}
          {props.required && (
            <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}
      <select
        {...props}
        className={className}
        style={{
          width: '100%',
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: typography.sizes.base,
          fontFamily: typography.fontFamily,
          color: colors.text.primary,
          backgroundColor: colors.background.primary,
          border: `1px solid ${error ? colors.danger : colors.border.default}`,
          borderRadius: radius.md,
          outline: 'none',
          transition: `border-color ${animation.timing.fast}ms ${animation.easing.standard}`,
          cursor: 'pointer',
          ...(props.disabled && {
            backgroundColor: colors.background.tertiary,
            cursor: 'not-allowed',
            opacity: 0.6,
          }),
          ...props.style,
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = colors.primary;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = colors.border.default;
          }
          props.onBlur?.(e);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.danger,
          }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
