/**
 * CRM Integration Types
 * Unified types for CRM integrations (HubSpot, Pipedrive)
 */

import { z } from 'zod';

// CRM Provider type
export type CRMProvider = 'hubspot' | 'pipedrive';

// Generic CRM credentials
export interface CRMCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  apiKey?: string; // For Pipedrive
  hubId?: string; // For HubSpot
}

// Contact/Person schema
export const ContactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

// Deal/Opportunity schema
export const DealSchema = z.object({
  title: z.string(),
  value: z.number(),
  currency: z.string().default('USD'),
  stage: z.string().optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  expectedCloseDate: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

export type Deal = z.infer<typeof DealSchema>;

// CRM integration config for workflow nodes
export const CRMIntegrationConfigSchema = z.object({
  provider: z.enum(['hubspot', 'pipedrive']),
  action: z.enum([
    'create_contact',
    'update_contact',
    'get_contact',
    'create_deal',
    'update_deal',
    'get_deal',
    'search_contacts',
    'search_deals',
  ]),
  contactData: ContactSchema.optional(),
  dealData: DealSchema.optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type CRMIntegrationConfig = z.infer<typeof CRMIntegrationConfigSchema>;

// Response types
export interface CRMContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export interface CRMDeal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  contactId?: string;
  createdAt: string;
}
