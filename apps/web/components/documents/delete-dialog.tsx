'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { logger } from '@/lib/utils/logger';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentName: string;
  onSuccess?: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  documentId,
  documentName,
  onSuccess,
}: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete document');

      toast.success('Document deleted successfully');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      logger.error('Failed to delete document', {
        error: err instanceof Error ? err.message : String(err),
        documentId,
      });
      toast.error('Failed to delete document');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle>Delete Document</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{documentName}</span>? This action
            cannot be undone and the document will be permanently removed from your collection.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="flex h-10 items-center justify-center rounded-md border bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
