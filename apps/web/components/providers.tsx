'use client';

import { WorkspaceProvider as WorkspaceProviderNew } from '@/hooks/useWorkspace';
import { WorkspaceProvider as WorkspaceProviderOld } from '@/contexts/workspace-context';
import { ThemeProvider } from '@/components/providers/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <WorkspaceProviderNew>
        <WorkspaceProviderOld>
          {children}
        </WorkspaceProviderOld>
      </WorkspaceProviderNew>
    </ThemeProvider>
  );
}
