"use client";

import { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  FileText,
  File,
  Image,
  FileSpreadsheet,
  Download,
  MoreVertical,
  Upload,
  Eye,
  Share2,
} from "lucide-react";
import Link from "next/link";

// Mock documents data
const documents = [
  {
    id: "doc_001",
    name: "Sales Playbook 2024.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2025-10-15T10:30:00Z",
    modifiedDate: "2025-10-16T14:20:00Z",
    owner: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
    },
    tags: ["sales", "playbook", "2024"],
    description: "Complete sales methodology and process documentation",
  },
  {
    id: "doc_002",
    name: "Q3 Revenue Analysis.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    uploadDate: "2025-10-14T16:45:00Z",
    modifiedDate: "2025-10-14T16:45:00Z",
    owner: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
    },
    tags: ["revenue", "analysis", "q3"],
    description: "Financial analysis and revenue breakdown for Q3",
  },
  {
    id: "doc_003",
    name: "Product Screenshots.zip",
    type: "archive",
    size: "15.7 MB",
    uploadDate: "2025-10-13T09:15:00Z",
    modifiedDate: "2025-10-13T09:15:00Z",
    owner: {
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ER",
    },
    tags: ["product", "screenshots", "ui"],
    description: "Collection of product interface screenshots",
  },
  {
    id: "doc_004",
    name: "API Documentation.md",
    type: "markdown",
    size: "156 KB",
    uploadDate: "2025-10-12T11:20:00Z",
    modifiedDate: "2025-10-17T08:30:00Z",
    owner: {
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DK",
    },
    tags: ["api", "documentation", "developer"],
    description: "Complete API reference and integration guide",
  },
  {
    id: "doc_005",
    name: "Brand Guidelines.pdf",
    type: "pdf",
    size: "8.3 MB",
    uploadDate: "2025-10-11T14:10:00Z",
    modifiedDate: "2025-10-11T14:10:00Z",
    owner: {
      name: "Jessica Martinez",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JM",
    },
    tags: ["brand", "guidelines", "design"],
    description: "Complete brand identity and usage guidelines",
  },
  {
    id: "doc_006",
    name: "Customer Survey Results.csv",
    type: "csv",
    size: "892 KB",
    uploadDate: "2025-10-10T13:25:00Z",
    modifiedDate: "2025-10-10T13:25:00Z",
    owner: {
      name: "Robert Taylor",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=RT",
    },
    tags: ["customer", "survey", "data"],
    description: "Raw customer feedback survey responses",
  },
  {
    id: "doc_007",
    name: "Training Video - Onboarding.mp4",
    type: "video",
    size: "247 MB",
    uploadDate: "2025-10-09T15:40:00Z",
    modifiedDate: "2025-10-09T15:40:00Z",
    owner: {
      name: "Lisa Anderson",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LA",
    },
    tags: ["training", "onboarding", "video"],
    description: "New employee onboarding training video",
  },
  {
    id: "doc_008",
    name: "Competitor Analysis.docx",
    type: "document",
    size: "3.1 MB",
    uploadDate: "2025-10-08T12:15:00Z",
    modifiedDate: "2025-10-15T10:20:00Z",
    owner: {
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JW",
    },
    tags: ["competitor", "analysis", "market"],
    description: "Competitive landscape analysis and positioning",
  },
  {
    id: "doc_009",
    name: "Meeting Notes - All Hands.txt",
    type: "text",
    size: "12 KB",
    uploadDate: "2025-10-07T17:30:00Z",
    modifiedDate: "2025-10-07T17:30:00Z",
    owner: {
      name: "Maria Garcia",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MG",
    },
    tags: ["meeting", "notes", "all-hands"],
    description: "Notes from monthly all-hands meeting",
  },
  {
    id: "doc_010",
    name: "Product Roadmap 2025.pptx",
    type: "presentation",
    size: "5.7 MB",
    uploadDate: "2025-10-06T14:55:00Z",
    modifiedDate: "2025-10-14T16:30:00Z",
    owner: {
      name: "Alex Rodriguez",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AR",
    },
    tags: ["roadmap", "product", "2025"],
    description: "Product development roadmap and timeline",
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const typeFilter = activeFilters.type || [];
    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(doc.type);

    const ownerFilter = activeFilters.owner || [];
    const matchesOwner =
      ownerFilter.length === 0 || ownerFilter.includes(doc.owner.name);

    return matchesSearch && matchesType && matchesOwner;
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
      case "pdf":
      case "document":
      case "markdown":
      case "text":
        return <FileText className="h-8 w-8" />;
      case "spreadsheet":
      case "csv":
        return <FileSpreadsheet className="h-8 w-8" />;
      case "image":
        return <Image className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "text-red-500";
      case "spreadsheet":
      case "csv":
        return "text-green-500";
      case "image":
        return "text-blue-500";
      case "document":
        return "text-blue-600";
      case "presentation":
        return "text-orange-500";
      case "video":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <ListPage
      title="Documents"
      subtitle={`${filteredDocuments.length} document${
        filteredDocuments.length !== 1 ? "s" : ""
      }`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documents" },
      ]}
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
          id: "type",
          label: "File Type",
          type: "checkbox",
          options: [
            { value: "pdf", label: "PDF", count: 2 },
            { value: "document", label: "Document", count: 1 },
            { value: "spreadsheet", label: "Spreadsheet", count: 1 },
            { value: "csv", label: "CSV", count: 1 },
            { value: "image", label: "Image", count: 0 },
            { value: "video", label: "Video", count: 1 },
            { value: "presentation", label: "Presentation", count: 1 },
          ],
        },
        {
          id: "owner",
          label: "Owner",
          type: "checkbox",
          options: [
            { value: "Sarah Johnson", label: "Sarah Johnson", count: 1 },
            { value: "Michael Chen", label: "Michael Chen", count: 1 },
            { value: "Emily Rodriguez", label: "Emily Rodriguez", count: 1 },
            { value: "David Kim", label: "David Kim", count: 1 },
            { value: "Jessica Martinez", label: "Jessica Martinez", count: 1 },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      showFilters
    >
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${getFileTypeColor(
                    doc.type,
                  )}`}
                >
                  {getFileIcon(doc.type)}
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <Link href={`/documents/${doc.id}`}>
                <h3 className="mb-2 font-semibold hover:text-primary">
                  {doc.name}
                </h3>
              </Link>

              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {doc.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-1">
                {doc.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Modified</span>
                  <span className="font-medium">
                    {new Date(doc.modifiedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={doc.owner.avatar}
                      alt={doc.owner.name}
                      fallback={doc.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      size="sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      {doc.owner.name}
                    </span>
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
          ))}
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
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Modified</th>
                  <th className="pb-3 pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`${getFileTypeColor(doc.type)}`}>
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <Link href={`/documents/${doc.id}`}>
                            <p className="font-medium hover:text-primary">
                              {doc.name}
                            </p>
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm">{doc.size}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={doc.owner.avatar}
                          alt={doc.owner.name}
                          fallback={doc.owner.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                          size="sm"
                        />
                        <span className="text-sm">{doc.owner.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm">
                      {new Date(doc.modifiedDate).toLocaleDateString()}
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredDocuments.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No documents found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Card>
      )}
    </ListPage>
  );
}
