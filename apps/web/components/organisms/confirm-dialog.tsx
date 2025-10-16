'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  showIcon?: boolean;
  className?: string;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClassName: 'text-primary bg-primary/10 border-primary/20',
    confirmButtonVariant: 'default' as const,
  },
  destructive: {
    icon: XCircle,
    iconClassName: 'text-destructive bg-destructive/10 border-destructive/20',
    confirmButtonVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    confirmButtonVariant: 'default' as const,
  },
  success: {
    icon: CheckCircle,
    iconClassName: 'text-green-500 bg-green-500/10 border-green-500/20',
    confirmButtonVariant: 'default' as const,
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  showIcon = true,
  className,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <div className="flex gap-4">
          {/* Icon */}
          {showIcon && (
            <div className="flex-shrink-0">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border',
                  config.iconClassName
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 space-y-3">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="sm:w-auto"
              >
                {cancelLabel}
              </Button>
              <Button
                variant={config.confirmButtonVariant}
                onClick={handleConfirm}
                disabled={isLoading}
                className="sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';
