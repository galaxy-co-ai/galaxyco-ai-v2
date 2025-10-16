# V0 Prompt: Marketplace Agent Card

**Component**: Compact marketplace agent card (OpenSea-inspired)  
**Use this prompt**: Copy to V0.dev to generate production code

---

## 📋 V0.dev Prompt

```
Create a compact marketplace agent card component for a SaaS platform.

TECH STACK:
- React + TypeScript
- Tailwind CSS
- shadcn/ui components where applicable
- Lucide React icons
- Next.js 14 compatible

COMPONENT DETAILS:
Name: MarketplaceAgentCard
Props interface:
{
  agent: {
    id: string
    name: string
    category: string
    description: string
    price: string | "Free"
    rating: number (1-5)
    totalRuns: number
    successRate: number
    creator: string
    avatarGradient: { from: string, to: string }
  }
  onViewDetails: () => void
  onDeploy: () => void
}

VISUAL DESIGN:
- Card: white background, rounded-lg (8px), border border-gray-200
- Compact size: fits 4-5 cards per row on desktop
- Hover: subtle border color change to indigo-500, slight shadow elevation

LAYOUT (top to bottom):
1. Agent avatar (48px circular, gradient background matching avatarGradient prop)
2. Agent name (font-semibold, text-gray-900)
3. Category badge (small pill, bg-primary-50, text-primary-700)
4. Description (2 lines max, text-sm, text-gray-600, truncate with ellipsis)
5. Stats row (2 columns):
   - Left: {totalRuns} runs
   - Right: {successRate}% success
   (text-xs, text-gray-500)
6. Price row:
   - Left: price/month or "Free"
   - Right: rating stars (gold for filled, gray for empty)
7. Action buttons (full width):
   - "View Details" (secondary: border, hover:bg-gray-50)
   - "Deploy" (primary: bg-indigo-600, text-white, hover:bg-indigo-700)

SPACING:
- Card padding: p-4
- Internal spacing: gap-2 to gap-3 (compact feel)
- Button row: mt-4

RESPONSIVE:
- Mobile (< 640px): 1 column, full width
- Tablet (640-1024px): 2 columns
- Desktop (1024-1536px): 4 columns
- Large (> 1536px): 5 columns

INTERACTIONS:
- Hover card: border changes to indigo-500, shadow-md → shadow-lg
- Click anywhere on card: calls onViewDetails
- Click "Deploy" button: calls onDeploy (stops propagation)

ACCESSIBILITY:
- Semantic HTML (article, h3, button)
- Proper ARIA labels
- Keyboard navigation support
- Focus visible states

STYLE INSPIRATION:
- Similar to OpenSea NFT cards (compact, grid-friendly)
- Vercel dashboard aesthetics (clean, minimal)
- Enterprise-professional feel

Please generate the complete TypeScript component with:
1. Proper imports
2. Interface definitions
3. Component implementation
4. Export statement

Make it production-ready with proper TypeScript types and accessible markup.
```

---

## 🎯 Expected Output

V0 will generate something like:

```tsx
import { Star } from "lucide-react";

interface MarketplaceAgentCardProps {
  agent: {
    id: string;
    name: string;
    category: string;
    description: string;
    price: string | "Free";
    rating: number;
    totalRuns: number;
    successRate: number;
    creator: string;
    avatarGradient: { from: string; to: string };
  };
  onViewDetails: () => void;
  onDeploy: () => void;
}

export function MarketplaceAgentCard({
  agent,
  onViewDetails,
  onDeploy,
}: MarketplaceAgentCardProps) {
  // [V0 will generate the rest]
}
```

---

## 🔄 After Generation

### **Step 1: Copy to your project**

```bash
# Create or replace file
/c/Users/Owner/workspace/galaxyco-ai-2.0/apps/web/components/marketplace/MarketplaceAgentCard.tsx
```

### **Step 2: Test it**

```tsx
// In your marketplace page
import { MarketplaceAgentCard } from '@/components/marketplace/MarketplaceAgentCard'

const mockAgent = {
  id: '1',
  name: 'Email Agent',
  category: 'Automation',
  description: 'Automatically processes and responds to customer emails using AI.',
  price: '$49',
  rating: 4.8,
  totalRuns: 1247,
  successRate: 98,
  creator: 'GalaxyCo',
  avatarGradient: { from: '#6366F1', to: '#06B6D4' }
}

<MarketplaceAgentCard
  agent={mockAgent}
  onViewDetails={() => console.log('View details')}
  onDeploy={() => console.log('Deploy')}
/>
```

### **Step 3: If tweaks needed**

Go back to V0 chat and say:

- "Make the description 1 line instead of 2"
- "Remove the rating stars, just show as text"
- "Add a 'Popular' badge for top agents"

V0 will update the code instantly.

---

## 💡 Pro Tips for This Component

### **Make it reusable**

```tsx
// Support optional props for flexibility
interface MarketplaceAgentCardProps {
  agent: Agent;
  onViewDetails: () => void;
  onDeploy?: () => void; // Optional for view-only mode
  compact?: boolean; // Ultra-compact variant
  featured?: boolean; // Highlight featured agents
}
```

### **Add loading state**

```tsx
export function MarketplaceAgentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-12 w-12 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        {/* More skeleton elements */}
      </div>
    </div>
  );
}
```

### **Add to design system doc**

After it works, add pattern to `docs/DESIGN_SYSTEM_FOUNDATION.md`:

```markdown
### Marketplace Card Pattern

[Screenshot of the card]
[Link to component file]
Use this pattern for: marketplace, agent discovery, template browsing
```

---

## 📊 Time Comparison

### **Old way (manual coding):**

- Design in browser: 1 hour
- Tweak CSS: 2 hours
- Responsive fixes: 1 hour
- Testing: 30 min
- **Total: 4.5 hours**

### **New way (Figma + V0):**

- Design in Figma (or use Untitled UI): 20 min
- Generate with V0: 5 min
- Copy to project: 5 min
- Minor tweaks: 10 min
- **Total: 40 minutes**

**Time saved: 3 hours 50 minutes per component**

---

## ✅ Next Steps

1. ✅ Copy this prompt to V0.dev
2. ✅ Generate the component
3. ✅ Replace your current `MarketplaceAgentCard.tsx`
4. ✅ Test on localhost
5. ✅ Commit with proper message:
   ```bash
   git add components/marketplace/MarketplaceAgentCard.tsx
   git commit -m "feat(web): redesign marketplace card using V0 - compact OpenSea style"
   ```

---

**Want me to create prompts for your other struggling components? (Dashboard cards, stat cards, etc.)**
