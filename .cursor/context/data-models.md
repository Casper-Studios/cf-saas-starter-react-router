# Data Models

## Schema Location

**Primary source:** `app/db/schema.ts`

Always read the schema file directly for current table definitions.

## Entity Relationships

```
user ◄─────┬───── session (userId)
           │         └── impersonatedBy → user
           │
           ├───── account (userId)
           │
           └───── verification (identifier = email)
```

## Tables Overview

| Table | Purpose | Key Relations |
|-------|---------|---------------|
| `user` | Core user with roles/bans | Referenced by session, account |
| `session` | Active sessions | Links user, tracks impersonation |
| `account` | OAuth/credential accounts | Belongs to user |
| `verification` | Email verification tokens | Links to user by email |

## SQLite Conventions

- **Booleans**: INTEGER (0/1)
- **Timestamps**: INTEGER (Unix epoch)
- **Enums**: TEXT with app-level validation
- **JSON**: TEXT with serialization

## Migrations

- **Location**: `drizzle/`
- **Generate**: `bun run db:generate`
- **Apply**: `bun run db:migrate`

See `.cursor/rules/database.mdc` for Drizzle patterns.
