'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { Input } from './input';
import { Textarea } from './textarea';

/**
 * FormField molecule component using GalaxyCo.ai Design System tokens
 * Combines Label, Input/Textarea, and error messaging
 * Implements form patterns from 05-COMPONENT-INVENTORY.md
 */
const formFieldVariants = cva(['space-y-2'], {
  variants: {
    variant: {
      default: '',
      inline: 'flex items-center space-y-0 space-x-3',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface FormFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof formFieldVariants> {
  /** Label text */
  label?: string;
  /** Whether field is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Help text */
  description?: string;
  /** Input type - determines whether to render Input or Textarea */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'textarea';
  /** Input value */
  value?: string;
  /** Input change handler */
  onChange?: (value: string) => void;
  /** Input placeholder */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether input is readonly */
  readOnly?: boolean;
  /** Unique identifier */
  id?: string;
  /** Input name attribute */
  name?: string;
  /** Auto complete attribute */
  autoComplete?: string;
  /** Input size */
  size?: 'sm' | 'default' | 'lg';
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      variant,
      label,
      required,
      error,
      description,
      type = 'text',
      value,
      onChange,
      placeholder,
      disabled,
      readOnly,
      id,
      name,
      autoComplete,
      size,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = id || `field-${generatedId}`;
    const errorId = `${fieldId}-error`;
    const descriptionId = `${fieldId}-description`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div ref={ref} className={cn(formFieldVariants({ variant }), className)} {...props}>
        {label && (
          <Label htmlFor={fieldId} required={required} variant={error ? 'default' : 'default'}>
            {label}
          </Label>
        )}

        {type === 'textarea' ? (
          <Textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            error={error}
            size={size}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={cn(error && errorId, description && descriptionId)}
          />
        ) : (
          <Input
            type={type}
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
            error={error}
            size={size}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={cn(error && errorId, description && descriptionId)}
          />
        )}

        {description && (
          <p id={descriptionId} className="text-xs text-foreground-muted">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
FormField.displayName = 'FormField';

export { FormField, formFieldVariants };
