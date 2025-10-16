# @galaxyco/ui

Shared React components and design system for GalaxyCo.ai v2.0.

## Purpose

Provides reusable UI components, hooks, and utilities shared across all applications. Built with React 18, TypeScript, and Tailwind CSS.

## Installation

Already included via workspace protocol:

```json
{
  "dependencies": {
    "@galaxyco/ui": "workspace:*"
  }
}
```

## Key Exports

### Components

- **`Button`** - Primary button component
- **`Input`** - Form input component
- **`Card`** - Card container component
- **`Modal`** - Modal dialog component
- **`Spinner`** - Loading spinner
- **`Alert`** - Alert/notification component

### Hooks

- **`useToast`** - Toast notifications
- **`useModal`** - Modal state management
- **`useForm`** - Form validation

### Utilities

- **`cn()`** - className utility (clsx + tailwind-merge)
- **`formatters`** - Common formatting functions

## Usage

```typescript
import { Button, Card, useToast } from '@galaxyco/ui';

function MyComponent() {
  const { toast } = useToast();

  return (
    <Card>
      <Button
        onClick={() => toast({ title: 'Success!' })}
      >
        Click Me
      </Button>
    </Card>
  );
}
```

## Development

```bash
pnpm dev          # Watch mode
pnpm build        # Build for production
pnpm typecheck    # Type check
```

## Styling

Uses Tailwind CSS with shared configuration. All components support:

- **Variants**: Different visual styles
- **Sizes**: sm, md, lg
- **Custom className**: Extend with additional classes

```typescript
<Button variant="primary" size="lg" className="custom-class">
  Button
</Button>
```

## Best Practices

1. **Use semantic components**:

   ```typescript
   <Card>  // ✅ Semantic
   <div className="...">  // ❌ Avoid raw divs
   ```

2. **Leverage hooks for state**:
   ```typescript
   const { toast } = useToast(); // ✅ Centralized
   const [show, setShow] = useState(false); // ❌ Duplicate logic
   ```

---

**Version**: 0.1.0  
**Maintained By**: GalaxyCo.ai Team
