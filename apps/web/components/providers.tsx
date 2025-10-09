'use client';

import { WorkspaceProvider as WorkspaceProviderNew } from '@/hooks/useWorkspace';
import { WorkspaceProvider as WorkspaceProviderOld } from '@/contexts/workspace-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProviderNew>
      <WorkspaceProviderOld>
        {children}
      </WorkspaceProviderOld>
    </WorkspaceProviderNew>
  );
}
