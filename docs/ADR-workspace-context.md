# ADR: Workspace Context Architecture

**Date:** October 8, 2025  
**Status:** ✅ ACCEPTED  
**Context:** Phase 9B workspace ID resolution for multi-tenant security

---

## 🎯 Decision

Implement **cookie-based workspace persistence** with React Context for client state management.

## 📊 Context

**Problem:** Hardcoded `'workspace-id-placeholder'` breaks multi-tenancy and violates security rule `4kR94Z3XhqK4C54vwDDwnq`.

**Requirements:**

- ✅ Works server-side (Server Actions, API routes)
- ✅ Works client-side (React hooks, components)
- ✅ Persists across sessions
- ✅ Compatible with Clerk authentication
- ✅ Supports workspace switching UI
- ✅ Enforces tenant isolation

## 🏗️ Architecture

### Workspace Resolution Hierarchy

```
1. URL query parameter (?w=<workspace-id>)
   ↓ (if missing)
2. localStorage (client-side persistence)
   ↓ (if missing/expired)
3. Cookie (server-side default)
   ↓ (if missing)
4. First workspace in user's memberships (DB query)
   ↓ (if none)
5. Redirect to /onboarding (create workspace)
```

### TypeScript Interfaces

```typescript
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  role: "owner" | "admin" | "member" | "viewer";
}

export interface WorkspaceContextValue {
  workspaceId: string | null;
  workspace: Workspace | null;
  setWorkspaceId: (id: string) => void;
  isLoading: boolean;
}

export interface WorkspaceResolution {
  id: string;
  source: "cookie" | "localStorage" | "url" | "default" | "none";
}
```

### Implementation Components

#### 1. Server-Side Helper (`lib/workspace.ts`)

```typescript
"use server";
export async function getCurrentWorkspaceId(): Promise<WorkspaceResolution>;
export async function setWorkspaceCookie(workspaceId: string): Promise<void>;
```

#### 2. Client-Side Hook (`hooks/useWorkspace.ts`)

```typescript
"use client";
export function WorkspaceProvider({ children }): JSX.Element;
export function useWorkspace(): WorkspaceContextValue;
```

#### 3. API Endpoints

- `GET /api/workspace/current` - Get current workspace
- `GET /api/workspace/list` - List user's workspaces
- `POST /api/workspace/current` - Set current workspace

#### 4. UI Components

- `<WorkspaceSelect />` - Dropdown switcher
- `<RequireWorkspace>` - Route guard HOC

## 🔒 Security Compliance

**Multi-Tenant Rule (4kR94Z3XhqK4C54vwDDwnq) Enforcement:**

All database queries **MUST** include workspace filtering:

```typescript
// ✅ CORRECT
const agents = await db.query.agents.findMany({
  where: and(
    eq(agents.workspaceId, workspaceId), // REQUIRED
    eq(agents.status, "active"),
  ),
});

// ❌ WRONG - Security violation
const agents = await db.query.agents.findMany({
  where: eq(agents.status, "active"),
});
```

**Validation Rules:**

- Server-side: Verify user has access to requested workspace
- Client-side: Only show workspaces user belongs to
- Database: All queries include `workspaceId` filter
- Cookies: HTTP-only, Secure, SameSite=Strict

## 🌊 Data Flow

### Initial Load

```
Browser → useWorkspace hook → localStorage check →
API call → getCurrentWorkspaceId() → Database query →
Set context → Update localStorage → Ready
```

### Workspace Switch

```
User clicks dropdown → setWorkspaceId(newId) →
Update localStorage → Update URL param →
Set cookie → Refresh components → Ready
```

## 💡 Alternatives Considered

| Approach                  | Pros                                    | Cons                               | Decision    |
| ------------------------- | --------------------------------------- | ---------------------------------- | ----------- |
| **Cookie-based (CHOSEN)** | Server-side support, persistent, secure | Slightly more complex              | ✅ ACCEPTED |
| URL params only           | Simple, bookmarkable                    | No persistence, server-side issues | ❌ REJECTED |
| localStorage only         | Fast, simple                            | No server-side support             | ❌ REJECTED |
| Session storage           | No persistence issues                   | Lost on tab close                  | ❌ REJECTED |

## ⚠️ Risks & Mitigations

| Risk                    | Impact | Mitigation                                 |
| ----------------------- | ------ | ------------------------------------------ |
| Cookie size limits      | Medium | Store only workspace ID (36 chars)         |
| GDPR compliance         | Low    | Functional cookie, document in policy      |
| Cross-subdomain sharing | Low    | Set domain correctly if needed             |
| Race conditions         | Medium | Use React 18 concurrent features correctly |

## 🧪 Testing Strategy

### Unit Tests

- `getCurrentWorkspaceId()` - All resolution paths
- `useWorkspace()` - React hook behavior
- Cookie persistence - Set/get/expire

### Integration Tests

- Multi-user workspace isolation
- Workspace switching flow
- Server/client state sync

### Security Tests

- Cross-tenant data access blocked
- Unauthorized workspace access blocked
- Cookie tampering protection

## 📈 Success Metrics

- ✅ Zero hardcoded workspace IDs in codebase
- ✅ All database queries include workspace filter
- ✅ TypeScript compilation clean
- ✅ Security audit passes
- ✅ User can switch workspaces seamlessly

---

## 📝 Implementation Checklist

- [ ] Create `lib/workspace.ts` server helpers
- [ ] Create `hooks/useWorkspace.ts` React context
- [ ] Create `/api/workspace/*` endpoints
- [ ] Create `<WorkspaceSelect>` UI component
- [ ] Replace hardcoded IDs in 3 locations
- [ ] Add `<WorkspaceProvider>` to root layout
- [ ] Write comprehensive tests
- [ ] Security review & validation

**Decision Made By:** AI Assistant (Claude 4.5 Sonnet)  
**Implementation Timeline:** Phase 9B Sprint 2 (October 8, 2025)
