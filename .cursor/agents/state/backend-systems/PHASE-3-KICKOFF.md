# 🟢 Backend Systems Agent - Phase 3 Kickoff

**Agent:** Backend Systems  
**Phase:** Phase 3 - Launch Excellence (Performance Optimization)  
**Date:** November 3, 2025  
**Priority:** 🟡 MEDIUM - Performance Enhancement  
**Status:** 🟢 Ready to Execute  
**Estimated Duration:** 2 hours  
**Success Criteria:** Sub-200ms API responses with Redis caching

---

## 🎯 Mission Objective

**Implement Redis caching for marketplace and templates to achieve sub-200ms API responses.**

**Current State:**
- ✅ Marketplace API working
- ✅ Templates API working
- ⚠️ No caching implemented
- ⚠️ API responses may be slow under load

**Target State:**
- ✅ Redis caching for marketplace agents (5 min TTL)
- ✅ Redis caching for workflow templates (10 min TTL)
- ✅ Redis caching for user workspaces (1 min TTL)
- ✅ Optimistic UI updates supported
- ✅ Sub-200ms API response times

---

## 📚 Context Files to Read First

**CRITICAL - Read these before starting:**

1. **`.cursor/STRATEGIC-COMPLETION-PLAN.md`** (Phase 3 section)
   - Performance optimization requirements
   - Caching strategy details

2. **`.cursor/PHASE-1-HANDOFF.md`**
   - Phase 1 completion status
   - Backend patterns established

3. **`apps/web/app/api/marketplace/route.ts`**
   - Current marketplace API implementation
   - Where to add caching

4. **`apps/web/lib/actions/marketplace-actions.ts`**
   - Server Actions that need caching
   - Current implementation patterns

5. **Redis configuration** (if exists)
   - Check for Redis client setup
   - Environment variables

---

## 🎯 Phase 3 Tasks (Priority Order)

### Task 1: Verify Redis Infrastructure ✅
**Priority:** 🟢 CHECK  
**Status:** ✅ Already Exists  
**Estimated:** 5 minutes

**Objective:**
Verify Redis caching infrastructure is ready.

**What Already Exists:**
- ✅ `apps/web/lib/cache/redis.ts` - Redis client with Upstash support
- ✅ `apps/web/lib/cache/with-cache.ts` - Caching wrapper utilities
- ✅ `cacheKeys` helpers for consistent key naming
- ✅ `cacheTTL` constants for TTL values

**Action Needed:**
- [ ] Verify Redis credentials in environment variables
- [ ] Test Redis connection works
- [ ] Review existing cache utilities

**Files to Check:**
- `apps/web/lib/cache/redis.ts` - Redis client
- `apps/web/lib/cache/with-cache.ts` - Caching wrapper

---

### Task 2: Marketplace API Caching (30 min) ⭐ CRITICAL
**Priority:** 🔴 HIGH  
**Status:** 🟡 Not Started  
**Estimated:** 30 minutes

**Objective:**
Add caching to marketplace API endpoints using existing cache utilities.

**Implementation:**

1. **Update Marketplace API** (`apps/web/app/api/marketplace/route.ts`)
   ```typescript
   import { withCache } from '@/lib/cache/with-cache';
   import { cacheKeys, cacheTTL } from '@/lib/cache/redis';
   import { searchMarketplace } from '@/lib/actions/marketplace-actions';
   
   export async function GET(req: NextRequest) {
     try {
       const { userId: clerkUserId } = await auth();
       
       if (!clerkUserId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
       }
       
       const { searchParams } = new URL(req.url);
       const query = searchParams.get('query') || '';
       const category = searchParams.get('category') || '';
       const sortBy = searchParams.get('sortBy') || 'trending';
       
       // Create cache key
       const cacheKey = `marketplace:agents:${query}:${category}:${sortBy}`;
       
       // Get from cache or fetch (5 min TTL)
       const result = await withCache(
         cacheKey,
         cacheTTL.medium, // 5 minutes
         async () => {
           return await searchMarketplace({
             query: query || undefined,
             category: category || undefined,
             sortBy: sortBy as any,
           });
         }
       );
       
       if (!result.success) {
         return NextResponse.json({ error: result.error }, { status: 500 });
       }
       
       return NextResponse.json({
         templates: result.templates,
         total: result.total,
       });
     } catch (error) {
       console.error('[Marketplace API Error]', error);
       return NextResponse.json(
         { error: 'Failed to fetch marketplace agents' },
         { status: 500 }
       );
     }
   }
   ```

2. **Invalidate Cache on Install** (`apps/web/app/api/marketplace/agents/[id]/install/route.ts`)
   ```typescript
   import { cache } from '@/lib/cache/redis';
   
   export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
     // ... installation logic ...
     
     // Invalidate marketplace cache after installation
     // Note: Pattern invalidation may need custom implementation
     // For now, invalidate specific keys or use wildcard if supported
     await cache.del(`marketplace:agents:*`); // Adjust based on cache implementation
     
     return NextResponse.json({ success: true, agent });
   }
   ```

