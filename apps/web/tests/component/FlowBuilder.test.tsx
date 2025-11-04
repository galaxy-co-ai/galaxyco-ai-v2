/**
 * Component Tests for FlowBuilder
 *
 * Tests React component behavior, user interactions, and state management
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FlowBuilder } from '@/components/galaxy/flows/FlowBuilder';

// Mock fetch
global.fetch = vi.fn();

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Create test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('FlowBuilder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input panel initially', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Describe Your Workflow')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Example:/i)).toBeInTheDocument();
    expect(screen.getByText('Generate Workflow')).toBeInTheDocument();
  });

  it('should accept text input', async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Email new leads every Monday');

    expect(textarea).toHaveValue('Email new leads every Monday');
  });

  it('should disable generate button when input is empty', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    const button = screen.getByText('Generate Workflow');
    expect(button).toBeDisabled();
  });

  it('should enable generate button when input has text', async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');

    const button = screen.getByText('Generate Workflow');
    expect(button).not.toBeDisabled();
  });

  it('should show loading state when generating', async () => {
    const user = userEvent.setup();

    // Mock slow API response
    (global.fetch as any).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  flow: {
                    name: 'Test',
                    description: 'Test workflow',
                    nodes: [
                      { id: 'n1', type: 'start', label: 'Start', position: { x: 0, y: 0 } },
                      { id: 'n2', type: 'end', label: 'End', position: { x: 200, y: 0 } },
                    ],
                    edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
                  },
                }),
              }),
            100,
          ),
        ),
    );

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');

    const button = screen.getByText('Generate Workflow');
    await user.click(button);

    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('should call onSave callback when saving', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    // Mock successful API response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        flow: {
          name: 'Test Workflow',
          description: 'Test',
          nodes: [
            { id: 'n1', type: 'start', label: 'Start', position: { x: 0, y: 0 } },
            { id: 'n2', type: 'end', label: 'End', position: { x: 200, y: 0 } },
          ],
          edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        },
      }),
    });

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" onSave={onSave} />
      </QueryClientProvider>,
    );

    // Generate workflow
    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');
    await user.click(screen.getByText('Generate Workflow'));

    // Wait for workflow to generate
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    // Click save
    await user.click(screen.getByText('Save'));

    // Verify callback was called
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(String),
          nodes: expect.any(Array),
          edges: expect.any(Array),
        }),
      );
    });
  });

  it('should call onExecute callback when executing', async () => {
    const onExecute = vi.fn();
    const user = userEvent.setup();

    // Mock successful API response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        flow: {
          name: 'Test Workflow',
          description: 'Test',
          nodes: [
            { id: 'n1', type: 'start', label: 'Start', position: { x: 0, y: 0 } },
            { id: 'n2', type: 'end', label: 'End', position: { x: 200, y: 0 } },
          ],
          edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        },
      }),
    });

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" onExecute={onExecute} />
      </QueryClientProvider>,
    );

    // Generate workflow
    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');
    await user.click(screen.getByText('Generate Workflow'));

    // Wait for workflow to generate
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument();
    });

    // Click execute
    await user.click(screen.getByText('Execute'));

    // Verify callback was called
    await waitFor(() => {
      expect(onExecute).toHaveBeenCalledWith(
        expect.objectContaining({
          nodes: expect.any(Array),
          edges: expect.any(Array),
        }),
      );
    });
  });

  it('should reset workflow when clicking reset', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        flow: {
          name: 'Test Workflow',
          description: 'Test',
          nodes: [
            { id: 'n1', type: 'start', label: 'Start', position: { x: 0, y: 0 } },
            { id: 'n2', type: 'end', label: 'End', position: { x: 200, y: 0 } },
          ],
          edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        },
      }),
    });

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    // Generate workflow
    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');
    await user.click(screen.getByText('Generate Workflow'));

    // Wait for workflow
    await waitFor(() => {
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    // Click reset
    await user.click(screen.getByText('Reset'));

    // Should show input panel again
    expect(screen.getByText('Describe Your Workflow')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();

    // Mock API error
    (global.fetch as any).mockRejectedValue(new Error('API Error'));

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');
    await user.click(screen.getByText('Generate Workflow'));

    // Should show error toast (mocked)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should support keyboard shortcuts', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        flow: {
          name: 'Test Workflow',
          description: 'Test',
          nodes: [{ id: 'n1', type: 'start', label: 'Start', position: { x: 0, y: 0 } }],
          edges: [],
        },
      }),
    });

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <FlowBuilder workspaceId="test-workspace" />
      </QueryClientProvider>,
    );

    const textarea = screen.getByPlaceholderText(/Example:/i);
    await user.type(textarea, 'Test workflow');

    // Press Cmd/Ctrl + Enter
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      code: 'Enter',
      metaKey: true,
    });

    // Should trigger generation
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
