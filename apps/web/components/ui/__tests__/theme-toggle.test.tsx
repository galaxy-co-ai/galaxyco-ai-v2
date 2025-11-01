import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeToggle } from '../theme-toggle';

// Mock next-themes
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button or placeholder with consistent sizing', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    const { container } = render(React.createElement(ThemeToggle));

    // Should render either placeholder div or button with correct sizing
    const element = container.querySelector('.w-10.h-10.rounded-lg');
    expect(element).toBeInTheDocument();
  });

  it('renders button after mount', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('shows correct aria-label for light theme', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
    });
  });

  it('shows correct aria-label for dark theme', async () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
    });
  });

  it('toggles from light to dark on click', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light on click', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders Sun icon with correct classes for light theme', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    const { container } = render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const sunIcon = container.querySelector('svg.text-amber-500');
    expect(sunIcon).toBeInTheDocument();
    expect(sunIcon).toHaveClass('rotate-0', 'scale-100', 'opacity-100');
  });

  it('renders Moon icon with correct classes for dark theme', async () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    const { container } = render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const moonIcon = container.querySelector('svg.text-slate-400');
    expect(moonIcon).toBeInTheDocument();
    expect(moonIcon).toHaveClass('rotate-0', 'scale-100', 'opacity-100');
  });

  it('hides Sun icon in dark theme', async () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    const { container } = render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const sunIcon = container.querySelector('svg.text-amber-500');
    expect(sunIcon).toHaveClass('rotate-90', 'scale-0', 'opacity-0');
  });

  it('hides Moon icon in light theme', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    const { container } = render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const moonIcon = container.querySelector('svg.text-slate-400');
    expect(moonIcon).toHaveClass('-rotate-90', 'scale-0', 'opacity-0');
  });

  it('has transition classes for smooth animation', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    const { container } = render(React.createElement(ThemeToggle));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const icons = container.querySelectorAll('svg');
    icons.forEach((icon) => {
      expect(icon).toHaveClass('transition-all', 'duration-200');
    });
  });

  it('button has hover and transition styles', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all', 'duration-200');
      expect(button.className).toMatch(/hover:bg-neutral-100/);
    });
  });

  it('renders with correct sizing', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-10', 'h-10');
    });
  });

  it('renders with border and rounded corners', async () => {
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(React.createElement(ThemeToggle));

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-lg', 'border');
    });
  });
});
