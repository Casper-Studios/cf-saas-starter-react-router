# UX Product Thinking Examples

Complete examples of the UX product thinking process applied to real features.

---

## Example 0: Competitive Research (Pricing Page Redesign)

Before redesigning a pricing page, research how competitors handle it.

### Tavily Research Commands

**Step 1: Find competitor pricing pages**
```
tavily_search:
  query: "SaaS pricing page examples high conversion 2026"
  max_results: 10
  search_depth: "advanced"
  include_images: true
```

**Step 2: Extract specific competitors**
```
tavily_extract:
  urls: [
    "https://linear.app/pricing",
    "https://notion.so/pricing", 
    "https://vercel.com/pricing"
  ]
  extract_depth: "advanced"
  include_images: true
  query: "pricing tiers features comparison annual monthly"
```

**Step 3: Search for best practices**
```
tavily_search:
  query: "pricing page UX psychology conversion optimization"
  max_results: 10
  search_depth: "advanced"
```

### Research Findings Template

```markdown
## Competitive Research: Pricing Page

### Competitors Analyzed
| Competitor | Tiers | Highlight Tier | Free Tier | Annual Discount |
|------------|-------|----------------|-----------|-----------------|
| Linear | 3 | Pro (middle) | Yes | 20% |
| Notion | 4 | Plus (middle) | Yes | ~17% |
| Vercel | 3 | Pro (middle) | Yes | 2 months free |

### Branding Patterns
**Color usage on pricing:**
- Linear: Minimal, purple accents on recommended tier
- Notion: Clean white, subtle shadows, brand orange for CTAs
- Vercel: Dark mode, gradient borders on featured tier

**Common patterns:**
- Middle tier highlighted (recommended)
- Feature comparison table below tiers
- FAQ section at bottom
- Toggle for monthly/annual
- "Contact sales" for enterprise

### UX Patterns to Adopt
1. **Highlighted recommended tier**: All competitors use visual distinction
2. **Feature checkmarks**: Clear ✓/✗ for quick scanning
3. **Annual savings callout**: Show dollar amount saved, not just %
4. **Sticky CTA on mobile**: Pricing summary stays visible on scroll

### Differentiation Opportunities
- Most competitors bury feature limits in fine print → Be transparent upfront
- Few show "cost per user" math → Add calculator for team pricing
- Limited social proof on pricing pages → Add customer logos/quotes
```

### Mermaid: Competitive Positioning

```mermaid
quadrantChart
    title Pricing Page Positioning
    x-axis Simple Tiers --> Complex Tiers
    y-axis Budget Focus --> Premium Focus
    quadrant-1 Enterprise
    quadrant-2 Premium Simple
    quadrant-3 SMB Friendly
    quadrant-4 Feature Heavy
    Linear: [0.3, 0.7]
    Notion: [0.5, 0.5]
    Vercel: [0.4, 0.8]
    Our Target: [0.3, 0.5]
```

This research then feeds into Phase 1 (Product Goals) where you define what success looks like for your pricing page based on competitive gaps identified.

---

## Example 1: User Settings Feature

### Phase 1: Product Goals

```markdown
## Feature: User Settings

### Business Goals
- Primary: Reduce support tickets related to account issues by 30%
- Secondary: Increase user profile completion rate

### Success Metrics
| Metric | Current | Target | How Measured |
|--------|---------|--------|--------------|
| Support tickets (account) | 50/week | 35/week | Zendesk |
| Profile completion | 40% | 70% | Analytics |
| Settings page bounce rate | 60% | 30% | PostHog |

### Constraints
- Technical: Must support email change with verification
- Business: Launch within 2 sprints
- Design: Use existing component library
```

### Phase 2: User Analysis

```markdown
## Persona: Alex - Power User

**Role**: Team lead using the product daily
**Goal**: Quickly update account preferences without leaving workflow
**Pain Points**: 
- Can't find settings easily
- Password change requires contacting support
- No way to manage notification preferences

**Context**: Uses product on desktop during work hours
**Tech Comfort**: High
```

### Phase 3: User Flow