---

### Task 3: Templates API Caching (30 min)
**Priority:** 🟡 MEDIUM  
**Status:** 🟡 Not Started  
**Estimated:** 30 minutes

**Objective:**
Add caching to templates/workflows API endpoints.

**Implementation:**

1. **Cache Templates API** (similar pattern)
   ```typescript
   const cacheKey = `templates:workflows:${category}`;
   const result = await getCached(
     cacheKey,
     async () => fetchTemplates({ category }),
     10 * 60 // 10 minutes TTL
   );
   ```

2. **Cache User Workspaces** (if applicable)
   ```typescript
   const cacheKey = `workspace:${workspaceId}`;
   const workspace = await getCached(
     cacheKey,
     async () => getWorkspace(workspaceId),
     60 // 1 minute TTL
   );
   ```

---

## 🏗️ Architecture Patterns to Follow

### Cache Key Naming
```typescript
// ✅ CORRECT - Descriptive cache keys
'marketplace:agents:query:category:sortBy'
'templates:workflows:category'
'workspace:workspaceId'

// ❌ WRONG - Ambiguous keys
'cache1'
'data'
```

### Cache Invalidation
```typescript
// ✅ CORRECT - Invalidate on writes
await invalidateCachePattern('marketplace:agents:*');

// ✅ CORRECT - Set appropriate TTL
await getCached(key, fetcher, 5 * 60); // 5 minutes
```

### Error Handling
```typescript
// ✅ CORRECT - Fallback on cache errors
try {
  return await getCached(key, fetcher);
} catch (error) {
  // Cache error - still fetch data
  return fetcher();
}
```

---

## 📊 Success Metrics

### Performance ✅
- [ ] Marketplace API < 200ms (with cache hit)
- [ ] Templates API < 200ms (with cache hit)
- [ ] Cache hit rate > 80%
- [ ] Redis connection working

### Functionality ✅
- [ ] Caching doesn't break existing functionality
- [ ] Cache invalidation works on installs
- [ ] Cache TTLs are appropriate
- [ ] Error handling graceful

### Code Quality ✅
- [ ] 0 linting errors
- [ ] 0 TypeScript errors
- [ ] Redis client properly configured
- [ ] Cache utilities reusable

---

## 📁 Files to Create/Modify

### New Files to Create:
1. `apps/web/lib/redis/client.ts` - Redis client
2. `apps/web/lib/cache/utils.ts` - Caching utilities

### Files to Modify:
1. `apps/web/app/api/marketplace/route.ts` - Add caching
2. `apps/web/app/api/marketplace/agents/[id]/install/route.ts` - Invalidate cache
3. Templates API routes (if they exist) - Add caching

---

## ✅ Completion Checklist

### Pre-Execution
- [ ] Read context files
- [ ] Check Redis availability (Upstash or self-hosted)
- [ ] Verify environment variables

### Task 1: Redis Setup
- [ ] Install Redis client library
- [ ] Create Redis client
- [ ] Create caching utilities
- [ ] Test Redis connection

### Task 2: Marketplace Caching
- [ ] Add caching to marketplace API
- [ ] Add cache invalidation on install
- [ ] Test cache hit/miss scenarios
- [ ] Verify performance improvement

### Task 3: Templates Caching
- [ ] Add caching to templates API
- [ ] Add cache invalidation on updates
- [ ] Test cache behavior

### Post-Execution
- [ ] Run linting → 0 errors
- [ ] Run TypeScript check → 0 errors
- [ ] Test API performance
- [ ] Verify cache invalidation works
- [ ] Update completion document

---

## 🎯 Expected Outcomes

### Immediate Value
- ✅ API responses < 200ms (with cache)
- ✅ Reduced database load
- ✅ Better user experience (faster loads)

### Strategic Value
- ✅ Platform scales better
- ✅ Foundation for future caching
- ✅ Performance baseline established

---

## 🚀 Timeline

**Estimated Duration:** 2 hours

**Breakdown:**
- Task 1 (Redis Setup): 1 hour
- Task 2 (Marketplace Caching): 30 min
- Task 3 (Templates Caching): 30 min

---

## 💡 Key Points

### Redis Options
- **Upstash Redis** (serverless, recommended for Vercel)
- **Self-hosted Redis** (if available)
- **Redis Cloud** (alternative)

### Cache Strategy
- **Marketplace:** 5 min TTL (frequently updated)
- **Templates:** 10 min TTL (less frequently updated)
- **Workspaces:** 1 min TTL (user-specific, changes often)

### Cache Invalidation
- Invalidate on installs/updates
- Use pattern matching for bulk invalidation
- Graceful fallback on cache errors

---

**BEGIN PHASE 3 NOW! 🚀**

**Remember:** Performance optimization is critical for launch. Sub-200ms responses = happy users!

Questions? Check context files first. Still unclear? Ask Director immediately.

---

**Estimated Timeline:**
- Start: Now
- Expected Completion: 2 hours
- Actual Completion: [filled by agent]

