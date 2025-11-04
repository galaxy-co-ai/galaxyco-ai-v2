# 🔵 Frontend Architect Agent - Phase 2 Kickoff

**Agent:** Frontend Architect  
**Phase:** Phase 2 - Marketplace UI & Templates  
**Date:** November 3, 2025  
**Priority:** ⭐ HIGH - Competitive Enhancement  
**Status:** 🟢 Ready to Execute  
**Estimated Duration:** 6 hours  
**Success Criteria:** Marketplace UI functional, users can install agents in 10 seconds

---

## 🎯 Mission Objective

**Build Agent Marketplace UI and Templates Library to unlock hidden assets and provide instant value to users.**

**Current State:**
- ✅ Backend marketplace API complete (Backend Agent built it!)
- ✅ 10 pre-built agent templates ready
- ✅ Installation API working
- ✅ Rating system implemented
- ❌ **No frontend UI** to browse/install agents

**Target State:**
- ✅ Beautiful marketplace page (`/marketplace`)
- ✅ Agent cards with install button
- ✅ Search and filtering
- ✅ Templates library integrated into Flow Builder
- ✅ One-click agent installation
- ✅ Users get instant value (10 pre-built agents available)

---

## 📚 Context Files to Read First

**CRITICAL - Read these before starting:**

1. **`.cursor/STRATEGIC-COMPLETION-PLAN.md`** (Phase 2 section)
   - Detailed implementation code for Marketplace UI
   - Templates library integration approach
   - Success criteria and impact metrics

2. **`.cursor/PHASE-1-HANDOFF.md`**
   - Phase 1 completion status
   - Platform current state
   - Testing deferred until after Phase 3

3. **`apps/web/app/api/marketplace/route.ts`**
   - Marketplace API endpoint structure
   - Query parameters (query, category, sortBy, etc.)
   - Response format: `{ templates: [...], total: number }`

4. **`apps/web/app/api/marketplace/agents/[id]/route.ts`**
   - Agent detail endpoint
   - Installation endpoint structure

5. **`packages/database/src/schema.ts`** (agentTemplates table)
   - Agent template schema structure
   - Fields: name, description, category, iconUrl, rating, installCount, etc.

6. **`.cursor/component-guide.md`**
   - Component patterns (shadcn/ui, Kibo UI)
   - Styling guidelines
   - Design system tokens

---

## 🎯 Phase 2 Tasks (Priority Order)

### Task 1: Agent Marketplace Page (3-4 hours) ⭐ CRITICAL
**Priority:** 🔴 HIGH  
**Status:** 🟡 Not Started  
**Estimated:** 3-4 hours

**Objective:**
Create beautiful marketplace page where users can browse and install pre-built agents.

**Backend API Already Exists:**
```
GET /api/marketplace
  Query params: query?, category?, featured?, sortBy?, limit?, offset?
  Response: { templates: [...], total: number }

GET /api/marketplace/agents/[id]
  Response: Agent template details

POST /api/marketplace/agents/[id]/install
  Response: { success: true, agentId: string }
```

**Implementation Steps:**

1. **Create Marketplace Page** (`apps/web/app/(app)/marketplace/page.tsx`)
   ```typescript
   'use client';
   
   import { useQuery, useMutation } from '@tanstack/react-query';
   import { useState } from 'react';
   import { Input } from '@/components/ui/input';
   import { Button } from '@/components/ui/button';
   import { AgentCard } from '@/components/marketplace/agent-card';
   import { toast } from '@/hooks/use-toast';
   
   export default function MarketplacePage() {
     const [searchQuery, setSearchQuery] = useState('');
     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
     
     const { data, isLoading } = useQuery({
       queryKey: ['marketplace-agents', searchQuery, selectedCategory],
       queryFn: async () => {
         const params = new URLSearchParams();
         if (searchQuery) params.set('query', searchQuery);
         if (selectedCategory) params.set('category', selectedCategory);
         params.set('sortBy', 'trending');
         
         const res = await fetch(`/api/marketplace?${params}`);
         if (!res.ok) throw new Error('Failed to fetch agents');
         return res.json();
       },
     });
     
     const installMutation = useMutation({
       mutationFn: async (agentId: string) => {
         const res = await fetch(`/api/marketplace/agents/${agentId}/install`, {
           method: 'POST',
         });
         if (!res.ok) throw new Error('Failed to install agent');
         return res.json();
       },
       onSuccess: () => {
         toast({
           title: 'Agent installed!',
           description: 'The agent has been added to your workspace.',
         });
       },
       onError: (error) => {
         toast({
           title: 'Installation failed',
           description: error.message,
           variant: 'destructive',
         });
       },
     });
     
     return (
       <div className="container mx-auto py-8 space-y-6">
         <div>
           <h1 className="text-3xl font-bold">Agent Marketplace</h1>
           <p className="text-muted-foreground mt-2">
             Install pre-built agents in 10 seconds
           </p>
         </div>
         
         {/* Search and Filters */}
         <div className="flex gap-4">
           <Input
             placeholder="Search agents..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="max-w-sm"
           />
           {/* Category filter dropdown */}
         </div>
         
         {/* Loading State */}
         {isLoading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
             ))}
           </div>
         )}
         
         {/* Agent Grid */}
         {data?.templates && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {data.templates.map((agent) => (
               <AgentCard
                 key={agent.id}
                 agent={agent}
                 onInstall={() => installMutation.mutate(agent.id)}
                 isInstalling={installMutation.isPending}
               />
             ))}
           </div>
         )}
       </div>
     );
   }
   ```

