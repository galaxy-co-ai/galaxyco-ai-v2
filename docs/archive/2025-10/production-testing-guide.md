# 🧪 Production Testing Guide - Agent Execution Feature

**Test URL**: https://galaxyco-ai-20.vercel.app/  
**Feature**: Agent Execution (Mock & Live Modes)  
**Status**: Ready for testing

---

## 🎯 Quick Test Workflow

### Step 1: Access the Platform

1. Go to **https://galaxyco-ai-20.vercel.app/**
2. Sign in with Clerk (create account if needed)
3. Ensure you're in a workspace

### Step 2: Navigate to Agents

1. Look for **"Agents"** in the navigation
2. Click to go to the agents list page
3. If no agents exist, create a simple test agent first

### Step 3: Test Mock Mode Execution 🎭

1. Click on any agent to open details
2. Look for a **"Test"** button or **TestPanel**
3. **Toggle to Mock Mode** (should show 🎭 Mock indicator)
4. Enter test JSON input:
   ```json
   {
     "email_content": "Hi team, let's schedule our Q1 planning meeting for next week",
     "subject": "Q1 Planning Meeting"
   }
   ```
5. Click **"▶️ Run Test"**
6. **Verify Results**:
   - ✅ Response appears quickly (~300ms)
   - ✅ Mock data is returned (action items, sentiment, etc.)
   - ✅ Metrics shown: tokens, cost, latency, model
   - ✅ Success badge displayed

### Step 4: Test Live Mode Execution 🚀 (Optional)

1. **Toggle to Live Mode** (should show 🚀 Live indicator)
2. Use same JSON input as above
3. Click **"▶️ Run Test"**
4. **Expected**:
   - ✅ Takes longer (~2-3 seconds)
   - ✅ Real AI response from OpenAI
   - ✅ Actual token usage and cost displayed
   - ⚠️ **Note**: Requires OpenAI API key in environment

---

## ✅ Success Criteria

### UI/UX Validation

- [ ] TestPanel opens smoothly
- [ ] Mode toggle works clearly (🎭 Mock / 🚀 Live)
- [ ] Input JSON validation works
- [ ] Loading states display properly
- [ ] Results format nicely
- [ ] Metrics badges appear
- [ ] Mobile responsive

### Mock Mode Tests

- [ ] Fast response (<500ms)
- [ ] Deterministic mock data returned
- [ ] No API calls to OpenAI
- [ ] Cost shows mock value ($0.0023)
- [ ] Success rate: 100%

### Error Handling

- [ ] Invalid JSON shows clear error
- [ ] Empty input handled gracefully
- [ ] Network errors display helpfully
- [ ] Authentication required properly

---

## 🚨 If Issues Found

### Common Issues & Solutions

**Issue: "Agent not found"**

- Solution: Create a test agent first in the agents section

**Issue: "Not authenticated"**

- Solution: Make sure you're signed in with Clerk

**Issue: TestPanel doesn't open**

- Solution: Check browser console for errors

**Issue: Live mode fails**

- Solution: Expected without OpenAI API keys - test mock mode instead

**Issue: UI looks broken**

- Solution: Hard refresh (Ctrl+F5) to clear cache

### Report Issues

If you find any problems:

1. **Screenshot** the issue
2. **Check browser console** for errors
3. **Note the steps** that led to the problem
4. **Test on different browser** if possible

---

## 📊 What You Should See

### Mock Mode Success Response

```json
{
  "success": true,
  "output": {
    "summary": "Analyzed input and extracted key insights",
    "actionItems": [
      "Review provided content for priority items",
      "Schedule follow-up discussion",
      "Document key findings"
    ],
    "priority": "medium",
    "sentiment": "neutral",
    "confidence": 0.85
  },
  "metrics": {
    "tokens": 267,
    "cost": 0.0023,
    "latencyMs": 432,
    "model": "mock-model"
  },
  "mode": "mock"
}
```

### UI Elements to Verify

- **Mode Toggle**: Clear visual difference between Mock/Live
- **Loading State**: Spinner while processing
- **Success Badges**: Green ✓ Success indicator
- **Metrics Cards**: Token count, cost, latency, model
- **JSON Display**: Formatted with copy button
- **Error Messages**: Clear and helpful when they occur

---

## 🎉 Expected Experience

**Mock Mode**: Should be **lightning fast** and **always work** - perfect for demos and development testing.

**Live Mode**: Should connect to real AI (when keys configured) and return actual intelligent responses.

**Overall**: Professional, smooth, and reliable interface that makes agent testing a joy!

---

## 📞 Support

If you encounter any issues:

- **Expected**: Mock mode should work flawlessly
- **Debugging**: Check browser developer console
- **Fallback**: Try different agents or refresh the page

---

**Happy Testing!** 🚀 This feature represents a major milestone for your GalaxyCo.ai platform.
