import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Kbd } from '../kbd';

describe('Kbd', () => {
  it('renders single key', () => {
    const { container } = render(React.createElement(Kbd, { keys: ['K'] }));
    const kbd = container.querySelector('kbd');
    expect(kbd).toBeInTheDocument();
    expect(kbd?.textContent).toContain('K');
  });

  it('renders multiple keys with separator', () => {
    const { container } = render(React.createElement(Kbd, { keys: ['cmd', 'k'] }));
    const kbd = container.querySelector('kbd');
    expect(kbd?.textContent).toMatch(/[⌘⌃]\+K/);
  });

  it('renders with custom separator', () => {
    const { container } = render(
      React.createElement(Kbd, {
        keys: ['ctrl', 'shift', 'p'],
        separator: ' ',
      }),
    );
    const kbd = container.querySelector('kbd');
    expect(kbd?.textContent).not.toContain('+');
  });

  it('converts special keys to symbols', () => {
    const { container: cCmd } = render(React.createElement(Kbd, { keys: ['cmd'] }));
    const { container: cShift } = render(React.createElement(Kbd, { keys: ['shift'] }));
    const { container: cEnter } = render(React.createElement(Kbd, { keys: ['enter'] }));

    expect(cCmd.textContent).toMatch(/[⌘⌃]/);
    expect(cShift.textContent).toContain('⇧');
    expect(cEnter.textContent).toContain('↵');
  });

  it('capitalizes regular keys', () => {
    const { container } = render(React.createElement(Kbd, { keys: ['a'] }));
    expect(container.textContent).toContain('A');
  });

  it('renders arrow keys', () => {
    const { container } = render(
      React.createElement(Kbd, { keys: ['up', 'down', 'left', 'right'] }),
    );
    const text = container.textContent || '';
    expect(text).toContain('↑');
    expect(text).toContain('↓');
    expect(text).toContain('←');
    expect(text).toContain('→');
  });

  it('renders with different variants', () => {
    const { container: cDefault } = render(
      React.createElement(Kbd, { keys: ['k'], variant: 'default' }),
    );
    const { container: cOutline } = render(
      React.createElement(Kbd, { keys: ['k'], variant: 'outline' }),
    );

    expect(cDefault.firstChild).toHaveClass('bg-muted');
    expect(cOutline.firstChild).toHaveClass('bg-background');
  });

  it('applies custom className', () => {
    const { container } = render(
      React.createElement(Kbd, { keys: ['k'], className: 'custom-kbd' }),
    );
    expect(container.firstChild).toHaveClass('custom-kbd');
  });

  it('renders with border', () => {
    const { container } = render(React.createElement(Kbd, { keys: ['k'] }));
    expect(container.firstChild).toHaveClass('border');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(React.createElement(Kbd, { keys: ['k'], ref }));
    expect(ref.current).toBeDefined();
  });
});
