'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  Download,
  Tag as TagIcon,
  Clock,
  FileCode,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { toast } from 'sonner';
import { DeleteDialog } from '@/components/documents/delete-dialog';

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'document' | 'url' | 'image' | 'text';
  status: 'processing' | 'ready' | 'failed';
  sourceUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  content?: string;
  summary?: string;
  metadata?: {
    author?: string;
    publishDate?: string;
    wordCount?: number;
    language?: string;
  };
  tags: string[];
  collectionId?: string;
  processingError?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [document, setDocument] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/documents/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Document not found');
          router.push('/collections');
          return;
        }
        throw new Error('Failed to load document');
      }
      const data = await res.json();
      setDocument(data.document);
    } catch (err) {
      logger.error('Failed to load document', {
        error: err instanceof Error ? err.message : String(err),
        documentId: params.id,
      });
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    router.push('/collections');
  };

  const handleDownload = () => {
    if (document?.sourceUrl) {
      window.open(document.sourceUrl, '_blank');
    } else if (document?.content) {
      // Create blob and download
      const blob = new Blob([document.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.fileName || document.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'url':
        return FileCode;
      case 'text':
        return FileText;
      default:
        return File;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Ready
          </div>
        );
      case 'processing':
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </div>
        );
      case 'failed':
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            Failed
          </div>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <FileText className="h-12 w-12 text-neutral-400" />
        <h3 className="mt-4 font-semibold text-foreground">Document not found</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          The document you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <button
          onClick={() => router.push('/collections')}
          className="mt-4 flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </button>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(document.type);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 dark:bg-neutral-900">
        <div className="mb-4">
          <button
            onClick={() => router.push('/collections')}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <TypeIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{document.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                {getStatusBadge(document.status)}
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {(document.sourceUrl || document.content) && (
              <button
                onClick={handleDownload}
                className="flex h-10 items-center gap-2 rounded-md border bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="flex h-10 items-center gap-2 rounded-md border border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-neutral-800 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-6 dark:bg-neutral-950">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Metadata Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-neutral-900">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Document Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  File Name
                </dt>
                <dd className="mt-1 text-sm text-foreground">{document.fileName || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  File Size
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatFileSize(document.fileSize)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Type</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {document.mimeType || document.type}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Uploaded
                </dt>
                <dd className="mt-1 text-sm text-foreground">{formatDate(document.createdAt)}</dd>
              </div>
              {document.metadata?.author && (
                <div>
                  <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Author
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">{document.metadata.author}</dd>
                </div>
              )}
              {document.metadata?.wordCount && (
                <div>
                  <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Word Count
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {document.metadata.wordCount.toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="mt-6">
                <dt className="mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Tags
                </dt>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Error */}
            {document.status === 'failed' && document.processingError && (
              <div className="mt-6 rounded-md bg-red-50 p-4 dark:bg-red-900/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                      Processing Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {document.processingError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {document.summary && (
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-neutral-900">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Summary</h2>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {document.summary}
              </p>
            </div>
          )}

          {/* Content Preview */}
          {document.content && document.status === 'ready' && (
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-neutral-900">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Content Preview</h2>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap rounded-md bg-neutral-50 p-4 text-sm dark:bg-neutral-800">
                  {document.content.length > 2000
                    ? `${document.content.slice(0, 2000)}...\n\n[Content truncated. Download to view full document.]`
                    : document.content}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      {document && (
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          documentId={document.id}
          documentName={document.title}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