2. **Create AgentCard Component** (`apps/web/components/marketplace/agent-card.tsx`)
   ```typescript
   'use client';
   
   import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
   import { Button } from '@/components/ui/button';
   import { Badge } from '@/components/ui/badge';
   import { Star, Download, TrendingUp } from 'lucide-react';
   
   interface AgentCardProps {
     agent: {
       id: string;
       name: string;
       description: string;
       shortDescription?: string;
       category: string;
       iconUrl?: string;
       rating?: number;
       reviewCount?: number;
       installCount: number;
       badgeText?: string;
       kpis?: {
         avgTimeSaved?: string;
         successRate?: number;
       };
     };
     onInstall: () => void;
     isInstalling?: boolean;
   }
   
   export function AgentCard({ agent, onInstall, isInstalling }: AgentCardProps) {
     const rating = agent.rating ? (agent.rating / 100).toFixed(1) : null;
     
     return (
       <Card className="hover:shadow-lg transition-shadow">
         <CardHeader>
           <div className="flex items-start justify-between">
             <div className="flex items-center gap-3">
               {agent.iconUrl && (
                 <img src={agent.iconUrl} alt={agent.name} className="w-12 h-12 rounded-lg" />
               )}
               <div>
                 <CardTitle className="text-lg">{agent.name}</CardTitle>
                 <CardDescription className="text-sm mt-1">
                   {agent.shortDescription || agent.description}
                 </CardDescription>
               </div>
             </div>
             {agent.badgeText && (
               <Badge variant="secondary">{agent.badgeText}</Badge>
             )}
           </div>
         </CardHeader>
         
         <CardContent>
           <div className="space-y-2">
             {agent.kpis && (
               <div className="flex gap-4 text-sm text-muted-foreground">
                 {agent.kpis.avgTimeSaved && (
                   <span>⏱️ {agent.kpis.avgTimeSaved}</span>
                 )}
                 {agent.kpis.successRate && (
                   <span>✓ {agent.kpis.successRate}% success</span>
                 )}
               </div>
             )}
             
             {rating && (
               <div className="flex items-center gap-1">
                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                 <span className="text-sm font-medium">{rating}</span>
                 {agent.reviewCount && (
                   <span className="text-sm text-muted-foreground">
                     ({agent.reviewCount} reviews)
                   </span>
                 )}
               </div>
             )}
             
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <Download className="w-4 h-4" />
               <span>{agent.installCount.toLocaleString()} installs</span>
             </div>
           </div>
         </CardContent>
         
         <CardFooter>
           <Button
             onClick={onInstall}
             disabled={isInstalling}
             className="w-full"
           >
             {isInstalling ? 'Installing...' : 'Install Agent'}
           </Button>
         </CardFooter>
       </Card>
     );
   }
   ```

3. **Add Navigation Link**
   - Add `/marketplace` to navigation menu
   - Use lucide-react `Store` icon

**Success Criteria:**
- [ ] Marketplace page loads agents from API
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Agent cards display correctly (name, description, rating, installs)
- [ ] Install button triggers installation API
- [ ] Success toast shows after installation
- [ ] Loading states displayed during API calls
- [ ] Responsive design (mobile-first)

---

### Task 2: Templates Library Integration (2 hours)
**Priority:** 🟡 MEDIUM  
**Status:** 🟡 Not Started  
**Estimated:** 2 hours

**Objective:**
Add "Start from Template" feature to Flow Builder.

**Implementation Steps:**

1. **Add Template Selector Modal** (`apps/web/components/workflows/template-selector.tsx`)
   - Browse templates modal
   - Template preview
   - "Use Template" button

2. **Integrate into Flow Builder** (`apps/web/app/(app)/workflows/builder/page.tsx`)
   - Add "Start from Template" button
   - Open template selector modal
   - Load template into Flow Builder

**Success Criteria:**
- [ ] "Start from Template" button visible in Flow Builder
- [ ] Template selector modal opens
- [ ] Templates load from API
- [ ] Selecting template loads workflow into builder
- [ ] User can customize template

---

### Task 3: Demo Workflow Feature (1-2 hours)
**Priority:** 🟡 MEDIUM  
**Status:** 🟡 Not Started  
**Estimated:** 1-2 hours

**Objective:**
Add "Try Demo" button that shows workflow execution without signup.

**Implementation Steps:**

1. **Create Demo Workflow Component**
   - Pre-loaded sample workflow
   - Mock execution (no real API calls)
   - Shareable results

2. **Add to Landing Page or Homepage**
   - "Try Demo - No Signup Required" button
   - Opens demo workflow modal

