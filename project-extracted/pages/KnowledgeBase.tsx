import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Search,
  Upload,
  FileText,
  FolderOpen,
  Star,
  Clock,
  Users,
  Sparkles,
  Filter,
  Download,
  ExternalLink,
  MoreVertical,
  Folder,
  File,
  Image,
  Video,
  Archive,
  Plus,
  Grid3x3,
  List,
  TrendingUp,
  Eye,
  BookOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface KBDocument {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "spreadsheet" | "presentation" | "pdf";
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  views: number;
  starred: boolean;
  tags: string[];
  aiGenerated: boolean;
  description?: string;
}

interface KBFolder {
  id: string;
  name: string;
  documentCount: number;
  color: string;
  icon: string;
}

const folders: KBFolder[] = [
  { id: "1", name: "Projects", documentCount: 24, color: "blue", icon: "briefcase" },
  { id: "2", name: "Proposals", documentCount: 12, color: "green", icon: "file-text" },
  { id: "3", name: "Contracts", documentCount: 8, color: "purple", icon: "file-check" },
  { id: "4", name: "Training Materials", documentCount: 15, color: "orange", icon: "book-open" },
  { id: "5", name: "Client Resources", documentCount: 31, color: "pink", icon: "users" },
  { id: "6", name: "Marketing", documentCount: 19, color: "cyan", icon: "megaphone" },
];

const documents: KBDocument[] = [
  {
    id: "1",
    name: "TechCorp Implementation Plan.pdf",
    type: "pdf",
    folder: "Projects",
    uploadedBy: "AI Assistant",
    uploadedAt: "2 hours ago",
    size: "2.4 MB",
    views: 24,
    starred: true,
    tags: ["Implementation", "Q4 2025"],
    aiGenerated: true,
    description: "Comprehensive implementation roadmap with timeline and milestones"
  },
  {
    id: "2",
    name: "Q4 Sales Proposal Template.docx",
    type: "document",
    folder: "Proposals",
    uploadedBy: "Sarah Chen",
    uploadedAt: "1 day ago",
    size: "856 KB",
    views: 45,
    starred: true,
    tags: ["Sales", "Template"],
    aiGenerated: false,
    description: "Reusable proposal template for enterprise sales"
  },
  {
    id: "3",
    name: "Product Demo Recording.mp4",
    type: "video",
    folder: "Training Materials",
    uploadedBy: "Michael Rodriguez",
    uploadedAt: "2 days ago",
    size: "124 MB",
    views: 156,
    starred: false,
    tags: ["Demo", "Training"],
    aiGenerated: false,
    description: "Full platform walkthrough for new clients"
  },
  {
    id: "4",
    name: "API Integration Guide.pdf",
    type: "pdf",
    folder: "Client Resources",
    uploadedBy: "AI Assistant",
    uploadedAt: "3 days ago",
    size: "1.8 MB",
    views: 89,
    starred: true,
    tags: ["Technical", "API"],
    aiGenerated: true,
    description: "Step-by-step guide for API integration"
  },
  {
    id: "5",
    name: "Brand Guidelines 2025.pdf",
    type: "pdf",
    folder: "Marketing",
    uploadedBy: "Emma Thompson",
    uploadedAt: "1 week ago",
    size: "5.2 MB",
    views: 67,
    starred: false,
    tags: ["Brand", "Design"],
    aiGenerated: false,
    description: "Updated brand guidelines and visual identity"
  },
  {
    id: "6",
    name: "Client Onboarding Checklist.xlsx",
    type: "spreadsheet",
    folder: "Projects",
    uploadedBy: "AI Assistant",
    uploadedAt: "1 week ago",
    size: "234 KB",
    views: 112,
    starred: true,
    tags: ["Onboarding", "Process"],
    aiGenerated: true,
    description: "Automated onboarding workflow checklist"
  },
  {
    id: "7",
    name: "Enterprise Contract Template.pdf",
    type: "pdf",
    folder: "Contracts",
    uploadedBy: "James Park",
    uploadedAt: "2 weeks ago",
    size: "1.1 MB",
    views: 34,
    starred: false,
    tags: ["Legal", "Enterprise"],
    aiGenerated: false
  },
  {
    id: "8",
    name: "ROI Analysis Dashboard.xlsx",
    type: "spreadsheet",
    folder: "Client Resources",
    uploadedBy: "AI Assistant",
    uploadedAt: "2 weeks ago",
    size: "678 KB",
    views: 78,
    starred: true,
    tags: ["Analytics", "ROI"],
    aiGenerated: true,
    description: "Interactive ROI calculator for client presentations"
  }
];

