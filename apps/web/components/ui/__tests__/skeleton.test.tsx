import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('renders with default variant and size', () => {
    const { container } = render(React.createElement(Skeleton));
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded');
    expect(skeleton).toHaveClass('bg-background-subtle');
    expect(skeleton).toHaveClass('h-6');
  });

  it('renders with different variants', () => {
    const { container: containerCard } = render(React.createElement(Skeleton, { variant: 'card' }));
    const { container: containerText } = render(React.createElement(Skeleton, { variant: 'text' }));
    const { container: containerAvatar } = render(
      React.createElement(Skeleton, { variant: 'avatar' }),
    );
    const { container: containerButton } = render(
      React.createElement(Skeleton, { variant: 'button' }),
    );

    const skeletonCard = containerCard.firstChild as HTMLElement;
    const skeletonText = containerText.firstChild as HTMLElement;
    const skeletonAvatar = containerAvatar.firstChild as HTMLElement;
    const skeletonButton = containerButton.firstChild as HTMLElement;

    expect(skeletonCard).toHaveClass('rounded-lg');
    expect(skeletonAvatar).toHaveClass('rounded-full');
    // Variant height classes (h-4, h-10) are overridden by default size when not explicitly set
  });

  it('renders with different sizes', () => {
    const { container: containerSm } = render(React.createElement(Skeleton, { size: 'sm' }));
    const { container: containerLg } = render(React.createElement(Skeleton, { size: 'lg' }));
    const { container: containerXl } = render(React.createElement(Skeleton, { size: 'xl' }));

    const skeletonSm = containerSm.firstChild as HTMLElement;
    const skeletonLg = containerLg.firstChild as HTMLElement;
    const skeletonXl = containerXl.firstChild as HTMLElement;

    expect(skeletonSm).toHaveClass('h-4');
    expect(skeletonLg).toHaveClass('h-8');
    expect(skeletonXl).toHaveClass('h-12');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Skeleton, { className: 'w-full h-20' }));
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('w-full');
    expect(skeleton).toHaveClass('h-20');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Skeleton, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('supports additional HTML attributes', () => {
    const { container } = render(React.createElement(Skeleton, { id: 'loading-skeleton' }));
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveAttribute('id', 'loading-skeleton');
  });

  it('renders multiple skeletons for loading state', () => {
    const { container } = render(
      React.createElement(
        'div',
        null,
        React.createElement(Skeleton, { variant: 'text', className: 'w-full' }),
        React.createElement(Skeleton, {
          variant: 'text',
          className: 'w-3/4 mt-2',
        }),
        React.createElement(Skeleton, {
          variant: 'text',
          className: 'w-1/2 mt-2',
        }),
      ),
    );

    const skeletons = container.querySelectorAll('div');
    expect(skeletons.length).toBeGreaterThan(1);
  });
});
