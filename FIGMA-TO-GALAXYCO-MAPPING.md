# 🗺️ Figma Design → GalaxyCo.ai Component Mapping

**How to use the extracted Figma components in your actual GalaxyCo project**

---

## 📊 Dashboard Page Mapping

### Current GalaxyCo Dashboard
**Location:** `apps/web/app/(app)/dashboard/page.tsx`

### Figma Dashboard Components
**Location:** `project-extracted/pages/Dashboard.tsx`

### Direct Replacements

| GalaxyCo Current | Figma Component | Benefits |
|-----------------|----------------|----------|
| Dashboard header | `Dashboard` header section | Better typography, spacing |
| Stats/KPIs | `DashboardStats.tsx` | Animated gradient pills |
| Agent list | `AgentStatusCard.tsx` | Status badges, pulse animations |
| Activity/logs | `ActivityFeed.tsx` | Timeline design, status dots |
| Workflows | `WorkflowVisualizer.tsx` | Visual node-based diagram |
| Quick actions | Floating toolbar | Glassy blur effect |

---

## 🤖 Agent Components Mapping

### 1. Agent Status Display

**Figma:** `components/AgentStatusCard.tsx`  
**Use in GalaxyCo:** `apps/web/app/(app)/agents/page.tsx`

```typescript
// Replace current agent cards with:
<AgentStatusCard
  name={agent.name}
  description={agent.description}
  status={agent.status} // "active" | "idle" | "processing"
  icon={Bot}
  tasksToday={agent.tasksCompleted}
  color="bg-gradient-to-br from-purple-500/10 to-blue-500/10"
/>
```

**What you get:**
- ✅ Animated status badges
- ✅ Pulse effect for processing
- ✅ Better visual hierarchy
- ✅ Hover states with elevation

---

### 2. Activity Feed

**Figma:** `components/ActivityFeed.tsx`  
**Use in GalaxyCo:** Dashboard sidebar or dedicated activity page

```typescript
// Add to dashboard for real-time updates
<ActivityFeed />

// Customize with your data:
const activities = useAgentActivity(); // Your Zustand store
```

**What you get:**
- ✅ Timeline visualization
- ✅ Status color coding
- ✅ Scrollable container
- ✅ Last activity timestamps

---

## 🎨 UI Component Upgrades

### Stats Pills (Top Priority!)

**Figma:** Dashboard stats section  
**Use in GalaxyCo:** Any page with KPIs

```typescript
// Current: Basic stat cards
// Upgrade to: Gradient pills with icons

<Badge 
  variant="outline" 
  className="h-8 px-4 rounded-full border-0 
             bg-gradient-to-br from-blue-500/10 to-blue-500/20 
             text-blue-600 
             shadow-[0_2px_10px_rgb(59,130,246,0.15)] 
             hover:shadow-[0_4px_20px_rgb(59,130,246,0.25)] 
             transition-all"
>
  <Bot className="h-3.5 w-3.5 mr-2" />
  <span className="text-xs">{value} {label}</span>
</Badge>
```

**Perfect for:**
- Dashboard metrics
- Agent counts
- Task completion
- Success rates
- Any numeric KPI

---

### Floating Toolbar

**Figma:** Dashboard floating toolbar  
**Use in GalaxyCo:** Global quick actions

```typescript
// Add floating toolbar for quick access
<div className="bg-background/80 backdrop-blur-lg 
                border border-border rounded-full 
                shadow-[0_8px_30px_rgb(0,0,0,0.08)] 
                px-3 py-2 flex items-center gap-1">
  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
    <Plus className="h-4 w-4" />
  </Button>
  {/* More actions... */}
</div>
```

**Perfect for:**
- Create new agent
- Access knowledge base
- Manage integrations
- Quick search
- AI assistant toggle

---

## 🎯 Workflow Builder Mapping

### Visual Workflow Visualizer

**Figma:** `components/WorkflowVisualizer.tsx` + Dialog in `Dashboard.tsx`  
**Use in GalaxyCo:** `apps/web/app/(app)/workflows/page.tsx`

