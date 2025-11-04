/**
 * HubSpot Integration Types
 * Type-safe definitions for HubSpot CRM API interactions
 */

export interface HubSpotCreateContactParams {
  email: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  phone?: string;
  website?: string;
  [key: string]: string | undefined; // Allow additional properties
}

export interface HubSpotUpdateContactParams {
  contactId: string;
  properties: Record<string, string>;
}

export interface HubSpotContactResult {
  contactId: string;
  createdAt?: string;
  updatedAt?: string;
  properties: Record<string, string>;
}

export interface HubSpotCreateDealParams {
  dealname: string;
  amount?: number;
  dealstage?: string;
  closedate?: string;
  pipeline?: string;
  [key: string]: string | number | undefined; // Allow additional properties
}

export interface HubSpotUpdateDealParams {
  dealId: string;
  properties: Record<string, string | number>;
}

export interface HubSpotDealResult {
  dealId: string;
  createdAt?: string;
  updatedAt?: string;
  properties: Record<string, any>;
}

// HubSpot API Response Types
export interface HubSpotContact {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotDeal {
  id: string;
  properties: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotCreateResponse {
  id: string;
  properties: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotUpdateResponse {
  id: string;
  properties: Record<string, any>;
  updatedAt: string;
}
