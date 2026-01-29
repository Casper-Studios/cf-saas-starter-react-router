# User Journeys

## Authentication Flows

### Sign Up (New User)

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User   │────▶│ /sign-up     │────▶│ Submit Form │────▶│ Validate │
└─────────┘     └──────────────┘     └─────────────┘     └────┬─────┘
                                                              │
                     ┌────────────────────────────────────────┘
                     ▼
              ┌─────────────┐     ┌─────────────┐     ┌──────────────┐
              │ Create User │────▶│ Create      │────▶│ Redirect to  │
              │ + Account   │     │ Session     │     │ /admin       │
              └─────────────┘     └─────────────┘     └──────────────┘
```

**Key files:** `app/routes/authentication/sign-up.tsx`, `app/auth/server.ts`

### Login (Existing User)

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User   │────▶│ /login       │────▶│ Submit      │────▶│ Verify   │
└─────────┘     └──────────────┘     │ Credentials │     │ Password │
                                     └─────────────┘     └────┬─────┘
                                                              │
              ┌───────────────────────────────────────────────┘
              ▼
       ┌─────────────┐     ┌─────────────┐     ┌──────────────┐
       │ Check Ban   │────▶│ Create      │────▶│ Redirect to  │
       │ Status      │     │ Session     │     │ /admin       │
       └─────────────┘     └─────────────┘     └──────────────┘
```

**Key files:** `app/routes/authentication/login.tsx`

### Logout

```
User clicks logout → authClient.signOut() → Session deleted → Redirect to /login
```

## Admin Journeys

### User Management

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│  Admin  │────▶│ /admin/users │────▶│ View User   │
└─────────┘     └──────────────┘     │ Table       │
                                     └──────┬──────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────┐
        ▼                                   ▼                               ▼
┌───────────────┐                   ┌───────────────┐               ┌───────────────┐
│ Ban User      │                   │ Unban User    │               │ Impersonate   │
│ (set reason)  │                   │               │               │ User          │
└───────────────┘                   └───────────────┘               └───────────────┘
```

**Key files:** `app/routes/admin/users.tsx`, `app/trpc/routes/admin.ts`

### Documentation Viewing

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  Admin  │────▶│ /admin/docs  │────▶│ Select      │────▶│ View Document│
└─────────┘     └──────────────┘     │ Category    │     │ + TOC        │
                                     └─────────────┘     └──────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ Search/     │
                                     │ Filter Docs │
                                     └─────────────┘
```

**Key files:** `app/routes/admin/docs.tsx`

## File Upload Journey

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  User   │────▶│ Select File  │────▶│ Validate    │────▶│ Upload to R2 │
└─────────┘     └──────────────┘     │ Type/Size   │     └──────┬───────┘
                                     └─────────────┘            │
                                                                ▼
                                                         ┌──────────────┐
                                                         │ Return URL   │
                                                         │ to Client    │
                                                         └──────────────┘
```

**Key files:** `app/components/file-upload.tsx`, `app/routes/api/upload-file.ts`

## Role-Based Access

```
                                    ┌─────────────────┐
                                    │   All Users     │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
            ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
            │ Public Routes │        │ Protected     │        │ Admin Routes  │
            │ /login        │        │ Routes        │        │ /admin/*      │
            │ /sign-up      │        │ (logged in)   │        │ (role=admin)  │
            └───────────────┘        └───────────────┘        └───────────────┘
```

## Error States

### Banned User Login Attempt
```
Login attempt → Check ban status → Show ban reason + expiration → Block access
```

### Session Expired
```
API request → Session invalid → Redirect to /login → "Session expired" message
```

### Unauthorized Admin Access
```
Navigate to /admin/* → Check role → role !== 'admin' → Redirect to /
```
