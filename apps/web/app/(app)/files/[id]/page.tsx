"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Download,
  Share2,
  Trash2,
  FileText,
  Image as ImageIcon,
  FileJson,
  FileArchive,
} from "lucide-react";

const mockFiles: Record<
  string,
  {
    id: string;
    name: string;
    type: "pdf" | "image" | "json" | "zip";
    size: string;
    uploadedAt: string;
    owner: string;
    url?: string;
  }
> = {
  "1": {
    id: "1",
    name: "proposal.pdf",
    type: "pdf",
    size: "1.2 MB",
    uploadedAt: "2025-10-10",
    owner: "Alex",
  },
  "2": {
    id: "2",
    name: "avatar.png",
    type: "image",
    size: "320 KB",
    uploadedAt: "2025-10-11",
    owner: "Sam",
    url: "/images/placeholder.png",
  },
  "3": {
    id: "3",
    name: "data.json",
    type: "json",
    size: "8 KB",
    uploadedAt: "2025-10-12",
    owner: "Taylor",
  },
};

export default function FileDetailPage() {
  const params = useParams<{ id: string }>();
  const id = (params?.id || "1").toString();
  const file = useMemo(() => mockFiles[id] ?? mockFiles["1"], [id]);

  const icon =
    file.type === "pdf" ? (
      <FileText className="h-12 w-12" />
    ) : file.type === "image" ? (
      <ImageIcon className="h-12 w-12" />
    ) : file.type === "json" ? (
      <FileJson className="h-12 w-12" />
    ) : (
      <FileArchive className="h-12 w-12" />
    );

  return (
    <PageShell
      title={file.name}
      subtitle="File details and actions"
      breadcrumbs={[{ label: "Files", href: "/files" }, { label: file.name }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            {icon}
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{file.type.toUpperCase()}</Badge>
                <span className="text-sm text-muted-foreground">
                  {file.size}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Uploaded {file.uploadedAt} by {file.owner}
              </p>
            </div>
          </div>

          <div className="rounded-md border bg-background-subtle p-6 text-center">
            {file.type === "image" ? (
              <div className="relative mx-auto max-h-96 h-96 w-full max-w-2xl">
                <Image
                  src={file.url ?? ""}
                  alt={file.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="mb-2">Preview not available.</p>
                <p className="text-xs">Download the file to view.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-col gap-2">
              <Button>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="secondary">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button variant="destructive" disabled>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Metadata</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <Label>Filename</Label>
                <p>{file.name}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p>{file.type}</p>
              </div>
              <div>
                <Label>Size</Label>
                <p>{file.size}</p>
              </div>
              <div>
                <Label>Owner</Label>
                <p>{file.owner}</p>
              </div>
              <div>
                <Label>Uploaded</Label>
                <p>{file.uploadedAt}</p>
              </div>
              <div>
                <Label>URL</Label>
                <p className="truncate text-muted-foreground">
                  {file.url ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
