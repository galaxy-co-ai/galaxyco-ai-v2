'use client';

import { X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const fileSizeKB = (file.size / 1024).toFixed(1);

  return (
    <Card className="relative p-3 pr-10 bg-muted border">
      <div className="flex items-center gap-3">
        {/* Icon or image preview */}
        {isImage ? (
          <div className="size-10 rounded overflow-hidden shrink-0 bg-background">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div className="size-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="size-5 text-primary" />
          </div>
        )}

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{fileSizeKB} KB</p>
        </div>
      </div>

      {/* Remove button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemove}
        className="absolute top-2 right-2 h-6 w-6"
      >
        <X className="size-3" />
      </Button>
    </Card>
  );
}
