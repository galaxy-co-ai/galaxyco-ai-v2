/**
 * GalaxyCo.ai Authenticated App Layout
 * Layout for all authenticated routes with AppShell
 * October 15, 2025
 */

import { AppShell } from "@/components/layout/app-shell";
import { ChatWidget } from "@/components/chat/chat-widget";
import { WorkspaceProvider } from "@/contexts/workspace-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <WorkspaceProvider>
      <AppShell>{children}</AppShell>
      <ChatWidget />
    </WorkspaceProvider>
  );
}
