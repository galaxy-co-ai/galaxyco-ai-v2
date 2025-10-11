"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  helperText?: string; // Alias for helper
  variant?: "default" | "search";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Professional Input Component using CSS Design System
 *
 * Features:
 * - Clean focus states with proper contrast
 * - Error states with helpful messaging
 * - Icon support for enhanced UX
 * - Search variant for filter inputs
 * - Consistent with StackAI/Vercel input quality
 */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      helperText,
      variant = "default",
      leftIcon,
      rightIcon,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    // Use helperText as alias for helper
    const helperMessage = helperText || helper;
    // Generate ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Build input classes using our CSS system
    const inputClasses = [
      "input",
      error ? "" : "", // Error styles handled by CSS focus states
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Search variant has different styling
    const searchStyles: React.CSSProperties =
      variant === "search"
        ? {
            paddingLeft: leftIcon ? "var(--space-10)" : "var(--space-4)",
            paddingRight: rightIcon ? "var(--space-10)" : "var(--space-4)",
            borderRadius: "var(--radius-full)",
          }
        : {};

    // Error border override
    const errorStyles: React.CSSProperties = error
      ? {
          borderColor: "var(--border-error)",
        }
      : {};

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {label}
            {props.required && (
              <span style={{ color: "var(--error)", marginLeft: "4px" }}>
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div style={{ position: "relative" }}>
          {/* Left Icon */}
          {leftIcon && (
            <div
              style={{
                position: "absolute",
                left: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)",
                pointerEvents: "none",
                zIndex: "var(--z-base)",
              }}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            style={{
              paddingLeft: leftIcon ? "var(--space-10)" : "var(--space-4)",
              paddingRight: rightIcon ? "var(--space-10)" : "var(--space-4)",
              ...searchStyles,
              ...errorStyles,
            }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              style={{
                position: "absolute",
                right: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)",
                pointerEvents: "none",
                zIndex: "var(--z-base)",
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(error || helperMessage) && (
          <div
            className="text-xs"
            style={{
              color: error ? "var(--error)" : "var(--text-tertiary)",
            }}
          >
            {error || helperMessage}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// Textarea variant
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  helperText?: string; // Alias for helper
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, helperText, className = "", id, ...props }, ref) => {
    // Use helperText as alias for helper
    const helperMessage = helperText || helper;
    // Generate ID if not provided
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Build textarea classes using our CSS system
    const textareaClasses = ["input", className].filter(Boolean).join(" ");

    // Error border override
    const errorStyles: React.CSSProperties = error
      ? {
          borderColor: "var(--border-error)",
        }
      : {};

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {label}
            {props.required && (
              <span style={{ color: "var(--error)", marginLeft: "4px" }}>
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea Field */}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          style={{
            minHeight: "120px",
            resize: "vertical",
            ...errorStyles,
          }}
          {...props}
        />

        {/* Helper/Error Text */}
        {(error || helperMessage) && (
          <div
            className="text-xs"
            style={{
              color: error ? "var(--error)" : "var(--text-tertiary)",
            }}
          >
            {error || helperMessage}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  helperText?: string; // Alias for helper
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helper, helperText, options, className = "", id, ...props },
    ref,
  ) => {
    // Use helperText as alias for helper
    const helperMessage = helperText || helper;
    // Generate ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Build select classes using our CSS system
    const selectClasses = ["input", className].filter(Boolean).join(" ");

    // Error border override
    const errorStyles: React.CSSProperties = error
      ? {
          borderColor: "var(--border-error)",
        }
      : {};

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {label}
            {props.required && (
              <span style={{ color: "var(--error)", marginLeft: "4px" }}>
                *
              </span>
            )}
          </label>
        )}

        {/* Select Field */}
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          style={{
            cursor: "pointer",
            ...errorStyles,
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Helper/Error Text */}
        {(error || helperMessage) && (
          <div
            className="text-xs"
            style={{
              color: error ? "var(--error)" : "var(--text-tertiary)",
            }}
          >
            {error || helperMessage}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
