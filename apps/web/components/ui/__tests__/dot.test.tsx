import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Dot } from '../dot';

describe('Dot', () => {
  it('renders dot', () => {
    const { container } = render(React.createElement(Dot));
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { container: cDefault } = render(React.createElement(Dot, { variant: 'default' }));
    const { container: cPrimary } = render(React.createElement(Dot, { variant: 'primary' }));
    const { container: cSuccess } = render(React.createElement(Dot, { variant: 'success' }));
    const { container: cWarning } = render(React.createElement(Dot, { variant: 'warning' }));
    const { container: cDestructive } = render(
      React.createElement(Dot, { variant: 'destructive' }),
    );

    expect(cDefault.firstChild).toHaveClass('bg-foreground-muted');
    expect(cPrimary.firstChild).toHaveClass('bg-primary');
    expect(cSuccess.firstChild).toHaveClass('bg-success');
    expect(cWarning.firstChild).toHaveClass('bg-warning');
    expect(cDestructive.firstChild).toHaveClass('bg-destructive');
  });

  it('renders with different sizes', () => {
    const { container: cXs } = render(React.createElement(Dot, { size: 'xs' }));
    const { container: cSm } = render(React.createElement(Dot, { size: 'sm' }));
    const { container: cDefault } = render(React.createElement(Dot, { size: 'default' }));
    const { container: cLg } = render(React.createElement(Dot, { size: 'lg' }));

    expect(cXs.firstChild).toHaveClass('h-1.5');
    expect(cSm.firstChild).toHaveClass('h-2');
    expect(cDefault.firstChild).toHaveClass('h-2.5');
    expect(cLg.firstChild).toHaveClass('h-3');
  });

  it('applies pulse animation', () => {
    const { container } = render(React.createElement(Dot, { pulse: true }));
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('does not pulse by default', () => {
    const { container } = render(React.createElement(Dot));
    expect(container.firstChild).not.toHaveClass('animate-pulse');
  });

  it('has aria-hidden when no label', () => {
    const { container } = render(React.createElement(Dot));
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has status role when label is provided', () => {
    const { container } = render(React.createElement(Dot, { label: 'Active' }));
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });

  it('has aria-label when label is provided', () => {
    const { container } = render(React.createElement(Dot, { label: 'Important' }));
    expect(container.firstChild).toHaveAttribute('aria-label', 'Important');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Dot, { className: 'custom-dot' }));
    expect(container.firstChild).toHaveClass('custom-dot');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(React.createElement(Dot, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has rounded-full class', () => {
    const { container } = render(React.createElement(Dot));
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('primary variant has primary color', () => {
    const { container } = render(React.createElement(Dot, { variant: 'primary' }));
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('success variant has success color', () => {
    const { container } = render(React.createElement(Dot, { variant: 'success' }));
    expect(container.firstChild).toHaveClass('bg-success');
  });
});
