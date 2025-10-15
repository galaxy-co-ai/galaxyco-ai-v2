# New Component Development Guide

**Use this pattern when rebuilding UI from wireframes**

## Quick Start Template

```typescript
// apps/web/components/v2/[section]/ComponentName.tsx

"use client"; // Only if component needs interactivity

import { useState } from "react"; // Only import what you need
import { Icon } from "lucide-react";

interface ComponentNameProps {
  title: string;
  value: number;
  onAction?: () => void;
}

/**
 * ComponentName - Brief description
 * 
 * @example
 * <ComponentName title="Users" value={42} onAction={handleClick} />
 */
export function ComponentName({ title, value, onAction }: ComponentNameProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <article className="bg-white rounded-lg p-6 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon size={20} className="text-gray-400" />
      </header>
      
      <p className="text-3xl font-bold">{value}</p>
      
      {onAction && (
        <button 
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Take Action
        </button>
      )}
    </article>
  );
}
```

## File Organization

```
apps/web/components/v2/
├── dashboard/
│   ├── StatsCard.tsx
│   ├── AgentGrid.tsx
│   └── ActivityFeed.tsx
├── agents/
│   ├── AgentCard.tsx
│   ├── AgentForm.tsx
│   └── TestPanel.tsx
├── marketplace/
│   ├── TemplateCard.tsx
│   ├── CategoryFilter.tsx
│   └── SearchBar.tsx
├── knowledge/
│   ├── DocumentCard.tsx
│   ├── CollectionList.tsx
│   └── UploadModal.tsx
└── shared/
    ├── EmptyState.tsx
    ├── LoadingSpinner.tsx
    └── ErrorBoundary.tsx
```

## Styling Guidelines

### ✅ DO: Use Tailwind utility classes
```tsx
<div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600 mt-2">Description</p>
</div>
```

### ✅ DO: Use semantic HTML
```tsx
<article className="...">
  <header className="...">
    <h3>Title</h3>
  </header>
  <section className="...">
    Content
  </section>
  <footer className="...">
    Actions
  </footer>
</article>
```

