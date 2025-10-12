/**
 * Toast Notification Helpers
 * 
 * Convenient utilities for showing toast notifications
 * throughout the app using the shadcn toast system
 */

import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
};

/**
 * Show a success toast notification
 */
export function toastSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(options?.title || "Success", {
    description: options?.description || message,
    duration: options?.duration || 4000,
  });
}

/**
 * Show an error toast notification
 */
export function toastError(message: string, options?: ToastOptions) {
  return sonnerToast.error(options?.title || "Error", {
    description: options?.description || message,
    duration: options?.duration || 5000,
  });
}

/**
 * Show an info toast notification
 */
export function toastInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(options?.title || "Info", {
    description: options?.description || message,
    duration: options?.duration || 4000,
  });
}

/**
 * Show a warning toast notification
 */
export function toastWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(options?.title || "Warning", {
    description: options?.description || message,
    duration: options?.duration || 4500,
  });
}

/**
 * Show a loading toast notification
 * Returns a dismiss function
 */
export function toastLoading(message: string, options?: ToastOptions) {
  return sonnerToast.loading(options?.title || "Loading", {
    description: options?.description || message,
  });
}

/**
 * Show a promise toast that updates based on promise state
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

/**
 * Dismiss a specific toast by ID
 */
export function toastDismiss(toastId?: string | number) {
  if (toastId) {
    sonnerToast.dismiss(toastId);
  } else {
    sonnerToast.dismiss();
  }
}

/**
 * Common toast messages for the app
 */
export const commonToasts = {
  // Agent operations
  agentCreated: () => toastSuccess("Agent created successfully!"),
  agentUpdated: () => toastSuccess("Agent updated successfully!"),
  agentDeleted: () => toastSuccess("Agent deleted successfully!"),
  agentDeployed: () => toastSuccess("Agent deployed successfully!"),
  
  // Knowledge operations
  fileUploaded: () => toastSuccess("File uploaded successfully!"),
  filesUploading: (count: number) => 
    toastLoading(`Uploading ${count} file${count > 1 ? 's' : ''}...`),
  
  // Generic operations
  saved: () => toastSuccess("Changes saved!"),
  copied: () => toastSuccess("Copied to clipboard!"),
  
  // Errors
  networkError: () => toastError("Network error. Please check your connection."),
  unauthorized: () => toastError("You don't have permission to do that."),
  genericError: () => toastError("Something went wrong. Please try again."),
};