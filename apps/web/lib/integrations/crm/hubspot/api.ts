/**
 * HubSpot API Service
 * Core HubSpot CRM API functionality
 */

import { CRMCredentials, Contact, Deal, CRMContact, CRMDeal } from '../types';

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

/**
 * Make HubSpot API request
 */
async function hubspotApiRequest(
  endpoint: string,
  credentials: CRMCredentials,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: Record<string, any>,
) {
  const url = `${HUBSPOT_API_BASE}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`HubSpot API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Create a contact in HubSpot
 */
export async function createHubSpotContact(
  credentials: CRMCredentials,
  contact: Contact,
): Promise<CRMContact> {
  const data = await hubspotApiRequest('/crm/v3/objects/contacts', credentials, 'POST', {
    properties: {
      firstname: contact.firstName,
      lastname: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      jobtitle: contact.jobTitle,
      ...contact.customFields,
    },
  });

  return {
    id: data.id,
    firstName: data.properties.firstname,
    lastName: data.properties.lastname,
    email: data.properties.email,
    phone: data.properties.phone,
    company: data.properties.company,
    createdAt: data.createdAt,
  };
}

/**
 * Update a contact in HubSpot
 */
export async function updateHubSpotContact(
  credentials: CRMCredentials,
  contactId: string,
  contact: Partial<Contact>,
): Promise<CRMContact> {
  const data = await hubspotApiRequest(
    `/crm/v3/objects/contacts/${contactId}`,
    credentials,
    'PATCH',
    {
      properties: {
        ...(contact.firstName && { firstname: contact.firstName }),
        ...(contact.lastName && { lastname: contact.lastName }),
        ...(contact.email && { email: contact.email }),
        ...(contact.phone && { phone: contact.phone }),
        ...(contact.company && { company: contact.company }),
        ...(contact.jobTitle && { jobtitle: contact.jobTitle }),
        ...contact.customFields,
      },
    },
  );

  return {
    id: data.id,
    firstName: data.properties.firstname,
    lastName: data.properties.lastname,
    email: data.properties.email,
    phone: data.properties.phone,
    company: data.properties.company,
    createdAt: data.createdAt,
  };
}

/**
 * Get a contact from HubSpot
 */
export async function getHubSpotContact(
  credentials: CRMCredentials,
  contactId: string,
): Promise<CRMContact> {
  const data = await hubspotApiRequest(`/crm/v3/objects/contacts/${contactId}`, credentials, 'GET');

  return {
    id: data.id,
    firstName: data.properties.firstname,
    lastName: data.properties.lastname,
    email: data.properties.email,
    phone: data.properties.phone,
    company: data.properties.company,
    createdAt: data.createdAt,
  };
}

/**
 * Create a deal in HubSpot
 */
export async function createHubSpotDeal(credentials: CRMCredentials, deal: Deal): Promise<CRMDeal> {
  const data = await hubspotApiRequest('/crm/v3/objects/deals', credentials, 'POST', {
    properties: {
      dealname: deal.title,
      amount: deal.value,
      dealstage: deal.stage,
      ...(deal.expectedCloseDate && { closedate: deal.expectedCloseDate }),
      ...deal.customFields,
    },
    associations: [
      ...(deal.contactId
        ? [
            {
              to: { id: deal.contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }],
            },
          ]
        : []),
    ],
  });

  return {
    id: data.id,
    title: data.properties.dealname,
    value: parseFloat(data.properties.amount || '0'),
    currency: 'USD',
    stage: data.properties.dealstage,
    createdAt: data.createdAt,
  };
}

/**
 * Search contacts in HubSpot
 */
export async function searchHubSpotContacts(
  credentials: CRMCredentials,
  query: string,
  limit = 10,
): Promise<CRMContact[]> {
  const data = await hubspotApiRequest('/crm/v3/objects/contacts/search', credentials, 'POST', {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'email',
            operator: 'CONTAINS_TOKEN',
            value: query,
          },
        ],
      },
    ],
    limit,
  });

  return (data.results || []).map((result: any) => ({
    id: result.id,
    firstName: result.properties.firstname,
    lastName: result.properties.lastname,
    email: result.properties.email,
    phone: result.properties.phone,
    company: result.properties.company,
    createdAt: result.createdAt,
  }));
}
