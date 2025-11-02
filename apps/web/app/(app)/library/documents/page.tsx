'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/workspace-context';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { ListPage } from '@/components/templates/list-page';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  FileText,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
  Download,
  MoreVertical,
  Upload,
  Eye,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: string;
  title: string;
  type: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  summary: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  status: string;
}

export default function DocumentsPage() {
  const { currentWorkspace } = useWorkspace();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Fetch documents from API
  useEffect(() => {
    async function fetchDocuments() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/documents?workspaceId=${currentWorkspace.id}&limit=100`);

        if (!res.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await res.json();
        setDocuments(data.documents || []);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        toast.error('Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocuments();
  }, [currentWorkspace?.id]);

  // Helper to format file size from bytes
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Helper to get display name for document
  const getDocName = (doc: Document): string => {
    return doc.fileName || doc.title || 'Untitled Document';
  };

  // Helper to get file type from MIME type or filename
  const getFileType = (doc: Document): string => {
    if (doc.type) return doc.type;
    if (doc.mimeType?.includes('pdf')) return 'pdf';
    if (doc.mimeType?.includes('image')) return 'image';
    if (doc.mimeType?.includes('video')) return 'video';
    if (doc.mimeType?.includes('spreadsheet') || doc.mimeType?.includes('excel'))
      return 'spreadsheet';
    if (doc.mimeType?.includes('csv')) return 'csv';
    if (doc.mimeType?.includes('presentation') || doc.mimeType?.includes('powerpoint'))
      return 'presentation';
    return 'document';
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const filteredDocuments = documents.filter((doc) => {
    const docName = getDocName(doc);
    const docType = getFileType(doc);
    const description = doc.summary || '';
    const tags = doc.tags || [];

    const matchesSearch =
      searchQuery === '' ||
      docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const typeFilter = activeFilters.type || [];
    const matchesType = typeFilter.length === 0 || typeFilter.includes(docType);

    return matchesSearch && matchesType;
  });

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
      case 'markdown':
      case 'text':
        return <FileText className="h-8 w-8" />;
      case 'spreadsheet':
      case 'csv':
        return <FileSpreadsheet className="h-8 w-8" />;
      case 'image':
        return <ImageIcon className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
      case 'spreadsheet':
      case 'csv':
      case 'image':
      case 'presentation':
      case 'video':
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <ListPage
      title="Documents"
      subtitle={`${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''}`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents' }]}
      actions={
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      }
      searchQuery={searchQuery}
      searchPlaceholder="Search documents..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showViewToggle
      filters={[
        {
          id: 'type',
          label: 'File Type',
          type: 'checkbox',
          options: [
            { value: 'pdf', label: 'PDF', count: 0 },
            { value: 'document', label: 'Document', count: 0 },
            { value: 'spreadsheet', label: 'Spreadsheet', count: 0 },
            { value: 'csv', label: 'CSV', count: 0 },
            { value: 'image', label: 'Image', count: 0 },
            { value: 'video', label: 'Video', count: 0 },
            { value: 'presentation', label: 'Presentation', count: 0 },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      showFilters
    >
      {viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => {
            const docName = getDocName(doc);
            const docType = getFileType(doc);
            const docTags = doc.tags || [];

            return (
              <Card key={doc.id} className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${getFileTypeColor(
                      docType,
                    )}`}
                  >
                    {getFileIcon(docType)}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <Link href={`/library/documents/${doc.id}`}>
                  <h3 className="mb-2 font-semibold hover:text-primary">{docName}</h3>
                </Link>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {doc.summary || 'No description available'}
                </p>

                <div className="mb-4 flex flex-wrap gap-1">
                  {docTags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">{formatFileSize(doc.fileSize)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Modified</span>
                    <span className="font-medium">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 pl-6">Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Modified</th>
                  <th className="pb-3 pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const docName = getDocName(doc);
                  const docType = getFileType(doc);

                  return (
                    <tr key={doc.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`${getFileTypeColor(docType)}`}>
                            {getFileIcon(docType)}
                          </div>
                          <div>
                            <Link href={`/library/documents/${doc.id}`}>
                              <p className="font-medium hover:text-primary">{docName}</p>
                            </Link>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {doc.summary || 'No description'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline" className="text-xs">
                          {docType}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm">{formatFileSize(doc.fileSize)}</td>
                      <td className="py-4">
                        <Badge variant="secondary" className="text-xs">
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-6">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredDocuments.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No documents found</h3>
          <p className="mb-4 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Card>
      )}
    </ListPage>
  );
}
