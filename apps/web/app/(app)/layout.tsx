/**
 * GalaxyCo.ai Authenticated App Layout
 * Layout for all authenticated routes with AppShell
 * October 15, 2025
 */

import { AppShell } from "@/components/layout/app-shell";
import { ChatWidget } from "@/components/chat/chat-widget";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <ChatWidget />
    </>
  );
}
