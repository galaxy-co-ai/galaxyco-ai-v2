'use client';

import { WorkspaceProvider } from '@/hooks/useWorkspace';

export function Providers({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