**Key Features to Copy:**
1. **Canvas with dot grid background**
   ```typescript
   style={{
     backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)",
     backgroundSize: "24px 24px",
   }}
   ```

2. **Node design**
   - 80px × 80px cards
   - Gradient backgrounds by type
   - Drop shadows
   - Hover scale effect

3. **Connectors**
   - SVG lines between nodes
   - Dashed stroke
   - Animated on hover

**Replace:**
- Current workflow list → Visual canvas
- Text-based flow → Node diagrams
- Static view → Interactive builder

---

## 🔌 Integration Pages

### Integration Marketplace

**Figma:** Integrations dialog in `Dashboard.tsx`  
**Use in GalaxyCo:** `apps/web/app/(app)/integrations/page.tsx`

**Features to adopt:**
1. **Search bar** with icon
2. **Category filters** (badges)
3. **Grid layout** (responsive)
4. **Connected badge** (green with checkmark)
5. **Gradient icon containers**

```typescript
// Per integration card:
<Card className="p-5 rounded-xl border-0 
                 shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                 hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)]">
  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
    <integration.icon className="h-6 w-6 text-white" />
  </div>
  {/* ... */}
</Card>
```

**Data structure matches GalaxyCo needs:**
```typescript
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  connected: boolean;
  color: string; // Gradient class
}
```

---

## 🎨 Design Token Integration

### Step 1: Merge Color System

**File:** `project-extracted/styles/globals.css`

```bash
# Add to your existing globals.css
# These tokens are production-ready:

:root {
  --background: #ffffff
  --foreground: oklch(0.145 0 0)
  --muted-foreground: #717182
  --border: rgba(0, 0, 0, 0.1)
  --radius: 0.625rem
  /* ... */
}
```

### Step 2: Use Status Colors

```typescript
// Active agents
className="bg-green-500/10 text-green-600"

// Processing
className="bg-blue-500/10 text-blue-600"

// Idle
className="bg-gray-500/10 text-gray-600"

// Error
className="bg-red-500/10 text-red-600"
```

### Step 3: Apply Shadow System

```typescript
// Card elevation
className="shadow-[0_4px_20px_rgb(0,0,0,0.04)]"

// Hover state
className="hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)]"

// Floating elements
className="shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
```

---

## 📱 Responsive Design Patterns

### Grid Layouts

