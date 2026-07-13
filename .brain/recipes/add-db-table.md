# Recipe: Add a D1 table + repository

## Steps

### 1. Schema → [`app/db/schema.ts`](../../app/db/schema.ts)

```ts
export const post = sqliteTable("post", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`cast(unixepoch('subsecond') * 1000 as integer)`),
});

export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;
```

> Use `unixepoch` SQL default — D1 SQLite. No JS-side Date defaults.

### 2. Generate migration

```bash
bun run db:generate
```

Review the generated SQL in `drizzle/NNNN_<name>.sql` — sanity-check column names, FK actions, indexes.

### 3. Apply locally

```bash
bun run db:migrate:local
```

### 4. Repository → `app/repositories/post.ts`

Follow [`.brain/rules/repository.md`](../rules/repository.md). Use `Effect.Service`, `tryQuery` / `tryUpdate` helpers. Type all inputs as Effect Schema in `app/lib/schemas/post.ts`.

### 5. Repository unit test → `app/repositories/__tests__/post.test.ts`

Use `makeTestDatabase` + `chainable` stub from [`app/services/database.test-layer.ts`](../../app/services/database.test-layer.ts). One test per method.

### 6. Seed fixtures → [`scripts/seed-preview.ts`](../../scripts/seed-preview.ts)

Extend the seed script with representative rows for the new table (`INSERT OR IGNORE`, deterministic `seed-*` ids) so per-PR previews and local dev have realistic data. See [`.brain/rules/repository.md`](../rules/repository.md) ("Seed data").

### 7. Update brain

- [`.brain/high-level-architecture/data-models.md`](../high-level-architecture/data-models.md) — add table row, ER diagram if relations
- [`.brain/rules/repository.md`](../rules/repository.md) — only if introducing new pattern
- [`.brain/CHANGELOG.md`](../CHANGELOG.md) — entry

### 8. Production migration

Only after PR merged + reviewed:

```bash
bun run db:migrate:remote
```

## Definition of done

- [ ] Schema in `app/db/schema.ts`
- [ ] Migration generated + reviewed + applied locally
- [ ] Types exported (`Post`, `NewPost`)
- [ ] Repository in `app/repositories/`
- [ ] Repo unit test green
- [ ] `scripts/seed-preview.ts` extended with representative fixtures
- [ ] `data-models.md` updated
- [ ] CHANGELOG entry

## Anti-patterns

- ❌ JS-side `new Date()` default — use SQL `unixepoch`
- ❌ Forgetting `references(...)` for foreign keys — D1 enforces if pragma on
- ❌ Direct `db.run(sql\`...\`)` raw queries when query builder works
- ❌ Skipping the repo layer and querying DB from a tRPC route