### ✅ DO: Use conditional classes
```tsx
<button 
  className={`px-4 py-2 rounded-lg transition-colors ${
    isActive 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`}
>
  {label}
</button>
```

### ❌ DON'T: Import design-system constants
```tsx
// ❌ BAD
import { colors, spacing } from '@/lib/constants/design-system';

<div style={{ color: colors.text.primary, padding: spacing.md }}>
```

### ❌ DON'T: Use inline styles (unless dynamic)
```tsx
// ❌ BAD
<div style={{ padding: "16px", color: "#111827" }}>

// ✅ GOOD
<div className="p-4 text-gray-900">

// ✅ GOOD (dynamic value)
<div style={{ width: `${percentage}%` }} className="h-2 bg-blue-500">
```

### ❌ DON'T: Create giant components
```tsx
// ❌ BAD - 500 lines in one component
export function AgentBuilder() {
  // Massive component with everything
}

// ✅ GOOD - Break into smaller pieces
export function AgentBuilder() {
  return (
    <>
      <AgentBasicInfo />
      <AgentConfiguration />
      <AgentTesting />
    </>
  );
}
```

## Color Palette

Use these Tailwind colors consistently:

### Primary (Blue)
- `bg-blue-50` - Very light backgrounds
- `bg-blue-500` - Primary buttons, links
- `bg-blue-600` - Button hover
- `text-blue-500` - Links, accents

### Neutral (Gray)
- `bg-white` - Cards, containers
- `bg-gray-50` - Light backgrounds
- `bg-gray-100` - Disabled states
- `text-gray-900` - Primary text
- `text-gray-600` - Secondary text
- `text-gray-400` - Tertiary text, icons
- `border-gray-200` - Borders, dividers

### Semantic
- `bg-green-50` / `text-green-700` - Success
- `bg-yellow-50` / `text-yellow-700` - Warning
- `bg-red-50` / `text-red-700` - Error
- `bg-blue-50` / `text-blue-700` - Info

## Common Patterns

### Loading State
```tsx
export function ComponentWithLoading({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return <ActualContent data={data} />;
}
```

### Empty State
```tsx
export function EmptyState({ title, message, action }: Props) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🚀</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          {action.label}
        </button>
      )}
    </div>
  );
}
```

### Error State
```tsx
export function ErrorState({ error, retry }: Props) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">{error.message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

### Card Pattern
```tsx
export function Card({ children, className = "" }: Props) {
  return (
    <article className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {children}
    </article>
  );
}

// Usage
<Card>
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-gray-600">Content</p>
</Card>
```

### Modal Pattern
```tsx
export function Modal({ isOpen, onClose, title, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Accessibility

### Always Include:
- ✅ Semantic HTML (`<article>`, `<nav>`, `<button>`)
- ✅ ARIA labels for icons: `<Icon aria-label="Close" />`
- ✅ Focus states: `focus:ring-2 focus:ring-blue-500`
- ✅ Keyboard navigation: `onKeyDown` handlers
- ✅ Alt text for images
- ✅ Proper heading hierarchy (h1 → h2 → h3)

### Example:
```tsx
<button
  onClick={handleClick}
  className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  aria-label="Delete item"
>
  <TrashIcon size={20} />
</button>
```

## Performance

### Use React.memo for expensive components
```tsx
export const ExpensiveList = React.memo(function ExpensiveList({ items }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});
```

### Lazy load heavy components
```tsx
const HeavyChart = lazy(() => import('./HeavyChart'));

export function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

## Testing

### Component Test Template
```tsx
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with title', () => {
    render(<ComponentName title="Test" value={42} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const handleAction = jest.fn();
    render(<ComponentName title="Test" value={42} onAction={handleAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
```

## Documentation

### Add JSDoc comments
```tsx
/**
 * AgentCard displays agent information in a compact card format
 * 
 * @param agent - Agent data including name, status, and stats
 * @param onToggle - Callback when agent is toggled on/off
 * @param onDelete - Optional callback for delete action
 * 
 * @example
 * ```tsx
 * <AgentCard 
 *   agent={myAgent} 
 *   onToggle={handleToggle}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function AgentCard({ agent, onToggle, onDelete }: Props) {
  // ...
}
```

## Migration Checklist

When rebuilding a component from the legacy codebase:

- [ ] Review old component's functionality
- [ ] Design approved from wireframes
- [ ] Create new component in `/components/v2/`
- [ ] Use semantic HTML
- [ ] Use Tailwind classes only
- [ ] Add loading state
- [ ] Add empty state
- [ ] Add error state
- [ ] Add JSDoc comments
- [ ] Test on mobile
- [ ] Test keyboard navigation
- [ ] Test screen reader
- [ ] Update imports in pages
- [ ] Remove old component file
- [ ] Verify no broken imports
- [ ] Smoke test the feature

## Common Mistakes to Avoid

### ❌ Over-nesting divs
```tsx
// BAD
<div>
  <div>
    <div>
      <div>Content</div>
    </div>
  </div>
</div>

// GOOD
<article className="p-4">
  Content
</article>
```

### ❌ Inconsistent spacing
```tsx
// BAD
<div className="mb-3">
<div className="mb-4">
<div className="mb-5">

// GOOD - Use consistent scale (4, 8, 12, 16, 24, 32)
<div className="mb-2">  {/* 8px */}
<div className="mb-4">  {/* 16px */}
<div className="mb-6">  {/* 24px */}
```

### ❌ Magic numbers
```tsx
// BAD
<div style={{ width: '347px', height: '123px' }}>

// GOOD
<div className="w-full max-w-sm h-32">
```

### ❌ Unclear prop names
```tsx
// BAD
<Component data={x} fn={y} flag={z} />

// GOOD
<Component items={items} onSubmit={handleSubmit} isLoading={isLoading} />
```

## Resources

- **Tailwind Docs:** https://tailwindcss.com/docs
- **Pico CSS:** https://picocss.com
- **React Patterns:** https://reactpatterns.com
- **Accessibility:** https://www.a11yproject.com
- **Testing Library:** https://testing-library.com/react

---

**Remember:** Simple, semantic, accessible. That's the goal!
