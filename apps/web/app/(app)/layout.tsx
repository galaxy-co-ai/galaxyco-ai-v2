/**
 * GalaxyCo.ai Authenticated App Layout
 * Layout for all authenticated routes with AppShell
 * October 15, 2025
 */

import { AppShell } from '@/components/layout/app-shell';
import { ChatWidget } from '@/components/chat/chat-widget';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ErrorBoundary } from '@/components/error/error-boundary';
import { QueryProvider } from '@/components/providers/query-provider';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <WorkspaceProvider>
          <SidebarProvider>
            <AppShell>
              <ErrorBoundary>{children}</ErrorBoundary>
            </AppShell>
            <ChatWidget />
          </SidebarProvider>
        </WorkspaceProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
