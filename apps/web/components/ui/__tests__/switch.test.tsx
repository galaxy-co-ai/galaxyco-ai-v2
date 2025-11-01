import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../switch';

describe('Switch', () => {
  it('renders unchecked by default', () => {
    const { container } = render(React.createElement(Switch));
    const switchButton = container.querySelector('button');
    expect(switchButton).toBeInTheDocument();
    expect(switchButton).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders checked when checked prop is true', () => {
    const { container } = render(React.createElement(Switch, { checked: true }));
    const switchButton = container.querySelector('button');
    expect(switchButton).toHaveAttribute('data-state', 'checked');
  });

  it('toggles when clicked', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(React.createElement(Switch, { onCheckedChange }));
    const switchButton = container.querySelector('button') as HTMLButtonElement;

    await user.click(switchButton);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('can be disabled', () => {
    const { container } = render(React.createElement(Switch, { disabled: true }));
    const switchButton = container.querySelector('button');
    expect(switchButton).toBeDisabled();
  });

  it('renders with different sizes', () => {
    const { container: containerSm } = render(React.createElement(Switch, { size: 'sm' }));
    const { container: containerLg } = render(React.createElement(Switch, { size: 'lg' }));

    const switchSm = containerSm.querySelector('button');
    const switchLg = containerLg.querySelector('button');

    expect(switchSm).toHaveClass('h-5');
    expect(switchSm).toHaveClass('w-9');
    expect(switchLg).toHaveClass('h-7');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Switch, { className: 'custom-class' }));
    const switchButton = container.querySelector('button');
    expect(switchButton).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(React.createElement(Switch, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      React.createElement(Switch, { 'aria-label': 'Toggle notifications' }),
    );
    const switchButton = container.querySelector('button');
    expect(switchButton).toHaveAttribute('role', 'switch');
    expect(switchButton).toHaveAttribute('aria-label', 'Toggle notifications');
  });

  it('renders thumb element', () => {
    const { container } = render(React.createElement(Switch));
    const thumb = container.querySelector('span[data-state]');
    expect(thumb).toBeInTheDocument();
  });

  it('handles controlled switch state', async () => {
    const ControlledSwitch = () => {
      const [checked, setChecked] = React.useState(false);
      return React.createElement(Switch, {
        checked,
        onCheckedChange: setChecked,
      });
    };

    const user = userEvent.setup();
    const { container } = render(React.createElement(ControlledSwitch));
    const switchButton = container.querySelector('button') as HTMLButtonElement;

    expect(switchButton).toHaveAttribute('data-state', 'unchecked');
    await user.click(switchButton);
    expect(switchButton).toHaveAttribute('data-state', 'checked');
    await user.click(switchButton);
    expect(switchButton).toHaveAttribute('data-state', 'unchecked');
  });

  it('applies checked styling', () => {
    const { container } = render(React.createElement(Switch, { checked: true }));
    const switchButton = container.querySelector('button');
    expect(switchButton).toHaveClass('data-[state=checked]:bg-primary');
  });

  it('applies unchecked styling', () => {
    const { container } = render(React.createElement(Switch, { checked: false }));
    const switchButton = container.querySelector('button');
    expect(switchButton).toHaveClass('data-[state=unchecked]:bg-input');
  });
});
