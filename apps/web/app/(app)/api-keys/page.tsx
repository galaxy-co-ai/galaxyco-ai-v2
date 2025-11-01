'use client';

import { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, KeyRound, EyeOff, Trash2, Copy, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsed: string | null;
  createdAt: string;
  status: 'active' | 'revoked';
}

export default function ApiKeysPage() {
  const [name, setName] = useState('');
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: 'key_1',
      name: 'Server Key',
      prefix: 'sk_live',
      lastUsed: '2025-10-10',
      createdAt: '2025-10-01',
      status: 'active',
    },
    {
      id: 'key_2',
      name: 'Web Key',
      prefix: 'pk_live',
      lastUsed: null,
      createdAt: '2025-10-05',
      status: 'active',
    },
  ]);

  const createKey = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    const id = `key_${Math.random().toString(36).slice(2, 8)}`;
    setKeys([
      {
        id,
        name,
        prefix: 'sk_live',
        lastUsed: null,
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'active',
      },
      ...keys,
    ]);
    toast.success("API key created. Save it now; you won't be able to view it again.");
    setName('');
  };

  const revoke = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));
    toast.success('Key revoked');
  };

  const copy = async (id: string) => {
    // Copy masked example; never expose real secrets
    await navigator.clipboard.writeText('sk_live_' + id + '_****************');
    toast.success('Key copied (masked)');
  };

  return (
    <PageShell
      title="API Keys"
      subtitle="Create and manage credentials for authenticating API requests"
      breadcrumbs={[{ label: 'Developers', href: '/developers' }, { label: 'API Keys' }]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Key</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="name">Key name</Label>
              <Input
                id="name"
                placeholder="e.g., Backend Server"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Keys are scoped per workspace. Rotate regularly.
              </p>
            </div>
            <Button onClick={createKey} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Create Key
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Existing Keys</h2>
            <Badge variant="secondary">
              <Shield className="mr-1 h-3 w-3" /> Never share your secret keys
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-subtle">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Name</th>
                  <th className="text-left p-4 font-medium text-sm">Prefix</th>
                  <th className="text-left p-4 font-medium text-sm">Created</th>
                  <th className="text-left p-4 font-medium text-sm">Last used</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-right p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr
                    key={k.id}
                    className={`border-t border-border hover:bg-background-subtle transition-colors ${k.status === 'revoked' ? 'opacity-60' : ''}`}
                  >
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" /> {k.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="font-mono text-xs">{k.prefix}</code>
                    </td>
                    <td className="p-4">{k.createdAt}</td>
                    <td className="p-4">
                      {k.lastUsed ?? <span className="text-muted-foreground">never</span>}
                    </td>
                    <td className="p-4">
                      <Badge variant={k.status === 'active' ? 'secondary' : 'outline'}>
                        {k.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copy(k.id)}
                        title="Copy (masked)"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" disabled title="View value">
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => revoke(k.id)}
                        disabled={k.status === 'revoked'}
                        title="Revoke"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
