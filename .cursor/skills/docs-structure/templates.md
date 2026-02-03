# Documentation Templates

Complete templates for each documentation type.

---

## Feature Architecture Document

```markdown
---
title: Feature Name Architecture
date: YYYY-MM-DD
---

# Feature Name: Information Architecture

Brief description of the feature.

---

## Table of Contents
1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [System Architecture](#system-architecture)
4. [Data Model](#data-model)
5. [Feature Breakdown](#feature-breakdown)
6. [UI Components](#ui-components)
7. [Frontend Design Specification](#frontend-design-specification)
8. [Technical Stack](#technical-stack)
9. [Future Roadmap](#future-roadmap)

---

## Overview

### Vision
What this feature enables and why it matters.

### Core Value Proposition
- **For Users**: Benefit 1
- **For the Platform**: Benefit 2

### Competitive Positioning

\`\`\`mermaid
quadrantChart
    title Feature Landscape
    x-axis Low Value --> High Value
    y-axis Simple --> Complex
    quadrant-1 Premium
    quadrant-2 Leaders
    quadrant-3 Basic
    quadrant-4 Niche
    "Competitor A": [0.7, 0.8]
    "Our Product (current)": [0.4, 0.35]
    "Our Product (target)": [0.75, 0.85]
\`\`\`

---

## User Flow

### Primary Flow

\`\`\`mermaid
flowchart TD
    Start([User Action]) --> A{Decision?}
    A -->|Yes| B[Action 1]
    A -->|No| C[Action 2]
    B --> D[Result]
    C --> D
    D --> End([Complete])
\`\`\`

### State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> Initial
    Initial --> Processing: trigger
    Processing --> Success: complete
    Processing --> Error: fail
    Success --> [*]
    Error --> Initial: retry
\`\`\`

### User Journey

\`\`\`mermaid
journey
    title User Journey: Feature Name
    section Discovery
      Find feature: 4: User
      Understand value: 5: User
    section Usage
      Perform action: 5: User
      See result: 5: User
\`\`\`

---

## System Architecture

### High-Level Architecture

\`\`\`mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Page[Page Component]
        Components[UI Components]
    end
    
    subgraph API["API Layer"]
        Router[tRPC Router]
    end
    
    subgraph Data["Data Layer"]
        Repo[Repository]
        DB[(Database)]
    end
    
    Page --> Router
    Router --> Repo
    Repo --> DB
\`\`\`

### Processing Sequence

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant API as API
    participant DB as Database

    U->>UI: Action
    UI->>API: Request
    API->>DB: Query
    DB-->>API: Result
    API-->>UI: Response
    UI->>U: Display
\`\`\`

---

## Data Model

### ER Diagram

\`\`\`mermaid
erDiagram
    USER ||--o{ ENTITY : creates
    ENTITY ||--o{ CHILD : contains
    
    ENTITY {
        text id PK
        text user_id FK
        text name
        integer created_at
    }

    CHILD {
        text id PK
        text entity_id FK
        text value
    }
\`\`\`

### TypeScript Interfaces

\`\`\`typescript
interface Entity {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
}

interface Child {
  id: string;
  entityId: string;
  value: string;
}
\`\`\`

---

## Feature Breakdown

### Feature 1: Name

**Purpose**: What this feature does.

**User Story**: As a user, I want to... so that...

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

### Feature 2: Name

**Purpose**: What this feature does.

---

## UI Components

### Component Hierarchy

\`\`\`mermaid
flowchart TD
    subgraph Pages["Route Pages"]
        PageA["/route-a"]
        PageB["/route-b"]
    end
    
    subgraph Shared["Shared Components"]
        ComponentA["ComponentA"]
        ComponentB["ComponentB"]
    end
    
    PageA --> ComponentA
    PageB --> ComponentA
    PageB --> ComponentB
\`\`\`

### Screen Wireframes

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ Header                                              ✕   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Title                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Input field                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│           [ Cancel ]        [ Submit ]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

## Frontend Design Specification

### Aesthetic Direction
**Tone**: Describe the visual feel

### Typography
| Usage | Font | Weight |
|-------|------|--------|
| Headings | Font Name | 600 |
| Body | Font Name | 400 |

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `var(--primary)` | CTAs |
| Secondary | `var(--secondary)` | Badges |

### Motion Design
- **Hover**: Subtle lift effect
- **Transitions**: 200ms ease-out

---

## Technical Stack

### API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `entity.create` | mutation | Create entity |
| `entity.list` | query | Get user's entities |
| `entity.getById` | query | Get single entity |
| `entity.delete` | mutation | Delete entity |

### New Files

\`\`\`
app/
├── repositories/
│   └── entity.ts
├── trpc/routes/
│   └── entity.ts
├── routes/
│   └── entity/
│       ├── index.tsx
│       └── [id].tsx
└── components/
    └── entity/
        ├── entity-card.tsx
        └── entity-form.tsx
\`\`\`

### Migration SQL

\`\`\`sql
CREATE TABLE \`entity\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`user_id\` text NOT NULL,
  \`name\` text NOT NULL,
  \`created_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE cascade
);
\`\`\`

---

## Future Roadmap

### Phase 1 (Current Scope)
- [ ] Core functionality
- [ ] Basic UI

### Phase 2
- [ ] Advanced feature
- [ ] Integrations

---

*Architecture Document v1.0*
```

