/**
 * HubSpot OAuth Configuration
 * OAuth 2.0 setup for HubSpot CRM integration
 */

import { CRMCredentials } from '../types';

// HubSpot OAuth scopes
export const HUBSPOT_SCOPES = [
  'crm.objects.contacts.read',
  'crm.objects.contacts.write',
  'crm.objects.deals.read',
  'crm.objects.deals.write',
  'crm.objects.companies.read',
  'crm.objects.companies.write',
];

// OAuth configuration
export const HUBSPOT_OAUTH_CONFIG = {
  clientId: process.env.HUBSPOT_CLIENT_ID || '',
  clientSecret: process.env.HUBSPOT_CLIENT_SECRET || '',
  redirectUri:
    process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/hubspot/callback' ||
    'http://localhost:3000/api/integrations/hubspot/callback',
  scopes: HUBSPOT_SCOPES,
  authUrl: 'https://app.hubspot.com/oauth/authorize',
  tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
};

/**
 * Generate HubSpot OAuth authorization URL
 */
export function getHubSpotAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: HUBSPOT_OAUTH_CONFIG.clientId,
    redirect_uri: HUBSPOT_OAUTH_CONFIG.redirectUri,
    scope: HUBSPOT_OAUTH_CONFIG.scopes.join(' '),
    ...(state && { state }),
  });

  return `${HUBSPOT_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<CRMCredentials> {
  const response = await fetch(HUBSPOT_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: HUBSPOT_OAUTH_CONFIG.clientId,
      client_secret: HUBSPOT_OAUTH_CONFIG.clientSecret,
      redirect_uri: HUBSPOT_OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to exchange code for tokens: ${error.message || error.error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    hubId: data.hub_id,
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<CRMCredentials> {
  const response = await fetch(HUBSPOT_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: HUBSPOT_OAUTH_CONFIG.clientId,
      client_secret: HUBSPOT_OAUTH_CONFIG.clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refresh token: ${error.message || error.error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}
