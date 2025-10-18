"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image,
  File,
  Folder,
  Download,
  Share2,
  MoreVertical,
  Plus,
  Search,
  Grid,
  List,
} from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc" | "folder";
  size: string;
  modified: string;
  shared: boolean;
}

const documents: Document[] = [
  {
    id: "1",
    name: "Q4 Report",
    type: "pdf",
    size: "2.4 MB",
    modified: "Today",
    shared: true,
  },
  {
    id: "2",
    name: "Product Images",
    type: "folder",
    size: "12 items",
    modified: "Yesterday",
    shared: false,
  },
  {
    id: "3",
    name: "Proposal Draft",
    type: "doc",
    size: "156 KB",
    modified: "2 days ago",
    shared: true,
  },
  {
    id: "4",
    name: "Logo Files",
    type: "image",
    size: "845 KB",
    modified: "3 days ago",
    shared: false,
  },
  {
    id: "5",
    name: "Meeting Notes",
    type: "doc",
    size: "89 KB",
    modified: "5 days ago",
    shared: false,
  },
  {
    id: "6",
    name: "Contract Template",
    type: "pdf",
    size: "1.1 MB",
    modified: "1 week ago",
    shared: true,
  },
];

const typeConfig = {
  pdf: { icon: FileText, color: "text-red-500" },
  doc: { icon: FileText, color: "text-blue-500" },
  image: { icon: Image, color: "text-purple-500" },
  folder: { icon: Folder, color: "text-yellow-500" },
};

export default function MobileDocumentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const getIcon = (type: Document["type"]) => {
    const Icon = typeConfig[type].icon;
    return <Icon className={`h-5 w-5 ${typeConfig[type].color}`} />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Documents</h1>
              <p className="text-sm text-muted-foreground">
                {documents.length} items
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1"
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="p-4 space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card active:bg-accent transition-colors"
            >
              <div className="shrink-0">{getIcon(doc.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{doc.name}</h3>
                  {doc.shared && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      Shared
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.modified}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="p-4 grid grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-border bg-card p-4 active:bg-accent transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">{getIcon(doc.type)}</div>
                <h3 className="font-medium text-sm truncate w-full mb-2">
                  {doc.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{doc.size}</span>
                  {doc.shared && (
                    <>
                      <span>•</span>
                      <Share2 className="h-3 w-3" />
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{doc.modified}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="fixed bottom-20 left-0 right-0 p-4">
        <div className="rounded-lg border border-border bg-card shadow-lg p-3">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <File className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No documents yet</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
}
