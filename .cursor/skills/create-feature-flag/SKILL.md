---
name: create-feature-flag
description: Create and manage feature flags in PostHog using the MCP server. Use when the user asks to create a feature flag, add a flag, set up A/B testing, enable a feature for a percentage of users, or manage rollouts.
---

# Create Feature Flag in PostHog

## Workflow

When creating a feature flag:

1. **Create the flag in PostHog** using MCP tools
2. **Add the flag constant** to `app/posthog/feature-flags.ts`
3. **Implement usage** in the appropriate loader/component

## Step 1: Create Flag in PostHog via MCP

Use the `create-feature-flag` MCP tool:

```
Call: posthog.create-feature-flag
Arguments:
  - key: "feature-my-feature-name" (lowercase, hyphens)
  - name: "My Feature Name" (human-readable)
  - filters: rollout configuration (see examples below)
```

### Common Rollout Patterns

**100% rollout (feature on for everyone):**
```json
{
  "groups": [{ "rollout_percentage": 100 }]
}
```

**Percentage rollout (e.g., 20%):**
```json
{
  "groups": [{ "rollout_percentage": 20 }]
}
```

**Specific users only:**
```json
{
  "groups": [{
    "properties": [{ "key": "email", "value": ["user@example.com"], "operator": "exact", "type": "person" }],
    "rollout_percentage": 100
  }]
}
```

## Step 2: Add to feature-flags.ts

Add the flag constant to `app/posthog/feature-flags.ts`:

```typescript
export const FEATURE_FLAGS = {
  // Existing flags...
  MY_NEW_FEATURE: "feature-my-feature-name",
} as const;

export interface FeatureFlags {
  // Existing properties...
  myNewFeatureEnabled: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Existing defaults...
  myNewFeatureEnabled: false,
};

export const FLAG_KEY_TO_DEFAULT: Record<string, boolean> = {
  // Existing mappings...
  [FEATURE_FLAGS.MY_NEW_FEATURE]: false,
};
```

## Step 3: Use the Flag

**In a loader:**
```typescript
import { getFeatureFlag } from "@/posthog/server";
import { FEATURE_FLAGS } from "@/posthog/feature-flags";

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await context.auth.api.getSession({ headers: request.headers });
  
  const myFeatureEnabled = await getFeatureFlag(
    context.posthog,
    session?.user?.id ?? "",
    FEATURE_FLAGS.MY_NEW_FEATURE,
    false
  );

  return { myFeatureEnabled };
}
```

**In a component:**
```typescript
const { myFeatureEnabled } = useLoaderData<typeof loader>();

return myFeatureEnabled ? <NewFeature /> : <OldFeature />;
```

## Naming Conventions

| Location | Format | Example |
|----------|--------|---------|
| PostHog key | `feature-kebab-case` | `feature-new-checkout` |
| TypeScript constant | `SCREAMING_SNAKE` | `NEW_CHECKOUT` |
| Interface property | `camelCaseEnabled` | `newCheckoutEnabled` |

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `create-feature-flag` | Create a new flag |
| `update-feature-flag` | Change rollout percentage or filters |
| `feature-flag-get-definition` | Check current flag configuration |
| `feature-flag-get-all` | List all flags in project |
| `delete-feature-flag` | Remove a flag |
