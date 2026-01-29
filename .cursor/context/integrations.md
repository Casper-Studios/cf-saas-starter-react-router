# Third-Party Integrations

## Cloudflare Services

### D1 Database
SQLite database at the edge.

```typescript
// Access via context
const db = ctx.db;  // DrizzleD1Database

// In repositories
export async function getUser(db: Database, id: string) {
  return db.query.user.findFirst({ where: eq(user.id, id) });
}
```

**Configuration:** `wrangler.jsonc`

### R2 Storage
Object storage for files.

```typescript
// Access via context.env
const bucket = ctx.env.BUCKET;

// Upload
await bucket.put(key, file);

// Get URL
const url = `${publicUrl}/${key}`;
```

**Key files:** `app/repositories/bucket.ts`

### Workers KV
Key-value storage (used for sessions by Better Auth).

**Configuration:** `wrangler.jsonc`

---

## Better Auth

Authentication library configured for Cloudflare Workers.

### Server Setup
```typescript
// app/auth/server.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  // ... config
});
```

### Client Setup
```typescript
// app/auth/client.ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

### Usage Patterns
```typescript
// Server: Check session in loader
const session = await context.auth.api.getSession({ headers: request.headers });

// Client: Sign in
await authClient.signIn.email({ email, password });

// Client: Get session
const { data: session } = authClient.useSession();
```

---

## Stripe (Optional)

Payment processing via Stripe.

### Access Pattern
```typescript
// ALWAYS use context.stripe, never create client in repositories
const stripe = ctx.stripe;

// Create checkout session
const session = await stripe.checkout.sessions.create({...});
```

### Webhook Handling
```typescript
// app/routes/api/stripe-webhook.ts
const event = stripe.webhooks.constructEvent(body, sig, secret);

switch (event.type) {
  case 'checkout.session.completed':
    // Handle payment
    break;
}
```

**Rule:** See `.cursor/rules/stripe.mdc`

---

## PostHog (Optional)

Feature flags and product analytics.

### Server-Side Feature Flags
```typescript
// In loaders or tRPC routes
const isEnabled = await context.posthog?.isFeatureEnabled('feature-name', userId);
```

### Client-Side Analytics
```typescript
import { posthog } from 'posthog-js';

// Track event
posthog.capture('button_clicked', { button: 'signup' });

// Check feature flag
const isEnabled = posthog.isFeatureEnabled('feature-name');
```

**Rule:** See `.cursor/rules/feature-flags.mdc`

---

## Resend (Email)

Email sending via Resend SDK.

### Setup
```typescript
import { Resend } from 'resend';
const resend = new Resend(env.RESEND_API_KEY);
```

### Sending Email
```typescript
await resend.emails.send({
  from: 'noreply@example.com',
  to: user.email,
  subject: 'Welcome!',
  html: generateWelcomeEmail(user),
});
```

### Email Templates
Store templates in `app/lib/constants/emails.ts`:
```typescript
export function generateWelcomeEmail(user: User): string {
  return `<html>...</html>`;  // Inline CSS only
}
```

**Rule:** See `.cursor/rules/emails.mdc`

---

## Shiki (Syntax Highlighting)

Code syntax highlighting for markdown.

```typescript
import { codeToHtml } from 'shiki';

const html = await codeToHtml(code, {
  lang: 'typescript',
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
});
```

**Key files:** `app/components/markdown-renderer.tsx`

---

## Mermaid (Diagrams)

Diagram rendering in markdown.

```typescript
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false });
const { svg } = await mermaid.render('id', diagramCode);
```

**Key files:** `app/components/markdown-renderer.tsx`

---

## Integration Checklist

When adding a new integration:

1. [ ] Add to `wrangler.jsonc` if Cloudflare service
2. [ ] Add environment variables to `.dev.vars`
3. [ ] Create repository if data access needed
4. [ ] Add to context type in `workers/app.ts`
5. [ ] Create `.cursor/rules/` file for patterns
6. [ ] Update `.cursor/context/integrations.md`
