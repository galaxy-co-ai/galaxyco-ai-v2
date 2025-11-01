# Special API Route Customizations

This document describes the special customizations applied to specific API route categories.

## Analytics Routes (Read-Only)

**Location:** `/api/analytics/*`

**Routes:**

- `/api/analytics/sales` - GET only
- `/api/analytics/marketing` - GET only
- `/api/analytics/outreach` - GET only
- `/api/analytics/time-usage` - GET only
- `/api/analytics/usage` - GET only

**Characteristics:**

- Read-only endpoints (GET method only)
- Require workspace membership
- Return aggregated analytics data
- No POST/PUT/DELETE operations

**Usage:**

```typescript
GET /api/analytics/sales?workspaceId=<id>&limit=50&offset=0
```

---

## Admin Routes (Role-Based Access)

**Location:** `/api/admin/*`

**Routes:**

- `/api/admin/analytics` - Cross-tenant analytics (GET)
- `/api/admin/settings` - System settings (GET, PUT)
- `/api/admin/users` - User management (GET)
- `/api/admin/users/[id]` - Single user (GET, PUT, DELETE)
- `/api/admin/workspaces` - Workspace management (GET)
- `/api/admin/workspaces/[id]` - Single workspace (GET, PUT)

**Authorization:**

- Requires **admin** or **owner** role
- Uses `checkSystemAdmin()` for cross-tenant operations
- Uses `checkWorkspaceAdmin()` for workspace-scoped operations

**Implementation:**

```typescript
import { checkSystemAdmin } from '@/lib/auth/admin-check';

// Check admin role
const adminCheck = await checkSystemAdmin(clerkUserId);
if (!adminCheck.authorized) {
  return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
}
```

**Available Roles:**

- `owner` - Full workspace control
- `admin` - Administrative privileges
- `member` - Standard access
- `viewer` - Read-only access

---

## Playground Route (Sandboxed Testing)

**Location:** `/api/playground`

**Method:** POST only

**Purpose:**
Test API requests in a sandboxed environment without affecting real resources.

**Request Schema:**

```typescript
{
  workspaceId: string;
  resource: "customers" | "projects" | "contacts" | "tasks" | "agents" | "workflows";
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, any>;
  params?: Record<string, string>;
  validateOnly?: boolean; // If true, only validates without executing
}
```

**Response:**

```typescript
{
  success: true;
  result: {
    requestId: string;
    validation: {
      passed: boolean;
      checks: {
        authentication: string;
        authorization: string;
        rateLimit: string;
        schema: string;
        permissions: string;
      }
    }
    mockResponse: object | null; // null if validateOnly=true
    executedAt: string;
  }
}
```

**Features:**

- Validates authentication and authorization
- Checks rate limits
- Validates request schemas
- Returns mock responses for testing
- Does not modify real data

---

## Webhook Routes (Signature Validation)

**Location:** `/api/webhooks/*`

**Routes:**

- `/api/webhooks` - Create/list webhooks (POST, GET)
- `/api/webhooks/[id]` - Manage webhook (GET, PUT, DELETE)

**Security Features:**

### Webhook Secret Generation

When creating a webhook, a secret is generated and returned (only shown once):

```typescript
import { generateWebhookSecret } from '@/lib/webhooks/signature';

const secret = generateWebhookSecret(); // 32 bytes, base64 encoded
```

### Webhook Signature Validation

For incoming webhook events (Phase 2):

```typescript
import { verifyWebhookRequest } from '@/lib/webhooks/signature';

// Get signature from header
const signature = req.headers.get('x-webhook-signature');

// Verify signature and timestamp
const verification = verifyWebhookRequest(
  payload,
  signature,
  webhookSecret,
  300, // 5 minute max age
);

if (!verification.valid) {
  return NextResponse.json({ error: verification.error }, { status: 401 });
}
```

**Signature Format:**

```
X-Webhook-Signature: t=1234567890,v1=abc123def456...
```

Where:

- `t` = Unix timestamp (seconds)
- `v1` = HMAC-SHA256 signature (hex)

**Webhook Validation Schema:**

```typescript
{
  workspaceId: string;
  name: string;
  url: string; // Must be HTTPS
  events: Array<string>; // e.g., ["agent.created", "agent.executed"]
  secret?: string; // Auto-generated if not provided
  isActive?: boolean; // Default: true
}
```

**URL Requirements:**

- Must use HTTPS
- Must be publicly accessible
- Should return 200 OK for successful webhook delivery

---

## Rate Limits

Different rate limits apply to different route categories:

```typescript
RATE_LIMITS = {
  STANDARD: 60, // Standard API calls
  ADMIN_OPS: 30, // Admin operations
  WEBHOOK_OPS: 20, // Webhook management
  PLAYGROUND: 100, // Playground testing (higher limit)
  EMAIL_SEND: 10, // Email sending
};
```

---

## Phase 2 TODOs

### Admin Routes

- [ ] Implement actual database queries for cross-tenant analytics
- [ ] Add system settings table and management
- [ ] Implement user/workspace update operations
- [ ] Add role-based permission checks at database level

### Playground Route

- [ ] Implement actual sandbox environment
- [ ] Execute requests against test resources
- [ ] Add request history tracking
- [ ] Implement quota limits per workspace

### Webhook Routes

- [ ] Create webhooks table in database
- [ ] Store encrypted webhook secrets
- [ ] Implement webhook delivery queue
- [ ] Add retry logic with exponential backoff
- [ ] Add webhook delivery logs
- [ ] Implement webhook signature verification for incoming events

### Analytics Routes

- [ ] Replace mock data with real aggregations
- [ ] Add time-series data support
- [ ] Implement caching for expensive queries
- [ ] Add export functionality (CSV, JSON)

---

## Testing

### Admin Routes

```bash
# Test admin access (requires admin/owner role)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/admin/analytics?period=last-30-days"
```

### Playground Route

```bash
# Test API request validation
curl -X POST http://localhost:3000/api/playground \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "...",
    "resource": "customers",
    "method": "GET",
    "validateOnly": true
  }'
```

### Webhook Routes

```bash
# Create webhook
curl -X POST http://localhost:3000/api/webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "...",
    "name": "My Webhook",
    "url": "https://example.com/webhook",
    "events": ["agent.created", "agent.executed"]
  }'
```

---

## Security Considerations

1. **Admin Routes**: Always check role before allowing access
2. **Playground**: Ensure sandbox isolation (no real data modification)
3. **Webhooks**: Validate signatures to prevent spoofing
4. **Rate Limits**: Monitor for abuse, adjust limits as needed
5. **Logging**: Log all admin operations for audit trail

---

## References

- [Admin Check Utility](../../apps/web/lib/auth/admin-check.ts)
- [Webhook Signatures](../../apps/web/lib/webhooks/signature.ts)
- [Rate Limiting](../../apps/web/lib/rate-limit.ts)
- [Validation Schemas](../../apps/web/lib/validation/)
