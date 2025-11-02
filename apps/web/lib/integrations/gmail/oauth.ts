/**
 * Gmail OAuth Configuration
 * Google OAuth 2.0 setup for Gmail integration
 */

import { GmailCredentials } from './types';

// Gmail OAuth scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
];

// OAuth configuration
export const GMAIL_OAUTH_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri:
    process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/gmail/callback' ||
    'http://localhost:3000/api/integrations/gmail/callback',
  scopes: GMAIL_SCOPES,
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
};

/**
 * Generate Gmail OAuth authorization URL
 */
export function getGmailAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GMAIL_OAUTH_CONFIG.clientId,
    redirect_uri: GMAIL_OAUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: GMAIL_OAUTH_CONFIG.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    ...(state && { state }),
  });

  return `${GMAIL_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<GmailCredentials> {
  const response = await fetch(GMAIL_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: GMAIL_OAUTH_CONFIG.clientId,
      client_secret: GMAIL_OAUTH_CONFIG.clientSecret,
      redirect_uri: GMAIL_OAUTH_CONFIG.redirectUri,
      grant_type: 'authorization_code',
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
    email: '', // Will be populated when we fetch user info
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GmailCredentials> {
  const response = await fetch(GMAIL_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: GMAIL_OAUTH_CONFIG.clientId,
      client_secret: GMAIL_OAUTH_CONFIG.clientSecret,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refresh token: ${error.error_description || error.error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: refreshToken, // Keep the same refresh token
    expiresAt: Date.now() + data.expires_in * 1000,
    email: '',
  };
}

/**
 * Get user email from access token
 */
export async function getGmailUserEmail(accessToken: string): Promise<string> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user email');
  }

  const data = await response.json();
  return data.emailAddress;
}

/**
 * Validate Gmail credentials (check if access token is valid)
 */
export async function validateGmailCredentials(credentials: GmailCredentials): Promise<boolean> {
  try {
    // Check if token is expired
    if (Date.now() >= credentials.expiresAt) {
      return false;
    }

    // Verify token by making a simple API call
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
