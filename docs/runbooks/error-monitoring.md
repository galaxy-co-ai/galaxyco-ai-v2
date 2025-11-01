# Error Monitoring with Sentry

Real-time error tracking and performance monitoring for GalaxyCo.ai.

## 🎯 Why Error Monitoring?

Without monitoring, you're **flying blind**:

- Users hit bugs, you never know
- No stack traces for debugging
- Can't prioritize critical vs minor issues
- No performance metrics

With Sentry:

- ✅ **Instant alerts** when errors occur
- ✅ **Full stack traces** with source maps
- ✅ **User context** (which users affected)
- ✅ **Performance monitoring** (slow requests)
- ✅ **Release tracking** (which deploy broke it)

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Sign up (free tier available)
3. Create a new project:
   - Platform: **Next.js**
   - Name: **GalaxyCo.ai Web**
   - Alert frequency: **On every new issue**

### Step 2: Get DSN

1. After creating project, copy the **DSN**
2. It looks like: `https://abc123@o123456.ingest.sentry.io/7654321`

### Step 3: Add to Environment

```bash
# Add to apps/web/.env.local
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN_HERE@sentry.io/PROJECT_ID

# Also add to Vercel:
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Paste your DSN when prompted
```

### Step 4: Restart Dev Server

```bash
# Kill existing server
# Then restart:
pnpm dev
```

### Step 5: Test It Works

```bash
# Create a test error in any page:
# apps/web/src/app/page.tsx

// Add this temporarily:
if (typeof window !== 'undefined') {
  throw new Error("Test Sentry error - please ignore!");
}

# Visit the page, check Sentry dashboard for error
# Then remove the test code
```

## ✅ What Gets Monitored

### Automatic Monitoring

Sentry automatically captures:

- **Unhandled errors** - Any uncaught exceptions
- **Promise rejections** - Async errors
- **API route errors** - Server-side failures
- **React errors** - Component crashes
- **Performance** - Slow API calls and pages

### Manual Monitoring

For specific cases, you can capture manually:

```typescript
import * as Sentry from '@sentry/nextjs';

// Capture an exception
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Capture a message
Sentry.captureMessage('Something important happened');

// Add context
Sentry.setUser({ id: userId, email: userEmail });
Sentry.setTag('feature', 'onboarding');
```

## 📊 Using Sentry Dashboard

### Viewing Errors

