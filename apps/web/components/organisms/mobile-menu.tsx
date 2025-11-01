'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface MobileMenuNavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export interface MobileMenuNavGroup {
  label?: string;
  items: MobileMenuNavItem[];
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navGroups: MobileMenuNavGroup[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navGroups,
  header,
  footer,
  className,
}) => {
  const handleNavClick = (item: MobileMenuNavItem) => {
    item.onClick?.();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className={cn('w-[280px] sm:w-[320px] p-0', className)}>
        {/* Header */}
        <SheetHeader className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            {header ? (
              <div className="flex-1">{header}</div>
            ) : (
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav aria-label="Mobile navigation">
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Group separator */}
                {groupIndex > 0 && <Separator className="my-2" />}

                {/* Group label */}
                {group.label && (
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </h3>
                  </div>
                )}

                {/* Nav items */}
                <ul className="space-y-1 px-2">
                  {group.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        onClick={() => handleNavClick(item)}
                        className={cn(
                          'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg',
                          'text-sm font-medium transition-colors duration-200',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                          item.isActive && 'bg-accent text-accent-foreground',
                        )}
                        aria-current={item.isActive ? 'page' : undefined}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.icon && (
                            <span className="flex-shrink-0 text-muted-foreground">{item.icon}</span>
                          )}
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={cn(
                              'flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full',
                              'bg-primary text-primary-foreground',
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        {footer && <div className="border-t border-border p-4">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
};

MobileMenu.displayName = 'MobileMenu';
