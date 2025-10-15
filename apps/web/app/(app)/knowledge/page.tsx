'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload, Filter, Grid, List, FileText, Image, File, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { DocumentUpload } from '@/components/knowledge/document-upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Document {
  id: string;
  title: string;
  type: 'document' | 'url' | 'image' | 'text';
  status: 'processing' | 'ready' | 'failed';
  size?: number;
  uploadedAt: string;
  collectionId?: string;
  tags: string[];
  summary?: string;
}

interface Collection {
  id: string;
  name: string;
  color: string;
  documentCount: number;
}

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Load documents and collections
  useEffect(() => {
    loadDocuments();
    loadCollections();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
    setLoading(false);
  };

  const loadCollections = async () => {
    // Mock collections for now - will be replaced with API call
    setCollections([
      { id: '1', name: 'All Documents', color: 'bg-blue-500', documentCount: documents.length },
      { id: '2', name: 'Company Docs', color: 'bg-green-500', documentCount: 5 },
      { id: '3', name: 'Research', color: 'bg-purple-500', documentCount: 3 },
      { id: '4', name: 'Templates', color: 'bg-orange-500', documentCount: 2 },
    ]);
  };

  // Filter documents based on search and collection
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCollection = !selectedCollection || selectedCollection === '1' || doc.collectionId === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-full">
      {/* Collections Sidebar */}
      <div className="w-64 border-r bg-muted/30 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Collections</h2>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                selectedCollection === collection.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${collection.color}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{collection.name}</div>
                <div className="text-sm text-muted-foreground">{collection.documentCount} documents</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Knowledge Base</h1>
              <p className="text-muted-foreground mt-1">
                Upload and organize documents to enhance AI responses
              </p>
            </div>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                </DialogHeader>
                <DocumentUpload
                  onUploadComplete={() => {
                    loadDocuments();
                    setUploadDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents and tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-12 w-12 text-muted-foreground" />}
              iconType="component"
              title={searchQuery ? 'No documents found' : 'No documents yet'}
              description={
                searchQuery
                  ? 'Try adjusting your search terms or filters.'
                  : 'Upload your first document to get started with AI-powered knowledge base.'
              }
              action={
                !searchQuery ? {
                  label: 'Upload Documents',
                  onClick: () => setUploadDialogOpen(true)
                } : undefined
              }
            />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getDocumentIcon(document.type)}
                        <CardTitle className="text-base truncate">{document.title}</CardTitle>
                      </div>
                      <Badge className={`ml-2 ${getStatusColor(document.status)}`}>
                        {document.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {document.summary && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {document.summary}
                      </p>
                    )}
                    
                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{document.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(document.uploadedAt)}
                      </div>
                      {document.size && (
                        <span>{formatFileSize(document.size)}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}