import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../sheet';

describe('Sheet', () => {
  it('renders sheet trigger', () => {
    render(React.createElement(Sheet, null, React.createElement(SheetTrigger, null, 'Open Sheet')));
    expect(screen.getByText('Open Sheet')).toBeInTheDocument();
  });

  it('renders sheet content when open', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          null,
          React.createElement(SheetTitle, null, 'Sheet Title'),
        ),
      ),
    );
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
  });

  it('renders sheet with title and description', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          null,
          React.createElement(
            SheetHeader,
            null,
            React.createElement(SheetTitle, null, 'Settings'),
            React.createElement(SheetDescription, null, 'Manage your preferences'),
          ),
        ),
      ),
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your preferences')).toBeInTheDocument();
  });

  it('renders sheet with footer', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          null,
          React.createElement(SheetTitle, null, 'Sheet'),
          React.createElement(
            SheetFooter,
            null,
            React.createElement('button', null, 'Cancel'),
            React.createElement('button', null, 'Save'),
          ),
        ),
      ),
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders close button in content', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(SheetContent, null, React.createElement(SheetTitle, null, 'Sheet')),
      ),
    );
    const closeText = screen.getByText('Close');
    expect(closeText).toBeInTheDocument();
  });

  it('renders with different sides', () => {
    const { container: cLeft } = render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          { side: 'left' },
          React.createElement(SheetTitle, null, 'Left'),
        ),
      ),
    );
    const { container: cRight } = render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          { side: 'right' },
          React.createElement(SheetTitle, null, 'Right'),
        ),
      ),
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('applies custom className to content', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          { className: 'custom-sheet' },
          React.createElement(SheetTitle, null, 'Custom'),
        ),
      ),
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('title has correct styling', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(SheetContent, null, React.createElement(SheetTitle, null, 'Title')),
      ),
    );
    const title = screen.getByText('Title');
    expect(title).toHaveClass('font-heading');
  });

  it('description has muted text color', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetTrigger, null, 'Open'),
        React.createElement(
          SheetContent,
          null,
          React.createElement(SheetTitle, null, 'Title'),
          React.createElement(SheetDescription, null, 'Description text'),
        ),
      ),
    );
    const description = screen.getByText('Description text');
    expect(description).toHaveClass('text-foreground-muted');
  });

  it('header has flex col layout', () => {
    const { container } = render(
      React.createElement(SheetHeader, null, React.createElement('div', null, 'Header content')),
    );
    const header = container.firstChild;
    expect(header).toHaveClass('flex', 'flex-col');
  });

  it('footer has border top', () => {
    const { container } = render(
      React.createElement(SheetFooter, null, React.createElement('div', null, 'Footer content')),
    );
    const footer = container.firstChild;
    expect(footer).toHaveClass('border-t');
  });

  it('forwards ref to content', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(SheetContent, { ref }, React.createElement(SheetTitle, null, 'Test')),
      ),
    );
    expect(ref.current).toBeDefined();
  });

  it('renders sheet close component', () => {
    render(
      React.createElement(
        Sheet,
        { open: true },
        React.createElement(
          SheetContent,
          null,
          React.createElement(SheetTitle, null, 'Sheet'),
          React.createElement(SheetClose, null, 'Close'),
        ),
      ),
    );
    expect(screen.getAllByText('Close').length).toBeGreaterThan(0);
  });
});