```typescript
// Stats pills
className="flex items-center gap-3 flex-wrap"

// Agent cards
className="grid gap-6 lg:grid-cols-2"

// Integration marketplace
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Main content
className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🚀 Quick Wins (Do These First!)

### 1. Upgrade Dashboard Stats (15 min)
Copy the gradient pill design from Figma dashboard → Your dashboard

**Impact:** ⭐⭐⭐⭐⭐  
**Effort:** ⚡ (Very Easy)

### 2. Add Status Badges (10 min)
Replace text status → Animated badges with dots

**Impact:** ⭐⭐⭐⭐  
**Effort:** ⚡ (Very Easy)

### 3. Improve Card Shadows (5 min)
Update shadow classes to match Figma system

**Impact:** ⭐⭐⭐  
**Effort:** ⚡ (Very Easy)

### 4. Add Activity Timeline (30 min)
Copy `ActivityFeed.tsx` → Connect to your data

**Impact:** ⭐⭐⭐⭐⭐  
**Effort:** ⚡⚡ (Easy)

### 5. Implement Workflow Visualizer (1 hour)
Copy workflow dialog → Adapt for your flows

**Impact:** ⭐⭐⭐⭐⭐  
**Effort:** ⚡⚡⚡ (Medium)

---

## 🔄 Component Migration Strategy

### Phase 1: Drop-in Replacements (Low Risk)
1. ✅ Color tokens (globals.css)
2. ✅ Shadow system (utility classes)
3. ✅ Status badges (simple components)
4. ✅ Stats pills (Badge component)

### Phase 2: New Components (Medium Risk)
1. ⚠️ ActivityFeed (need data connection)
2. ⚠️ AgentStatusCard (replace existing cards)
3. ⚠️ DashboardStats (integrate with data)
4. ⚠️ Floating toolbar (new feature)

### Phase 3: Complex Features (Higher Risk)
1. 🔥 WorkflowVisualizer (major feature)
2. 🔥 Integration marketplace (new page)
3. 🔥 Full dashboard redesign
4. 🔥 Visual flow builder

---

## 📊 Component Reusability Matrix

| Component | GalaxyCo Pages | Reusability | Customization Needed |
|-----------|---------------|-------------|---------------------|
| DashboardStats | Dashboard, Agents, Workflows | High | Data source only |
| AgentStatusCard | Agents, Dashboard | High | Icon, colors |
| ActivityFeed | Dashboard, all pages (sidebar) | High | Activity data format |
| WorkflowVisualizer | Workflows | Medium | Node types, actions |
| Floating Toolbar | Global | High | Action buttons |
| Integration Cards | Integrations | High | Integration list |

---

## 💡 Best Practices

### 1. Start Small
Don't rebuild everything at once. Pick one component and perfect it.

### 2. Keep Existing Data Layer
The Figma components are UI-only. Keep your Server Actions, Zustand stores, etc.

### 3. Maintain GalaxyCo Branding
Adapt colors if needed, but keep the structure and interaction patterns.

### 4. Test Responsive
The Figma design is mobile-first. Test on all breakpoints.

### 5. Preserve Accessibility
Components use semantic HTML and ARIA. Don't remove these.

---

## 🎯 Recommended Integration Order

1. **Week 1: Foundation**
   - [ ] Merge globals.css
   - [ ] Update shadow system
   - [ ] Add status badge pattern

2. **Week 2: Dashboard**
   - [ ] Replace stats with gradient pills
   - [ ] Add activity feed
   - [ ] Improve agent cards

3. **Week 3: Features**
   - [ ] Add floating toolbar
   - [ ] Implement workflow visualizer
   - [ ] Create integration marketplace

4. **Week 4: Polish**
   - [ ] Add loading states
   - [ ] Improve transitions
   - [ ] Test dark mode
   - [ ] Verify accessibility

---

## 📝 Code Examples

### Example 1: Agent Status in GalaxyCo

**Before:**
```typescript
<div className="p-4 border rounded">
  <h3>{agent.name}</h3>
  <p>Status: {agent.status}</p>
</div>
```

**After (Figma style):**
```typescript
<Card className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
  <div className="flex items-start gap-4">
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <Bot className="h-6 w-6 text-purple-500" />
    </div>
    <div className="flex-1">
      <p className="font-medium">{agent.name}</p>
      <Badge className="mt-2 bg-green-500/10 text-green-600 border-0 rounded-full">
        <div className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5" />
        {agent.status}
      </Badge>
    </div>
  </div>
</Card>
```

### Example 2: Dashboard Stats

**Before:**
```typescript
<div className="grid grid-cols-4 gap-4">
  {stats.map(stat => (
    <div key={stat.label}>
      <p>{stat.label}</p>
      <h2>{stat.value}</h2>
    </div>
  ))}
</div>
```

**After (Figma style):**
```typescript
<div className="flex items-center gap-3 flex-wrap">
  {stats.map(stat => (
    <Badge 
      key={stat.label}
      className={`h-8 px-4 rounded-full border-0 
                  bg-gradient-to-br ${stat.gradient} 
                  ${stat.textColor} ${stat.shadowColor} 
                  transition-all`}
    >
      <stat.icon className="h-3.5 w-3.5 mr-2" />
      <span className="text-xs">{stat.value} {stat.label}</span>
    </Badge>
  ))}
</div>
```

---

## ✨ Summary

- **43 shadcn/ui components** ready to use
- **9 custom components** tailored for AI dashboards
- **5 complete pages** with real implementations
- **Production-ready code** with TypeScript
- **Full design system** with tokens
- **Responsive layouts** mobile-first
- **Accessible** WCAG compliant

**Start here:** Copy the stats pills to your dashboard (15 min, huge visual impact)

**Next:** Add activity feed for real-time updates (30 min)

**Long-term:** Integrate workflow visualizer (1-2 hours)

---

**Ready to start?** Begin with `FIGMA-DESIGN-SPECS.md` for complete specifications!

