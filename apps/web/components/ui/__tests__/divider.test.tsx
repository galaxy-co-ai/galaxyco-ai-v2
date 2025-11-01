import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from '../divider';

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    const { container } = render(React.createElement(Divider));
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders vertical divider', () => {
    const { container } = render(React.createElement(Divider, { orientation: 'vertical' }));
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders horizontal divider with text', () => {
    const { container } = render(React.createElement(Divider, { text: 'OR' }));
    expect(container.textContent).toContain('OR');
  });

  it('text divider has left position', () => {
    const { container } = render(
      React.createElement(Divider, { text: 'Section', textPosition: 'left' }),
    );
    expect(container.textContent).toContain('Section');
  });

  it('text divider has right position', () => {
    const { container } = render(
      React.createElement(Divider, { text: 'End', textPosition: 'right' }),
    );
    expect(container.textContent).toContain('End');
  });

  it('text divider has center position by default', () => {
    const { container } = render(React.createElement(Divider, { text: 'Center' }));
    expect(container.textContent).toContain('Center');
  });

  it('horizontal divider has correct styling', () => {
    const { container } = render(React.createElement(Divider));
    const divider = container.firstChild;
    expect(divider).toHaveClass('bg-border');
  });

  it('vertical divider has correct styling', () => {
    const { container } = render(React.createElement(Divider, { orientation: 'vertical' }));
    const divider = container.firstChild;
    expect(divider).toHaveClass('w-px');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Divider, { className: 'custom-divider' }));
    expect(container.firstChild).toHaveClass('custom-divider');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Divider, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('text divider has aria-label', () => {
    const { container } = render(React.createElement(Divider, { text: 'Section A' }));
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toHaveAttribute('aria-label', 'Section A');
  });

  it('divider has separator role', () => {
    const { container } = render(React.createElement(Divider));
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toBeInTheDocument();
  });
});
