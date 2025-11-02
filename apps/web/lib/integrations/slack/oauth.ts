/**
 * Slack OAuth Configuration
 * Slack OAuth 2.0 setup for workspace integration
 */

import { SlackCredentials } from './types';

// Slack OAuth scopes
export const SLACK_SCOPES = [
  'channels:read',
  'channels:write',
  'channels:history',
  'chat:write',
  'groups:read',
  'groups:write',
  'im:read',
  'im:write',
  'mpim:read',
  'mpim:write',
  'users:read',
];

// OAuth configuration
export const SLACK_OAUTH_CONFIG = {
  clientId: process.env.SLACK_CLIENT_ID || '',
  clientSecret: process.env.SLACK_CLIENT_SECRET || '',
  redirectUri:
    process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/slack/callback' ||
    'http://localhost:3000/api/integrations/slack/callback',
  scopes: SLACK_SCOPES,
  authUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
};

/**
 * Generate Slack OAuth authorization URL
 */
export function getSlackAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: SLACK_OAUTH_CONFIG.clientId,
    redirect_uri: SLACK_OAUTH_CONFIG.redirectUri,
    scope: SLACK_OAUTH_CONFIG.scopes.join(','),
    ...(state && { state }),
  });

  return `${SLACK_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<SlackCredentials> {
  const response = await fetch(SLACK_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: SLACK_OAUTH_CONFIG.clientId,
      client_secret: SLACK_OAUTH_CONFIG.clientSecret,
      redirect_uri: SLACK_OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to exchange code for tokens: ${error.error || 'Unknown error'}`);
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack OAuth error: ${data.error || 'Unknown error'}`);
  }

  return {
    accessToken: data.access_token,
    tokenType: data.token_type || 'Bearer',
    scope: data.scope,
    botUserId: data.bot_user_id,
    appId: data.app_id,
    teamId: data.team?.id,
    teamName: data.team?.name,
  };
}

/**
 * Validate Slack credentials (test API call)
 */
export async function validateSlackCredentials(credentials: SlackCredentials): Promise<boolean> {
  try {
    const response = await fetch('https://slack.com/api/auth.test', {
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

/**
 * Get workspace information
 */
export async function getWorkspaceInfo(
  accessToken: string,
): Promise<{ team: string; user: string }> {
  const response = await fetch('https://slack.com/api/auth.test', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch workspace info');
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`);
  }

  return {
    team: data.team,
    user: data.user,
  };
}
