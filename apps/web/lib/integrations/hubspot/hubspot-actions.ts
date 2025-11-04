/**
 * HubSpot Integration Actions
 * Server-side HubSpot CRM operations using Nango
 */

import { executeIntegrationRequest } from '../nango-server';
import type {
  HubSpotCreateContactParams,
  HubSpotUpdateContactParams,
  HubSpotContactResult,
  HubSpotCreateDealParams,
  HubSpotUpdateDealParams,
  HubSpotDealResult,
  HubSpotCreateResponse,
  HubSpotUpdateResponse,
} from './hubspot-types';

/**
 * Create a new contact in HubSpot
 */
export async function createHubSpotContact(
  connectionId: string,
  params: HubSpotCreateContactParams,
): Promise<{ success: true; data: HubSpotContactResult } | { success: false; error: string }> {
  try {
    // Build properties object
    const properties: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        properties[key] = String(value);
      }
    }

    const result = await executeIntegrationRequest<HubSpotCreateResponse>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: '/crm/v3/objects/contacts',
      method: 'POST',
      data: {
        properties,
      },
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        contactId: result.data.id,
        createdAt: result.data.createdAt,
        properties: result.data.properties,
      },
    };
  } catch (error) {
    console.error('Failed to create HubSpot contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create contact',
    };
  }
}

/**
 * Update an existing contact in HubSpot
 */
export async function updateHubSpotContact(
  connectionId: string,
  params: HubSpotUpdateContactParams,
): Promise<{ success: true; data: HubSpotContactResult } | { success: false; error: string }> {
  try {
    const result = await executeIntegrationRequest<HubSpotUpdateResponse>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: `/crm/v3/objects/contacts/${params.contactId}`,
      method: 'PATCH',
      data: {
        properties: params.properties,
      },
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        contactId: result.data.id,
        updatedAt: result.data.updatedAt,
        properties: result.data.properties,
      },
    };
  } catch (error) {
    console.error('Failed to update HubSpot contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update contact',
    };
  }
}

/**
 * Get a contact by ID
 */
export async function getHubSpotContact(
  connectionId: string,
  contactId: string,
): Promise<{ success: true; data: HubSpotContactResult } | { success: false; error: string }> {
  try {
    const result = await executeIntegrationRequest<HubSpotCreateResponse>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: `/crm/v3/objects/contacts/${contactId}`,
      method: 'GET',
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        contactId: result.data.id,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
        properties: result.data.properties,
      },
    };
  } catch (error) {
    console.error('Failed to get HubSpot contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get contact',
    };
  }
}

/**
 * Create a new deal in HubSpot
 */
export async function createHubSpotDeal(
  connectionId: string,
  params: HubSpotCreateDealParams,
): Promise<{ success: true; data: HubSpotDealResult } | { success: false; error: string }> {
  try {
    // Build properties object
    const properties: Record<string, any> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        properties[key] = value;
      }
    }

    const result = await executeIntegrationRequest<HubSpotCreateResponse>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: '/crm/v3/objects/deals',
      method: 'POST',
      data: {
        properties,
      },
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        dealId: result.data.id,
        createdAt: result.data.createdAt,
        properties: result.data.properties,
      },
    };
  } catch (error) {
    console.error('Failed to create HubSpot deal:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create deal',
    };
  }
}

/**
 * Update an existing deal in HubSpot
 */
export async function updateHubSpotDeal(
  connectionId: string,
  params: HubSpotUpdateDealParams,
): Promise<{ success: true; data: HubSpotDealResult } | { success: false; error: string }> {
  try {
    const result = await executeIntegrationRequest<HubSpotUpdateResponse>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: `/crm/v3/objects/deals/${params.dealId}`,
      method: 'PATCH',
      data: {
        properties: params.properties,
      },
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        dealId: result.data.id,
        updatedAt: result.data.updatedAt,
        properties: result.data.properties,
      },
    };
  } catch (error) {
    console.error('Failed to update HubSpot deal:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update deal',
    };
  }
}

/**
 * Get a deal by ID
 */
export async function getHubSpotDeal(
  connectionId: string,
  dealId: string,
): Promise<{ success: true; data: HubSpotDealResult } | { success: false; error: string }> {
  try {
    const result = await executeIntegrationRequest<HubSpotCreateResponse>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: `/crm/v3/objects/deals/${dealId}`,
      method: 'GET',
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        dealId: result.data.id,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
        properties: result.data.properties,
      },
    };
  } catch (error) {
    console.error('Failed to get HubSpot deal:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get deal',
    };
  }
}

/**
 * Search contacts by email (helper function)
 */
export async function searchHubSpotContactByEmail(
  connectionId: string,
  email: string,
): Promise<
  { success: true; data: HubSpotContactResult | null } | { success: false; error: string }
> {
  try {
    const result = await executeIntegrationRequest<{
      results: Array<HubSpotCreateResponse>;
    }>({
      integrationId: 'hubspot',
      connectionId,
      endpoint: '/crm/v3/objects/contacts/search',
      method: 'POST',
      data: {
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
      },
    });

    if (!result.success) {
      return result;
    }

    if (!result.data.results || result.data.results.length === 0) {
      return { success: true, data: null };
    }

    const contact = result.data.results[0];

    return {
      success: true,
      data: {
        contactId: contact.id,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        properties: contact.properties,
      },
    };
  } catch (error) {
    console.error('Failed to search HubSpot contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search contact',
    };
  }
}
