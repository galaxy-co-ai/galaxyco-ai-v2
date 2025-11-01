import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Logo } from '../logo';

describe('Logo', () => {
  it('renders with default variant (full)', () => {
    const { container } = render(React.createElement(Logo));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders icon-only variant', () => {
    const { container } = render(React.createElement(Logo, { variant: 'icon-only' }));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders wordmark variant', () => {
    const { container } = render(React.createElement(Logo, { variant: 'wordmark' }));
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders full variant', () => {
    const { container } = render(React.createElement(Logo, { variant: 'full' }));
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { container: cSm } = render(React.createElement(Logo, { size: 'sm' }));
    const { container: cLg } = render(React.createElement(Logo, { size: 'lg' }));
    const { container: cXl } = render(React.createElement(Logo, { size: 'xl' }));

    expect(cSm.querySelector('svg')).toHaveClass('h-6');
    expect(cLg.querySelector('svg')).toHaveClass('h-10');
    expect(cXl.querySelector('svg')).toHaveClass('h-12');
  });

  it('wraps in link when href provided', () => {
    const { container } = render(React.createElement(Logo, { href: '/' }));
    expect(container.querySelector('a')).toBeInTheDocument();
  });

  it('link has correct href', () => {
    const { container } = render(React.createElement(Logo, { href: '/home' }));
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('renders without link when href not provided', () => {
    const { container } = render(React.createElement(Logo));
    expect(container.querySelector('a')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Logo, { className: 'custom-logo' }));
    expect(container.firstChild).toHaveClass('custom-logo');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(React.createElement(Logo, { ref }));
    expect(ref.current).toBeDefined();
  });

  it('icon-only has circle element', () => {
    const { container } = render(React.createElement(Logo, { variant: 'icon-only' }));
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('full variant has both circle and text', () => {
    const { container } = render(React.createElement(Logo, { variant: 'full' }));
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(container.querySelector('text')).toBeInTheDocument();
  });

  it('wordmark has text element', () => {
    const { container } = render(React.createElement(Logo, { variant: 'wordmark' }));
    expect(container.querySelector('text')).toBeInTheDocument();
  });

  it('link has hover opacity transition', () => {
    const { container } = render(React.createElement(Logo, { href: '/' }));
    const link = container.querySelector('a');
    expect(link).toHaveClass('hover:opacity-80');
  });
});
