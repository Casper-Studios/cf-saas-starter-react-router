# Security Model

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│ Better Auth │────▶│   Verify    │────▶│   Create    │
│   Request   │     │   Handler   │     │ Credentials │     │   Session   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │ Set Cookie  │
                                                            │ (httpOnly)  │
                                                            └─────────────┘
```

## Session Management

### Session Storage
- Sessions stored in D1 database (`session` table)
- Session token in httpOnly cookie
- Includes IP address and user agent for auditing

### Session Validation
```typescript
// In loaders
const session = await context.auth.api.getSession({
  headers: request.headers,
});

if (!session) {
  return redirect("/login");
}
```

### Impersonation
Admins can impersonate users for support:
```typescript
// session.impersonatedBy contains admin's user ID when impersonating
if (session.impersonatedBy) {
  // Currently impersonating another user
}
```

---

## Authorization Layers

### Layer 1: Route Protection (Loaders)
```typescript
export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await context.auth.api.getSession({ headers: request.headers });
  
  if (!session) {
    return redirect("/login");
  }
  
  // Check role for admin routes
  if (session.user.role !== "admin") {
    return redirect("/");
  }
  
  return { user: session.user };
}
```

### Layer 2: tRPC Procedures
```typescript
// Public - no auth required
export const publicProcedure = t.procedure;

// Protected - must be logged in
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.auth.user } });
});

// Admin - must have admin role
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

### Layer 3: Repository Validation
Repositories receive validated data and don't perform auth checks:
```typescript
// Repository - trusts caller has authorized
export async function updateUser(db: Database, input: UpdateUserInput) {
  // No auth check here - caller (tRPC route) handles that
  return db.update(user).set(input).where(eq(user.id, input.id));
}
```

---

## Role-Based Access Control (RBAC)

### Roles
| Role | Capabilities |
|------|-------------|
| `user` | Access protected routes, own data |
| `admin` | All user capabilities + admin routes, user management |

### Role Check Pattern
```typescript
// In components
{session.user.role === "admin" && (
  <AdminOnlyFeature />
)}

// In tRPC
.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
})
```

---

## Ban System

### Ban Structure
```typescript
{
  banned: boolean;
  banReason: string | null;
  banExpires: number | null;  // Unix timestamp, null = permanent
}
```

### Ban Check Flow
```
Login attempt → Fetch user → Check banned flag → Check banExpires
                                    │                    │
                                    ▼                    ▼
                            banned=true?          Expired?
                                    │                    │
                                    ▼                    ▼
                            Block + show reason    Allow login
```

---

## Input Validation

### Client-Side
Form validation for UX, not security:
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Server-Side (tRPC)
Required validation using Zod:
```typescript
.input(z.object({
  email: z.string().email(),
  password: z.string().min(8),
}))
.mutation(async ({ input }) => {
  // input is validated and typed
})
```

### Database-Level
Drizzle schema constraints:
```typescript
export const user = sqliteTable("user", {
  email: text("email").notNull().unique(),
  // ...
});
```

---

## Security Headers

Cloudflare Workers automatically handle:
- HTTPS enforcement
- DDoS protection

Application should add:
```typescript
// In middleware or response
headers.set("X-Content-Type-Options", "nosniff");
headers.set("X-Frame-Options", "DENY");
headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
```

---

## Secrets Management

### Development
Store in `.dev.vars` (gitignored):
```
DATABASE_URL=...
AUTH_SECRET=...
RESEND_API_KEY=...
```

### Production
Set via Cloudflare Dashboard or Wrangler:
```bash
wrangler secret put AUTH_SECRET
```

### Access Pattern
```typescript
// In Workers context
const apiKey = ctx.env.RESEND_API_KEY;
```

**Never:**
- Commit secrets to git
- Log secrets
- Expose in client bundles
