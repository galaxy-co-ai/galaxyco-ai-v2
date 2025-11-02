/**
 * Pipedrive OAuth Configuration
 * OAuth 2.0 setup for Pipedrive CRM integration
 */

import { CRMCredentials } from '../types';

// OAuth configuration
export const PIPEDRIVE_OAUTH_CONFIG = {
  clientId: process.env.PIPEDRIVE_CLIENT_ID || '',
  clientSecret: process.env.PIPEDRIVE_CLIENT_SECRET || '',
  redirectUri:
    process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/pipedrive/callback' ||
    'http://localhost:3000/api/integrations/pipedrive/callback',
  authUrl: 'https://oauth.pipedrive.com/oauth/authorize',
  tokenUrl: 'https://oauth.pipedrive.com/oauth/token',
};

/**
 * Generate Pipedrive OAuth authorization URL
 */
export function getPipedriveAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: PIPEDRIVE_OAUTH_CONFIG.clientId,
    redirect_uri: PIPEDRIVE_OAUTH_CONFIG.redirectUri,
    ...(state && { state }),
  });

  return `${PIPEDRIVE_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<CRMCredentials> {
  const response = await fetch(PIPEDRIVE_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${PIPEDRIVE_OAUTH_CONFIG.clientId}:${PIPEDRIVE_OAUTH_CONFIG.clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: PIPEDRIVE_OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to exchange code for tokens: ${error.error_description || error.error}`,
    );
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    apiKey: data.api_domain, // Pipedrive uses domain-specific API
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<CRMCredentials> {
  const response = await fetch(PIPEDRIVE_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${PIPEDRIVE_OAUTH_CONFIG.clientId}:${PIPEDRIVE_OAUTH_CONFIG.clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refresh token: ${error.error_description || error.error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}
