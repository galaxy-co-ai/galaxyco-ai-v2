/**
 * Session Token API Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/integrations/session-token/route';
import * as nangoServer from '@/lib/integrations/nango-server';

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock('@/lib/integrations/nango-server');

describe('Session Token API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unauthorized without auth', async () => {
    const { auth } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new Request('http://localhost:3000/api/integrations/session-token', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should create session token for authenticated user', async () => {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(currentUser).mockResolvedValue({
      id: 'user-123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      fullName: 'Test User',
    } as any);

    vi.mocked(nangoServer.nangoServer.createConnectSession).mockResolvedValue({
      data: { token: 'session_token_123' },
    } as any);

    const request = new Request('http://localhost:3000/api/integrations/session-token', {
      method: 'POST',
      body: JSON.stringify({
        allowedIntegrations: ['gmail', 'slack'],
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sessionToken).toBe('session_token_123');
  });

  it('should handle missing allowedIntegrations', async () => {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(currentUser).mockResolvedValue({
      id: 'user-123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      fullName: 'Test User',
    } as any);

    vi.mocked(nangoServer.nangoServer.createConnectSession).mockResolvedValue({
      data: { token: 'session_token_123' },
    } as any);

    const request = new Request('http://localhost:3000/api/integrations/session-token', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sessionToken).toBeDefined();

    // Should default to all integrations
    const mockCall = vi.mocked(nangoServer.nangoServer.createConnectSession).mock.calls[0][0];
    expect(mockCall.allowed_integrations).toContain('gmail');
    expect(mockCall.allowed_integrations).toContain('slack');
    expect(mockCall.allowed_integrations).toContain('hubspot');
  });

  it('should validate allowedIntegrations type', async () => {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(currentUser).mockResolvedValue({
      id: 'user-123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      fullName: 'Test User',
    } as any);

    const request = new Request('http://localhost:3000/api/integrations/session-token', {
      method: 'POST',
      body: JSON.stringify({
        allowedIntegrations: 'gmail', // Should be array
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('must be an array');
  });

  it('should handle session creation errors', async () => {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(currentUser).mockResolvedValue({
      id: 'user-123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      fullName: 'Test User',
    } as any);

    vi.mocked(nangoServer.nangoServer.createConnectSession).mockRejectedValue(
      new Error('Nango API error'),
    );

    const request = new Request('http://localhost:3000/api/integrations/session-token', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Nango API error');
  });
});
