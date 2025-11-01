'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-background text-foreground shadow-elevation-low',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-elevation-high">
        <Command
          className={cn(
            '[&_[cmdk-group-heading]]:px-spacing-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground-muted',
            '[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-spacing-sm',
            '[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5',
            '[&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-spacing-sm [&_[cmdk-item]]:py-spacing-sm',
            '[&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5',
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-border px-spacing-md py-spacing-xs"
    cmdk-input-wrapper=""
  >
    <Search className="mr-spacing-sm h-4 w-4 shrink-0 text-foreground-muted" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full bg-transparent py-spacing-sm text-body-sm text-foreground',
        'outline-none placeholder:text-foreground-subtle',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden py-spacing-xs', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-spacing-lg text-center text-body-sm text-foreground-muted"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-spacing-xs text-foreground',
      '[&_[cmdk-group-heading]]:px-spacing-sm [&_[cmdk-group-heading]]:py-spacing-xs',
      '[&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-medium',
      '[&_[cmdk-group-heading]]:text-foreground-muted [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-spacing-xs h-px bg-border my-spacing-xs', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-spacing-sm rounded-sm',
      'px-spacing-sm py-spacing-xs text-body-sm text-foreground outline-none',
      'transition-colors duration-fast',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      'data-[selected=true]:bg-hover data-[selected=true]:text-foreground',
      'hover:bg-hover hover:text-foreground',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground-muted',
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-caption font-mono tracking-wide text-foreground-subtle',
        'bg-background-subtle px-spacing-xs py-spacing-2xs rounded border border-border',
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
