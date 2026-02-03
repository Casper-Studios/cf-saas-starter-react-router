---
name: plan-with-subagents
description: Create implementation plans with subagent assignments for each task. Use when the user asks to plan work, create a plan, or when a task is complex enough to warrant structured planning with delegation.
---

# Plan with Subagents

Create structured implementation plans that assign appropriate subagents to each task and include PR validation.

## Before Planning: Rules Index

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning.**

Read `.cursor/context.md` for the compressed Rules Index. When planning tasks that touch specific areas, note which rules apply:

| File Pattern | Rule to Include in Plan |
|--------------|------------------------|
| `app/repositories/*.ts` | `repository-pattern.mdc` |
| `app/trpc/routes/*.ts` | `repository-pattern.mdc` |
| `app/routes/**/*.tsx` | `routes.mdc` |
| `app/db/schema.ts` | `database.mdc` |
| `app/components/*-modal.tsx` | `modals.mdc` |
| `**/stripe*`, `**/payment*` | `stripe.mdc` |
| `e2e/**/*` | `playwright-rules.mdc` |
| `docs/**/*.md` | `docs.mdc` |

Include rule requirements in task descriptions so subagents know what patterns to follow.

## When to Use

- User requests a plan for feature implementation
- Complex tasks requiring multiple files/layers
- Work that will result in a PR

## Planning Workflow

### Step 1: Analyze the Work Request

Identify:
1. **Type of work**: Feature, bug fix, or refactor
2. **Scope**: Files and layers affected
3. **Dependencies**: Order constraints between tasks

### Step 2: Break Down into Tasks

Create tasks following the data flow pattern:

```
1. Competitive Research (if new feature with UX decisions)
2. Schema/Database changes
3. Repository layer
4. tRPC routes
5. UI Components
6. Route pages
7. Feature Architecture Documentation (docs/features/)
8. Debug Logging (for complex logic/integrations)
9. Testing
10. Context Documentation (context.md)
11. Architecture Documentation (high-level-architecture.md)
12. Analytics Dashboard (if new data to track)
13. PR Validation
```

Skip layers not affected by the work.

### Step 3: Assign Subagents

Map each task to the appropriate subagent:

| Task Type | Subagent | When to Use |
|-----------|----------|-------------|
| Database exploration | `explore` | Understanding schema, finding related code |
| Schema changes | `generalPurpose` | Adding tables, fields, migrations |
| Repository/tRPC | `generalPurpose` | Business logic implementation |
| UI Components | `generalPurpose` | Building React components |
| Styling from Figma | `figma-to-tailwind-converter` | Converting Figma designs |
| Design validation | `figma-design-validator` | Verifying UI matches designs |
| Add logging | `logger` | Adding debug logs to code |
| Testing | `tester` | Verify implementation, write e2e tests |
| Documentation | `context-keeper` | Update context.md |
| Architecture Docs | `architecture-tracker` | Update route maps, flows, changelog |
| Analytics | `data-analytics` | Create dashboards for new data |
| PR Validation | Manual (pr-checker skill) | Final validation step |

### Step 4: Build the Plan

Output format:

```markdown
## Implementation Plan: {Feature Name}

### Overview
{Brief description of what will be implemented}

### Tasks

#### Task 1: {Task Name}
**Subagent:** `{subagent-type}`
**Files:** `{file patterns}`
**Description:** {What this task accomplishes}

#### Task 2: {Task Name}
**Subagent:** `{subagent-type}`
**Files:** `{file patterns}`
**Description:** {What this task accomplishes}

...

#### Task N: PR Validation
**Subagent:** None (manual - use pr-checker skill)
**Description:** Run pr-checker skill before creating PR

### Validation Requirements (from pr-checker)
{List applicable checks based on files touched}
```

---

## File Pattern → Validation Mapping

When a task touches certain files, note the validation requirement:

