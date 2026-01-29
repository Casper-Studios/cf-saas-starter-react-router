# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ React Router│  │ tRPC Client │  │ Better Auth Client      │ │
│  │ Components  │  │ Hooks       │  │ (useSession, signIn)    │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
└─────────┼────────────────┼─────────────────────┼───────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Cloudflare Workers (Edge)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ React Router│  │ tRPC Router │  │ Better Auth Handler     │ │
│  │ Loaders     │  │ /api/trpc/* │  │ /api/auth/*             │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                     │                │
│         └────────────────┼─────────────────────┘                │
│                          ▼                                      │
│                 ┌─────────────────┐                             │
│                 │  Repositories   │                             │
│                 │  (Data Access)  │                             │
│                 └────────┬────────┘                             │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Services                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ D1 Database │  │ R2 Storage  │  │ Workers KV (sessions)   │ │
│  │ (SQLite)    │  │ (Files)     │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### Server-Side Rendering (Loaders)

```
Route Loader → context.trpc.routeName.methodName() → Repository → D1
     │
     └─→ Returns data to component via useLoaderData()
```

**Example:**
```typescript
// app/routes/admin/users.tsx
export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await context.auth.api.getSession({ headers: request.headers });
  if (!session) return redirect("/login");
  
  const users = await context.trpc.admin.getUsers();
  return { users };
}
```

### Client-Side Data Fetching

```
Component → api.routeName.useQuery() → tRPC Client → /api/trpc/* → tRPC Router → Repository → D1
                                                                        │
                                                                        └─→ Response flows back
```

**Example:**
```typescript
// Client component
const { data: users, isLoading } = api.admin.getUsers.useQuery();
```

### Mutations

```
Component → api.routeName.useMutation() → tRPC Client → /api/trpc/* → tRPC Router → Repository → D1
     │
     └─→ onSuccess/onError callbacks handle UI updates
```

## Layer Responsibilities

### Routes (`app/routes/`)
- Page components and layouts
- Server loaders for SSR data
- Client-side interactivity
- Form handling and navigation

### tRPC Routes (`app/trpc/routes/`)
- Input validation (Zod schemas)
- Authorization checks
- Orchestrate repository calls
- Transform data for clients

### Repositories (`app/repositories/`)
- Pure database operations
- No auth/context awareness
- Throw typed errors
- Single responsibility per function

### Models (`app/models/`)
- Zod schemas for validation
- TypeScript types
- Custom error classes

## Key Files

| Layer | Location | Purpose |
|-------|----------|---------|
| Entry | `workers/app.ts` | Cloudflare Worker entry |
| Routes | `app/routes.ts` | Route definitions |
| tRPC | `app/trpc/router.ts` | tRPC router setup |
| DB | `app/db/schema.ts` | Drizzle schema |
| Auth | `app/auth/server.ts` | Better Auth config |
