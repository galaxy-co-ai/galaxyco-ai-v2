'use client';

import { WorkspaceProvider } from '../contexts/workspace-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
