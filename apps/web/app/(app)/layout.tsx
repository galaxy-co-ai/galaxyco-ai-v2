/**
 * GalaxyCo.ai Authenticated App Layout
 * Layout for all authenticated routes with AppShell
 * October 15, 2025
 */

import { AppShell } from '@/components/layout/app-shell'
import { ChatWidget } from '@/components/chat/chat-widget'
import { WorkspaceProvider } from '@/contexts/workspace-context'

interface AppLayoutProps {
  children: React.ReactNode
}

// Development mock workspace data
const mockWorkspace = {
  id: 'dev-workspace-123',
  name: 'Development Workspace',
  slug: 'dev-workspace',
  plan: 'pro' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <WorkspaceProvider initialWorkspace={mockWorkspace}>
      <AppShell>{children}</AppShell>
      <ChatWidget />
    </WorkspaceProvider>
  )
}