```mermaid
flowchart TD
    Entry([Click avatar]) --> Menu[User dropdown menu]
    Menu --> Settings[Settings page]
    
    Settings --> Tab{Which setting?}
    Tab -->|Profile| Profile[Profile section]
    Tab -->|Security| Security[Security section]
    Tab -->|Notifications| Notif[Notifications section]
    
    Profile --> EditProfile[Edit fields]
    EditProfile --> SaveProfile{Save?}
    SaveProfile -->|Yes| ValidateProfile{Valid?}
    ValidateProfile -->|Yes| SuccessProfile[Show success toast]
    ValidateProfile -->|No| ErrorProfile[Show inline errors]
    ErrorProfile --> EditProfile
    
    Security --> ChangePassword[Change password form]
    ChangePassword --> VerifyOld{Old password correct?}
    VerifyOld -->|Yes| SetNew[Set new password]
    VerifyOld -->|No| PasswordError[Show error]
    SetNew --> SuccessSecurity[Success + logout other sessions]
```

### Phase 4: Component Architecture

```mermaid
flowchart TD
    subgraph SettingsPage
        subgraph Navigation
            Tabs[TabList]
        end
        subgraph Content
            ProfileForm[ProfileForm]
            SecurityForm[SecurityForm]
            NotificationForm[NotificationForm]
        end
    end
    
    ProfileForm --> AvatarUpload[AvatarUpload]
    ProfileForm --> TextField[TextField]
    ProfileForm --> SaveButton[SaveButton]
    
    SecurityForm --> PasswordInput[PasswordInput]
    SecurityForm --> TwoFactorToggle[TwoFactorToggle]
    
    NotificationForm --> NotificationGroup[NotificationGroup]
    NotificationGroup --> Switch[Switch]
```

### Phase 5: Wireframe Spec

```markdown
## Screen: Settings Page

### Layout
┌─────────────────────────────────────────┐
│ ← Back to Dashboard    User Settings    │
├─────────────────────────────────────────┤
│ [Profile] [Security] [Notifications]    │
├─────────────────────────────────────────┤
│  ┌──────┐                               │
│  │Avatar│  Name: [_______________]      │
│  │Upload│  Email: [_______________]     │
│  └──────┘  Bio: [________________]      │
│                  [________________]      │
│                                         │
│            [Cancel]  [Save Changes]     │
└─────────────────────────────────────────┘

### Responsive Behavior
- Mobile: Tabs become dropdown selector
- Tablet: Same as desktop but narrower form
- Desktop: Full-width with comfortable spacing

### Interactions
1. Tab click: Switch to selected section with fade transition
2. Form field: Inline validation on blur
3. Save button: Disabled until changes made, shows loading state
4. Avatar: Click opens file picker, shows preview before save
```

### Context-Keeper Documentation

```markdown
## Features

### User Settings
**Purpose**: Allow users to manage profile, security, and notification preferences

**User Flow**:
\`\`\`mermaid
flowchart LR
    Avatar --> Menu --> Settings --> Tabs --> Forms --> Save
\`\`\`

**Key Components**:
- `SettingsPage` - Container with tab navigation
- `ProfileForm` - Name, email, bio, avatar upload
- `SecurityForm` - Password change, 2FA toggle
- `NotificationForm` - Email/push notification preferences

**Files**: `app/routes/settings.tsx`, `app/components/settings/`

**UX Decisions**:
- Used tabs over accordion (faster access to any section)
- Inline validation (immediate feedback, fewer form errors)
- Confirmation dialog for email change (prevent accidental lockout)
```

---

## Example 2: Search Feature

### Phase 1: Product Goals

```markdown
## Feature: Global Search

### Business Goals
- Primary: Increase feature discoverability (reduce "I didn't know that existed")
- Secondary: Reduce time to find content by 50%

### Success Metrics
| Metric | Current | Target | How Measured |
|--------|---------|--------|--------------|
| Avg searches/user/day | 0.5 | 2 | Analytics |
| Search success rate | N/A | 80% | Click after search |
| Time to find item | 45s | 20s | Session recording |
```

### Phase 2: User Analysis

```markdown
## Persona: Jordan - New User

**Role**: Recently onboarded team member
**Goal**: Find specific documents or features quickly
**Pain Points**: 
- Doesn't know where things are located
- Navigation hierarchy is deep
- Different content types in different places

**Context**: Uses product across mobile and desktop
**Tech Comfort**: Medium
```

### Phase 3: User Flow

