# Assets Directory Structure Decision

**Date**: October 14, 2025  
**Context**: Organization Sprint - Phase 4.1  
**Decision**: **NO** centralized `/assets` directory

---

## Executive Summary

After evaluating the project structure and needs, we've decided **NOT** to create a centralized `/assets` directory at the project root. The existing `apps/web/public/` directory structure is sufficient for current and foreseeable needs.

---

## Current State Analysis

### Existing Structure
```
galaxyco-ai-2.0/
├── apps/
│   ├── web/
│   │   └── public/          # Next.js public directory (currently empty)
│   └── api/                 # No static assets needed
└── packages/                # 5 shared packages
```

### Key Findings
1. **Single Web App**: Only `apps/web` serves static assets
2. **Empty Public Directory**: No assets currently in use
3. **API App**: Backend service, doesn't serve static files
4. **Documentation**: No images currently in docs/
5. **Monorepo**: Well-organized with established patterns

---

## Decision Rationale

### Why NO Centralized Assets Directory

#### 1. **Next.js Best Practices**
- Next.js has a well-established `public/` directory pattern
- Framework automatically optimizes and serves files from `public/`
- Deviation from Next.js conventions adds unnecessary complexity
- Community resources and tooling expect standard structure

#### 2. **Single Consumer**
- Only one app (`web`) needs static assets currently
- No shared asset requirements between apps
- API app is backend-only (no static file serving)
- No evidence of future multi-app asset sharing needs

#### 3. **Build Complexity**
- Centralized assets would require custom Turbo config
- Would need asset copying pipeline in build process
- Increases build time and complexity
- Higher maintenance burden for minimal benefit

#### 4. **Existing Solutions Work**
- `apps/web/public/` is the right place for web assets
- Documentation images can go in `docs/images/` if needed later
- Brand assets can live in `apps/web/public/brand/` if needed
- No current pain point to solve

#### 5. **Monorepo Philosophy**
- **Shared Code**: Use `packages/` for shared TypeScript/React components
- **App-Specific Assets**: Keep in app's public directory
- **Documentation Assets**: Keep with documentation in `docs/`
- Clear separation of concerns

---

## Recommended Structure

### For Web App Assets
```
apps/web/public/
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── images/
│   ├── logo.svg
│   ├── hero-bg.jpg
│   └── screenshots/
├── icons/
│   ├── agent-icon.svg
│   ├── marketplace-icon.svg
│   └── dashboard-icon.svg
└── brand/
    ├── galaxy co-logo-full.svg
    ├── galaxyco-wordmark.svg
    └── brand-guidelines.pdf
```

### For Documentation Assets
```
docs/images/
├── architecture-diagram.png
├── deployment-flow.png
└── screenshots/
    ├── dashboard-preview.png
    └── agent-builder.png
```

---

## Alternative Considered

### Option: Centralized `/assets` Directory

**Structure:**
```
assets/
├── images/
├── icons/
├── brand/
└── README.md
```

**Why Rejected:**
1. ❌ Adds unnecessary build complexity
2. ❌ Deviates from Next.js conventions
3. ❌ Solves a problem that doesn't exist yet
4. ❌ Requires custom Turbo configuration
5. ❌ Complicates asset imports in code
6. ❌ No current multi-app asset sharing need

---

## Future Considerations

### When to Revisit This Decision

**Triggers for reconsideration:**
1. **Multiple Frontend Apps**: If we add more apps that need shared assets
2. **Design System Package**: If we create a UI package with asset dependencies
3. **Cross-App Branding**: If brand assets need to be consumed by multiple apps
4. **Documentation Scaling**: If docs grow to need dedicated asset management

### If Centralized Assets Become Necessary

**Recommended Approach:**
1. Create shared package: `packages/assets`
2. Use as dependency in apps that need it
3. Export assets as TypeScript modules with proper typing
4. Let build tools handle asset optimization per-app
5. Consider using a CDN for production

**Example:**
```typescript
// packages/assets/src/index.ts
export { default as Logo } from './brand/logo.svg';
export { default as DashboardIcon } from './icons/dashboard.svg';

// apps/web/src/components/Header.tsx
import { Logo } from '@galaxyco/assets';
```

---

## Implementation Plan

### Immediate Actions
1. ✅ Document decision (this file)
2. ✅ Keep `apps/web/public/` as primary location
3. ✅ Add README to `apps/web/public/` explaining structure
4. ✅ Create `docs/images/` when first documentation image needed

### No Actions Required
- ❌ No centralized `/assets` directory to create
- ❌ No build configuration changes
- ❌ No .gitignore updates needed
- ❌ No migration of existing assets (none exist)

---

## Documentation Links

### Related Files
- `apps/web/public/README.md` (to be created when assets added)
- `WARP.md` - Project structure documentation
- `AI_CONTEXT.md` - Repository structure section

### References
- Next.js Public Directory: https://nextjs.org/docs/basic-features/static-file-serving
- Turborepo Best Practices: https://turbo.build/repo/docs/handbook

---

## Summary

**Decision**: Use existing `apps/web/public/` directory for web assets  
**Rationale**: Follows Next.js conventions, sufficient for current needs, avoids unnecessary complexity  
**Action**: No changes required  
**Review**: Revisit if multi-app asset sharing becomes necessary

This decision supports the project's goal of production-grade quality without cutting corners by adhering to established conventions rather than over-engineering for hypothetical future needs.

---

**Decision Made By**: AI Assistant + User  
**Approved By**: User (pending)  
**Status**: Documented for review  
**Next Review**: When adding second frontend app or design system package