const recentActivity = [
  { action: "uploaded", user: "AI Assistant", document: "TechCorp Implementation Plan.pdf", time: "2 hours ago" },
  { action: "viewed", user: "Sarah Chen", document: "API Integration Guide.pdf", time: "3 hours ago" },
  { action: "starred", user: "Michael Rodriguez", document: "Client Onboarding Checklist.xlsx", time: "5 hours ago" },
  { action: "uploaded", user: "Emma Thompson", document: "Brand Guidelines 2025.pdf", time: "1 day ago" },
];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<"all" | "starred" | "ai-generated">("all");

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeFilter === "starred") return doc.starred;
    if (activeFilter === "ai-generated") return doc.aiGenerated;
    return true;
  });

  const getFileIcon = (type: KBDocument["type"]) => {
    switch (type) {
      case "pdf": return FileText;
      case "document": return FileText;
      case "image": return Image;
      case "video": return Video;
      case "spreadsheet": return FileText;
      case "presentation": return FileText;
      default: return File;
    }
  };

  const getFileColor = (type: KBDocument["type"]) => {
    switch (type) {
      case "pdf": return "from-red-500/10 to-red-500/20 text-red-500";
      case "document": return "from-blue-500/10 to-blue-500/20 text-blue-500";
      case "image": return "from-green-500/10 to-green-500/20 text-green-500";
      case "video": return "from-purple-500/10 to-purple-500/20 text-purple-500";
      case "spreadsheet": return "from-emerald-500/10 to-emerald-500/20 text-emerald-500";
      case "presentation": return "from-orange-500/10 to-orange-500/20 text-orange-500";
      default: return "from-gray-500/10 to-gray-500/20 text-gray-500";
    }
  };

  const totalDocuments = documents.length;
  const aiGeneratedCount = documents.filter(d => d.aiGenerated).length;
  const totalViews = documents.reduce((acc, doc) => acc + doc.views, 0);
  const starredCount = documents.filter(d => d.starred).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1>Knowledge Base</h1>
          <p className="text-muted-foreground">
            Centralized repository for all company documentation
          </p>
        </div>
        <Button className="shadow-[0_2px_10px_rgb(0,0,0,0.08)]">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Stats Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge 
          variant="outline" 
          className="h-8 px-4 rounded-full border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/20 text-blue-600 shadow-[0_2px_10px_rgb(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgb(59,130,246,0.25)] transition-all"
        >
          <FileText className="h-3.5 w-3.5 mr-2" />
          <span className="text-xs">{totalDocuments} Documents</span>
        </Badge>

        <Badge 
          variant="outline" 
          className="h-8 px-4 rounded-full border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/20 text-purple-600 shadow-[0_2px_10px_rgb(168,85,247,0.15)] hover:shadow-[0_4px_20px_rgb(168,85,247,0.25)] transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          <span className="text-xs">{aiGeneratedCount} AI Generated</span>
        </Badge>

        <Badge 
          variant="outline" 
          className="h-8 px-4 rounded-full border-0 bg-gradient-to-br from-green-500/10 to-green-500/20 text-green-600 shadow-[0_2px_10px_rgb(34,197,94,0.15)] hover:shadow-[0_4px_20px_rgb(34,197,94,0.25)] transition-all"
        >
          <Eye className="h-3.5 w-3.5 mr-2" />
          <span className="text-xs">{totalViews} Views</span>
        </Badge>

        <Badge 
          variant="outline" 
          className="h-8 px-4 rounded-full border-0 bg-gradient-to-br from-yellow-500/10 to-yellow-500/20 text-yellow-600 shadow-[0_2px_10px_rgb(234,179,8,0.15)] hover:shadow-[0_4px_20px_rgb(234,179,8,0.25)] transition-all"
        >
          <Star className="h-3.5 w-3.5 mr-2" />
          <span className="text-xs">{starredCount} Starred</span>
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 rounded-2xl overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-sm">Folders</h3>
          </div>
          
          <ScrollArea className="h-[600px]">
            <div className="p-2 space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className="w-full p-3 rounded-xl hover:bg-white/50 hover:shadow-[0_2px_10px_rgb(0,0,0,0.04)] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br from-${folder.color}-500/10 to-${folder.color}-500/20 flex items-center justify-center`}>
                      <Folder className={`h-4 w-4 text-${folder.color}-500`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder.documentCount} docs</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t mt-4">
              <h3 className="text-sm mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="text-muted-foreground">
                      <span className="text-foreground">{activity.user}</span> {activity.action}{" "}
                      <span className="text-foreground truncate block">{activity.document}</span>
                    </p>
                    <p className="text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search & Filters */}
          <Card className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                      All Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveFilter("starred")}>
                      <Star className="h-4 w-4 mr-2" />
                      Starred Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveFilter("ai-generated")}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Generated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-1 border border-border/50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 ${viewMode === "grid" ? "bg-muted" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 ${viewMode === "list" ? "bg-muted" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <ScrollArea className="h-[600px]">
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  const colorClass = getFileColor(doc.type);

                  return (
                    <Card
                      key={doc.id}
                      className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                            <FileIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                            {doc.aiGenerated && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-0 text-xs rounded-full">
                                <Sparkles className="h-3 w-3" />
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  {doc.starred ? "Unstar" : "Star"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div>
                          <p className="truncate text-sm">{doc.name}</p>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {doc.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-0 bg-muted rounded-full">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{doc.views}</span>
                          </div>
                          <span>{doc.size}</span>
                          <span>{doc.uploadedAt}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  const colorClass = getFileColor(doc.type);

                  return (
                    <Card
                      key={doc.id}
                      className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                          <FileIcon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate">{doc.name}</p>
                            {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />}
                            {doc.aiGenerated && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-0 text-xs rounded-full shrink-0">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{doc.folder}</span>
                            <span>•</span>
                            <span>{doc.uploadedBy}</span>
                            <span>•</span>
                            <span>{doc.uploadedAt}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{doc.views}</span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              {doc.starred ? "Unstar" : "Star"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No documents found" : "No documents yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload files or let AI Assistant create documents
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
