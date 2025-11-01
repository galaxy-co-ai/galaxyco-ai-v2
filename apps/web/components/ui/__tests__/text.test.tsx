import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Text } from '../text';

describe('Text', () => {
  it('renders p element by default', () => {
    const { container } = render(React.createElement(Text, null, 'Test text'));
    const p = container.querySelector('p');
    expect(p).toBeInTheDocument();
    expect(p?.textContent).toBe('Test text');
  });

  it("renders different elements with 'as' prop", () => {
    const { container: cSpan } = render(React.createElement(Text, { as: 'span' }, 'Span'));
    const { container: cDiv } = render(React.createElement(Text, { as: 'div' }, 'Div'));
    const { container: cLabel } = render(React.createElement(Text, { as: 'label' }, 'Label'));

    expect(cSpan.querySelector('span')).toBeInTheDocument();
    expect(cDiv.querySelector('div')).toBeInTheDocument();
    expect(cLabel.querySelector('label')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { container: cBody } = render(React.createElement(Text, { variant: 'body' }, 'Body'));
    const { container: cMuted } = render(React.createElement(Text, { variant: 'muted' }, 'Muted'));
    const { container: cSubtle } = render(
      React.createElement(Text, { variant: 'subtle' }, 'Subtle'),
    );
    const { container: cAccent } = render(
      React.createElement(Text, { variant: 'accent' }, 'Accent'),
    );
    const { container: cSuccess } = render(
      React.createElement(Text, { variant: 'success' }, 'Success'),
    );
    const { container: cWarning } = render(
      React.createElement(Text, { variant: 'warning' }, 'Warning'),
    );
    const { container: cError } = render(React.createElement(Text, { variant: 'error' }, 'Error'));

    expect(cBody.firstChild).toHaveClass('text-foreground');
    expect(cMuted.firstChild).toHaveClass('text-foreground-muted');
    expect(cSubtle.firstChild).toHaveClass('text-foreground-subtle');
    expect(cAccent.firstChild).toHaveClass('text-primary');
    expect(cSuccess.firstChild).toHaveClass('text-success');
    expect(cWarning.firstChild).toHaveClass('text-warning');
    expect(cError.firstChild).toHaveClass('text-destructive');
  });

  it('renders different sizes', () => {
    const { container: cXs } = render(React.createElement(Text, { size: 'xs' }, 'XS'));
    const { container: cSm } = render(React.createElement(Text, { size: 'sm' }, 'SM'));
    const { container: cBase } = render(React.createElement(Text, { size: 'base' }, 'Base'));
    const { container: cLg } = render(React.createElement(Text, { size: 'lg' }, 'LG'));

    expect(cXs.firstChild).toHaveClass('text-xs');
    expect(cSm.firstChild).toHaveClass('text-sm');
    expect(cBase.firstChild).toHaveClass('text-base');
    expect(cLg.firstChild).toHaveClass('text-lg');
  });

  it('renders different weights', () => {
    const { container: cNormal } = render(
      React.createElement(Text, { weight: 'normal' }, 'Normal'),
    );
    const { container: cMedium } = render(
      React.createElement(Text, { weight: 'medium' }, 'Medium'),
    );
    const { container: cBold } = render(React.createElement(Text, { weight: 'bold' }, 'Bold'));

    expect(cNormal.firstChild).toHaveClass('font-normal');
    expect(cMedium.firstChild).toHaveClass('font-medium');
    expect(cBold.firstChild).toHaveClass('font-bold');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Text, { className: 'custom-text' }, 'Custom'));
    expect(container.firstChild).toHaveClass('custom-text');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(React.createElement(Text, { ref }, 'Test'));
    expect(ref.current).toBeDefined();
  });
});
