'use client';

import { DetailPage } from '@/components/templates/detail-page';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  FileText,
  Clock,
  User,
  Link2,
  Copy,
  Settings,
} from 'lucide-react';

// Mock document data
const documentData = {
  id: 'doc_001',
  name: 'Sales Playbook 2024.pdf',
  type: 'pdf',
  size: '2.4 MB',
  uploadDate: '2025-10-15T10:30:00Z',
  modifiedDate: '2025-10-16T14:20:00Z',
  owner: {
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
    email: 'sarah.johnson@company.com',
  },
  tags: ['sales', 'playbook', '2024'],
  description:
    'Complete sales methodology and process documentation for the 2024 fiscal year. Includes objection handling, qualification frameworks, and closing techniques.',
  versions: [
    {
      id: 'v3',
      version: '3.0',
      uploadDate: '2025-10-16T14:20:00Z',
      uploader: 'Sarah Johnson',
      size: '2.4 MB',
      changes: 'Added new objection handling section, updated pricing guidelines',
      isCurrent: true,
    },
    {
      id: 'v2',
      version: '2.1',
      uploadDate: '2025-10-12T09:15:00Z',
      uploader: 'Michael Chen',
      size: '2.1 MB',
      changes: 'Updated competitor analysis section',
      isCurrent: false,
    },
    {
      id: 'v1',
      version: '2.0',
      uploadDate: '2025-10-01T16:45:00Z',
      uploader: 'Sarah Johnson',
      size: '1.8 MB',
      changes: 'Initial Q4 version with new territory assignments',
      isCurrent: false,
    },
  ],
  permissions: [
    {
      id: 'perm_1',
      type: 'user',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Owner',
      permissions: ['view', 'edit', 'share', 'delete'],
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
    },
    {
      id: 'perm_2',
      type: 'team',
      name: 'Sales Team',
      role: 'Editor',
      permissions: ['view', 'edit', 'comment'],
      memberCount: 12,
    },
    {
      id: 'perm_3',
      type: 'user',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Viewer',
      permissions: ['view', 'comment'],
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
    },
  ],
};

const metrics = [
  {
    label: 'File Size',
    value: documentData.size,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: 'Created',
    value: new Date(documentData.uploadDate).toLocaleDateString(),
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: 'Modified',
    value: new Date(documentData.modifiedDate).toLocaleDateString(),
    icon: <Edit className="h-5 w-5" />,
  },
  {
    label: 'Owner',
    value: documentData.owner.name,
    icon: <User className="h-5 w-5" />,
  },
];

function PreviewTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Full Screen
            </Button>
          </div>
        </div>

        {/* Preview placeholder */}
        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h4 className="mb-2 text-lg font-semibold">PDF Preview</h4>
            <p className="text-sm text-muted-foreground">Document preview would render here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              (PDF.js or similar viewer integration)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DetailsTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Document Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="doc-name">Name</Label>
            <Input id="doc-name" defaultValue={documentData.name} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="doc-description">Description</Label>
            <textarea
              id="doc-description"
              defaultValue={documentData.description}
              className="mt-1 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {documentData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              <Button variant="outline" size="sm">
                + Add Tag
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">File Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">File Type</span>
            <span className="font-medium">{documentData.type.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Size</span>
            <span className="font-medium">{documentData.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">
              {new Date(documentData.uploadDate).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Modified</span>
            <span className="font-medium">
              {new Date(documentData.modifiedDate).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner</span>
            <div className="flex items-center gap-2">
              <Avatar
                src={documentData.owner.avatar}
                alt={documentData.owner.name}
                fallback={documentData.owner.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
                size="sm"
              />
              <span className="font-medium">{documentData.owner.name}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Version History</h3>
        <div className="space-y-4">
          {documentData.versions.map((version) => (
            <div
              key={version.id}
              className={`rounded-lg border p-4 ${
                version.isCurrent ? 'border-primary/50 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="font-semibold">Version {version.version}</h4>
                    {version.isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{version.changes}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Uploaded by {version.uploader}</span>
                    <span>{new Date(version.uploadDate).toLocaleString()}</span>
                    <span>{version.size}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!version.isCurrent && (
                    <Button variant="outline" size="sm">
                      Restore
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SharingTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Share Link</h3>
          <Button size="sm">Create Link</Button>
        </div>
        <div className="flex gap-2">
          <Input
            value="https://app.company.com/documents/doc_001/shared"
            readOnly
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Anyone with this link can view the document
        </p>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Access Permissions</h3>
          <Button size="sm">Add People</Button>
        </div>
        <div className="space-y-3">
          {documentData.permissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3">
                {permission.type === 'user' ? (
                  <Avatar
                    src={permission.avatar}
                    alt={permission.name}
                    fallback={permission.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                    size="sm"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{permission.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {permission.type === 'user'
                      ? permission.email
                      : `${permission.memberCount} members`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{permission.role}</Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function DocumentDetailPage() {
  return (
    <DetailPage
      title={documentData.name}
      subtitle={`${documentData.type.toUpperCase()} • ${documentData.size}`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Documents', href: '/documents' },
        { label: documentData.name },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      }
      metrics={metrics}
      tabs={[
        {
          id: 'preview',
          label: 'Preview',
          content: <PreviewTab />,
        },
        {
          id: 'details',
          label: 'Details',
          content: <DetailsTab />,
        },
        {
          id: 'history',
          label: 'History',
          badge: documentData.versions.length,
          content: <HistoryTab />,
        },
        {
          id: 'sharing',
          label: 'Sharing',
          badge: documentData.permissions.length,
          content: <SharingTab />,
        },
      ]}
    />
  );
}
