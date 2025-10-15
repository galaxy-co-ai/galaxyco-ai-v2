# UI Rebuild Plan

**Status:** Planning Phase  
**Target:** Q1 2025  
**Approach:** Complete rebuild from wireframes

## Overview

All current UI components will be rebuilt from scratch based on final wireframes and layout designs. The current codebase serves as a functional prototype while the new UI is being designed.

## Current State

### ✅ Already Cleaned
- **Dashboard components** (AgentCard, AgentFilters, AgentGrid, ProgressTracker)
  - Migrated as reference/pattern
  - Will still be replaced in rebuild
- **Mock/demo data** removed from marketplace and dashboard
- **Design system** simplified (Pico CSS + Tailwind)

### 🔄 Legacy Components (To Be Replaced)
These components use the old design-system stub and will be completely rebuilt:

**Agents (12 files):**
- AdvancedSettings.tsx
- AgentBuilderPage.tsx
- AgentCard.tsx
- AgentListCard.tsx
- BasicInfoForm.tsx
- ConfigurationForm.tsx
- KnowledgeConfigSection.tsx
- PublishConfirmationModal.tsx
- TemplateCard.tsx
- TemplateLibrary.tsx
- TestPanel.tsx
- TestPanelImproved.tsx

**Marketplace (9 files):**
- AgentPackCard.tsx
- AgentTemplateCard.tsx
- CategoryChips.tsx
- MarketplaceCategories.tsx
- MarketplaceFeatured.tsx
- MarketplaceHero.tsx
- MarketplacePacks.tsx
- SearchBar.tsx
- TokenCard.tsx

**Knowledge (6 files):**
- CollectionsSidebar.tsx
- CreateCollectionModal.tsx
- EmptyState.tsx
- ItemDetailModal.tsx
- KnowledgeItemCard.tsx
- SearchFilterBar.tsx

**Layout/Settings/Other (10 files):**
- RequireWorkspace.tsx
- WorkspaceSelect.tsx
- ApiKeyManager.tsx
- OnboardingWizard.tsx
- ProductTour.tsx
- error-boundary.tsx
- settings/page.tsx
- agents/[id]/page.tsx
- marketplace/[category]/page.tsx

## Rebuild Priorities

### Phase 1: Foundation (Week 1-2)
**Goal:** Core navigation and layout structure

1. **New Layout System**
   - `/app/layout.tsx` - Root layout with Pico + Tailwind
   - `/components/layout/Header.tsx` - Top navigation
   - `/components/layout/Sidebar.tsx` - Side navigation
   - `/components/layout/Container.tsx` - Page container

2. **Design System v2**
   - `/lib/design-system-v2/` folder
   - Color palette (from wireframes)
   - Typography scale
   - Spacing system
   - Component patterns

### Phase 2: Dashboard (Week 3)
**Goal:** Main landing page with agent overview

1. Dashboard page (`/dashboard`)
2. Stats cards
3. Agent grid (new design)
4. Activity feed
5. Quick actions

### Phase 3: Agent Management (Week 4-5)
**Goal:** Create, view, and configure agents

1. Agent list page (`/agents`)
2. Agent detail page (`/agents/[id]`)
3. Agent builder flow (`/agents/create`)
   - Basic info step
   - Configuration step
   - Knowledge base step
   - Testing step
   - Publishing step

### Phase 4: Marketplace (Week 6)
**Goal:** Browse and install agent templates

1. Marketplace home (`/marketplace`)
2. Category pages (`/marketplace/[category]`)
3. Agent template detail
4. Installation flow
5. Rating/review system

### Phase 5: Knowledge Base (Week 7)
**Goal:** Upload and manage documents

1. Knowledge home (`/knowledge`)
2. Collection management
3. Document upload
4. Search interface
5. Preview/detail modals

### Phase 6: Settings & Account (Week 8)
**Goal:** User settings and workspace config

1. Settings page (`/settings`)
2. API key management
3. Workspace settings
4. Billing/usage
5. Team management

### Phase 7: Polish & Optimization (Week 9-10)
**Goal:** Final touches and performance

1. Loading states
2. Error boundaries
3. Empty states
4. Animations
5. Mobile responsive
6. Performance optimization
7. Accessibility audit

## Component Patterns for Rebuild

### File Structure
```
components/
├── v2/                    # New components
│   ├── dashboard/
│   ├── agents/
│   ├── marketplace/
│   ├── knowledge/
│   └── settings/
├── ui/                    # Shadcn components (keep)
└── [legacy]/              # Old components (ignore)
```

### Naming Convention
- Prefix new components with location: `Dashboard-`, `Agent-`, etc.
- Use semantic names: `AgentCard`, not `Card3`
- Group related components in folders

### Code Style
```typescript
// ✅ NEW PATTERN
export function DashboardStatsCard({ title, value }: Props) {
  return (
    <article className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </article>
  );
}

// ❌ OLD PATTERN (don't do this)
import { colors, spacing } from '@/lib/constants/design-system';

export function Card() {
  return (
    <div style={{ background: colors.background.primary, padding: spacing.lg }}>
      ...
    </div>
  );
}
```

## Migration Strategy

### Option A: Parallel Development
- Build new UI in `/app/v2/` routes
- Keep old UI running
- Switch routes when ready
- Zero downtime

### Option B: Page-by-Page Replacement
- Replace one page at a time
- Test thoroughly before moving to next
- Gradual rollout
- Can mix old/new pages temporarily

**Recommended:** Option A for major pages, Option B for minor pages

## Testing Strategy

### Before Replacing Each Page:
- [ ] Design approved from wireframes
- [ ] Component built and tested
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility checked
- [ ] Loading/error states implemented
- [ ] Empty states designed
- [ ] Smoke test all user flows
- [ ] Performance measured

## Rollback Plan

If new UI has issues:
```bash
# Revert to old component
git revert <commit-hash>

# Or temporarily route to old page
# In app/routing.ts
export const routes = {
  dashboard: USE_V2 ? '/v2/dashboard' : '/dashboard'
}
```

## Documentation Requirements

For each rebuilt page, document:
1. **Purpose** - What this page does
2. **User flows** - How users navigate
3. **Components** - What components are used
4. **State management** - How data flows
5. **API calls** - What endpoints are hit
6. **Edge cases** - Error/loading/empty states

## Success Metrics

### Code Quality
- Zero design-system imports
- < 200 lines per component
- 100% TypeScript coverage
- Accessibility score > 95

### Performance
- Lighthouse score > 90
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1

### User Experience
- Mobile responsive
- Keyboard navigable
- Screen reader friendly
- Fast page transitions

## Current Temporary State

**All legacy components still work** via the design-system stub in:
- `apps/web/lib/constants/design-system.ts`

This stub provides fallback values so old components don't break while we rebuild. Once a component is rebuilt, remove its legacy version entirely.

## Questions to Answer Before Starting

1. **Wireframe finalization** - When will designs be ready?
2. **Color palette** - What's the exact brand colors?
3. **Typography** - What fonts? (Currently using Pico defaults)
4. **Spacing** - 4px or 8px grid?
5. **Component library** - Keep Shadcn or switch?
6. **Animation** - What level of motion?
7. **Dark mode** - Support it from day 1?

## Resources

- Wireframes: `docs/wireframes.md`
- Design tokens: `lib/design-system-v2/tokens.ts` (to be created)
- Component library: [Shadcn UI](https://ui.shadcn.com)
- CSS framework: [Pico CSS](https://picocss.com)
- Utility classes: [Tailwind CSS](https://tailwindcss.com)

---

**Last Updated:** January 2025  
**Next Review:** After wireframes finalized
