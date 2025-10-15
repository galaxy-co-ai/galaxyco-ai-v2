'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, FileText, Image, File, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadModal } from '@/components/documents/upload-modal';

interface Document {
  id: string;
  title: string;
  category: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  thumbnailUrl?: string;
}

interface Collection {
  category: string;
  count: number;
  documents: Document[];
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to load documents');
      const data = await res.json();
      
      // Group documents by category
      const grouped: Record<string, Document[]> = {};
      for (const doc of data.documents || []) {
        if (!grouped[doc.category]) grouped[doc.category] = [];
        grouped[doc.category].push(doc);
      }

      const collectionList: Collection[] = Object.entries(grouped).map(([category, docs]) => ({
        category,
        count: docs.length,
        documents: docs,
      }));

      setCollections(collectionList);
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = collections
    .filter((col) => !selectedCategory || col.category === selectedCategory)
    .flatMap((col) => col.documents)
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const categories = [
    { id: 'company_info', name: 'Company Info', icon: FileText, color: 'text-blue-600' },
    { id: 'case_studies', name: 'Case Studies', icon: FileText, color: 'text-purple-600' },
    { id: 'service_offerings', name: 'Services', icon: FileText, color: 'text-green-600' },
    { id: 'team_bios', name: 'Team Bios', icon: FileText, color: 'text-orange-600' },
    { id: 'brand_assets', name: 'Brand Assets', icon: Image, color: 'text-pink-600' },
  ];

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    const Icon = cat?.icon || File;
    return <Icon className={cn('h-4 w-4', cat?.color || 'text-neutral-600')} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Collections
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Organize your knowledge and documents
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        </div>

        {/* Search and filters */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border bg-white pl-9 pr-4 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-neutral-950"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-white hover:bg-neutral-50 dark:bg-neutral-950'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white hover:bg-neutral-50 dark:bg-neutral-950'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              !selectedCategory
                ? 'border-primary bg-primary text-white'
                : 'border-neutral-300 bg-white hover:bg-neutral-50 dark:bg-neutral-950'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                selectedCategory === cat.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-neutral-300 bg-white hover:bg-neutral-50 dark:bg-neutral-950'
              )}
            >
              <cat.icon className="h-3 w-3" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-6 dark:bg-neutral-950">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-neutral-600 dark:text-neutral-400">Loading collections...</div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">
              No documents found
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Upload documents to get started with collections
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Upload Document
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group flex flex-col rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-900"
              >
                <div className="flex h-32 items-center justify-center rounded-t-lg bg-neutral-100 dark:bg-neutral-800">
                  {getCategoryIcon(doc.category)}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {doc.category.replace(/_/g, ' ')}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3 text-xs text-neutral-500">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  {getCategoryIcon(doc.category)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {doc.category.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <div>{formatFileSize(doc.fileSize)}</div>
                  <div>{new Date(doc.uploadedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={loadCollections}
      />
    </div>
  );
}
