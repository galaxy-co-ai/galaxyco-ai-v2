'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileUp, CheckCircle2, XCircle } from 'lucide-react';

export default function ImportsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState('agents');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <PageShell
      title="Data Imports"
      subtitle="Import data from CSV or JSON files"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Imports' }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Upload File</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="importType">Import Type</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger id="importType">
                  <SelectValue placeholder="Select import type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agents">Agents</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="contacts">Contacts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>File Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  {selectedFile ? (
                    <div>
                      <p className="font-medium mb-1">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">CSV or JSON (MAX. 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <Button className="w-full" disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Upload and Preview
            </Button>
          </div>
        </div>

        {/* Import Instructions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Import Instructions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Supported Formats</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• CSV - Comma-separated values</li>
                <li>• JSON - JavaScript Object Notation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">File Requirements</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Maximum file size: 10MB</li>
                <li>• CSV must include header row</li>
                <li>• JSON must be valid array of objects</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Import Process</h4>
              <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Upload your file</li>
                <li>Preview and map columns</li>
                <li>Validate data</li>
                <li>Confirm import</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Column Mapping Preview (would show after upload) */}
      {selectedFile && (
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Column Mapping</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Map your file columns to system fields
          </p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">File Column</th>
                  <th className="px-4 py-3 text-left font-medium">Maps To</th>
                  <th className="px-4 py-3 text-left font-medium">Sample Value</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3">name</td>
                  <td className="px-4 py-3">
                    <code className="text-xs">Agent Name</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Lead Generator</td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">description</td>
                  <td className="px-4 py-3">
                    <code className="text-xs">Description</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Finds new leads...</td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">invalid_field</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-muted-foreground">Not Mapped</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">-</td>
                  <td className="px-4 py-3 text-center">
                    <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-4">
            <Button>Continue to Validation</Button>
            <Button variant="outline">Cancel Import</Button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
