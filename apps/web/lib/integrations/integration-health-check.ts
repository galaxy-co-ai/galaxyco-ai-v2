/**
 * Integration Health Check
 * Monitor and validate integration connections
 */

import { getNangoConnection } from './nango-server';
import type { IntegrationType } from './integration-config';

export interface IntegrationHealth {
  integrationId: IntegrationType;
  isConnected: boolean;
  isValid: boolean;
  lastChecked: string;
  error?: string;
  connectionDetails?: {
    createdAt?: string;
    updatedAt?: string;
    metadata?: Record<string, any>;
  };
}

/**
 * Check health of a single integration connection
 */
export async function checkIntegrationHealth(
  integrationId: IntegrationType,
  connectionId: string,
): Promise<IntegrationHealth> {
  const lastChecked = new Date().toISOString();

  try {
    const result = await getNangoConnection(integrationId, connectionId);

    if (!result.success) {
      return {
        integrationId,
        isConnected: false,
        isValid: false,
        lastChecked,
        error: result.error,
      };
    }

    return {
      integrationId,
      isConnected: true,
      isValid: true,
      lastChecked,
      connectionDetails: result.data
        ? {
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at,
            metadata: result.data.metadata || undefined,
          }
        : undefined,
    };
  } catch (error) {
    return {
      integrationId,
      isConnected: false,
      isValid: false,
      lastChecked,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check health of all integrations for a user
 */
export async function checkAllIntegrationsHealth(
  connectionId: string,
): Promise<IntegrationHealth[]> {
  const integrationIds: IntegrationType[] = ['gmail', 'slack', 'hubspot', 'google-calendar'];

  const healthChecks = await Promise.all(
    integrationIds.map((id) => checkIntegrationHealth(id, connectionId)),
  );

  return healthChecks;
}

/**
 * Get summary statistics for integration health
 */
export function getIntegrationHealthSummary(health: IntegrationHealth[]) {
  const total = health.length;
  const connected = health.filter((h) => h.isConnected).length;
  const valid = health.filter((h) => h.isValid).length;
  const errors = health.filter((h) => h.error).length;

  return {
    total,
    connected,
    valid,
    errors,
    healthPercentage: total > 0 ? Math.round((valid / total) * 100) : 0,
  };
}

/**
 * Detect integrations that need reconnection
 */
export function getIntegrationsNeedingReconnection(health: IntegrationHealth[]): IntegrationType[] {
  return health.filter((h) => h.isConnected && !h.isValid).map((h) => h.integrationId);
}