| File Pattern | Required Check |
|--------------|----------------|
| `app/repositories/*.ts` | Repository pattern compliance |
| `app/trpc/routes/*.ts` | tRPC validation, Zod inputs |
| `app/routes/**/*.tsx` | Route conventions, auth checks |
| `app/db/schema.ts` | Migration with descriptive name |
| `drizzle/*.sql` | Migration naming convention |
| `app/models/*.ts` | Zod schema standards |
| `app/components/*-modal.tsx` | Modal pattern compliance |
| `e2e/**/*` | Playwright rules |

---

## Subagent Task Templates

### Competitive Research Task (when applicable)
```markdown
#### Task: Competitive Research
**Subagent:** `generalPurpose`
**Files:** `docs/research/{feature}-research.md`
**Description:** Use Tavily MCP to research competitors and UX patterns:
  - Search for similar products/features
  - Analyze common UI patterns
  - Identify differentiation opportunities
  - Document findings in research file
**When to include:** New user-facing features requiring UX decisions
```

### Explore Task
```markdown
#### Task: Explore {Area}
**Subagent:** `explore`
**Thoroughness:** quick | medium | very thorough
**Description:** {What to discover}
```

### Implementation Task
```markdown
#### Task: Implement {Feature}
**Subagent:** `generalPurpose`
**Files:** `{file patterns}`
**Description:** {Implementation details}
**PR Checks:** {Applicable validation from file patterns}
```

### Testing Task
```markdown
#### Task: Test Implementation
**Subagent:** `tester`
**Description:** Generate testing plan, verify with browser, write e2e tests
**Outputs:**
  - Browser verification (screenshots)
  - E2E Playwright tests in `e2e/` folder
  - Test summary documentation with screenshots
```

### Testing Workflow
The testing task MUST follow this workflow:

1. **Browser Verification** - Use Playwright MCP to manually verify the feature works
2. **Capture Screenshots** - Take screenshots of key states for documentation
3. **Write E2E Tests** - Convert successful browser actions into Playwright e2e tests
4. **Create Test Summary** - Document test cases with screenshots in `docs/features/`

### Feature Architecture Documentation Task
```markdown
#### Task: Create Feature Architecture Doc
**Subagent:** `generalPurpose`
**Files:** `docs/features/{feature}-architecture.md`
**Description:** Create comprehensive architecture document with:
  - Overview and vision
  - User flow diagrams (mermaid)
  - System architecture diagram
  - Data model (ER diagram + TypeScript interfaces)
  - Feature breakdown
  - UI component hierarchy
  - Frontend design specification
  - API endpoints table
```

### Context Documentation Task
```markdown
#### Task: Update Context Documentation
**Subagent:** `context-keeper`
**Description:** Update context.md with new feature/routes/schema summary
```

### Architecture Documentation Task (when applicable)
```markdown
#### Task: Update Architecture Documentation
**Subagent:** `architecture-tracker`
**Files:** `.cursor/context/high-level-architecture.md`
**Description:** Update living architecture doc with:
  - New routes added to Route Map diagram
  - New rows in Information Architecture table
  - New Feature Flow section (if new feature)
  - Updated Data Relationships (if schema changes)
  - Changelog entry with today's date
**When to include:** New routes, new features, schema changes, architectural decisions
```

### Analytics Task (when applicable)
```markdown
#### Task: Create Analytics Dashboard
**Subagent:** `data-analytics`
**Description:** Create growth charts/metrics for new data
**Trigger:** Schema adds timestamp/enum/boolean fields, new features with trackable user actions
```

### Logger Task (when applicable)
```markdown
#### Task: Add Debug Logging
**Subagent:** `logger`
**Files:** `{files being implemented}`
**Description:** Add structured debug logs to trace execution flow
**When to include:** Complex business logic, async operations, error-prone code paths, third-party integrations
**Outputs:**
  - Structured logs with appropriate levels (debug, info, warn, error)
  - Trace logging for request flows
  - Context-rich error logging
```

---

## Example Plan

