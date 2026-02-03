# PostHog Reference

## Complete File Templates

### app/posthog/feature-flags.ts

```typescript
/**
 * Feature flag keys - centralized constants for type-safe feature flag access
 */
export const FEATURE_FLAGS = {
  // Add feature flags here
  // Example: DOCUMENT_UPLOAD: "feature-document-upload",
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

export interface FeatureFlags {
  // Add properties matching flags
  // Example: documentUploadEnabled: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Add defaults (typically false)
};

export const FLAG_KEY_TO_DEFAULT: Record<string, boolean> = {
  // Map flag keys to defaults
};
```

### app/posthog/server.ts

```typescript
import { PostHog } from "posthog-node";
import { FLAG_KEY_TO_DEFAULT, type FeatureFlagKey } from "./feature-flags";

const POSTHOG_HOST = "https://us.i.posthog.com";

export function createPostHogClient(apiKey: string | undefined): PostHog | null {
  if (!apiKey) return null;

  return new PostHog(apiKey, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function getFeatureFlag(
  client: PostHog | null,
  distinctId: string,
  flagKey: FeatureFlagKey,
  defaultValue: boolean = false
): Promise<boolean> {
  if (import.meta.env.DEV) {
    return FLAG_KEY_TO_DEFAULT[flagKey] ?? defaultValue;
  }

  if (!client || !distinctId) return defaultValue;

  try {
    const result = await client.isFeatureEnabled(flagKey, distinctId);
    return result ?? defaultValue;
  } catch (error) {
    console.error(`[PostHog] Error evaluating flag "${flagKey}":`, error);
    return defaultValue;
  }
}

export async function captureEvent(
  client: PostHog | null,
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  if (!client || !distinctId) return;

  try {
    await client.captureImmediate({ distinctId, event, properties });
  } catch (error) {
    console.error(`[PostHog] Error capturing event "${event}":`, error);
  }
}

export async function shutdownPostHog(client: PostHog | null): Promise<void> {
  if (!client) return;

  try {
    await client.shutdown();
  } catch (error) {
    console.error("[PostHog] Error during shutdown:", error);
  }
}
```

### app/posthog/provider.tsx

```typescript
"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider, usePostHog } from "@posthog/react";

const POSTHOG_HOST = "https://us.i.posthog.com";

interface User {
  id: string;
  email: string;
  name: string;
}

interface PHProviderProps {
  children: React.ReactNode;
  apiKey: string | undefined;
  user: User | null;
}

function PostHogIdentify({ user }: { user: User | null }) {
  const posthogClient = usePostHog();

  useEffect(() => {
    if (!posthogClient) return;
    if (user) {
      posthogClient.identify(user.id, {
        email: user.email,
        name: user.name,
      });
    }
  }, [user, posthogClient]);

  return null;
}

export function PHProvider({ children, apiKey, user }: PHProviderProps) {
  useEffect(() => {
    if (!apiKey || typeof window === "undefined") return;
    if (posthog.__loaded) return;

    posthog.init(apiKey, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: { password: true },
      },
    });
  }, [apiKey]);

  if (!apiKey || typeof window === "undefined") {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogIdentify user={user} />
      {children}
    </PostHogProvider>
  );
}

export function useAnalytics() {
  const posthogClient = usePostHog();

  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (posthogClient) posthogClient.capture(eventName, properties);
  };

  const reset = () => {
    if (posthogClient) posthogClient.reset();
  };

  return { trackEvent, reset, posthog: posthogClient };
}

export { posthog };
```

### app/posthog/index.ts

```typescript
export { PHProvider, useAnalytics, posthog } from "./provider";
export { createPostHogClient, getFeatureFlag, captureEvent, shutdownPostHog } from "./server";
export { FEATURE_FLAGS, DEFAULT_FEATURE_FLAGS, FLAG_KEY_TO_DEFAULT, type FeatureFlagKey, type FeatureFlags } from "./feature-flags";
```

## Environment Configuration

### wrangler.jsonc

```jsonc
{
  "vars": {
    "POSTHOG_CLIENT_KEY": "phc_your_key_here"
  }
}
```

### .env (local development)

```
POSTHOG_CLIENT_KEY=phc_your_key_here
```

After adding to wrangler.jsonc, run:
```bash
bun run cf-typegen
```

## PostHog MCP Server

The PostHog MCP server enables AI-assisted analytics. Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "posthog": {
      "url": "https://mcp.posthog.com/mcp"
    }
  }
}
```

### Available MCP Tools

| Category | Tools |
|----------|-------|
| Feature Flags | create, update, delete, get-all, get-definition |
| Insights | create, query, update, delete, get-all |
| Experiments | create, update, results, delete |
| Events | definitions-list, properties-list |
| Dashboards | create, update, add-insight, reorder |
| Queries | query-run, hogql-from-question |

### Example MCP Prompts

- "Create a feature flag called 'new-checkout-flow' enabled for 20% of users"
- "How many unique users signed up in the last 7 days?"
- "Create an A/B test for our pricing page measuring conversion"
- "What are the top 5 errors this week?"

## Best Practices

### Security
- Never evaluate sensitive flags client-side only
- Always use server-side evaluation for access control
- Default new flags to `false`

### Performance
- Evaluate all flags in a single loader with `Promise.all()`
- Use flag values from loader data, don't re-fetch in components

### Naming Conventions
- PostHog flag keys: `feature-{name}` or `{TICKET}-{Name}`
- TypeScript constants: `SCREAMING_SNAKE_CASE`
- Interface properties: `camelCaseEnabled`

### Cleanup
When removing a flag after full rollout:
1. Remove from `FEATURE_FLAGS`
2. Remove from `FeatureFlags` interface
3. Remove from `DEFAULT_FEATURE_FLAGS`
4. Remove from `FLAG_KEY_TO_DEFAULT`
5. Search codebase for all usages

## Troubleshooting

### Events not captured in production
- Ensure `ctx.waitUntil(shutdownPostHog(posthog))` is called
- Verify `POSTHOG_CLIENT_KEY` is set
- Check PostHog region (US vs EU)

### Feature flags not working
- Verify flag key matches exactly (case-sensitive)
- Check user ID is passed correctly
- In dev, flags use defaults from `DEFAULT_FEATURE_FLAGS`

### Client not initializing
- Verify API key passed from loader
- Check browser console for errors
- Ensure key starts with `phc_`
