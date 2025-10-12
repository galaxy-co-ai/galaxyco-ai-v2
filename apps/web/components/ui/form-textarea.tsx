"use client";

import React, { forwardRef } from "react";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  helperText?: string;
}

/**
 * FormTextarea - Wrapper around shadcn Textarea with label, error, and helper text
 * This provides backward compatibility with the old Textarea component API
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helper,
      helperText,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const helperMessage = helperText || helper;
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2 mb-4">
        {/* Label */}
        {label && (
          <Label htmlFor={textareaId} className="text-sm font-medium">
            {label}
            {required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
        )}

        {/* Textarea */}
        <Textarea
          ref={ref}
          id={textareaId}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${textareaId}-error` : helperMessage ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {/* Error Message */}
        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && helperMessage && (
          <p
            id={`${textareaId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperMessage}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
