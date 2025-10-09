/**
 * Workspace Context Hook
 * Client-side workspace state management with persistence
 * 
 * Fallback hierarchy:
 * 1. URL query parameter (?w=<workspace-id>)
 * 2. localStorage (client-side persistence)
 * 3. API call to server for default workspace
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface WorkspaceContextValue {
  workspaceId: string | null;
  workspace: Workspace | null;
  setWorkspaceId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaceId, setWorkspaceIdState] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Fetch workspace details from API
   */
  const fetchWorkspaceDetails = useCallback(async (id?: string) => {
    try {
      setError(null);
      
      let url = '/api/workspace/current';
      if (id) {
        // If setting specific workspace, update server-side cookie first
        await fetch('/api/workspace/current', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspaceId: id }),
        });
      }
      
      const response = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workspace');
      }
      
      const data = await response.json();
      
      // Handle null workspace (new user without workspace yet) - this is normal!
      if (data.workspaceId === null || data.workspace === null) {
        console.log('ℹ️ No workspace found - user needs to create one');
        setWorkspaceIdState(null);
        setWorkspace(null);
        localStorage.removeItem('workspaceId');
        return null;
      }
      
      setWorkspaceIdState(data.workspaceId);
      setWorkspace(data.workspace);
      
      // Update localStorage for client-side persistence
      if (data.workspaceId) {
        localStorage.setItem('workspaceId', data.workspaceId);
      }
      
      return data.workspaceId;
    } catch (err: any) {
      console.error('Error fetching workspace details:', err);
      setError(err.message);
      return null;
    }
  }, []);

  /**
   * Initialize workspace from URL, localStorage, or API
   */
  useEffect(() => {
    async function initializeWorkspace() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Priority 1: URL query parameter
        const urlWorkspace = searchParams.get('w');
        if (urlWorkspace) {
          console.log('🔗 Using workspace from URL:', urlWorkspace);
          await fetchWorkspaceDetails(urlWorkspace);
          setIsLoading(false);
          return;
        }

        // Priority 2: localStorage
        const storedWorkspace = localStorage.getItem('workspaceId');
        if (storedWorkspace && storedWorkspace !== 'undefined') {
          console.log('💾 Using workspace from localStorage:', storedWorkspace);
          await fetchWorkspaceDetails(storedWorkspace);
          setIsLoading(false);
          return;
        }

        // Priority 3: API default
        console.log('🌐 Fetching default workspace from API');
        await fetchWorkspaceDetails();
      } catch (err: any) {
        console.error('Error initializing workspace:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    initializeWorkspace();
  }, [searchParams, fetchWorkspaceDetails]);

  /**
   * Set new workspace and update all persistence layers
   */
  const setWorkspaceId = useCallback(async (id: string) => {
    if (id === workspaceId) {
      return; // No change needed
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Update server-side (sets cookie)
      const response = await fetch('/api/workspace/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set workspace');
      }
      
      const data = await response.json();
      
      // Update state
      setWorkspaceIdState(data.workspaceId);
      setWorkspace(data.workspace);
      
      // Update localStorage
      localStorage.setItem('workspaceId', data.workspaceId);
      
      // Update URL (without page reload)
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('w', data.workspaceId);
      router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
      
      console.log('✅ Workspace switched to:', data.workspace?.name);
    } catch (err: any) {
      console.error('Error setting workspace:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, router]);

  /**
   * Refresh current workspace details
   */
  const refreshWorkspace = useCallback(async () => {
    if (workspaceId) {
      await fetchWorkspaceDetails(workspaceId);
    }
  }, [workspaceId, fetchWorkspaceDetails]);

  const contextValue: WorkspaceContextValue = {
    workspaceId,
    workspace,
    setWorkspaceId,
    isLoading,
    error,
    refreshWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

/**
 * Hook to access workspace context
 * Throws error if used outside WorkspaceProvider
 */
export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  
  if (!context) {
    throw new Error(
      'useWorkspace must be used within a WorkspaceProvider. ' +
      'Make sure to wrap your app with <WorkspaceProvider>.'
    );
  }
  
  return context;
}

/**
 * Hook to get workspace ID only (lightweight version)
 * Returns null if workspace is not loaded yet
 */
export function useWorkspaceId(): string | null {
  const { workspaceId, isLoading } = useWorkspace();
  return isLoading ? null : workspaceId;
}

/**
 * Hook to check if workspace is loading
 */
export function useWorkspaceLoading(): boolean {
  const { isLoading } = useWorkspace();
  return isLoading;
}