/**
 * Connect Integration Button Component Tests
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConnectIntegrationButton } from '@/components/integrations/connect-integration-button';
import * as nangoClient from '@/lib/integrations/nango-client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/lib/integrations/nango-client', () => ({
  connectIntegration: vi.fn(),
  nangoClient: { openConnectUI: vi.fn() },
}));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ConnectIntegrationButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct label', () => {
    render(<ConnectIntegrationButton integrationId="gmail" />);
    expect(screen.getByText('Connect Gmail')).toBeInTheDocument();
  });

  it('should show loading state when connecting', async () => {
    // Mock a slow connection
    vi.mocked(nangoClient.connectIntegration).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(), 1000);
        }),
    );

    render(<ConnectIntegrationButton integrationId="slack" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
  });

  it('should call onSuccess callback when connection succeeds', async () => {
    const onSuccess = vi.fn();

    vi.mocked(nangoClient.connectIntegration).mockImplementation(async (_id, callbacks) => {
      callbacks?.onSuccess?.('connection-123');
    });

    render(<ConnectIntegrationButton integrationId="gmail" onSuccess={onSuccess} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('connection-123');
    });
  });

  it('should show error toast when connection fails', async () => {
    vi.mocked(nangoClient.connectIntegration).mockImplementation(async (_id, callbacks) => {
      callbacks?.onError?.('Connection failed');
    });

    render(<ConnectIntegrationButton integrationId="gmail" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Failed to connect'));
    });
  });

  it('should render different integration icons', () => {
    const { rerender } = render(<ConnectIntegrationButton integrationId="gmail" />);
    expect(screen.getByText('Connect Gmail')).toBeInTheDocument();

    rerender(<ConnectIntegrationButton integrationId="slack" />);
    expect(screen.getByText('Connect Slack')).toBeInTheDocument();

    rerender(<ConnectIntegrationButton integrationId="hubspot" />);
    expect(screen.getByText('Connect HubSpot')).toBeInTheDocument();
  });

  it('should support different button variants', () => {
    const { container, rerender } = render(
      <ConnectIntegrationButton integrationId="gmail" variant="outline" />,
    );
    expect(container.querySelector('button')).toHaveClass('border');

    rerender(<ConnectIntegrationButton integrationId="gmail" variant="ghost" />);
    expect(container.querySelector('button')).toHaveClass('hover:bg-accent');
  });

  it('should be disabled while connecting', async () => {
    vi.mocked(nangoClient.connectIntegration).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(), 1000);
        }),
    );

    render(<ConnectIntegrationButton integrationId="gmail" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});
