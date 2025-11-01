import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Star } from 'lucide-react';
import { Tag } from '../tag';

describe('Tag', () => {
  it('renders with text', () => {
    render(React.createElement(Tag, null, 'Design'));
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { container: cDefault } = render(
      React.createElement(Tag, { variant: 'default' }, 'Default'),
    );
    const { container: cPrimary } = render(
      React.createElement(Tag, { variant: 'primary' }, 'Primary'),
    );
    const { container: cSuccess } = render(
      React.createElement(Tag, { variant: 'success' }, 'Success'),
    );
    const { container: cWarning } = render(
      React.createElement(Tag, { variant: 'warning' }, 'Warning'),
    );
    const { container: cDestructive } = render(
      React.createElement(Tag, { variant: 'destructive' }, 'Destructive'),
    );

    expect(cDefault.firstChild).toHaveClass('bg-background-subtle');
    expect(cPrimary.firstChild).toHaveClass('bg-primary/10');
    expect(cSuccess.firstChild).toHaveClass('bg-success/10');
    expect(cWarning.firstChild).toHaveClass('bg-warning/10');
    expect(cDestructive.firstChild).toHaveClass('bg-destructive/10');
  });

  it('renders with different sizes', () => {
    const { container: cSm } = render(React.createElement(Tag, { size: 'sm' }, 'Small'));
    const { container: cDefault } = render(
      React.createElement(Tag, { size: 'default' }, 'Default'),
    );
    const { container: cLg } = render(React.createElement(Tag, { size: 'lg' }, 'Large'));

    expect(cSm.firstChild).toHaveClass('px-2');
    expect(cDefault.firstChild).toHaveClass('px-2.5');
    expect(cLg.firstChild).toHaveClass('px-3');
  });

  it('renders with icon', () => {
    const { container } = render(
      React.createElement(
        Tag,
        { icon: React.createElement(Star, { className: 'test-icon' }) },
        'Featured',
      ),
    );
    expect(container.querySelector('.test-icon')).toBeInTheDocument();
  });

  it('renders remove button when removable', () => {
    const { container } = render(React.createElement(Tag, { removable: true }, 'Removable'));
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Remove tag');
  });

  it('calls onRemove when remove button clicked', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(Tag, { removable: true, onRemove }, 'Removable'),
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    await user.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not render remove button when not removable', () => {
    const { container } = render(React.createElement(Tag, { removable: false }, 'Tag'));
    const button = container.querySelector('button');
    expect(button).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Tag, { className: 'custom-tag' }, 'Custom'));
    expect(container.firstChild).toHaveClass('custom-tag');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(React.createElement(Tag, { ref }, 'Test'));
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has rounded-full class', () => {
    const { container } = render(React.createElement(Tag, null, 'Tag'));
    expect(container.firstChild).toHaveClass('rounded-full');
  });
});