---

## Release Notes

```markdown
---
title: Release Title
date: YYYY-MM-DD
---

# Release Title

**Date:** YYYY-MM-DD

## Summary
Brief overview of this release.

## New Features

### Feature 1
- Detail about feature
- Another detail

### Feature 2
- Detail about feature

## Key Files

| File | Description |
|------|-------------|
| `path/to/file.ts` | What it does |
| `path/to/another.tsx` | What it does |

## Bug Fixes
- Fix 1 description
- Fix 2 description

## Breaking Changes
None.

## Dependencies Added
- `package-name` - Why it was added

## Database Migrations
- `0001_migration.sql`: Description of schema changes
```

---

## Testing Plan

```markdown
---
title: Testing Plan: Feature Name
date: YYYY-MM-DD
---

# Testing Plan: Feature Name

## Overview
Brief description of what was implemented and what needs to be tested.

## Prerequisites
- [ ] Development server running
- [ ] Database seeded with test data
- [ ] Test user credentials available

## Test Scenarios

### Scenario 1: Happy Path
**Description:** What this scenario tests

**Steps:**
1. Navigate to {URL}
2. {Action}
3. {Action}

**Expected Result:** {What should happen}

**Screenshot:** ![Description](./screenshots/scenario-1.png)

### Scenario 2: Edge Case
**Description:** What edge case this tests

**Steps:**
1. {Action}

**Expected Result:** {What should happen}

**Screenshot:** ![Description](./screenshots/scenario-2.png)

### Scenario 3: Error Handling
**Description:** How errors are handled

**Steps:**
1. {Trigger error condition}

**Expected Result:** {Error message or behavior}

## UI Elements to Verify
- [ ] {Element} renders correctly
- [ ] {Element} has correct styling
- [ ] {Element} is interactive

## Test IDs Reference

| Element | Test ID |
|---------|---------|
| {Element} | `{data-testid}` |
| {Button} | `{data-testid}` |

## E2E Test Coverage
Test file: `e2e/{feature-name}.spec.ts`

\`\`\`typescript
test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    // Test implementation
  });
});
\`\`\`
```

---

## Meeting Notes

```markdown
---
title: Meeting Title
date: YYYY-MM-DD
---

# Meeting Title

**Date:** YYYY-MM-DD
**Attendees:** Names

## Agenda
1. Item 1
2. Item 2

## Discussion
Summary of discussions...

## Decisions Made
- Decision 1
- Decision 2

## Action Items
- [ ] Task 1 - @assignee
- [ ] Task 2 - @assignee

## Next Meeting
Date and topics for next meeting.
```

---

## Ideas/Brainstorming

```markdown
---
title: Idea Title
date: YYYY-MM-DD
---

# Idea Title

## Problem
What problem does this solve?

## Proposed Solution
Description of the idea...

## Benefits
- Benefit 1
- Benefit 2

## Considerations
- Technical constraints
- Resource requirements

## Next Steps
- [ ] Research step
- [ ] Prototype step
```

---

