import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../avatar';

describe('Avatar', () => {
  it('renders with image src and alt props', () => {
    const { container } = render(
      React.createElement(Avatar, {
        src: '/test-avatar.jpg',
        alt: 'Test User',
      }),
    );
    // Avatar component renders with image props
    // Image may not load in test environment but component should render
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toBeInTheDocument();
  });

  it('renders with fallback text', async () => {
    const { container } = render(React.createElement(Avatar, { fallback: 'JD' }));
    // Fallback appears after delay
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(container.textContent).toContain('JD');
  });

  it('uses first character of alt as fallback', async () => {
    const { container } = render(React.createElement(Avatar, { alt: 'John Doe' }));
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(container.textContent).toContain('J');
  });

  it('renders with circle variant by default', () => {
    const { container } = render(React.createElement(Avatar));
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('rounded-full');
  });

  it('renders with square variant', () => {
    const { container } = render(React.createElement(Avatar, { variant: 'square' }));
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('rounded-md');
  });

  it('renders with different sizes', () => {
    const { container: containerXs } = render(React.createElement(Avatar, { size: 'xs' }));
    const { container: containerSm } = render(React.createElement(Avatar, { size: 'sm' }));
    const { container: containerLg } = render(React.createElement(Avatar, { size: 'lg' }));
    const { container: containerXl } = render(React.createElement(Avatar, { size: 'xl' }));
    const { container: container2xl } = render(React.createElement(Avatar, { size: '2xl' }));

    const avatarXs = containerXs.firstChild as HTMLElement;
    const avatarSm = containerSm.firstChild as HTMLElement;
    const avatarLg = containerLg.firstChild as HTMLElement;
    const avatarXl = containerXl.firstChild as HTMLElement;
    const avatar2xl = container2xl.firstChild as HTMLElement;

    expect(avatarXs).toHaveClass('h-6');
    expect(avatarXs).toHaveClass('w-6');
    expect(avatarSm).toHaveClass('h-8');
    expect(avatarLg).toHaveClass('h-12');
    expect(avatarXl).toHaveClass('h-14');
    expect(avatar2xl).toHaveClass('h-16');
  });

  it('renders with online status', () => {
    const { container } = render(React.createElement(Avatar, { status: 'online' }));
    const statusDot = container.querySelector("span[aria-label='online']");
    expect(statusDot).toBeInTheDocument();
    expect(statusDot).toHaveClass('bg-success');
  });

  it('renders with offline status', () => {
    const { container } = render(React.createElement(Avatar, { status: 'offline' }));
    const statusDot = container.querySelector("span[aria-label='offline']");
    expect(statusDot).toBeInTheDocument();
    expect(statusDot).toHaveClass('bg-foreground-subtle');
  });

  it('renders with busy status', () => {
    const { container } = render(React.createElement(Avatar, { status: 'busy' }));
    const statusDot = container.querySelector("span[aria-label='busy']");
    expect(statusDot).toBeInTheDocument();
    expect(statusDot).toHaveClass('bg-destructive');
  });

  it('renders with away status', () => {
    const { container } = render(React.createElement(Avatar, { status: 'away' }));
    const statusDot = container.querySelector("span[aria-label='away']");
    expect(statusDot).toBeInTheDocument();
    expect(statusDot).toHaveClass('bg-warning');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Avatar, { className: 'custom-avatar' }));
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('custom-avatar');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(React.createElement(Avatar, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders status dot with correct size for avatar size', () => {
    const { container } = render(React.createElement(Avatar, { size: 'lg', status: 'online' }));
    const statusDot = container.querySelector("span[aria-label='online']");
    expect(statusDot).toHaveClass('h-3');
  });

  it('uses question mark as default fallback', async () => {
    const { container } = render(React.createElement(Avatar));
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(container.textContent).toContain('?');
  });
});
