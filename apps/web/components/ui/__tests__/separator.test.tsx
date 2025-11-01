import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from '../separator';

describe('Separator', () => {
  it('renders as hr element', () => {
    const { container } = render(React.createElement(Separator));
    const separator = container.querySelector('hr');
    expect(separator).toBeInTheDocument();
  });

  it('renders with default styling', () => {
    const { container } = render(React.createElement(Separator));
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('my-spacing-xs');
    expect(separator).toHaveClass('h-px');
    expect(separator).toHaveClass('w-full');
    expect(separator).toHaveClass('bg-border');
    expect(separator).toHaveClass('border-0');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Separator, { className: 'my-4' }));
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('my-4');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHRElement>();
    render(React.createElement(Separator, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });

  it('supports additional HTML attributes', () => {
    const { container } = render(React.createElement(Separator, { id: 'custom-separator' }));
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveAttribute('id', 'custom-separator');
  });

  it('can override default spacing with className', () => {
    const { container } = render(React.createElement(Separator, { className: 'my-8' }));
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('my-8');
  });
});
