/**
 * GalaxyCo.ai Design System - Atomic Components Barrel Export
 *
 * All 30 atomic components organized by category:
 * - Typography (5): Heading, Text, Caption, Code, Link
 * - Forms (8): Button, Input, Checkbox, Switch, Textarea, Radio, Label, Form components
 * - Indicators (9): Badge, Tag, Spinner, Progress, ProgressBar, Dot, StatusIndicator, Skeleton, Toast
 * - Media (4): Icon, Avatar, Logo, Image
 * - Interactive (4): Tooltip, Kbd, Popover, Dropdown
 * - Layout (3): Card, Separator, Divider
 */

// ============================================
// TYPOGRAPHY COMPONENTS (5)
// ============================================
export { Heading, headingVariants, type HeadingProps } from './heading';
export { Text, textVariants, type TextProps } from './text';
export { Caption, captionVariants, type CaptionProps } from './caption';
export { Code, codeVariants, type CodeProps } from './code';
export { Link, linkVariants, type LinkProps } from './link';

// ============================================
// FORM COMPONENTS (8)
// ============================================
export { Button, buttonVariants, type ButtonProps } from './button';
export { Input, inputVariants, type InputProps } from './input';
export { Checkbox, checkboxVariants, type CheckboxProps } from './checkbox';
export { Switch, switchVariants, type SwitchProps } from './switch';
export { Textarea, textareaVariants, type TextareaProps } from './textarea';
export { Label } from './label';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { FormField } from './form-field';

// ============================================
// INDICATOR COMPONENTS (9)
// ============================================
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Tag, tagVariants, type TagProps } from './tag';
export { Spinner, spinnerVariants, type SpinnerProps } from './spinner';
export { Progress } from './progress';
export { ProgressBar, progressBarVariants, type ProgressBarProps } from './progress-bar';
export { Dot, dotVariants, type DotProps } from './dot';
export {
  StatusIndicator,
  statusIndicatorVariants,
  type StatusIndicatorProps,
} from './status-indicator';
export { Skeleton } from './skeleton';
export { Toaster } from './toaster';
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
} from './toast';

// ============================================
// MEDIA COMPONENTS (4)
// ============================================
export { Icon, iconVariants, type IconProps } from './icon';
export { Avatar, avatarVariants, type AvatarProps } from './avatar';
export { Logo, logoVariants, type LogoProps } from './logo';
export { Image, imageVariants, type ImageProps } from './image';

// ============================================
// INTERACTIVE COMPONENTS (4)
// ============================================
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export { Kbd, kbdVariants, KEY_SYMBOLS, type KbdProps } from './kbd';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

// ============================================
// LAYOUT COMPONENTS (3)
// ============================================
export { Card, CardContent, CardFooter, CardHeader } from './card';
export { Separator } from './separator';
export { Divider, dividerVariants, type DividerProps } from './divider';

// ============================================
// ADDITIONAL UI PRIMITIVES
// ============================================
export { Sheet, SheetContent, SheetTrigger } from './sheet';
export { Dialog, DialogContent, DialogTrigger } from './dialog';
export { Select } from './select';
export { Command } from './command';
export { EmptyState } from './empty-state';
