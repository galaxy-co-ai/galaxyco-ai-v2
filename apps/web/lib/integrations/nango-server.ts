/**
 * Nango Server-Side SDK Client
 * Handles all server-side integration operations
 *
 * SECURITY: This file should ONLY be used in server-side code (API routes, Server Actions)
 * Never import this in client components!
 */

import { Nango } from '@nangohq/node';

// Nango secret key is required - set in Vercel environment variables
if (!process.env.NANGO_SECRET_KEY) {
  throw new Error(
    'NANGO_SECRET_KEY is not defined in environment variables. ' +
      'Please add it to Vercel environment variables.',
  );
}

/**
 * Nango server instance
 * Used for:
 * - Executing integration actions
 * - Managing connections
 * - Accessing integration APIs with authenticated requests
 */
export const nangoServer = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY,
  // Optional: Custom host for self-hosted Nango
  // host: process.env.NANGO_HOST || 'https://api.nango.dev',
});

/**
 * Get connection details for a user's integration
 */
export async function getNangoConnection(integrationId: string, connectionId: string) {
  try {
    const connection = await nangoServer.getConnection(integrationId, connectionId);
    return { success: true, data: connection };
  } catch (error) {
    console.error(`Failed to get connection for ${integrationId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a user's connection to an integration
 */
export async function deleteNangoConnection(integrationId: string, connectionId: string) {
  try {
    await nangoServer.deleteConnection(integrationId, connectionId);
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete connection for ${integrationId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute an API call to an integration using Nango's proxy
 *
 * This automatically handles:
 * - OAuth token refresh
 * - Rate limiting
 * - Error handling
 */
export async function executeIntegrationRequest<T = any>(params: {
  integrationId: string;
  connectionId: string;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const {
    integrationId,
    connectionId,
    endpoint,
    method = 'GET',
    data,
    params: queryParams,
    headers,
  } = params;

  try {
    const response = await nangoServer.proxy({
      method,
      endpoint,
      providerConfigKey: integrationId,
      connectionId,
      data,
      params: queryParams,
      headers,
    });

    return { success: true, data: response.data as T };
  } catch (error: any) {
    console.error(`Integration request failed for ${integrationId}:`, error);

    // Extract useful error message
    const errorMessage =
      error.response?.data?.error?.message || error.message || 'Integration request failed';

    return { success: false, error: errorMessage };
  }
}

/**
 * List all connections for a specific integration
 */
export async function listNangoConnections(integrationId: string) {
  try {
    const connections = await nangoServer.listConnections(integrationId);
    return { success: true, data: connections };
  } catch (error) {
    console.error(`Failed to list connections for ${integrationId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a Connect Session for OAuth flows
 * Returns a session token that the frontend can use
 */
export async function createConnectSession(params: {
  end_user: {
    id: string;
    email?: string;
    display_name?: string;
    tags?: Record<string, string>;
  };
  allowed_integrations: string[];
}) {
  try {
    const result = await nangoServer.createConnectSession(params);
    return result;
  } catch (error) {
    console.error('Failed to create connect session:', error);
    throw error;
  }
}

/**
 * Create a Reconnect Session for re-authorizing existing connections
 */
export async function createReconnectSession(params: {
  connection_id: string;
  integration_id: string;
}) {
  try {
    const result = await nangoServer.createReconnectSession(params);
    return result;
  } catch (error) {
    console.error('Failed to create reconnect session:', error);
    throw error;
  }
}
