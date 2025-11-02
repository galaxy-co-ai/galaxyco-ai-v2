/**
 * GalaxyCo.ai Page Context Hook
 * Captures current page context for AI Assistant
 * November 2, 2025
 */

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface SelectedItems {
  agentId?: string;
  workflowId?: string;
  customerId?: string;
  prospectId?: string;
  projectId?: string;
  conversationId?: string;
  documentId?: string;
  gridId?: string;
}

interface PageContext {
  page: string;
  selectedItems: SelectedItems;
  timestamp: string;
  pageType?: string;
  action?: string;
}

/**
 * Extract resource IDs from URL pathname and search params
 */
function extractSelectedItems(pathname: string, searchParams: URLSearchParams): SelectedItems {
  const items: SelectedItems = {};

  // Extract from pathname patterns
  // /agents/[id]
  const agentMatch = pathname.match(/\/agents\/([a-zA-Z0-9-]+)/);
  if (agentMatch) items.agentId = agentMatch[1];

  // /workflows/[id] or /studio/lab/[id]
  const workflowMatch = pathname.match(/\/(?:workflows|studio\/lab)\/([a-zA-Z0-9-]+)/);
  if (workflowMatch) {
    items.workflowId = workflowMatch[1];
    items.gridId = workflowMatch[1]; // Alias for Grid
  }

  // /crm/customers/[id]
  const customerMatch = pathname.match(/\/crm\/customers\/([a-zA-Z0-9-]+)/);
  if (customerMatch) items.customerId = customerMatch[1];

  // /crm/prospects/[id]
  const prospectMatch = pathname.match(/\/crm\/prospects\/([a-zA-Z0-9-]+)/);
  if (prospectMatch) items.prospectId = prospectMatch[1];

  // /crm/projects/[id]
  const projectMatch = pathname.match(/\/crm\/projects\/([a-zA-Z0-9-]+)/);
  if (projectMatch) items.projectId = projectMatch[1];

  // /library/documents/[id]
  const documentMatch = pathname.match(/\/library\/documents\/([a-zA-Z0-9-]+)/);
  if (documentMatch) items.documentId = documentMatch[1];

  // /assistant (conversation might be in query params)
  const conversationId = searchParams.get('conversation');
  if (conversationId) items.conversationId = conversationId;

  return items;
}

/**
 * Determine page type from pathname
 */
function getPageType(pathname: string): string | undefined {
  if (pathname.startsWith('/agents')) return 'agents';
  if (pathname.startsWith('/workflows') || pathname.startsWith('/studio')) return 'workflows';
  if (pathname.startsWith('/crm')) return 'crm';
  if (pathname.startsWith('/library')) return 'library';
  if (pathname.startsWith('/analytics')) return 'analytics';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/assistant')) return 'assistant';
  return undefined;
}

/**
 * Determine action from pathname
 */
function getAction(pathname: string): string | undefined {
  if (pathname.includes('/new')) return 'create';
  if (pathname.includes('/edit')) return 'edit';
  if (pathname.endsWith('/executions')) return 'view_executions';
  if (pathname.endsWith('/logs')) return 'view_logs';
  return undefined;
}

/**
 * Hook to capture current page context for AI Assistant
 */
export function usePageContext(): PageContext {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useMemo(() => {
    const context: PageContext = {
      page: pathname,
      selectedItems: extractSelectedItems(pathname, searchParams),
      timestamp: new Date().toISOString(),
      pageType: getPageType(pathname),
      action: getAction(pathname),
    };

    return context;
  }, [pathname, searchParams]);
}

/**
 * Generate a human-readable description of the current context
 */
export function describeContext(context: PageContext): string {
  const parts: string[] = [];

  // Describe page type
  if (context.pageType) {
    parts.push(`on the ${context.pageType} page`);
  }

  // Describe action
  if (context.action === 'create') {
    parts.push('creating a new item');
  } else if (context.action === 'edit') {
    parts.push('editing an item');
  }

  // Describe selected items
  if (context.selectedItems.agentId) {
    parts.push(`viewing agent ${context.selectedItems.agentId}`);
  }
  if (context.selectedItems.workflowId) {
    parts.push(`viewing workflow ${context.selectedItems.workflowId}`);
  }
  if (context.selectedItems.customerId) {
    parts.push(`viewing customer ${context.selectedItems.customerId}`);
  }
  if (context.selectedItems.prospectId) {
    parts.push(`viewing prospect ${context.selectedItems.prospectId}`);
  }

  return parts.length > 0 ? `User is ${parts.join(', ')}` : 'User is on the main page';
}
