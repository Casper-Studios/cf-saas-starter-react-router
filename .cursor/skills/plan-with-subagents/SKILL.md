---
name: plan-with-subagents
description: Create implementation plans with subagent assignments for each task. Use when the user asks to plan work, create a plan, or when a task is complex enough to warrant structured planning with delegation.
---

# Plan with Subagents

Create structured implementation plans that assign appropriate subagents to each task and include PR validation.

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
1. Schema/Database changes
2. Repository layer
3. tRPC routes
4. UI Components
5. Route pages
6. Documentation
7. Testing
8. PR Validation
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

### Documentation Task
```markdown
#### Task: Update Documentation
**Subagent:** `context-keeper`
**Description:** Update context.md with new feature/routes/schema
```

### Analytics Task (when applicable)
```markdown
#### Task: Create Analytics Dashboard
**Subagent:** `data-analytics`
**Description:** Create growth charts/metrics for new data
**Trigger:** Schema adds timestamp/enum/boolean fields
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

#### Task 6: Test Implementation
**Subagent:** `tester`
**Description:** Generate testing plan, verify with Playwright MCP, write e2e tests

#### Task 7: Update Documentation
**Subagent:** `context-keeper`
**Description:** Add preferences feature to context.md

#### Task 8: PR Validation
**Subagent:** None (use pr-checker skill)
**Description:** Run validation checklist before creating PR

### Validation Requirements (from pr-checker)
- [ ] Repository pattern compliance (Task 3)
- [ ] tRPC Zod validation (Task 4)
- [ ] Route auth checks (Task 5)
- [ ] Migration naming convention (Task 2)
- [ ] context.md updated (Task 7)
- [ ] Testing plan exists (Task 6)
```

---

## Testing Requirements

**IMPORTANT**: Every implementation plan MUST include testing that follows this workflow:

1. **Browser Verification** - Use Playwright MCP to verify the feature works
2. **Capture Evidence** - Take screenshots during verification
3. **Write E2E Tests** - Convert browser actions to `e2e/{feature}.spec.ts`
4. **Document Tests** - Create `docs/features/{feature}-testing.md` with:
   - Test results summary table
   - E2E test coverage list
   - Key test IDs for the feature
   - Instructions for running tests

### Testing Task Example

```markdown
#### Task: Test Implementation
**Subagent:** `tester`
**Description:** 
1. Verify feature with Playwright MCP browser tools
2. Write e2e tests in `e2e/{feature}.spec.ts`
3. Add data-testid attributes to key elements
4. Create test documentation in `docs/features/{feature}-testing.md`
**Outputs:**
- E2E test file: `e2e/{feature}.spec.ts`
- Test documentation: `docs/features/{feature}-testing.md`
- Data-testid attributes on all interactive elements
```

---

## Final Step: PR Validation Checklist

Always include this at the end of every plan:

```markdown
### PR Validation (before creating PR)

Run the `pr-checker` skill which validates:

- [ ] Code rules compliance (per file patterns above)
- [ ] context.md updated (if feature/architecture change)
- [ ] Testing plan exists
- [ ] **E2E tests written in `e2e/`**
- [ ] **Test documentation in `docs/features/`**
- [ ] Migrations use db-migration skill (if applicable)
- [ ] Analytics considered (if schema/feature change)
```

---

## Quick Reference

| Work Type | Typical Subagents |
|-----------|-------------------|
| New feature | explore → generalPurpose → tester → context-keeper |
| Bug fix | explore → generalPurpose → tester |
| Refactor | explore → generalPurpose → tester |
| UI-only change | generalPurpose → tester |
| Analytics addition | data-analytics |
| Schema change | generalPurpose → data-analytics (optional) → tester |