```mermaid
flowchart TD
    Trigger([Cmd+K or click search]) --> Modal[Search modal opens]
    Modal --> Type[User types query]
    Type --> Debounce[300ms debounce]
    Debounce --> Search[Search API call]
    Search --> Results{Results found?}
    
    Results -->|Yes| Display[Show categorized results]
    Results -->|No| Empty[Show empty state + suggestions]
    
    Display --> Select[User selects result]
    Select --> Navigate[Navigate to item]
    Navigate --> Close[Modal closes]
    
    Empty --> Refine[User refines query]
    Refine --> Type
    
    Modal --> Escape[Press Escape]
    Escape --> Close
```

### Phase 4: Component Architecture

```mermaid
flowchart TD
    subgraph SearchModal
        Input[SearchInput]
        Results[SearchResults]
        Footer[SearchFooter]
    end
    
    Results --> ResultGroup1[ResultGroup: Documents]
    Results --> ResultGroup2[ResultGroup: People]
    Results --> ResultGroup3[ResultGroup: Settings]
    
    ResultGroup1 --> ResultItem[ResultItem]
    ResultItem --> Icon[TypeIcon]
    ResultItem --> Title[ItemTitle]
    ResultItem --> Preview[ItemPreview]
    ResultItem --> Shortcut[KeyboardShortcut]
```

### State Machine

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: Cmd+K / click
    
    state Open {
        [*] --> Idle
        Idle --> Searching: input change
        Searching --> HasResults: results returned
        Searching --> NoResults: empty results
        HasResults --> Idle: clear input
        NoResults --> Idle: clear input
        HasResults --> Searching: input change
        NoResults --> Searching: input change
    }
    
    Open --> Closed: Escape / click outside
    Open --> Navigating: select result
    Navigating --> Closed: navigation complete
```

### Journey Map

```mermaid
journey
    title Search Feature Journey
    section Trigger
      Press Cmd+K: 5: User
      See search modal: 5: User
    section Search
      Type query: 5: User
      Wait for results: 3: User
      Scan results: 4: User
    section Navigate
      Select result: 5: User
      Arrive at destination: 5: User
```

---

## Example 3: Onboarding Flow

### Phase 1: Product Goals

```markdown
## Feature: User Onboarding

### Business Goals
- Primary: Increase Day 7 retention from 30% to 50%
- Secondary: Reduce time to first value (first meaningful action)

### Success Metrics
| Metric | Current | Target | How Measured |
|--------|---------|--------|--------------|
| Onboarding completion | 45% | 80% | Analytics |
| Time to first value | 15 min | 5 min | Analytics |
| Day 7 retention | 30% | 50% | Cohort analysis |
```

### Phase 3: User Flow

```mermaid
flowchart TD
    Signup([User signs up]) --> Welcome[Welcome screen]
    Welcome --> Goal{What's your goal?}
    
    Goal -->|Personal| PersonalPath[Personal setup]
    Goal -->|Team| TeamPath[Team setup]
    
    PersonalPath --> Profile[Set up profile]
    TeamPath --> Invite[Invite team members]
    Invite --> Workspace[Name workspace]
    Workspace --> Profile
    
    Profile --> FirstAction[Guided first action]
    FirstAction --> Success[Celebration moment]
    Success --> Dashboard[Go to dashboard]
    
    subgraph Skip["Skip options"]
        Welcome -.->|Skip| Dashboard
        Profile -.->|Skip| FirstAction
    end
```

### Wireframe Spec

```markdown
## Screen: Onboarding - Welcome

### Layout
┌─────────────────────────────────────────┐
│                                         │
│           Welcome to [Product]          │
│                                         │
│        What brings you here today?      │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🏠  Personal projects          │   │
│   │      Organize my own work       │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  👥  Team collaboration         │   │
│   │      Work with my team          │   │
│   └─────────────────────────────────┘   │
│                                         │
│               [Skip for now]            │
│                                         │
│            Step 1 of 4  ●○○○            │
└─────────────────────────────────────────┘

### Interactions
1. Card hover: Subtle lift effect
2. Card click: Animate to next step
3. Skip link: Go directly to dashboard with reminder tooltip
4. Progress dots: Show current position, not clickable
```

---

## Using These Examples

When applying UX product thinking to your feature:

1. **Copy the relevant template sections** from the examples
2. **Customize for your specific feature** and users
3. **Create mermaid diagrams** appropriate to your feature's complexity
4. **Document in context.md** via context-keeper subagent

Remember: Not every feature needs all phases. Simple features may skip Phase 2 (user analysis) if users are well understood. Focus your effort where complexity and risk are highest.