1. Go to [sentry.io](https://sentry.io) → Your Project
2. **Issues** tab shows all errors
3. Click any issue to see:
   - Full stack trace
   - User affected
   - Browser/OS info
   - Breadcrumbs (actions leading to error)

### Important Metrics

- **Unresolved Issues** - Bugs not fixed yet
- **New Issues** - Errors from latest deploy
- **User Impact** - How many users affected
- **Frequency** - How often it happens

### Prioritizing Fixes

Focus on errors with:

- **High frequency** - Happens a lot
- **Many users affected** - Widespread impact
- **Recent** - From latest deployment

## 🔔 Setting Up Alerts

### Slack Notifications

1. Sentry Dashboard → **Settings** → **Integrations**
2. Find **Slack** → **Install**
3. Connect your Slack workspace
4. Choose channel: `#errors` or `#deployments`
5. Configure:
   - Alert on: **All new issues**
   - Alert on: **Issues regressed** (came back)

### Email Alerts

1. Sentry Dashboard → **Settings** → **Alerts**
2. Create new alert rule:
   - Name: "Critical Errors"
   - Conditions: "New issue created"
   - Actions: "Send email to: your@email.com"

### Discord Alerts (Alternative)

1. Create Discord webhook in your server
2. Sentry → **Settings** → **Integrations** → **Webhooks**
3. Add Discord webhook URL
4. Test it

## 🛠️ Best Practices

### DO ✅

- **Review Sentry daily** - Check for new errors
- **Set user context** - Helps identify affected users
- **Tag errors by feature** - Easier to track
- **Mark issues resolved** - Keep dashboard clean
- **Add source maps** - See actual code, not minified

### DON'T ❌

- **Ignore errors** - They represent real problems
- **Capture sensitive data** - PII, passwords, tokens
- **Leave resolved issues open** - Clutters dashboard
- **Skip testing** - Verify Sentry works before deploy

## 🔒 Privacy & Security

### Data Scrubbing

Sentry automatically scrubs:

- Passwords
- Credit card numbers
- Social security numbers
- Authorization headers

### Additional Scrubbing

```typescript
// In sentry.client.config.ts
Sentry.init({
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.headers) {
      delete event.request.headers.Authorization;
    }
    return event;
  },
});
```

### What NOT to Send

Never send:

- User passwords
- API keys
- Database credentials
- Personal health information

## 📈 Performance Monitoring

### Enabling Performance

Already enabled in config with `tracesSampleRate: 1.0`

### What Gets Tracked

- **Page load times** - How fast pages render
- **API response times** - Backend performance
- **Database query times** - Slow queries
- **External API calls** - Third-party latency

### Viewing Performance

1. Sentry Dashboard → **Performance** tab
2. See:
   - Slowest pages
   - Slowest API routes
   - P95 response times (95th percentile)

## 🐛 Debugging with Sentry

### Using Stack Traces

1. Click error in Sentry
2. **Stack Trace** shows:
   - Exact line number
   - Function name
   - File path
3. Click line to see code context

### Breadcrumbs

Shows user actions before error:

- Pages visited
- Buttons clicked
- API calls made
- Console logs

### Replays (Optional)

Session replay shows exactly what user did:

- Enabled for errors automatically
- Masks sensitive text
- Helps reproduce bugs

## 🚨 Common Issues

### Issue: Errors not appearing in Sentry

**Cause**: DSN not configured or errors only in development

**Solution**:

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check `enabled: process.env.NODE_ENV === "production"`
3. Test in production mode: `pnpm build && pnpm start`

### Issue: Too many errors

**Cause**: Noisy errors drowning out real issues

**Solution**:

1. **Ignore certain errors**:
   ```typescript
   Sentry.init({
     ignoreErrors: [
       'Network request failed', // User network issues
       'ResizeObserver loop limit exceeded', // Browser quirk
     ],
   });
   ```
2. **Rate limit**: Set max events per minute in Sentry settings

### Issue: Source maps not working

**Cause**: Source maps not uploaded to Sentry

**Solution**:

1. Set `SENTRY_AUTH_TOKEN` in Vercel
2. Verify `hideSourceMaps: false` in next.config.js
3. Check build logs for upload confirmation

## 💰 Cost Management

### Free Tier

Sentry free tier includes:

- 5,000 errors/month
- 10,000 performance events/month
- 30-day retention
- Good for small projects

### Managing Costs

If you exceed free tier:

1. **Filter noise**: Ignore common errors
2. **Sample performance**: Lower `tracesSampleRate`
3. **Upgrade**: ~$26/month for 50k errors

## 📝 Testing Checklist

Before deploying Sentry to production:

- [ ] DSN configured in Vercel
- [ ] Test error appears in dashboard
- [ ] Source maps work (see real code)
- [ ] Alerts configured (Slack/email)
- [ ] Privacy rules set (no sensitive data)
- [ ] Performance monitoring working
- [ ] Team has access to Sentry project

## 🔗 Related Documentation

- Troubleshooting: `docs/runbooks/troubleshooting.md`
- Deployment: `docs/runbooks/deployment.md`
- Sentry Docs: [https://docs.sentry.io](https://docs.sentry.io)

---

## 🎯 Next Steps

After setting up Sentry:

1. **Check it daily** - Make it part of your routine
2. **Fix errors quickly** - Don't let them pile up
3. **Monitor performance** - Catch slow queries
4. **Set up alerts** - Get notified immediately
5. **Review before deploys** - Check for new errors

---

**Remember**: Every error in Sentry is a real user experiencing a problem. Fix them! 🐛
