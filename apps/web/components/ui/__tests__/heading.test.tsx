import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Heading } from '../heading';

describe('Heading', () => {
  it('renders h2 by default', () => {
    const { container } = render(React.createElement(Heading, null, 'Test Heading'));
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toBe('Test Heading');
  });

  it('renders different heading levels', () => {
    const { container: c1 } = render(React.createElement(Heading, { level: 1 }, 'H1'));
    const { container: c3 } = render(React.createElement(Heading, { level: 3 }, 'H3'));
    const { container: c6 } = render(React.createElement(Heading, { level: 6 }, 'H6'));

    expect(c1.querySelector('h1')).toBeInTheDocument();
    expect(c3.querySelector('h3')).toBeInTheDocument();
    expect(c6.querySelector('h6')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { container: cXs } = render(React.createElement(Heading, { size: 'xs' }, 'XS'));
    const { container: cSm } = render(React.createElement(Heading, { size: 'sm' }, 'SM'));
    const { container: c2xl } = render(React.createElement(Heading, { size: '2xl' }, '2XL'));
    const { container: c5xl } = render(React.createElement(Heading, { size: '5xl' }, '5XL'));

    expect(cXs.firstChild).toHaveClass('text-xs');
    expect(cSm.firstChild).toHaveClass('text-sm');
    expect(c2xl.firstChild).toHaveClass('text-2xl');
    expect(c5xl.firstChild).toHaveClass('text-5xl');
  });

  it('renders different weights', () => {
    const { container: cNormal } = render(
      React.createElement(Heading, { weight: 'normal' }, 'Normal'),
    );
    const { container: cMedium } = render(
      React.createElement(Heading, { weight: 'medium' }, 'Medium'),
    );
    const { container: cBold } = render(React.createElement(Heading, { weight: 'bold' }, 'Bold'));

    expect(cNormal.firstChild).toHaveClass('font-normal');
    expect(cMedium.firstChild).toHaveClass('font-medium');
    expect(cBold.firstChild).toHaveClass('font-bold');
  });

  it("uses 'as' prop to override element", () => {
    const { container } = render(React.createElement(Heading, { level: 3, as: 'h1' }, 'Visual H1'));
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      React.createElement(Heading, { className: 'custom-heading' }, 'Custom'),
    );
    expect(container.firstChild).toHaveClass('custom-heading');
  });

  it('applies default semibold weight', () => {
    const { container } = render(React.createElement(Heading, null, 'Text'));
    expect(container.firstChild).toHaveClass('font-semibold');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(React.createElement(Heading, { ref }, 'Test'));
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});
