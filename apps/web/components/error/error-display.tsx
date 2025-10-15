"use client";

import { AlertCircle, RefreshCw, Wifi, Lock, AlertTriangle, Search, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorType, isRetryableError } from "@/lib/errors";

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

/**
 * Generic Error Display Component
 * 
 * Displays appropriate error messages and actions based on error type
 */
export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className,
  size = "md",
  showIcon = true,
}: ErrorDisplayProps) {
  const errorType = getErrorType(error);
  const canRetry = isRetryableError(error);
  const config = getErrorConfig(errorType);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg",
  };

  return (
    <Card className={className}>
      <CardHeader className={size === "sm" ? "p-4" : undefined}>
        {showIcon && (
          <div className="flex items-center space-x-2">
            <config.icon className={`h-5 w-5 ${config.color}`} />
            <CardTitle className={sizeClasses[size]}>{config.title}</CardTitle>
          </div>
        )}
        {!showIcon && <CardTitle className={sizeClasses[size]}>{config.title}</CardTitle>}
        <CardDescription className={sizeClasses[size]}>
          {config.getDescription(error)}
        </CardDescription>
      </CardHeader>
      
      {(onRetry || onDismiss) && (
        <CardContent className={`flex space-x-2 ${size === "sm" ? "p-4 pt-0" : "pt-0"}`}>
          {onRetry && canRetry && (
            <Button onClick={onRetry} size={size === "sm" ? "sm" : "default"} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button 
              onClick={onDismiss} 
              variant="outline" 
              size={size === "sm" ? "sm" : "default"}
              className={onRetry && canRetry ? "" : "flex-1"}
            >
              Dismiss
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Inline Error Component (for form fields, etc.)
 */
export function InlineError({ 
  error, 
  className = "text-sm text-red-600 dark:text-red-400" 
}: { 
  error: unknown; 
  className?: string; 
}) {
  if (!error) return null;

  const message = error instanceof Error ? error.message : String(error);
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Toast Error Component (for notifications)
 */
export function ToastError({ error }: { error: unknown }) {
  const errorType = getErrorType(error);
  const config = getErrorConfig(errorType);
  
  return (
    <div className="flex items-start space-x-3">
      <config.icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
      <div className="flex-1">
        <div className="font-medium">{config.title}</div>
        <div className="text-sm opacity-90">{config.getDescription(error)}</div>
      </div>
    </div>
  );
}

/**
 * Empty State Error Component
 */
export function EmptyStateError({
  error,
  onRetry,
  title = "Unable to load data",
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
}) {
  const errorType = getErrorType(error);
  const config = getErrorConfig(errorType);
  const canRetry = isRetryableError(error);

  return (
    <div className={`text-center py-12 ${className}`}>
      <config.icon className={`mx-auto h-12 w-12 ${config.color} mb-4`} />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {config.getDescription(error)}
      </p>
      {onRetry && canRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

/**
 * Page Error Component (for full page errors)
 */
export function PageError({
  error,
  onRetry,
  onGoHome,
}: {
  error: unknown;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  const errorType = getErrorType(error);
  const config = getErrorConfig(errorType);
  const canRetry = isRetryableError(error);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <config.icon className={`mx-auto h-16 w-16 ${config.color} mb-6`} />
        <h1 className="text-2xl font-bold mb-4">{config.title}</h1>
        <p className="text-muted-foreground mb-6">
          {config.getDescription(error)}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && canRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} variant="outline">
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Error configuration for different error types
function getErrorConfig(errorType: string) {
  const configs = {
    network: {
      icon: Wifi,
      color: "text-orange-600 dark:text-orange-400",
      title: "Connection Problem",
      getDescription: () => "Please check your internet connection and try again.",
    },
    auth: {
      icon: Lock,
      color: "text-blue-600 dark:text-blue-400",
      title: "Authentication Required",
      getDescription: () => "Please sign in to continue.",
    },
    permission: {
      icon: Lock,
      color: "text-red-600 dark:text-red-400",
      title: "Access Denied",
      getDescription: () => "You don't have permission to access this resource.",
    },
    validation: {
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      title: "Invalid Input",
      getDescription: (error: unknown) => error instanceof Error ? error.message : "Please check your input and try again.",
    },
    notFound: {
      icon: Search,
      color: "text-gray-600 dark:text-gray-400",
      title: "Not Found",
      getDescription: () => "The requested resource could not be found.",
    },
    conflict: {
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      title: "Conflict",
      getDescription: (error: unknown) => error instanceof Error ? error.message : "There was a conflict with your request.",
    },
    rateLimit: {
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      title: "Rate Limited",
      getDescription: () => "Too many requests. Please wait a moment and try again.",
    },
    server: {
      icon: ServerCrash,
      color: "text-red-600 dark:text-red-400",
      title: "Server Error",
      getDescription: () => "Something went wrong on our end. Please try again later.",
    },
    api: {
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      title: "API Error",
      getDescription: (error: unknown) => error instanceof Error ? error.message : "An API error occurred.",
    },
    unknown: {
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      title: "Unexpected Error",
      getDescription: () => "An unexpected error occurred. Please try again.",
    },
  };

  return configs[errorType as keyof typeof configs] || configs.unknown;
}