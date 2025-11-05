/**
 * Knowledge Base Page - Figma Design
 * Complete rebuild to match Figma design exactly
 * Updated: November 5, 2025
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  SearchHeader,
  DocumentCard,
  FolderSidebar,
} from '@/components/figma/knowledge-base';
import type { FolderItem } from '@/components/figma/knowledge-base/FolderSidebar';
import type { DocumentCardProps } from '@/components/figma/knowledge-base/DocumentCard';

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Folders Data (from Figma)
  const folders: FolderItem[] = [
    { id: '1', name: 'Projects', documentCount: 24, color: 'blue' },
    { id: '2', name: 'Proposals', documentCount: 12, color: 'green' },
    { id: '3', name: 'Contracts', documentCount: 8, color: 'purple' },
    { id: '4', name: 'Training Materials', documentCount: 15, color: 'orange' },
    { id: '5', name: 'Client Resources', documentCount: 31, color: 'black' },
    { id: '6', name: 'Marketing', documentCount: 19, color: 'cyan' },
  ];

  // Documents Data (from Figma)
  const documents: Omit<DocumentCardProps, 'onClick' | 'className'>[] = [
    {
      id: '1',
      title: 'TechCorp Implementation Plan.pdf',
      description: 'Comprehensive implementation roadmap with timeline and milestones',
      type: 'pdf',
      tags: ['Implementation', 'Q4 2025'],
      views: 24,
      size: '2.4 MB',
      timeAgo: '2 hours ago',
      isStarred: true,
      isAIGenerated: true,
    },
    {
      id: '2',
      title: 'Q4 Sales Proposal Template.docx',
      description: 'Reusable proposal template for enterprise sales',
      type: 'docx',
      tags: ['Sales', 'Template'],
      views: 45,
      size: '856 KB',
      timeAgo: '1 day ago',
      isStarred: true,
    },
    {
      id: '3',
      title: 'Product Demo Recording.mp4',
      description: 'Full platform walkthrough for new clients',
      type: 'mp4',
      tags: ['Demo', 'Training'],
      views: 156,
      size: '124 MB',
      timeAgo: '2 days ago',
      isStarred: true,
      isAIGenerated: true,
    },
    {
      id: '4',
      title: 'API Integration Guide.pdf',
      description: 'Step-by-step guide for API integration',
      type: 'pdf',
      tags: ['Technical', 'API'],
      views: 89,
      size: '1.8 MB',
      timeAgo: '3 days ago',
      isStarred: true,
      isAIGenerated: true,
    },
    {
      id: '5',
      title: 'Brand Guidelines 2025.pdf',
      description: 'Updated brand guidelines and visual identity',
      type: 'pdf',
      tags: ['Brand', 'Design'],
      views: 67,
      size: '8.4 MB',
      timeAgo: '5 days ago',
      isStarred: true,
      isAIGenerated: true,
    },
    {
      id: '6',
      title: 'Client Onboarding Checklist.xlsx',
      description: 'Automated onboarding workflow checklist',
      type: 'xlsx',
      tags: ['Onboarding', 'Process'],
      views: 52,
      size: '156 KB',
      timeAgo: '1 week ago',
      isStarred: true,
      isAIGenerated: true,
    },
  ];

  const stats = {
    documents: documents.length,
    aiGenerated: documents.filter((d) => d.isAIGenerated).length,
    totalViews: documents.reduce((sum, d) => sum + d.views, 0),
    starred: documents.filter((d) => d.isStarred).length,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Centralized repository for all company documentation
        </p>
      </div>

      {/* Search Header with Stats */}
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        stats={stats}
        onUpload={() => {}}
      />

      {/* Main Content: Folders + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Folders (1/4) */}
        <div className="lg:col-span-1">
          <FolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onFolderClick={setSelectedFolderId}
          />
        </div>

        {/* Right: Documents Grid (3/4) */}
        <div className="lg:col-span-3">
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            )}
          >
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                {...doc}
                onClick={() => console.log('Open document:', doc.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
