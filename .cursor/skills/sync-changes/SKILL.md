---
name: sync-changes
description: Syncs latest changes across documentation, analytics dashboard, and tests. Use after completing features, making significant changes, or when asked to sync, update docs, add analytics, or ensure test coverage.
---

# Sync Changes

Orchestrates multiple subagents to ensure documentation, analytics, and tests stay in sync with the latest codebase changes.

## Rules Reference

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning.**

Read `.cursor/context.md` for the compressed Rules Index. When syncing, ensure updates follow:
- `docs.mdc` - Documentation structure and templates
- `testing-workflow.mdc` - Testing plans and e2e patterns

## When to Use

- After completing a feature implementation
- After making significant architectural changes
- When asked to "sync changes" or "update everything"
- Before creating a pull request (ensures completeness)
- Periodically to catch up on undocumented work

## What Gets Synced

| Subagent | Purpose | Output |
|----------|---------|--------|
| `context-keeper` | Update technical documentation | Updated `context.md` |
| `architecture-tracker` | Update visual architecture docs | Updated `high-level-architecture.md` |
| `data-analytics` | Update admin dashboard | New/updated analytics components |
| `tester` | Ensure test coverage | E2E tests + test documentation |

## Workflow

### Step 1: Analyze Recent Changes

Before delegating, understand what changed:

```bash
# Check recent git changes
git diff --name-only HEAD~5  # Last 5 commits
git log --oneline -10        # Recent commit messages

# Or check uncommitted changes
git status
git diff --stat
```

Identify:
- **New files** → Need documentation, possibly analytics and tests
- **Modified schema** → May need analytics updates
- **New routes/features** → Need tests and documentation
- **API changes** → Need documentation updates

### Step 2: Delegate to Subagents

