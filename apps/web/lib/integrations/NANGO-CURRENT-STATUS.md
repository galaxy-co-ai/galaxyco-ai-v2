# Nango Integration - Current Status

**Date:** November 3, 2025  
**Status:** ⚠️ **Needs Update for Modern Flow**

---

## 🔍 Current Implementation Analysis

### ✅ What's Correct

1. **Server-Side (`nango-server.ts`)**
   - ✅ Using `@nangohq/node` correctly
   - ✅ Has `createConnectSession()` function
   - ✅ Has `createReconnectSession()` function
   - ✅ Using secret key (not public key)

2. **Session Token Endpoint**
   - ✅ `/api/integrations/session-token` exists
   - ✅ Calls `createConnectSession()` on backend

3. **Security**
   - ✅ Secret key stored in environment variables
   - ✅ No credentials exposed to frontend

---

## ⚠️ What Needs Fixing

### 1. Frontend Nango Instance Creation

**File:** `apps/web/lib/integrations/nango-client.ts`

**Current (Line 17):**
```typescript
export const nangoClient = new Nango();  // ❌ Missing session token
```

**Should be:**
```typescript
// Don't create global instance - create per-request with session token
// Remove this line entirely
```

---

### 2. Connect Flow Implementation

**Current Flow:**
```typescript
const connect = nangoClient.openConnectUI({ ... });
const tokenResult = await getSessionToken([integrationId]);
connect.setSessionToken(tokenResult.token);  // ❌ Deprecated method
```

**Modern Flow:**
```typescript
// 1. Get session token first
const tokenResult = await getSessionToken([integrationId]);

// 2. Create Nango instance with token
const nango = new Nango({ connectSessionToken: tokenResult.token });

// 3. Call auth directly
const result = await nango.auth(integrationId);
```

---

### 3. Type Declarations

**Current:** Incomplete type declarations in `nango-types.d.ts`

**Needed:**
```typescript
declare module '@nangohq/frontend' {
  interface NangoConfig {
    connectSessionToken: string;
  }

  interface AuthResult {
    connectionId: string;
    providerConfigKey: string;
  }

  export default class Nango {
    constructor(config: NangoConfig);
    auth(providerConfigKey: string, options?: any): Promise<AuthResult>;
  }
}

declare module '@nangohq/node' {
  interface EndUser {
    id: string;
    email?: string;
    display_name?: string;
    tags?: Record<string, string>;
  }

  interface CreateConnectSessionParams {
    end_user: EndUser;
    allowed_integrations?: string[];
  }

  interface ConnectSession {
    token: string;
    expires_at: string;
  }

  export class Nango {
    constructor(config: { secretKey: string; host?: string });
    
    createConnectSession(params: CreateConnectSessionParams): Promise<ConnectSession>;
    
    getConnection(
      providerConfigKey: string,
      connectionId: string
    ): Promise<{
      connection_id: string;
      provider_config_key: string;
      credentials: any;
      metadata?: any;
      created_at: string;
      updated_at: string;
    }>;
    
    deleteConnection(providerConfigKey: string, connectionId: string): Promise<void>;
    
    proxy(params: {
      method: string;
      endpoint: string;
      providerConfigKey: string;
      connectionId: string;
      data?: any;
      params?: Record<string, string>;
      headers?: Record<string, string>;
    }): Promise<{ data: any }>;
  }
}
```

---

## 🎯 Required Changes

### Priority 1: Fix Frontend Implementation

1. Remove global `nangoClient` instance
2. Create Nango instance per-request with session token
3. Update `connectIntegration()` function
4. Update `connectMultipleIntegrations()` function

### Priority 2: Update Type Declarations

1. Complete type declarations for `@nangohq/frontend`
2. Complete type declarations for `@nangohq/node`
3. Add proper event types

### Priority 3: Add Webhook Handler

1. Create `/api/webhooks/nango/route.ts`
2. Handle `connection.created` events
3. Store connection IDs in database

---

## 📋 Action Items

- [ ] Update `nango-client.ts` to use modern flow
- [ ] Complete `nango-types.d.ts` with full type definitions
- [ ] Create webhook endpoint
- [ ] Test OAuth flow end-to-end
- [ ] Remove deprecated methods
- [ ] Update documentation

---

## 🔧 Estimated Effort

- Type declarations: 30 minutes
- Frontend updates: 1 hour  
- Webhook handler: 1 hour
- Testing: 1 hour
- **Total: ~3.5 hours**

---

## 📚 Reference

See `NANGO-INTEGRATION-GUIDE.md` for complete modern implementation guide.

---

**Next Step:** Update type declarations and frontend implementation to match modern Nango flow.

