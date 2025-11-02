/**
 * Pipedrive API Service
 * Core Pipedrive CRM API functionality
 */

import { CRMCredentials, Contact, Deal, CRMContact, CRMDeal } from '../types';

const PIPEDRIVE_API_BASE = 'https://api.pipedrive.com/v1';

/**
 * Make Pipedrive API request
 */
async function pipedriveApiRequest(
  endpoint: string,
  credentials: CRMCredentials,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>,
) {
  const url = `${PIPEDRIVE_API_BASE}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pipedrive API error: ${error.error || response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Pipedrive API error: ${data.error || 'Unknown error'}`);
  }

  return data.data;
}

/**
 * Create a person in Pipedrive
 */
export async function createPipedrivePerson(
  credentials: CRMCredentials,
  contact: Contact,
): Promise<CRMContact> {
  const data = await pipedriveApiRequest('/persons', credentials, 'POST', {
    name: `${contact.firstName} ${contact.lastName}`,
    email: [{ value: contact.email, primary: true }],
    phone: contact.phone ? [{ value: contact.phone, primary: true }] : undefined,
    org_id: contact.company,
    ...contact.customFields,
  });

  return {
    id: data.id.toString(),
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    createdAt: data.add_time,
  };
}

/**
 * Update a person in Pipedrive
 */
export async function updatePipedrivePerson(
  credentials: CRMCredentials,
  personId: string,
  contact: Partial<Contact>,
): Promise<CRMContact> {
  const updateData: any = {};

  if (contact.firstName || contact.lastName) {
    updateData.name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  }
  if (contact.email) {
    updateData.email = [{ value: contact.email, primary: true }];
  }
  if (contact.phone) {
    updateData.phone = [{ value: contact.phone, primary: true }];
  }

  const data = await pipedriveApiRequest(`/persons/${personId}`, credentials, 'PUT', {
    ...updateData,
    ...contact.customFields,
  });

  return {
    id: data.id.toString(),
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    email: contact.email || '',
    phone: contact.phone,
    company: contact.company,
    createdAt: data.add_time,
  };
}

/**
 * Get a person from Pipedrive
 */
export async function getPipedrivePerson(
  credentials: CRMCredentials,
  personId: string,
): Promise<CRMContact> {
  const data = await pipedriveApiRequest(`/persons/${personId}`, credentials, 'GET');

  const nameParts = data.name?.split(' ') || ['', ''];

  return {
    id: data.id.toString(),
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' '),
    email: data.email?.[0]?.value || '',
    phone: data.phone?.[0]?.value,
    company: data.org_name,
    createdAt: data.add_time,
  };
}

/**
 * Create a deal in Pipedrive
 */
export async function createPipedriveDeal(
  credentials: CRMCredentials,
  deal: Deal,
): Promise<CRMDeal> {
  const data = await pipedriveApiRequest('/deals', credentials, 'POST', {
    title: deal.title,
    value: deal.value,
    currency: deal.currency,
    stage_id: deal.stage,
    person_id: deal.contactId,
    expected_close_date: deal.expectedCloseDate,
    ...deal.customFields,
  });

  return {
    id: data.id.toString(),
    title: data.title,
    value: parseFloat(data.value || '0'),
    currency: data.currency,
    stage: data.stage_id?.toString() || '',
    contactId: data.person_id?.toString(),
    createdAt: data.add_time,
  };
}

/**
 * Search persons in Pipedrive
 */
export async function searchPipedrivePersons(
  credentials: CRMCredentials,
  query: string,
  limit = 10,
): Promise<CRMContact[]> {
  const data = await pipedriveApiRequest(
    `/persons/search?term=${encodeURIComponent(query)}&limit=${limit}`,
    credentials,
    'GET',
  );

  if (!data.items) {
    return [];
  }

  return data.items.map((item: any) => {
    const person = item.item;
    const nameParts = person.name?.split(' ') || ['', ''];

    return {
      id: person.id.toString(),
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: person.emails?.[0] || '',
      phone: person.phones?.[0],
      company: person.organization?.name,
      createdAt: person.add_time,
    };
  });
}
