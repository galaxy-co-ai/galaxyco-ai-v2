import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    const { container } = render(React.createElement(Checkbox));
    const checkbox = container.querySelector('button');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders checked when checked prop is true', () => {
    const { container } = render(React.createElement(Checkbox, { checked: true }));
    const checkbox = container.querySelector('button');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('toggles when clicked', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(React.createElement(Checkbox, { onCheckedChange }));
    const checkbox = container.querySelector('button') as HTMLButtonElement;

    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('can be disabled', () => {
    const { container } = render(React.createElement(Checkbox, { disabled: true }));
    const checkbox = container.querySelector('button');
    expect(checkbox).toBeDisabled();
  });

  it('renders with different sizes', () => {
    const { container: containerSm } = render(React.createElement(Checkbox, { size: 'sm' }));
    const { container: containerLg } = render(React.createElement(Checkbox, { size: 'lg' }));

    const checkboxSm = containerSm.querySelector('button');
    const checkboxLg = containerLg.querySelector('button');

    expect(checkboxSm).toHaveClass('h-4');
    expect(checkboxSm).toHaveClass('w-4');
    expect(checkboxLg).toHaveClass('h-6');
    expect(checkboxLg).toHaveClass('w-6');
  });

  it('renders with destructive variant', () => {
    const { container } = render(React.createElement(Checkbox, { variant: 'destructive' }));
    const checkbox = container.querySelector('button');
    expect(checkbox).toHaveClass('border-destructive');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Checkbox, { className: 'custom-class' }));
    const checkbox = container.querySelector('button');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(React.createElement(Checkbox, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(React.createElement(Checkbox, { 'aria-label': 'Accept terms' }));
    const checkbox = container.querySelector('button');
    expect(checkbox).toHaveAttribute('role', 'checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms');
  });

  it('shows check icon when checked', () => {
    const { container } = render(React.createElement(Checkbox, { checked: true }));
    // Check icon is rendered via Radix indicator
    const indicator = container.querySelector("span[data-state='checked']");
    expect(indicator).toBeInTheDocument();
  });

  it('handles controlled checkbox state', async () => {
    const ControlledCheckbox = () => {
      const [checked, setChecked] = React.useState<CheckedState>(false);
      return React.createElement(Checkbox, {
        checked,
        onCheckedChange: setChecked,
      });
    };

    const user = userEvent.setup();
    const { container } = render(React.createElement(ControlledCheckbox));
    const checkbox = container.querySelector('button') as HTMLButtonElement;

    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });
});
