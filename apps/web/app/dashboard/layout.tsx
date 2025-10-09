'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
// import WorkspaceSelector from '@/components/workspace-selector';

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
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', cursor: 'pointer' }}>
              🚀 GalaxyCo.ai
            </h1>
          </Link>
          {/* <WorkspaceSelector /> */}
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/marketplace" style={{ textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '6px', background: '#f3f4f6', color: '#374151', fontWeight: '500' }}>
              Marketplace
            </Link>
            <Link href="/agents" style={{ textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '6px', background: '#f3f4f6', color: '#374151', fontWeight: '500' }}>
              Agents
            </Link>
          </nav>
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
