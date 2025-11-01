'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Session {
  id: string;
  device: string;
  deviceType: 'desktop' | 'mobile';
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SecuritySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      deviceType: 'desktop',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      lastActive: 'Just now',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      deviceType: 'mobile',
      location: 'San Francisco, CA',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: '3',
      device: 'Chrome on MacBook',
      deviceType: 'desktop',
      location: 'New York, NY',
      ip: '10.0.0.1',
      lastActive: 'Yesterday',
      isCurrent: false,
    },
  ]);

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success('Session revoked');
  };

  const revokeAll = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success('All other sessions revoked');
  };

  return (
    <PageShell
      title="Active Sessions"
      subtitle="Manage your active sessions and sign out remotely"
      breadcrumbs={[
        { label: 'Settings', href: '/settings' },
        { label: 'Security', href: '/settings/security' },
        { label: 'Sessions' },
      ]}
      actions={
        <Button variant="destructive" onClick={revokeAll}>
          <XCircle className="mr-2 h-4 w-4" />
          Revoke All Other Sessions
        </Button>
      }
    >
      <div className="space-y-4">
        {sessions.map((session) => {
          const DeviceIcon = session.deviceType === 'desktop' ? Monitor : Smartphone;

          return (
            <div key={session.id} className="rounded-lg border bg-card p-6 flex items-start gap-4">
              <DeviceIcon className="h-6 w-6 text-muted-foreground mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{session.device}</h3>
                  {session.isCurrent && <Badge variant="secondary">Current Session</Badge>}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    {session.location} • {session.ip}
                  </p>
                  <p>Last active: {session.lastActive}</p>
                </div>
              </div>
              {!session.isCurrent && (
                <Button variant="destructive" size="sm" onClick={() => revokeSession(session.id)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Revoke
                </Button>
              )}
            </div>
          );
        })}

        {sessions.length === 1 && (
          <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
            <Monitor className="mx-auto h-12 w-12 mb-4" />
            <p>No other active sessions</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4">
        <h3 className="font-semibold mb-2">Security Tip</h3>
        <p className="text-sm text-muted-foreground">
          If you notice any suspicious activity or unfamiliar sessions, revoke them immediately and
          change your password.
        </p>
      </div>
    </PageShell>
  );
}
