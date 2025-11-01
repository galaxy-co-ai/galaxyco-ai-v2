import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Link } from '../link';

describe('Link', () => {
  it('renders internal link with Next.js Link', () => {
    const { container } = render(React.createElement(Link, { href: '/dashboard' }, 'Dashboard'));
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('renders external link with target blank', () => {
    const { container } = render(
      React.createElement(Link, { href: 'https://example.com', external: true }, 'External'),
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('detects http links as external', () => {
    const { container } = render(
      React.createElement(Link, { href: 'https://example.com' }, 'Example'),
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('detects mailto links as external', () => {
    const { container } = render(
      React.createElement(Link, { href: 'mailto:test@example.com' }, 'Email'),
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders with different variants', () => {
    const { container: containerPrimary } = render(
      React.createElement(Link, { href: '/test', variant: 'primary' }, 'Link'),
    );
    const { container: containerMuted } = render(
      React.createElement(Link, { href: '/test', variant: 'muted' }, 'Link'),
    );
    const { container: containerUnderline } = render(
      React.createElement(Link, { href: '/test', variant: 'underline' }, 'Link'),
    );

    expect(containerPrimary.querySelector('a')).toHaveClass('text-primary');
    expect(containerMuted.querySelector('a')).toHaveClass('text-foreground-muted');
    expect(containerUnderline.querySelector('a')).toHaveClass('underline');
  });

  it('renders with different sizes', () => {
    const { container: containerSm } = render(
      React.createElement(Link, { href: '/test', size: 'sm' }, 'Link'),
    );
    const { container: containerLg } = render(
      React.createElement(Link, { href: '/test', size: 'lg' }, 'Link'),
    );

    expect(containerSm.querySelector('a')).toHaveClass('text-sm');
    expect(containerLg.querySelector('a')).toHaveClass('text-lg');
  });

  it('renders as span when disabled', () => {
    const { container } = render(
      React.createElement(Link, { href: '/test', disabled: true }, 'Link'),
    );
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-disabled', 'true');
  });

  it('removes href when disabled on external link', () => {
    const { container } = render(
      React.createElement(Link, { href: 'https://example.com', disabled: true }, 'Link'),
    );
    const link = container.querySelector('a');
    expect(link).not.toHaveAttribute('href');
  });

  it('applies custom className', () => {
    const { container } = render(
      React.createElement(Link, { href: '/test', className: 'custom-link' }, 'Link'),
    );
    const link = container.querySelector('a');
    expect(link).toHaveClass('custom-link');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(React.createElement(Link, { href: '/test', ref }, 'Link'));
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