**Success Criteria:**
- [ ] Demo workflow loads without signup
- [ ] Mock execution shows results
- [ ] Results are shareable
- [ ] Encourages signup after demo

---

## 🏗️ Architecture Patterns to Follow

### React Query Usage
```typescript
// ✅ CORRECT - Use React Query for server state
const { data, isLoading } = useQuery({
  queryKey: ['marketplace-agents'],
  queryFn: () => fetch('/api/marketplace').then(r => r.json()),
});

// ❌ WRONG - Don't use useState for server data
const [agents, setAgents] = useState([]);
```

### Loading States
```typescript
// ✅ CORRECT - Show loading skeleton
{isLoading && <SkeletonCard />}

// ❌ WRONG - Silent loading
{isLoading && null}
```

### Error Handling
```typescript
// ✅ CORRECT - Show user-friendly errors
const { data, error } = useQuery({...});
if (error) {
  toast({
    title: 'Failed to load agents',
    description: 'Please try again later.',
    variant: 'destructive',
  });
}
```

### Toast Notifications
```typescript
// ✅ CORRECT - Success feedback
installMutation.onSuccess(() => {
  toast({
    title: 'Agent installed!',
    description: 'The agent has been added to your workspace.',
  });
});
```

---

## 📊 Success Metrics

### Functionality ✅
- [ ] Marketplace page loads agents
- [ ] Search works
- [ ] Filtering works
- [ ] Install button works
- [ ] Templates integrated into Flow Builder
- [ ] Demo workflow works

### User Experience ✅
- [ ] Loading states for all async operations
- [ ] Success feedback after installation
- [ ] Error messages are user-friendly
- [ ] Responsive design (mobile-first)
- [ ] Accessible (WCAG compliance)

### Code Quality ✅
- [ ] 0 linting errors
- [ ] 0 TypeScript errors
- [ ] Uses React Query for server state
- [ ] Loading states mandatory
- [ ] Error handling comprehensive

---

## 📁 Files to Create/Modify

### New Files to Create:
1. `apps/web/app/(app)/marketplace/page.tsx` - Marketplace page
2. `apps/web/components/marketplace/agent-card.tsx` - Agent card component
3. `apps/web/components/marketplace/agent-grid.tsx` - Agent grid layout (optional)
4. `apps/web/components/workflows/template-selector.tsx` - Template selector modal
5. `apps/web/hooks/use-marketplace.ts` - Marketplace hooks (optional, for reusability)

### Files to Modify:
1. `apps/web/app/(app)/workflows/builder/page.tsx` - Add "Start from Template" button
2. Navigation component - Add marketplace link

---

## ✅ Completion Checklist

### Pre-Execution
- [ ] Read all context files listed above
- [ ] Review marketplace API endpoints
- [ ] Understand agent template schema
- [ ] Review component patterns

### Task 1: Marketplace Page
- [ ] Create marketplace page component
- [ ] Create AgentCard component
- [ ] Add search functionality
- [ ] Add category filtering
- [ ] Add install mutation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test responsive design

### Task 2: Templates Library
- [ ] Create template selector modal
- [ ] Integrate into Flow Builder
- [ ] Test template loading

### Task 3: Demo Workflow
- [ ] Create demo workflow component
- [ ] Add to landing page
- [ ] Test demo execution

### Post-Execution
- [ ] Run linting → 0 errors
- [ ] Run TypeScript check → 0 errors
- [ ] Test on mobile devices
- [ ] Verify accessibility
- [ ] Update completion document

---

## 🎯 Expected Outcomes

### Immediate Value
- ✅ Users can browse 10 pre-built agents
- ✅ One-click installation (10 seconds)
- ✅ Instant value (no building from scratch)
- ✅ Time to value: 60 seconds → 10 seconds

### Strategic Value
- ✅ Competitive differentiation (marketplace)
- ✅ User retention (instant value)
- ✅ Discovery mechanism for features
- ✅ Foundation for Phase 3 polish

---

## 🚀 Timeline

**Estimated Duration:** 6 hours

**Breakdown:**
- Task 1 (Marketplace UI): 3-4 hours
- Task 2 (Templates Library): 2 hours
- Task 3 (Demo Workflow): 1-2 hours

**Milestones:**
- Hour 1-4: Marketplace page complete
- Hour 5-6: Templates + Demo complete

---

## 💡 Key Points

### Backend Already Complete! ✅
- Marketplace API endpoints exist
- Installation API working
- 10 pre-built agents ready
- Rating system implemented

### You Just Need Frontend! 🎨
- Beautiful UI components
- React Query integration
- Loading states
- Error handling
- Responsive design

### Success = Users Install Agents in 10 Seconds ⚡
- Instant value
- No building from scratch
- Competitive advantage

---

**BEGIN PHASE 2 NOW! 🚀**

**Remember:** Backend is ready. You just need to build beautiful UI that connects to it!

Questions? Check context files first. Still unclear? Ask Director immediately.

---

**Estimated Timeline:**
- Start: Now
- Expected Completion: 6 hours
- Actual Completion: [filled by agent]

