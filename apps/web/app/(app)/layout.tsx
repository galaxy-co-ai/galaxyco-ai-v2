/**
 * GalaxyCo.ai Authenticated App Layout
 * Layout for all authenticated routes with AppShell
 * October 15, 2025
 */

import { AppShell } from "@/components/layout/app-shell";
import { ChatWidget } from "@/components/chat/chat-widget";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { ErrorBoundary } from "@/components/error/error-boundary";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundary>
      <WorkspaceProvider>
        <AppShell>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AppShell>
        <ChatWidget />
      </WorkspaceProvider>
    </ErrorBoundary>
  );
}
