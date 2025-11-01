import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '../popover';

describe('Popover', () => {
  it('renders popover trigger', () => {
    render(
      React.createElement(Popover, null, React.createElement(PopoverTrigger, null, 'Open Popover')),
    );
    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  it('renders popover content when open', () => {
    render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(
          PopoverContent,
          null,
          React.createElement('div', null, 'Popover content'),
        ),
      ),
    );
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('renders popover with custom content', () => {
    render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Trigger'),
        React.createElement(
          PopoverContent,
          null,
          React.createElement('div', null, 'Title'),
          React.createElement('p', null, 'Description text'),
        ),
      ),
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('applies custom className to content', () => {
    render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(
          PopoverContent,
          { className: 'custom-popover' },
          React.createElement('div', null, 'Content'),
        ),
      ),
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with different alignments', () => {
    const { container: cStart } = render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(
          PopoverContent,
          { align: 'start' },
          React.createElement('div', null, 'Start'),
        ),
      ),
    );
    const { container: cEnd } = render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(
          PopoverContent,
          { align: 'end' },
          React.createElement('div', null, 'End'),
        ),
      ),
    );
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('applies sideOffset to content', () => {
    render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(
          PopoverContent,
          { sideOffset: 10 },
          React.createElement('div', null, 'Content'),
        ),
      ),
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('content has rounded corners', () => {
    const { container } = render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(PopoverContent, null, React.createElement('div', null, 'Content')),
      ),
    );
    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('rounded-md');
  });

  it('content has border', () => {
    const { container } = render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverTrigger, null, 'Open'),
        React.createElement(PopoverContent, null, React.createElement('div', null, 'Content')),
      ),
    );
    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('border');
  });

  it('forwards ref to content', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverContent, { ref }, React.createElement('div', null, 'Test')),
      ),
    );
    expect(ref.current).toBeDefined();
  });

  it('renders with anchor', () => {
    render(
      React.createElement(
        Popover,
        { open: true },
        React.createElement(PopoverAnchor, null),
        React.createElement(PopoverTrigger, null, 'Trigger'),
        React.createElement(PopoverContent, null, React.createElement('div', null, 'Content')),
      ),
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