```markdown
## Implementation Plan: User Preferences Feature

### Overview
Add user preferences table with theme and notification settings, 
exposing via tRPC and creating a settings page.

### Tasks

#### Task 1: Explore Existing User Schema
**Subagent:** `explore`
**Thoroughness:** quick
**Description:** Understand current user table structure and patterns

#### Task 2: Add Database Schema
**Subagent:** `generalPurpose`
**Files:** `app/db/schema.ts`, `drizzle/*.sql`
**Description:** Add userPreferences table with theme, notifications fields
**PR Checks:** Migration naming (snake_case, descriptive)

#### Task 3: Create Repository
**Subagent:** `generalPurpose`
**Files:** `app/repositories/user-preferences.ts`
**Description:** CRUD operations for preferences with proper error handling
**PR Checks:** Repository pattern, Database type alias, try-catch

#### Task 4: Add tRPC Routes
**Subagent:** `generalPurpose`
**Files:** `app/trpc/routes/user-preferences.ts`, `app/trpc/router.ts`
**Description:** getPreferences, updatePreferences with Zod validation
**PR Checks:** Zod inputs, protectedProcedure usage

#### Task 5: Build Settings Page
**Subagent:** `generalPurpose`
**Files:** `app/routes/settings/preferences.tsx`
**Description:** Form for updating theme and notification preferences
**PR Checks:** Loader auth check, context.trpc usage

#### Task 6: Create Feature Architecture Doc
**Subagent:** `generalPurpose`
**Files:** `docs/features/user-preferences-architecture.md`
**Description:** Create architecture doc with user flows, data model, component hierarchy

#### Task 7: Add Debug Logging
**Subagent:** `logger`
**Files:** `app/repositories/user-preferences.ts`, `app/trpc/routes/user-preferences.ts`
**Description:** Add structured logs for preference operations (create, update, validation errors)

#### Task 8: Test Implementation
**Subagent:** `tester`
**Description:** Generate testing plan, verify with Playwright MCP, write e2e tests

#### Task 9: Update Context Documentation
**Subagent:** `context-keeper`
**Description:** Add preferences feature summary to context.md

#### Task 10: Update Architecture Documentation
**Subagent:** `architecture-tracker`
**Description:** Update high-level-architecture.md with new /settings/preferences route, add changelog entry

#### Task 11: Create Analytics Dashboard
**Subagent:** `data-analytics`
**Description:** Create metrics dashboard for preference usage (theme distribution, notification opt-ins)

#### Task 12: PR Validation
**Subagent:** None (use pr-checker skill)
**Description:** Run validation checklist before creating PR

### Validation Requirements (from pr-checker)
- [ ] Repository pattern compliance (Task 3)
- [ ] tRPC Zod validation (Task 4)
- [ ] Route auth checks (Task 5)
- [ ] Migration naming convention (Task 2)
- [ ] Feature architecture doc exists (Task 6)
- [ ] Debug logging added (Task 7)
- [ ] context.md updated (Task 9)
- [ ] high-level-architecture.md updated (Task 10)
- [ ] Testing plan exists (Task 8)
- [ ] Analytics dashboard created (Task 11)
```

---

## Testing Requirements

## ⚠️ CRITICAL: SCREENSHOTS ARE MANDATORY ⚠️

**TESTING IS INCOMPLETE WITHOUT SCREENSHOTS.**

Every implementation plan MUST include testing that follows this workflow:

1. **Browser Verification** - Use Playwright MCP to verify the feature works
2. **Capture Evidence** - Take screenshots to `docs/testing/{feature}/screenshots/` **← MANDATORY**
3. **Copy to Public** - Copy screenshots to `public/docs/testing/{feature}/screenshots/` **← MANDATORY**
4. **Write E2E Tests** - Convert browser actions to `e2e/{feature}.spec.ts`
5. **Document Tests** - Create `docs/testing/{feature}/{feature}.md` with:
   - Test scenarios and descriptions
   - **Screenshots embedded with markdown image links** **← MANDATORY**
   - Test IDs reference table
   - E2E test coverage list

**Testing task is NOT complete until screenshots are:**
- [ ] Taken with Playwright MCP browser tools
- [ ] Saved to `docs/testing/{feature}/screenshots/`
- [ ] Copied to `public/docs/testing/{feature}/screenshots/`
- [ ] Embedded in test documentation markdown file

### Testing Task Example

```markdown
#### Task: Test Implementation
**Subagent:** `tester`
**Description:** 
1. Create testing plan at `docs/testing/{feature}/{feature}.md`
2. Verify feature with Playwright MCP browser tools
3. **MANDATORY: Save screenshots to `docs/testing/{feature}/screenshots/`**
4. **MANDATORY: Copy screenshots to `public/docs/testing/{feature}/screenshots/`**
5. **MANDATORY: Embed screenshots in test documentation**
6. Write e2e tests in `e2e/{feature}.spec.ts`
7. Add data-testid attributes to key elements

**CRITICAL OUTPUTS (all required):**
- Testing plan: `docs/testing/{feature}/{feature}.md` with embedded screenshots
- Screenshots: `docs/testing/{feature}/screenshots/*.png` (at least 3-5 screenshots)
- Public copy: `public/docs/testing/{feature}/screenshots/*.png`
- E2E test file: `e2e/{feature}.spec.ts`
- Data-testid attributes on all interactive elements

**This task is NOT complete without screenshots in both locations and embedded in documentation.**
```

---

## Final Step: PR Validation Checklist

Always include this at the end of every plan:

```markdown
### PR Validation (before creating PR)

Run the `pr-checker` skill which validates:

- [ ] Code rules compliance (per file patterns above)
- [ ] **Implementation plan saved** (`docs/plans/{feature}-implementation.md`)
- [ ] **Research doc exists** (`docs/research/{feature}-research.md`) - if new user-facing feature
- [ ] **Feature architecture doc exists** (`docs/features/{feature}-architecture.md`)
- [ ] context.md updated (if feature/architecture change)
- [ ] Testing plan exists (`docs/testing/{feature}/`)
- [ ] **E2E tests written in `e2e/`**
- [ ] Migrations use db-migration skill (if applicable)
- [ ] **Debug logging added** (if complex logic/integrations)
- [ ] **Analytics dashboard created** (if new trackable data)
```

---

## Quick Reference

| Work Type | Typical Subagents |
|-----------|-------------------|
| New feature (user-facing) | research (Tavily) → explore → generalPurpose → logger → tester → context-keeper → architecture-tracker → data-analytics |
| New feature (backend) | explore → generalPurpose → logger → tester → context-keeper → architecture-tracker → data-analytics |
| Bug fix | explore → generalPurpose → logger → tester |
| Refactor | explore → generalPurpose → tester |
| UI-only change | generalPurpose → tester → context-keeper |
| Analytics addition | data-analytics |
| Schema change | generalPurpose → data-analytics → tester → architecture-tracker |
| Complex integration | explore → generalPurpose → logger → tester → context-keeper → architecture-tracker |
| New routes only | generalPurpose → tester → architecture-tracker |

## Documentation Checklist

| Doc Type | Location | When Required |
|----------|----------|---------------|
| **Plan** | `docs/plans/{feature}-implementation.md` | All new features |
| Research | `docs/research/{feature}-research.md` | New user-facing features |
| Architecture | `docs/features/{feature}-architecture.md` | New features with multiple layers |
| Testing | `docs/testing/{feature}/{feature}.md` | All features |
| Context | `.cursor/context.md` | All features/changes |
| High-Level Architecture | `.cursor/context/high-level-architecture.md` | New routes, features, schema changes |

**Important:** After implementation is complete, save the plan to `docs/plans/` for future reference.
| Debug Logs | In implementation files | Complex logic, integrations, error-prone paths |
| Analytics | Admin dashboard | Features with trackable data (signups, usage, conversions) |
