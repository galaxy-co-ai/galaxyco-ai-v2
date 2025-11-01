import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toaster } from '../toaster';
import * as useToastModule from '@/hooks/use-toast';

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Toaster', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty when no toasts', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({ toasts: [] } as any);
    const { container } = render(React.createElement(Toaster));
    expect(container.querySelector('[role="region"]')).toBeInTheDocument();
  });

  it('renders toast with title', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({
      toasts: [{ id: '1', title: 'Success' }],
    } as any);
    render(React.createElement(Toaster));
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders toast with description', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({
      toasts: [{ id: '1', title: 'Success', description: 'Operation completed' }],
    } as any);
    render(React.createElement(Toaster));
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({
      toasts: [
        { id: '1', title: 'First' },
        { id: '2', title: 'Second' },
      ],
    } as any);
    render(React.createElement(Toaster));
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders toast with action', () => {
    const actionElement = React.createElement('button', null, 'Undo');
    vi.mocked(useToastModule.useToast).mockReturnValue({
      toasts: [{ id: '1', title: 'Deleted', action: actionElement }],
    } as any);
    render(React.createElement(Toaster));
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('renders close button for each toast', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({
      toasts: [{ id: '1', title: 'Toast' }],
    } as any);
    const { container } = render(React.createElement(Toaster));
    expect(container.querySelector('[toast-close]')).toBeInTheDocument();
  });

  it('handles toasts with only title', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({
      toasts: [{ id: '1', title: 'Simple toast' }],
    } as any);
    render(React.createElement(Toaster));
    expect(screen.getByText('Simple toast')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders viewport', () => {
    vi.mocked(useToastModule.useToast).mockReturnValue({ toasts: [] } as any);
    const { container } = render(React.createElement(Toaster));
    const viewport = container.querySelector('[data-radix-toast-viewport]');
    // ToastViewport might render as an ol element with role="region"
    expect(viewport || container.querySelector('[role="region"]')).toBeInTheDocument();
  });
});
