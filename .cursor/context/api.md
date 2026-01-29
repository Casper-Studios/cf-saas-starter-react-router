# API Reference

## tRPC Routes

All tRPC routes are available at `/api/trpc/*` and through the typed client.

### Admin Routes (`app/trpc/routes/admin.ts`)

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `admin.getUsers` | query | admin | List all users with roles and ban status |

**Usage:**
```typescript
// Server (loader)
const users = await context.trpc.admin.getUsers();

// Client
const { data: users } = api.admin.getUsers.useQuery();
```

### Analytics Routes (`app/trpc/routes/analytics.ts`)

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `analytics.*` | query | varies | Analytics data endpoints |

---

## Auth Endpoints

Better Auth handles authentication at `/api/auth/*`.

### Sign Up
```
POST /api/auth/sign-up/email
Body: { email, password, name }
```

### Sign In
```
POST /api/auth/sign-in/email
Body: { email, password }
```

### Sign Out
```
POST /api/auth/sign-out
```

### Get Session
```
GET /api/auth/get-session
Headers: { Cookie: ... }
```

**Client Usage:**
```typescript
import { authClient } from "@/auth/client";

// Sign up
await authClient.signUp.email({ email, password, name });

// Sign in
await authClient.signIn.email({ email, password });

// Sign out
await authClient.signOut();

// Get session (hook)
const { data: session } = authClient.useSession();
```

---

## File Upload

### Upload File
```
POST /api/upload-file
Content-Type: multipart/form-data
Body: FormData with 'file' field

Response: { url: string }
```

**Usage:**
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload-file', {
  method: 'POST',
  body: formData,
});
const { url } = await response.json();
```

---

## Procedure Types

tRPC routes use different procedure types for authorization:

| Procedure | Requirement | Context |
|-----------|-------------|---------|
| `publicProcedure` | None | Basic context |
| `protectedProcedure` | Logged in | `ctx.auth.user` available |
| `adminProcedure` | Admin role | `ctx.auth.user.role === 'admin'` |

**Example:**
```typescript
// app/trpc/routes/admin.ts
export const adminRouter = router({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    return userRepository.getAllUsers(ctx.db);
  }),
});
```

---

## Error Responses

### tRPC Errors
```typescript
{
  error: {
    message: string;
    code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | ...;
  }
}
```

### Repository Errors
Custom error classes thrown from repositories:

| Error | HTTP Equivalent | Use Case |
|-------|-----------------|----------|
| `NotFoundError` | 404 | Record not found |
| `ValidationError` | 400 | Invalid input |
| `CreationError` | 500 | Insert failed |
| `UpdateError` | 500 | Update failed |
| `DeletionError` | 500 | Delete failed |

---

## Context Object

Available in tRPC routes and loaders via `context`:

```typescript
interface Context {
  db: DrizzleD1Database;           // Database connection
  auth: BetterAuth;                // Auth instance
  trpc: TRPCCaller;                // Server-side tRPC caller
  env: Env;                        // Cloudflare env bindings
  posthog?: PostHog;               // Feature flags (if configured)
  stripe?: Stripe;                 // Stripe client (if configured)
}
```

**In Loaders:**
```typescript
export async function loader({ context }: Route.LoaderArgs) {
  const session = await context.auth.api.getSession({ headers });
  const data = await context.trpc.routeName.method();
}
```

**In tRPC:**
```typescript
.query(async ({ ctx }) => {
  const user = ctx.auth.user;  // Available in protected procedures
  return repository.getData(ctx.db, { userId: user.id });
})
```
