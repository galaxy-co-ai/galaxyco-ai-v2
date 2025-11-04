/**
 * Direct OAuth Client
 * Handles OAuth flows without requiring backend API calls
 *
 * This bypasses Clerk auth issues by generating OAuth URLs client-side
 */

'use client';

export interface OAuthConfig {
  integrationType: string;
  userId?: string;
  workspaceId?: string;
}

/**
 * Generate Google OAuth URL directly on client
 */
export function generateGoogleOAuthUrl(config: OAuthConfig): string {
  const { integrationType } = config;

  // Use the actual client ID from env (or fallback for development)
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '8590991268-hkdrl87qu1qk6698cb06mu6ije4cppml.apps.googleusercontent.com';
  const redirectUri = `${window.location.origin}/api/auth/oauth/google/callback`;

  // Generate state token
  const state = btoa(
    JSON.stringify({
      integrationType,
      timestamp: Date.now(),
      returnTo: window.location.pathname,
    }),
  );

  const scopes =
    integrationType === 'gmail'
      ? [
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ]
      : [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Initiate OAuth flow by redirecting to provider
 */
export function initiateOAuthFlow(integrationType: string): void {
  let authUrl: string;

  switch (integrationType) {
    case 'gmail':
    case 'google-calendar':
      authUrl = generateGoogleOAuthUrl({ integrationType });
      break;

    default:
      throw new Error(`OAuth not configured for ${integrationType}`);
  }

  // Redirect to OAuth provider
  window.location.href = authUrl;
}
