# 📐 DoubleO.ai Wireframe Documentation
## Complete UX Blueprint for GalaxyCo.ai / HomeAdvice.ai

**Version:** 1.0  
**Date:** October 14, 2025  
**Author:** Dalton Cox & Claude  
**Purpose:** Production reference for HomeAdvice.ai implementation

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Layout Patterns](#core-layout-patterns)
3. [Screen Inventory (All 13 Screens)](#screen-inventory)
4. [Design System](#design-system)
5. [User Flows](#user-flows)
6. [Component Library Mapping](#component-library-mapping)
7. [Mobile Considerations](#mobile-considerations)
8. [Implementation Notes](#implementation-notes)

---

## Architecture Overview

### Core Principles
- **Left sidebar navigation** (persistent, dark theme)
- **Full-width content area** (light theme, white background)
- **Persistent chat widget** (bottom-right, floating)
- **Action-first design** (primary action always visible)
- **Empty states** (instructional, never dead-ends)
- **Progressive disclosure** (show complexity only when needed)

### Application Shell

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] OO        Top Header              [+ Action]    │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Sidebar     │        Main Content Area                 │
│  (Dark)      │        (Light/White BG)                  │
│              │                                           │
│  Automations │        Dynamic Content                   │
│  Templates   │        Per Route                         │
│  Chat        │                                           │
│  Knowledge   │                                           │
│  Databases   │                                           │
│  Settings    │                                           │
│              │                                           │
│  ─────────   │                                           │
│  Help        │                                           │
│  User Name   │                                           │
│  Logout      │                                    [💬]   │
│              │                                    Chat   │
└──────────────┴──────────────────────────────────────────┘
```

---

## Core Layout Patterns

### Pattern 1: Sidebar + Table View
**Used for:** Automations, Databases  
**Ratio:** 200px sidebar : flexible content

```
┌────────┬─────────────────────────────────────────┐
│        │  Page Title              [+ New Button] │
│        ├─────────────────────────────────────────┤
│        │  🔍 Search...           Filters ▼       │
│ Side   ├─────────────────────────────────────────┤
│ bar    │  Column  │ Column │ Column │ Actions    │
│        ├──────────┼────────┼────────┼────────    │
│        │  Data    │  Data  │  Data  │  [Action]  │
│        │  Data    │  Data  │  Data  │  [Action]  │
│        │  Data    │  Data  │  Data  │  [Action]  │
└────────┴─────────────────────────────────────────┘
```

### Pattern 2: Sidebar + Grid View
**Used for:** Templates  
**Ratio:** 240px sidebar : flexible content

```
┌────────┬─────────────────────────────────────────┐
│        │  🔍 Search...           Filters ▼       │
│ Filters├─────────────────────────────────────────┤
│        │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│ • Cat1 │  │Card │  │Card │  │Card │  │Card │   │
│ • Cat2 │  └─────┘  └─────┘  └─────┘  └─────┘   │
│        │                                         │
│ Industry│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│ • Ind1 │  │Card │  │Card │  │Card │  │Card │   │
│ • Ind2 │  └─────┘  └─────┘  └─────┘  └─────┘   │
└────────┴─────────────────────────────────────────┘
```

### Pattern 3: Centered Card (Modal/Simple Views)
**Used for:** Onboarding, Chat selector, Simple forms

```
┌───────────────────────────────────────────────────┐
│                                                   │
│                                                   │
│              ┌───────────────────┐                │
│              │                   │                │
│              │   [Icon/Logo]     │                │
│              │                   │                │
│              │   Heading         │                │
│              │   Subheading      │                │
│              │                   │                │
│              │   [Input/Select]  │                │
│              │                   │                │
│              │   [Primary CTA]   │                │
│              │                   │                │
│              └───────────────────┘                │
│                                                   │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Pattern 4: Settings Layout
**Used for:** All settings pages

```
┌────────┬─────────────────────────────────────────┐
│        │  Settings Section Title                 │
│ Nav    ├─────────────────────────────────────────┤
│        │                                         │
│ • Item │  Form Group 1                           │
│ • Item │  Label                                  │
│ > Item │  [Input Field]              [Action]   │
│ • Item │                                         │
│ • Item │  Form Group 2                           │
│        │  Label                                  │
│        │  [Input Field]                          │
│        │                      [Action Button]    │
└────────┴─────────────────────────────────────────┘
```

---

## Screen Inventory

### Screen 1: Welcome Modal (Onboarding)

**Route:** First login / triggered onboarding  
**Purpose:** Introduce platform value and guide first steps

**Layout:**
```
Modal Overlay (60% screen width, vertically centered)

┌──────────────────────────────────────────┐
│  Welcome to DoubleO                 [X]  │
├──────────────────────────────────────────┤
│                                          │
│         [🤖 Animated Agent Icon]         │
│                                          │
│  DoubleO helps you automate complex      │
│  processes, using teams of AI agents.    │
│                                          │
│  You can use DoubleO for simple tasks    │
│  like extracting data from PDFs or       │
│  researching competitors, or much more   │
│  complex workflows like onboarding new   │
│  hires or financial reconciliation of    │
│  invoices & POs.                         │
│                                          │
│  Lets walk through creating your first   │
│  workflow!                               │
│                                          │
│  ① Click on the black tooltips to get a  │
│     deeper dive into our features. Then  │
│     click the gold hotspots to continue. │
│                                          │
│              [Get Started]               │
│                                          │
└──────────────────────────────────────────┘
```

**Components:**
- Modal backdrop (semi-transparent overlay)
- Card container (white background, rounded corners)
- Close button (X, top-right)
- Icon/illustration (centered, top of card)
- Heading (bold, 28-32px)
- Body text (16-18px, center-aligned, multi-paragraph)
- Instructional callout (numbered step with emoji)
- Primary CTA button (full-width or prominent center)

**User Journey:**
1. User logs in for first time
2. Modal appears automatically
3. User reads value proposition
4. User clicks "Get Started"
5. Modal closes → either goes to templates or automation builder

**Design Notes:**
- High contrast between text and background
- Animation on agent icon (subtle pulse or wave)
- Modal can't be dismissed accidentally (requires intentional X click or CTA)
- Tooltip/hotspot pattern introduced here (black tooltips + gold hotspots)

---

### Screen 2: Automations List

**Route:** `/automations` (default/home)  
**Purpose:** View, manage, and run all user-created workflows

**Layout:**
```
┌─ Automations ───────────────────────────────────────────────┐
│                                                              │
│  Automations | Systems                    [+ New Automation]│
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  🔍 Search by name...                    🏷️ Tags            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Name              | Tags    | Creation  | Last Run | Status │
├───────────────────┼─────────┼───────────┼──────────┼────────┤
│ Candidate         │ No tags │ Oct 14    │ N/A      │ ⚫ Run │
│ Assessor          │         │ 10:44 AM  │          │workflow│
├───────────────────┼─────────┼───────────┼──────────┼────────┤
│ CRM Updater       │ No tags │ Oct 14    │ N/A      │ ⚫ Run │
│                   │         │ 10:44 AM  │          │workflow│
├───────────────────┼─────────┼───────────┼──────────┼────────┤
│ Figure Out Your   │ No tags │ Oct 14    │ N/A      │ ⚫ Run │
│ DoubleO Use Case  │         │ 10:44 AM  │          │workflow│
├───────────────────┼─────────┼───────────┼──────────┼────────┤
│ Weekly            │ No tags │ Oct 14    │ N/A      │ ⚫ Run │
│ Competitive       │         │ 10:44 AM  │          │workflow│
│ Tracker           │         │           │          │        │
└──────────────────────────────────────────────────────────────┘
```

**Components:**
- **Tab Navigation** (Automations | Systems)
  - Active tab: underlined or highlighted
  - Inactive tab: gray text
- **Primary Action Button** (+ New Automation)
  - Top-right placement
  - High contrast (dark background, white text)
  - Always visible
- **Search Bar**
  - Left-aligned
  - Icon prefix (magnifying glass)
  - Placeholder: "Search by name..."
- **Filter Dropdown** (Tags)
  - Right of search
  - Badge icon
- **Data Table**
  - Headers: Name, Tags, Creation, Last Run, Status
  - Sortable columns
  - Row hover state
  - Row actions: 3-dot kebab menu (⋮) per row
  - Run button: Pill-shaped, dark background
  - "Total Credits" column visible in some views
  - "Actions" column for kebab menu

**Empty State:**
```
No automations found.
Create your first automation to get started.
       [+ New Automation]
```

**User Journey:**
1. User lands on /automations
2. Sees list of existing workflows OR empty state
3. Can search/filter
4. Can run a workflow (opens modal with options)
5. Can edit workflow (kebab menu → Edit)
6. Can create new workflow (+ New Automation button)

**Design Notes:**
- Table is full-width, scrollable if needed
- Status badges use color coding (future: green=success, red=error, gray=not run)
- "Last Run By" shows user avatar + name
- Clicking row opens detail view (not shown in screenshots)

---

### Screen 3: Templates Gallery

**Route:** `/templates`  
**Purpose:** Browse and use pre-built workflow templates

**Layout:**
```
┌─ Templates ─────────────────────────────────────────────────┐
│  🔍 Search...                            [Other Filters ▼]  │
├───────────────┬─────────────────────────────────────────────┤
│ CATEGORIES    │  All templates                              │
│               │                                             │
│ All           │  [Customer Support]                         │
│ Customer      │  ┌──────────────────┐ ┌──────────────────┐ │
│  Support      │  │ Customer Support │ │ Customer Support │ │
│ Finance       │  │                  │ │                  │ │
│ Marketing     │  │ Create a New     │ │ Support Article  │ │
│ Operations    │  │ Help Center      │ │ Writer           │ │
│ Product       │  │                  │ │                  │ │
│ Sales         │  │ Plan and create  │ │ Create and       │ │
│               │  │ a help center,   │ │ organize support │ │
│ INDUSTRY      │  │ from structure   │ │ content          │ │
│               │  │ to content       │ │                  │ │
│ All           │  │ creation         │ │ AGENTS INVOLVED: │ │
│ Accounting    │  │                  │ │ 🤖 Support Agent │ │
│ AI            │  │ AGENTS INVOLVED: │ │                  │ │
│ B2B Tech      │  │ 🤖 Support Agent │ └──────────────────┘ │
│ B2C Tech      │  │                  │                      │
│ DTC & Ecom    │  └──────────────────┘                      │
│ Education     │                                             │
│ Finance &     │  [Finance]                                  │
│  Professional │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐│
│ Food & Bev    │  │ Bank   │ │ Cat.   │ │ Invoice│ │ Log  ││
│ Healthcare    │  │ Recon. │ │ Bank   │ │ Proc.  │ │ New  ││
│ Hospitality   │  │        │ │ Trans. │ │        │ │ Inv. ││
│ Logistics &   │  └────────┘ └────────┘ └────────┘ └──────┘│
│  Supply Chain │                                             │
│ Manufacturing │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐│
│ Media & Ent.  │  │ Mon.   │ │ Mon.   │ │ Payable│ │ Rec. ││
│ Real Estate & │  │ Cash & │ │ Payable│ │ Recon. │ │ Rec. ││
│  Construction │  │ Burn   │ │ Report │ │        │ │      ││
│ Sales         │  └────────┘ └────────┘ └────────┘ └──────┘│
│ Small Business│                                             │
└───────────────┴─────────────────────────────────────────────┘
```

**Components:**
- **Left Sidebar (Filters)**
  - Width: ~240px
  - Sections: Categories, Industry
  - Each section: collapsible accordion
  - Filter items: clickable, highlight on select
  - "All" option at top of each section
- **Search Bar** (top, spans main content area)
  - Icon prefix
  - Placeholder: "Search..."
- **Filter Button** (top-right)
  - "Other Filters" dropdown
  - Opens additional filter options
- **Template Cards** (grid layout)
  - 3-4 cards per row
  - Card structure:
    - Category badge (top, pill-shaped, color-coded)
    - Title (bold, 18-20px)
    - Description (gray text, 2-3 lines)
    - "Agents Involved" section (bottom)
      - Icon + agent name
  - Hover state: subtle shadow/border
  - Click: Opens template detail (not shown)

**Category Color Coding:**
- Customer Support: Pink (#EC4899)
- Finance: Green (#10B981)
- Marketing: Blue (#3B82F6)
- Operations: Purple
- Product: Orange
- Sales: Red

**User Journey:**
1. User navigates to Templates
2. Browses by category/industry OR searches
3. Clicks on a template card
4. Views template details (modal or new page)
5. Clicks "Use Template" or "Customize"
6. Template is copied to user's automations
7. User can edit and configure

**Design Notes:**
- Cards use consistent aspect ratio
- Grid is responsive (4 cols → 3 cols → 2 cols → 1 col)
- Category sections can be collapsed for easier browsing
- Horizontal scrolling within category sections (if too many cards)

---

### Screen 4: Databases (Empty State)

**Route:** `/databases`  
**Purpose:** View and manage databases created by workflows

**Layout:**
```
┌─ Databases ─────────────────────────────────────────────────┐
│  🔍 Search databases...                  [+ Add Database]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                                                             │
│                      [📊 Empty Icon]                        │
│                                                             │
│                                                             │
│              No databases found. Create your                │
│              first database from a workflow.                │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Search bar (top-left)
- Primary action button (+ Add Database, top-right)
- Empty state:
  - Icon (centered, subtle color, large ~80-100px)
  - Message text (centered, gray, 16px)
  - Instructional hint (how to create first database)
  - Optional CTA button (though not shown in screenshot)

**Populated State** (inferred, not shown in screenshots):
```
┌─ Databases ─────────────────────────────────────────────────┐
│  🔍 Search databases...                  [+ Add Database]   │
├─────────────────────────────────────────────────────────────┤
│ Name            | Source      | Created   | Records | Actions│
├─────────────────┼─────────────┼───────────┼─────────┼───────┤
│ Lead Database   │ Lead Intel  │ Oct 10    │ 234     │ ⋮     │
│ Email Outreach  │ Email Agent │ Oct 12    │ 87      │ ⋮     │
└─────────────────────────────────────────────────────────────┘
```

**User Journey:**
1. User navigates to Databases
2. Sees empty state (if first time) OR list of databases
3. Can search existing databases
4. Can add new database manually (+ button)
5. Typically, databases are auto-created by workflows
6. Clicking a database opens detail view

**Design Notes:**
- Empty states should be encouraging, not discouraging
- Clear path forward (mention "from a workflow")
- Consistent empty state pattern across all list views

---

### Screen 5: Chat (Chatbot Selector)

**Route:** `/chat`  
**Purpose:** Select and interact with AI chatbots/agents

**Layout:**
```
┌─ Chat ──────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                                                             │
│                        [💬 Icon]                            │
│                                                             │
│                                                             │
│              What chatbot do you want to run?               │
│              Select chatbot you want to chat with           │
│                                                             │
│                                                             │
│              Chatbot                                        │
│              ┌────────────────────────────────────┐         │
│              │ Select chat...                  ▼ │         │
│              └────────────────────────────────────┘         │
│                                                             │
│                                                             │
│                     [Chat - Disabled]                       │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Centered card (max-width ~600px)
- Icon (top, centered, ~60-80px)
- Heading (bold, 24px)
- Subheading (gray, 16px)
- Label ("Chatbot")
- Dropdown select (full-width within card)
  - Placeholder: "Select chat..."
  - Down arrow indicator
- CTA button (full-width, initially disabled)
  - Label: "Chat"
  - Disabled state: gray, no hover effect
  - Enabled state: primary color, clickable

**User Journey:**
1. User clicks "Chat" in sidebar
2. Sees chatbot selector
3. Opens dropdown
4. Selects a chatbot from list
5. Button becomes enabled
6. Clicks "Chat"
7. Chat interface opens (either modal or new view)

**Chat Interface** (inferred, not shown):
```
┌─ Chat: Support Agent ───────────────────────────┐
│  [Back]                              [⋮ Menu]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  🤖 How can I help you today?                   │
│                                                 │
│  👤 Help me create a knowledge base             │
│                                                 │
│  🤖 I can help with that! Let's start by...     │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  Type a message...                     [Send]   │
└─────────────────────────────────────────────────┘
```

**Design Notes:**
- Progressive disclosure: button disabled until valid selection
- Clear instructions prevent user confusion
- Centered layout emphasizes single task
- Chat interface likely appears as modal overlay or replaces selector

---

### Screen 6: Knowledge Base (Workspace Context)

**Route:** `/knowledge-base`  
**Purpose:** Manage context and knowledge agents can access

**Layout:**
```
┌─ Knowledge Base ────────────────────────────────────────────┐
│                                                             │
│  Workspace context                                          │
│                                                             │
├──────────────────┬──────────────────────────────────────────┤
│ Context name     │ Instructions to AI on context purpose & │
│                  │ usage                                    │
├──────────────────┼──────────────────────────────────────────┤
│                  │                                          │
│                  │                                          │
│                  │                                          │
│                  │                                          │
│                                                             │
│                  [+ Add context item]                       │
│                  │                                          │
│                  │                                          │
│                  │                                          │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

**Components:**
- Page heading ("Knowledge Base")
- Section heading ("Workspace context")
- Table headers:
  - Context name
  - Instructions to AI on context purpose & usage
  - Content (inferred, may include preview)
  - Actions (inferred, likely edit/delete)
- Add button (centered in empty state)
- Table rows (when populated)

**Populated State** (inferred):
```
┌─ Knowledge Base ────────────────────────────────────────────┐
│  Workspace context                          [+ Add Context] │
├──────────────────┬──────────────────────────┬───────────────┤
│ Context name     │ Instructions             │ Actions       │
├──────────────────┼──────────────────────────┼───────────────┤
│ Company Overview │ Use this to understand   │ Edit | Delete │
│                  │ our core business model  │               │
├──────────────────┼──────────────────────────┼───────────────┤
│ Product Catalog  │ Reference when asked     │ Edit | Delete │
│                  │ about products/services  │               │
└──────────────────┴──────────────────────────┴───────────────┘
```

**User Journey:**
1. User navigates to Knowledge Base
2. Sees existing context items OR empty state
3. Clicks "+ Add context item"
4. Modal/form appears:
   - Name field
   - Instructions field (textarea)
   - Content upload/input (file upload or text entry)
5. Saves context item
6. Context is now available to AI agents in workflows
7. Can edit or delete existing items

**Design Notes:**
- This is a power-user feature (not for first-time users)
- Clear labeling of what "context" means
- Instructions help AI understand when to use context
- Content could be documents, FAQs, guidelines, etc.

---

### Screen 7: Settings - User Profile

**Route:** `/settings/user`  
**Purpose:** Update user account information and credentials

**Layout:**
```
┌─ Settings ──────────────────────────────────────────────────┐
│ Workspace                                                   │
│ App Integrations                                            │
│ Messaging Integrations                                      │
│ Nango Integrations                                          │
│ User                              >                         │
│ Billing                                                     │
│ API keys                                                    │
├─────────────────────────────────────────────────────────────┤
│  User Settings                                              │
│                                                             │
│  Profile Information                         Dalton Cox     │
│  Update your name and profile information                   │
│                                          [Update Profile]   │
│                                                             │
│  Update Password                                            │
│  Update credentials you use to login to DoubleO             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Current Password                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ New Password                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Confirm New Password                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│                                      [Update Password]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Left sidebar (settings navigation)
  - Vertical list of settings sections
  - Current section has ">" indicator
  - Sections: Workspace, App Integrations, Messaging, Nango, User, Billing, API keys
- Right content area
  - Page heading ("User Settings")
  - Form sections, each with:
    - Section heading
    - Description text
    - Form fields
    - Action button (right-aligned)
  
**Form Sections:**
1. **Profile Information**
   - Name display (right side)
   - Fields (inferred): Name, Email, etc.
   - Action: "Update Profile" button
   
2. **Update Password**
   - Current Password field (password input)
   - New Password field (password input)
   - Confirm New Password field (password input)
   - Action: "Update Password" button

**User Journey:**
1. User navigates to Settings
2. Selects "User" from sidebar
3. Updates profile information or password
4. Clicks respective action button
5. Receives success/error feedback
6. Changes are saved

**Design Notes:**
- Clear separation of form sections
- Action buttons aligned right for consistency
- Password fields have visibility toggle (inferred)
- Form validation before submission
- Success messages appear as toasts (inferred)

---

### Screen 8: Settings - App Integrations

**Route:** `/settings/integrations`  
**Purpose:** Connect third-party applications

**Layout:**
```
┌─ Settings ──────────────────────────────────────────────────┐
│ Workspace                                                   │
│ App Integrations                    >                       │
│ Messaging Integrations                                      │
│ Nango Integrations                                          │
│ User                                                        │
│ Billing                                                     │
│ API keys                                                    │
├─────────────────────────────────────────────────────────────┤
│  Manage Integrations                    [Add New Integration]│
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Logo]  Hubspot                      [Connect]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Logo]  Linear                       [Connect]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Logo]  Greenhouse                   [Connect]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Logo]  Github                       [Connect]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Logo]  Notion                       [Connect]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Logo]  Slack                        [Connect]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│                                                   (scroll)  │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Left sidebar (settings navigation)
- Right content area:
  - Section heading ("Manage Integrations")
  - Action button ("Add New Integration", top-right)
  - Integration cards (stacked vertically):
    - Logo (left, ~40-50px)
    - Integration name (center-left)
    - Status OR action button (right)
      - "Connect" (if not connected)
      - "Connected" (if already connected)
      - "Reconnect" (if expired)
  - Scrollable list

**Integration Categories** (inferred from logos):
- CRM: Hubspot
- Project Management: Linear
- HR/Recruiting: Greenhouse
- Code/DevOps: Github
- Documentation: Notion
- Communication: Slack

**User Journey:**
1. User navigates to Settings → App Integrations
2. Browses available integrations
3. Clicks "Connect" on desired integration
4. OAuth flow opens (new window/tab)
5. User authorizes DoubleO to access the app
6. Returns to settings page
7. Integration now shows "Connected" status
8. Integration can be used in workflows

**Design Notes:**
- Logos should be high-quality, recognizable
- Clear status indicators (color + text)
- "Add New Integration" suggests more integrations available than shown
- Clicking connected integration opens config/settings
- Cards have subtle borders and hover states

---

### Screen 9: Settings - Workspace

**Route:** `/settings/workspace`  
**Purpose:** Manage workspace-level settings (inferred, not shown in detail)

**Layout:**
```
┌─ Settings ──────────────────────────────────────────────────┐
│ Workspace                             >                     │
│ App Integrations                                            │
│ ...                                                         │
├─────────────────────────────────────────────────────────────┤
│  Workspace Settings                                         │
│                                                             │
│  Workspace Name                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ My Workspace                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                              [Save]         │
│                                                             │
│  Team Members                             [Invite Member]  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Name         | Email            | Role    | Actions  │  │
│  │ John Doe     | john@example.com | Admin   | Remove   │  │
│  │ Jane Smith   | jane@example.com | Member  | Remove   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Screen 10: Settings - Billing

**Route:** `/settings/billing`  
**Purpose:** Manage subscription and payment methods (inferred)

---

### Screen 11: Settings - API Keys

**Route:** `/settings/api-keys`  
**Purpose:** Generate and manage API keys for programmatic access (inferred)

---

### Screen 12: Help Page

**Route:** `/help` or accessible via sidebar  
**Purpose:** Access documentation, FAQs, support (inferred)

---

### Screen 13: Floating Chat Widget

**Location:** Persistent, bottom-right corner (all pages)  
**Purpose:** Quick access to AI assistant

**Collapsed State:**
```
                                    ┌─────┐
                                    │ 💬  │
                                    │     │
                                    └─────┘
```

**Expanded State:**
```
                    ┌────────────────────────┐
                    │ GalaxyCo Assistant  [×]│
                    ├────────────────────────┤
                    │                        │
                    │ 🤖 How can I help?     │
                    │                        │
                    │ 👤 [User message]      │
                    │                        │
                    │ 🤖 [Assistant reply]   │
                    │                        │
                    │                        │
                    ├────────────────────────┤
                    │ Type message... [Send] │
                    └────────────────────────┘
```

**Components:**
- Floating button (collapsed)
  - Icon: Chat bubble or assistant icon
  - Badge: Notification count (if any)
  - Z-index: High (always on top)
- Expanded chat window
  - Header: Title + close button
  - Message area: Scrollable
  - Input area: Text field + send button

**User Journey:**
1. Widget visible on all pages
2. Click to expand
3. Chat with assistant
4. Assistant can help with:
   - Navigation ("Show me my automations")
   - Questions ("How do I add an integration?")
   - Quick actions ("Run my lead generation workflow")
5. Close to collapse

---

## Design System

### Color Palette

```scss
// Primary/Brand
$brand-primary: #F59E0B;      // Gold/Orange (CTAs, highlights)
$brand-secondary: #3B82F6;    // Blue (links, info)

// Backgrounds
$bg-dark: #1A1A1A;           // Sidebar background
$bg-light: #FFFFFF;          // Main content background
$bg-muted: #F3F4F6;          // Subtle backgrounds (empty states, cards)

// Text
$text-primary: #111827;      // Headings, primary text
$text-secondary: #6B7280;    // Body text, descriptions
$text-muted: #9CA3AF;        // Placeholder text, disabled

// Borders
$border-default: #E5E7EB;    // Standard borders
$border-focus: #3B82F6;      // Focus states

// Status Colors
$success: #10B981;           // Green (completed, success)
$warning: #F59E0B;           // Orange (warning, pending)
$error: #EF4444;             // Red (errors, critical)
$info: #3B82F6;              // Blue (info, neutral)

// Category Colors (for badges/pills)
$category-support: #EC4899;  // Pink
$category-finance: #10B981;  // Green
$category-marketing: #3B82F6; // Blue
$category-operations: #8B5CF6; // Purple
$category-product: #F59E0B;   // Orange
$category-sales: #EF4444;     // Red
```

### Typography

```scss
// Font Family
$font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", 
               Roboto, "Helvetica Neue", Arial, sans-serif;

// Font Sizes
$text-xs: 12px;    // Captions, labels
$text-sm: 14px;    // Body text (small)
$text-base: 16px;  // Body text (default)
$text-lg: 18px;    // Subheadings
$text-xl: 20px;    // Section headings
$text-2xl: 24px;   // Page headings
$text-3xl: 30px;   // Hero headings
$text-4xl: 36px;   // Modal/landing headings

// Font Weights
$weight-normal: 400;
$weight-medium: 500;
$weight-semibold: 600;
$weight-bold: 700;

// Line Heights
$leading-tight: 1.25;
$leading-normal: 1.5;
$leading-relaxed: 1.75;
```

### Spacing Scale

```scss
// Spacing (Tailwind-inspired)
$space-1: 4px;     // 0.25rem
$space-2: 8px;     // 0.5rem
$space-3: 12px;    // 0.75rem
$space-4: 16px;    // 1rem
$space-5: 20px;    // 1.25rem
$space-6: 24px;    // 1.5rem
$space-8: 32px;    // 2rem
$space-10: 40px;   // 2.5rem
$space-12: 48px;   // 3rem
$space-16: 64px;   // 4rem

// Common Usage
// - Card padding: $space-6 (24px)
// - Section gaps: $space-6 to $space-8
// - Grid gaps: $space-4 to $space-6
// - Button padding: $space-3 vertical, $space-6 horizontal
```

### Border Radius

```scss
$radius-sm: 4px;    // Inputs, subtle elements
$radius-md: 8px;    // Buttons, cards
$radius-lg: 12px;   // Modals, large cards
$radius-xl: 16px;   // Hero cards
$radius-full: 9999px; // Pills, circular buttons
```

### Shadows

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Components

#### Buttons

```scss
// Primary Button
.btn-primary {
  background: $text-primary;  // Dark
  color: white;
  padding: $space-3 $space-6;
  border-radius: $radius-md;
  font-weight: $weight-medium;
  
  &:hover {
    background: lighten($text-primary, 10%);
  }
}

// Secondary Button
.btn-secondary {
  background: white;
  color: $text-primary;
  border: 1px solid $border-default;
  padding: $space-3 $space-6;
  border-radius: $radius-md;
  
  &:hover {
    background: $bg-muted;
  }
}

// Button Sizes
.btn-sm { padding: $space-2 $space-4; font-size: $text-sm; }
.btn-md { padding: $space-3 $space-6; font-size: $text-base; }
.btn-lg { padding: $space-4 $space-8; font-size: $text-lg; }
```

#### Cards

```scss
.card {
  background: white;
  border: 1px solid $border-default;
  border-radius: $radius-md;
  padding: $space-6;
  
  &:hover {
    box-shadow: $shadow-md;
    border-color: darken($border-default, 10%);
  }
}
```

#### Inputs

```scss
.input {
  border: 1px solid $border-default;
  border-radius: $radius-sm;
  padding: $space-3 $space-4;
  font-size: $text-base;
  
  &::placeholder {
    color: $text-muted;
  }
  
  &:focus {
    outline: none;
    border-color: $border-focus;
    box-shadow: 0 0 0 3px rgba($border-focus, 0.1);
  }
}
```

#### Badges/Pills

```scss
.badge {
  display: inline-flex;
  align-items: center;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  font-size: $text-xs;
  font-weight: $weight-medium;
  
  &.badge-support { background: lighten($category-support, 40%); color: $category-support; }
  &.badge-finance { background: lighten($category-finance, 40%); color: $category-finance; }
  // ... etc
}
```

#### Tables

```scss
.table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: $space-3 $space-4;
    font-weight: $weight-semibold;
    font-size: $text-sm;
    color: $text-secondary;
    border-bottom: 1px solid $border-default;
  }
  
  td {
    padding: $space-4;
    border-bottom: 1px solid $border-default;
  }
  
  tr:hover {
    background: $bg-muted;
  }
}
```

---

## User Flows

### Flow 1: First-Time User Onboarding

```
1. User signs up / logs in for first time
   ↓
2. Welcome modal appears
   ↓
3. User reads value prop, clicks "Get Started"
   ↓
4. Modal closes, user sees main dashboard
   ↓
5. Option A: Browse templates
   - Click "Templates" in sidebar
   - Browse by category
   - Select a template
   - Click "Use Template"
   - Template copied to automations
   - User customizes workflow
   ↓
6. Option B: Create from scratch
   - Click "+ New Automation" button
   - Workflow builder opens
   - User builds workflow step-by-step
   - Saves automation
   ↓
7. User returns to Automations list
   ↓
8. User runs first automation
   - Clicks "Run workflow" button
   - Sees progress/results
   ↓
9. Success! User is onboarded
```

### Flow 2: Running an Existing Automation

```
1. User on Automations page
   ↓
2. Finds automation (search or scroll)
   ↓
3. Clicks "Run workflow" button
   ↓
4. Modal appears (inferred):
   - Configure run parameters (if any)
   - Confirm execution
   ↓
5. Automation runs (background or foreground)
   ↓
6. User sees status updates
   - "Running..." indicator
   - Progress bar (if applicable)
   ↓
7. Automation completes
   - Success message
   - Results displayed
   - Option to download output
   ↓
8. "Last Run" column updates in table
```

### Flow 3: Connecting an Integration

```
1. User navigates to Settings
   ↓
2. Clicks "App Integrations" in sidebar
   ↓
3. Scrolls to desired integration (e.g., Slack)
   ↓
4. Clicks "Connect" button
   ↓
5. New window/tab opens
   - OAuth provider page (e.g., Slack login)
   - User logs in (if not already)
   - Authorizes DoubleO access
   ↓
6. Redirect back to DoubleO
   ↓
7. Integration status changes to "Connected"
   ↓
8. Integration now available in workflows
   - User can select Slack actions
   - Can send messages, post to channels, etc.
```

### Flow 4: Using the Chat Assistant

```
1. User on any page
   ↓
2. Clicks floating chat widget (bottom-right)
   ↓
3. Chat window expands
   ↓
4. User types question (e.g., "How do I add a new automation?")
   ↓
5. Assistant responds with:
   - Text explanation
   - Clickable link to relevant page
   - OR step-by-step instructions
   ↓
6. User follows guidance
   ↓
7. User clicks link (e.g., to Templates page)
   ↓
8. Chat minimizes (or stays open)
   ↓
9. User completes task
   ↓
10. User returns to chat (optional) to thank or ask follow-up
```

### Flow 5: Adding Context to Knowledge Base

```
1. User navigates to Knowledge Base
   ↓
2. Clicks "+ Add context item"
   ↓
3. Modal/form appears:
   - Context name field
   - Instructions field (textarea)
   - Content upload or text entry
   ↓
4. User fills in fields:
   - Name: "Company Values"
   - Instructions: "Use this when asked about our mission"
   - Content: [uploads PDF or pastes text]
   ↓
5. Clicks "Save" button
   ↓
6. Modal closes
   ↓
7. New context item appears in table
   ↓
8. Context now available to all agents
   - Agents can reference it in workflows
   - Improves response accuracy
```

---

## Component Library Mapping

### For Hyper UI

| DoubleO Element | Hyper UI Component | Notes |
|---|---|---|
| Sidebar Navigation | `Navigation > Sidebar` | Dark theme, persistent |
| Data Tables | `Tables > Sortable Table` | Add search, filters |
| Template Cards | `Cards > Product Card` | Adapt for workflow templates |
| Search Bars | `Forms > Input with Icon` | Use search icon prefix |
| Primary Buttons | `Buttons > Primary` | Dark background |
| Secondary Buttons | `Buttons > Secondary` | White with border |
| Category Badges | `Badges > Pill Badge` | Color-coded |
| Empty States | `Empty States > Centered` | Icon + message + CTA |
| Modal Overlays | `Overlays > Modal` | Centered card |
| Settings Forms | `Forms > Stacked Form` | Vertical layout |
| Integration Cards | `Cards > Horizontal Card` | Logo + name + CTA |
| Dropdown Selects | `Forms > Select` | With chevron icon |
| Chat Widget | Custom Component | Build with Hyper UI primitives |
| Action Buttons | `Buttons > Icon Button` | Kebab menu (⋮) |
| Tab Navigation | `Navigation > Tabs` | Underline style |

### Custom Components to Build

1. **Floating Chat Widget**
   - Base: Hyper UI Button + Card
   - Add: Position fixed, z-index management
   - Includes: Collapsed state, expanded state, animations

2. **Workflow Run Button**
   - Base: Hyper UI Button
   - Add: Loading state, success/error states

3. **Template Card**
   - Base: Hyper UI Product Card
   - Customize: Badge positioning, agent info section

4. **Sidebar with Icons**
   - Base: Hyper UI Sidebar Navigation
   - Add: Icons for each nav item (lucide-react)

---

## Mobile Considerations

### Responsive Breakpoints

```scss
$breakpoint-sm: 640px;   // Mobile
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Large desktop
```

### Mobile Adaptations

1. **Sidebar → Hamburger Menu**
   - On mobile: Sidebar collapses to hamburger icon
   - Tapping opens overlay menu
   - Menu slides in from left

2. **Tables → Stacked Cards**
   - On mobile: Tables become vertically stacked cards
   - Each row becomes a card
   - Key info displayed prominently

3. **Grid → Single Column**
   - Template grid: 4 cols → 2 cols → 1 col
   - Cards expand to full width on mobile

4. **Chat Widget → Bottom Sheet**
   - On mobile: Chat expands to full-screen modal
   - Swipe down to minimize

5. **Forms → Full Width**
   - All form inputs full width
   - Buttons full width
   - Adequate touch targets (min 44px)

---

## Implementation Notes

### Tech Stack Alignment (from Project Instructions)

- **Frontend:** React 18 + TypeScript, Vite, Tailwind, Radix UI
- **Routing:** Wouter (lightweight)
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Animations:** Framer Motion (subtle, purposeful)

### Priority Order (for HomeAdvice.ai)

1. **Welcome Modal** (onboarding)
2. **Automations List** (core functionality)
3. **Floating Chat Widget** (AI assistant)
4. **Templates Gallery** (discovery)
5. **Settings Pages** (user management)
6. **Knowledge Base** (power user feature)
7. **Databases** (data management)

### Accessibility Requirements

- **Keyboard navigation:** All interactive elements tabbable
- **Focus indicators:** Clear visual focus states
- **ARIA labels:** Proper labels for screen readers
- **Color contrast:** Minimum 4.5:1 for text
- **Touch targets:** Minimum 44x44px on mobile
- **Alt text:** All images and icons

### Performance Targets

- **Initial load:** < 2s
- **Time to interactive:** < 3s
- **Page transitions:** < 200ms
- **Animations:** 60fps (use transform/opacity only)

---

## Appendix: Missing Information

Items not shown in screenshots but inferred or needed:

1. **Workflow Builder Interface**
   - Visual node-based editor (like n8n, Zapier)
   - Drag-and-drop nodes
   - Connection lines between steps
   - Node configuration panels

2. **Database Detail View**
   - Table schema viewer
   - Data preview
   - Export functionality

3. **Template Detail Page**
   - Full description
   - Agent configuration preview
   - "Use Template" CTA
   - User reviews/ratings (optional)

4. **User Profile Dropdown**
   - Avatar + name
   - Quick links (Settings, Logout)
   - Account info

5. **Notification System**
   - Toast notifications (success, error, info)
   - Badge counts (on sidebar items)

6. **Loading States**
   - Skeleton screens
   - Spinners
   - Progress indicators

7. **Error States**
   - Error messages
   - Retry buttons
   - Fallback UI

---

## Version History

- **v1.0** (Oct 14, 2025): Initial wireframe documentation based on DoubleO.ai screenshots

---

## Next Steps

1. **Review & Validate:** Confirm all screens captured accurately
2. **Component Inventory:** Map each UI element to Hyper UI components
3. **Implementation Packs:** Generate starter code for each screen
4. **Prototype:** Build interactive prototype with real data
5. **User Testing:** Validate flows with real users

---

**End of Wireframe Documentation**
