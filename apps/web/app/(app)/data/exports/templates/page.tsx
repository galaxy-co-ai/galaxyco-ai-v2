'use client';

import { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, FileDown, Edit3, Copy, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  format: 'CSV' | 'JSON' | 'XLSX';
  fields: number;
  updatedAt: string;
}

const initial: Template[] = [
  {
    id: 't1',
    name: 'Prospects Basic',
    format: 'CSV',
    fields: 12,
    updatedAt: '2025-10-09',
  },
  {
    id: 't2',
    name: 'Invoices Detailed',
    format: 'XLSX',
    fields: 28,
    updatedAt: '2025-10-11',
  },
  {
    id: 't3',
    name: 'Campaign Metrics',
    format: 'JSON',
    fields: 18,
    updatedAt: '2025-10-12',
  },
];

export default function ExportTemplatesPage() {
  const [q, setQ] = useState('');
  const [templates, setTemplates] = useState(initial);

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));

  const exportSample = (t: Template) => {
    toast.success(`Started sample export for ${t.name}`);
  };

  const duplicate = (t: Template) => {
    const id = 't' + Math.random().toString(36).slice(2, 8);
    setTemplates([
      {
        ...t,
        id,
        name: t.name + ' Copy',
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      ...templates,
    ]);
    toast.success('Template duplicated');
  };

  return (
    <PageShell
      title="Export Templates"
      subtitle="Manage reusable templates for exporting your data"
      breadcrumbs={[{ label: 'Exports', href: '/exports' }, { label: 'Templates' }]}
    >
      <div className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="q">Search templates</Label>
            <Input
              id="q"
              placeholder="Search by name"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-lg border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">Updated {t.updatedAt}</p>
                </div>
                <Badge variant="secondary">{t.format}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.fields} fields selected</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => exportSample(t)}>
                  <FileDown className="mr-2 h-4 w-4" /> Export sample
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => duplicate(t)} title="Duplicate">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