## Research/Competitive Analysis

```markdown
---
title: Topic Research & Competitive Analysis
date: YYYY-MM-DD
---

# {Feature/Topic} Research & Competitive Analysis

**Research Date:** YYYY-MM-DD  
**Research Method:** {Tavily/Manual/etc}  
**Focus Areas:** {Areas of focus}

---

## Executive Summary
Brief overview of key findings and recommendations.

## 1. Competitive Landscape

### Competitors Analyzed
| Competitor | URL | Strengths | Weaknesses |
|------------|-----|-----------|------------|
| {Name} | {URL} | {Strengths} | {Weaknesses} |

### Market Positioning
\`\`\`mermaid
quadrantChart
    title Market Positioning
    x-axis Low Feature --> High Feature
    y-axis Low Price --> High Price
    quadrant-1 Premium
    quadrant-2 Leaders
    quadrant-3 Budget
    quadrant-4 Niche
\`\`\`

## 2. UX Patterns Observed

### Common Patterns
- Pattern 1: Description and examples
- Pattern 2: Description and examples

### Best Practices
- Best practice 1
- Best practice 2

## 3. Differentiation Opportunities
- Opportunity 1: Description
- Opportunity 2: Description

## 4. Recommendations
Actionable recommendations based on research.

## Sources
- {Source 1}
- {Source 2}
```

---

## Plans/Roadmap

```markdown
---
title: Plan Title
date: YYYY-MM-DD
---

# Plan Title

## Goals
What we're trying to achieve.

## Phases

### Phase 1: Foundation
- [ ] Task 1
- [ ] Task 2

### Phase 2: Enhancement
- [ ] Task 1
- [ ] Task 2

## Success Metrics
How we'll measure success.

## Risks and Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk 1 | Medium | High | Mitigation strategy |
```

---

## Context Document Templates

### api.md

```markdown
# API Documentation

## tRPC Router Structure

\`\`\`
app/trpc/
├── router.ts        # Main router combining all routes
├── index.ts         # Context and procedure definitions
└── routes/
    ├── admin.ts     # Admin routes
    ├── user.ts      # User routes
    └── ...
\`\`\`

## Procedure Types

| Type | Usage | Auth |
|------|-------|------|
| `publicProcedure` | No auth required | None |
| `protectedProcedure` | User must be logged in | Session |
| `adminProcedure` | Admin role required | Session + Role |

## Route Modules

### admin.ts
| Route | Type | Description |
|-------|------|-------------|
| `admin.getUsers` | query | List all users |

## Error Responses

| Code | Meaning |
|------|---------|
| `UNAUTHORIZED` | Not authenticated |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
```

### architecture.md

```markdown
# System Architecture

## Overview Diagram

\`\`\`mermaid
flowchart TB
    subgraph Client
        React[React SPA]
    end
    subgraph Edge
        Worker[Cloudflare Worker]
    end
    subgraph Data
        D1[(D1 SQLite)]
    end
    React --> Worker --> D1
\`\`\`

## Data Flow

1. **Client** → tRPC hooks call API
2. **API Layer** → tRPC routes validate input
3. **Repository Layer** → Pure functions access database
4. **Database** → D1 SQLite via Drizzle ORM

## Key Patterns

- **Repository Pattern**: Data access via pure functions
- **tRPC**: Type-safe API communication
- **SSR**: Server-side rendering on edge
```

### data-models.md

```markdown
# Data Models

## Schema Location
`app/db/schema.ts`

## Entity Relationship Diagram

\`\`\`mermaid
erDiagram
    USER ||--o{ ENTITY : creates
    ENTITY ||--o{ CHILD : contains
\`\`\`

## Tables Overview

### user
| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| email | text | Unique email |

## Migrations
Located in `drizzle/` folder.
```

### features.md

```markdown
# Features Documentation

## Feature 1

### Overview
Brief description.

### Data Model
Tables involved.

### Key Files
- `app/routes/feature/` - UI
- `app/repositories/feature.ts` - Data access
- `app/trpc/routes/feature.ts` - API

### Flow Diagram

\`\`\`mermaid
sequenceDiagram
    User->>UI: Action
    UI->>API: Request
    API->>DB: Query
\`\`\`
```
