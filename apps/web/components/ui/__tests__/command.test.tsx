import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../command';

describe('Command', () => {
  it('renders command container', () => {
    const { container } = render(React.createElement(Command));
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with command input', () => {
    render(
      React.createElement(
        Command,
        null,
        React.createElement(CommandInput, { placeholder: 'Search...' }),
      ),
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders command list', () => {
    const { container } = render(
      React.createElement(Command, null, React.createElement(CommandList, null, 'Content')),
    );
    expect(container.querySelector('[cmdk-list]')).toBeInTheDocument();
  });

  it('renders command empty state', () => {
    render(
      React.createElement(
        Command,
        null,
        React.createElement(
          CommandList,
          null,
          React.createElement(CommandEmpty, null, 'No results found'),
        ),
      ),
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders command groups', () => {
    render(
      React.createElement(
        Command,
        null,
        React.createElement(
          CommandList,
          null,
          React.createElement(
            CommandGroup,
            { heading: 'Suggestions' },
            React.createElement(CommandItem, null, 'Item 1'),
          ),
        ),
      ),
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders command items', () => {
    render(
      React.createElement(
        Command,
        null,
        React.createElement(
          CommandList,
          null,
          React.createElement(CommandItem, null, 'Calendar'),
          React.createElement(CommandItem, null, 'Search'),
        ),
      ),
    );
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders command separator', () => {
    const { container } = render(
      React.createElement(
        Command,
        null,
        React.createElement(
          CommandList,
          null,
          React.createElement(CommandItem, null, 'Item 1'),
          React.createElement(CommandSeparator),
          React.createElement(CommandItem, null, 'Item 2'),
        ),
      ),
    );
    expect(container.querySelector('[cmdk-separator]')).toBeInTheDocument();
  });

  it('renders command shortcut', () => {
    render(
      React.createElement(
        Command,
        null,
        React.createElement(
          CommandList,
          null,
          React.createElement(
            CommandItem,
            null,
            'Search',
            React.createElement(CommandShortcut, null, '⌘K'),
          ),
        ),
      ),
    );
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('command input has search icon', () => {
    const { container } = render(
      React.createElement(
        Command,
        null,
        React.createElement(CommandInput, { placeholder: 'Search' }),
      ),
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom className to command', () => {
    const { container } = render(React.createElement(Command, { className: 'custom-command' }));
    expect(container.firstChild).toHaveClass('custom-command');
  });

  it('applies custom className to command input', () => {
    const { container } = render(
      React.createElement(
        Command,
        null,
        React.createElement(CommandInput, { className: 'custom-input' }),
      ),
    );
    expect(container.querySelector('input')).toHaveClass('custom-input');
  });

  it('command list has overflow-y-auto', () => {
    const { container } = render(
      React.createElement(Command, null, React.createElement(CommandList, null, 'Content')),
    );
    expect(container.querySelector('[cmdk-list]')).toHaveClass('overflow-y-auto');
  });

  it('command empty has centered text', () => {
    const { container } = render(
      React.createElement(
        Command,
        null,
        React.createElement(CommandList, null, React.createElement(CommandEmpty, null, 'Empty')),
      ),
    );
    expect(container.querySelector('[cmdk-empty]')).toHaveClass('text-center');
  });

  it('command shortcut has monospace font', () => {
    const { container } = render(React.createElement(CommandShortcut, null, 'Ctrl+K'));
    expect(container.firstChild).toHaveClass('font-mono');
  });

  it('forwards ref to command', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Command, { ref }));
    expect(ref.current).toBeDefined();
  });
});
