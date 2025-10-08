'use client';

import WorkspaceSelector from '@/components/workspace-selector';
import { UserButton } from '@clerk/nextjs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            🚀 GalaxyCo.ai
          </h1>
          <WorkspaceSelector />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
