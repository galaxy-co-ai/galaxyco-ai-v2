# Visual Flow Builder - Quick Start Guide

**The key differentiator is ready to ship!** 🚀

---

## 🚀 Getting Started

### 1. Start the Development Server

```bash
# From project root
cd apps/web
pnpm dev
```

### 2. Navigate to Flow Builder

Open: http://localhost:3000/workflows/builder

---

## 📝 Test Cases

### Test 1: Simple Workflow

**Input:**

```
Email new leads every Monday
```

**Expected Output:**

- Start node (purple)
- Email action node (blue)
- End node (emerald)
- Connected with animated edges
- Auto-layouted horizontally

**Success Criteria:**

- ✅ Generated in < 10 seconds
- ✅ Smooth animations
- ✅ Proper node connections

---

### Test 2: Conditional Workflow

**Input:**

```
When a new lead comes in, check if they're in California.
If yes, send a personalized email. Otherwise, add to newsletter.
```

**Expected Output:**

- Start node
- Condition node (amber) - "Check if in California"
- Two branches:
  - True: Email action
  - False: Newsletter action
- End node

**Success Criteria:**

- ✅ Conditional logic detected
- ✅ Multiple outgoing edges from condition
- ✅ Clear visual branching

---

### Test 3: Integration Workflow

**Input:**

```
Every morning at 9am, check Slack for new messages in #sales,
create a summary, and post it to our team channel
```

**Expected Output:**

- Start node
- Slack integration node (green) - "Check #sales messages"
- Action node - "Create summary"
- Slack integration node (green) - "Post to team channel"
- End node

**Success Criteria:**

- ✅ Slack identified as integration (green gradient)
- ✅ Multiple integration nodes
- ✅ Sequential flow

---

### Test 4: Complex Multi-Step Workflow

**Input:**

```
When someone fills out the contact form:
1. Add them to CRM
2. Send welcome email
3. If they selected "Enterprise", notify sales team
4. Schedule follow-up for next week
```

**Expected Output:**

- Start node
- CRM integration (green)
- Email action (blue)
- Condition node (amber) - "Check if Enterprise"
- Slack/Email integration - "Notify sales"
- Action node - "Schedule follow-up"
- End node

**Success Criteria:**

- ✅ Complex flow properly parsed
- ✅ Sequential and conditional steps
- ✅ Multiple integration types
- ✅ Clear visual hierarchy

---

## 🎨 Visual Verification

### Animations Checklist

- [ ] Nodes fade in smoothly on generation
- [ ] Hover over node → scales up (1.05x)
- [ ] Click node → scales down (0.95x)
- [ ] Edges are animated
- [ ] Smooth zoom and pan
- [ ] Mini map shows flow overview

### Design Checklist

- [ ] Purple gradient for Start nodes
- [ ] Blue gradient for Action nodes
- [ ] Amber gradient for Condition nodes
- [ ] Green gradient for Integration nodes
- [ ] Emerald gradient for End nodes
- [ ] Icons match node types
- [ ] Typography is readable
- [ ] Spacing is consistent

---

## 💾 Save & Execute

### Save Workflow

1. Generate a workflow
2. Click "Save" button
3. Verify toast notification
4. Navigate to `/workflows`
5. Check workflow appears in list

### Execute Workflow

1. Generate a workflow
2. Click "Execute" button
3. Watch status updates on nodes
4. Verify toast with execution results
5. Check execution metrics

---

## 🐛 Troubleshooting

### "Failed to parse workflow"

**Cause:** GPT-4 API error or invalid input

**Fix:**

- Check OPENAI_API_KEY in .env
- Verify input is descriptive
- Try simpler workflow first

### Nodes not rendering

**Cause:** React Flow not loaded

**Fix:**

- Clear browser cache
- Check console for errors
- Verify all dependencies installed

### Layout looks wrong

**Cause:** elkjs auto-layout failed

**Fix:**

- Check browser console
- Fallback layout should still work
- Try refreshing the page

---

## 📊 Success Metrics

**Track these metrics during testing:**

1. **Generation Speed**
   - Target: < 10 seconds
   - Measure: From click to visual

2. **Parse Accuracy**
   - Target: > 90% correct structure
   - Measure: Does output match intent?

3. **User Confusion**
   - Target: < 5% need help
   - Measure: Can non-technical user succeed?

4. **Visual Quality**
   - Target: 60fps animations
   - Measure: Open DevTools Performance tab

---

## 🎯 Example Workflows to Try

**E-commerce:**

```
When a customer abandons their cart, wait 2 hours,
then send a reminder email with a 10% discount code
```

**Sales:**

```
When a demo is scheduled, add to Salesforce,
send calendar invite, and notify the sales team on Slack
```

**Marketing:**

```
Every Monday, pull analytics from Google Analytics,
create a summary report, and email it to the marketing team
```

**Customer Support:**

```
When a new support ticket comes in, check priority level.
If urgent, notify manager immediately. Otherwise, assign to queue.
```

---

## 🔥 Pro Tips

1. **Be Specific:** "Email leads" is vague. "Send welcome email to new leads every Monday at 9am" is perfect.

2. **Use Natural Language:** Write like you're explaining to a colleague, not writing code.

3. **Include Timing:** "every Monday", "when X happens", "after 2 hours" - timing helps GPT-4 understand.

4. **Name Integrations:** "Send to Slack" is better than "Send message" - GPT-4 will detect integrations.

5. **Think Sequentially:** Describe steps in order: "First X, then Y, finally Z"

---

## 📸 Screenshot Checklist

**For demo/docs, capture:**

1. Initial state (empty canvas with input box)
2. Natural language input entered
3. Generated workflow (full visual)
4. Hover state (node scaled up)
5. Save/Execute buttons
6. Execution with status indicators
7. Workflows list page

---

## 🚀 Next Steps After Testing

1. **Gather Feedback**
   - Show to 3-5 non-technical users
   - Record time to create first workflow
   - Note any confusion points

2. **Iterate UX**
   - Improve based on feedback
   - Add helpful hints/examples
   - Enhance error messages

3. **Add Real Integrations**
   - Gmail connector
   - Slack connector
   - CRM connector

4. **Create Templates**
   - Pre-built workflow templates
   - Industry-specific examples
   - "Start from template" feature

---

## 💡 Remember

**The North Star:**
"Make users feel like superheroes"

**Success = Non-technical user creates working workflow in < 60 seconds**

---

**Let's ship this! 🚀**