Run subagents in parallel when possible (they're independent):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           SYNC PHASE (Parallel)                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────┐  ┌───────────────────┐  ┌───────────────┐  ┌───────────┐ │
│  │ context-keeper │  │ architecture-     │  │ data-analytics│  │  tester   │ │
│  │                │  │ tracker           │  │               │  │           │ │
│  │ Update docs    │  │ Update visual     │  │ Update admin  │  │ Ensure    │ │
│  │ - context.md   │  │ architecture      │  │ dashboard     │  │ tests     │ │
│  │ - API, schema  │  │ - Route map       │  │ with new      │  │ exist     │ │
│  │ - Features     │  │ - Feature flows   │  │ metrics       │  │           │ │
│  │                │  │ - Changelog       │  │               │  │           │ │
│  └────────────────┘  └───────────────────┘  └───────────────┘  └───────────┘ │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Execute Delegation

**Context Keeper:**
```typescript
Task({
  subagent_type: "context-keeper",
  description: "Update docs for recent changes",
  prompt: `
    Review recent changes and update .cursor/context.md:
    
    Changes to document:
    - {list of changed files/features}
    
    1. Read current context.md
    2. Review the changed files
    3. Update relevant sections (Features, API Routes, Database, etc.)
    4. Add to Recent Changes section
    5. Add Mermaid diagrams if helpful
  `,
  model: "fast"
})
```

**Data Analytics:**
```typescript
Task({
  subagent_type: "data-analytics",
  description: "Update analytics dashboard",
  prompt: `
    Check if recent schema/feature changes need analytics:
    
    Recent changes:
    - {list of changed files}
    
    1. Read app/db/schema.ts for new tables/fields
    2. Identify analytics opportunities:
       - New timestamp fields → time-series charts
       - New enum fields → distribution charts
       - New boolean fields → conversion metrics
    3. If new analytics needed:
       - Add repository functions
       - Add tRPC routes
       - Update admin dashboard
    4. If no new analytics needed, report "No analytics updates required"
  `,
  model: "fast"
})
```

**Architecture Tracker:**
```typescript
Task({
  subagent_type: "architecture-tracker",
  description: "Update architecture docs",
  prompt: `
    Update high-level architecture document for recent changes:
    
    Recent changes:
    - {list of changed files}
    
    1. Read .cursor/context/high-level-architecture.md
    2. Check app/routes.ts for new routes
    3. Update relevant sections:
       - Route Map diagram (if new routes)
       - Information Architecture table (if new routes)
       - Feature Flows section (if new features)
       - Data Relationships (if schema changes)
    4. Add Changelog entry with today's date
  `,
  model: "fast"
})
```

**Tester:**
```typescript
Task({
  subagent_type: "tester",
  description: "Ensure test coverage",
  prompt: `
    Verify test coverage for recent changes:
    
    Recent changes:
    - {list of changed files}
    
    1. Check if e2e tests exist for new/changed routes
    2. For each untested feature:
       - Create testing plan at docs/testing/{feature}/{feature}.md
       - Create screenshots folder at docs/testing/{feature}/screenshots/
       - Write e2e test in e2e/
       - Add data-testid attributes if missing
    3. Run tests to verify they pass: bun run test:e2e
    4. Save Playwright screenshots to docs/testing/{feature}/screenshots/
    5. CRITICAL: Copy screenshots to public folder for docs viewer:
       mkdir -p public/docs/testing/{feature}/screenshots
       cp docs/testing/{feature}/screenshots/*.png public/docs/testing/{feature}/screenshots/
  `,
  model: "fast"
})
```

---

## Decision Matrix

| Change Type | context-keeper | architecture-tracker | data-analytics | tester |
|-------------|----------------|---------------------|----------------|--------|
| New feature | ✅ Required | ✅ Required | Check schema | ✅ Required |
| Schema change | ✅ Required | ✅ Required | ✅ Required | Maybe |
| New routes | ✅ Required | ✅ Required | ❌ Skip | ✅ Required |
| UI-only change | ✅ Required | ❌ Skip | ❌ Skip | ✅ Required |
| Bug fix | Maybe | ❌ Skip | ❌ Skip | ✅ Required |
| API change | ✅ Required | Maybe | Maybe | ✅ Required |
| Config change | ✅ Required | ❌ Skip | ❌ Skip | ❌ Skip |

---

## Quick Sync Commands

For quick syncs, you can run a simplified version:

**Documentation only:**
```typescript
Task({
  subagent_type: "context-keeper",
  description: "Quick docs sync",
  prompt: "Review git diff and update context.md with recent changes.",
  model: "fast"
})
```

**Architecture only:**
```typescript
Task({
  subagent_type: "architecture-tracker",
  description: "Quick architecture sync",
  prompt: "Review app/routes.ts and update high-level-architecture.md with any new routes. Add changelog entry.",
  model: "fast"
})
```

**Analytics check:**
```typescript
Task({
  subagent_type: "data-analytics", 
  description: "Check analytics needs",
  prompt: "Review schema.ts and check if any new fields need analytics tracking.",
  model: "fast"
})
```

**Test coverage check:**
```typescript
Task({
  subagent_type: "tester",
  description: "Verify test coverage",
  prompt: "Check e2e/ folder against app/routes/ and identify missing test coverage.",
  model: "fast"
})
```

---

## Full Sync Example

```markdown
**User Request:** "Sync changes after recipe extraction feature"

**Analysis:** 
- New files: app/lib/content-extractor.ts, app/lib/claude.ts
- Modified: app/trpc/routes/recipes.ts, app/repositories/recipe.ts
- New schema fields: recipes table with createdAt

**Execution (Parallel):**

1. **context-keeper** → Document:
   - Recipe extraction feature
   - Claude AI integration
   - Content extractor architecture

2. **architecture-tracker** → Update:
   - Add /recipes/new route to Route Map
   - Add Recipe Extraction feature flow diagram
   - Add changelog entry
   
3. **data-analytics** → Add:
   - Recipe creation time-series chart
   - Source type distribution (YouTube vs URL)
   
4. **tester** → Create:
   - e2e/recipes.spec.ts tests
   - Testing plan for extraction flow
   - Test documentation with screenshots
```

---

## Checklist

After sync completes, verify:

- [ ] `context.md` reflects current state of codebase
- [ ] `high-level-architecture.md` has all routes and features
- [ ] Changelog has entry for recent changes
- [ ] Recent Changes section is up to date
- [ ] Analytics dashboard shows relevant metrics (if applicable)
- [ ] E2E tests exist for all user-facing features
- [ ] Test documentation with screenshots at `docs/testing/{feature}/`
- [ ] **Screenshots copied to `public/docs/testing/{feature}/screenshots/`** (required for docs viewer)
- [ ] No broken tests (run `bun run test:e2e`)

---

## When to Skip Subagents

**Skip context-keeper if:**
- Only fixing typos or minor bugs
- Changes are purely internal (no user impact)

**Skip architecture-tracker if:**
- No new routes added
- No new features implemented
- No schema changes
- Changes are UI-only tweaks (not new pages)
- Bug fixes or refactors

**Skip data-analytics if:**
- No schema changes
- No new trackable data
- Changes are UI-only

**Skip tester if:**
- Changes are documentation-only
- Changes are config/environment only
- Tests already exist and still pass
