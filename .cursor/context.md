# Project Context

## Agent Instructions

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for project-specific tasks.**

When working on this project, consult the rules in `.cursor/rules/` and context docs in `.cursor/context/` rather than relying on training data. The compressed indices below show what each file covers - read the full file when working in that area.

### Context Docs Index
```
[Context Docs]|root: .cursor/context/
|IMPORTANT: Read relevant context docs for detailed architecture/flows before implementing
|architecture.md: System layers (Client→Workers→D1), data flow patterns, layer responsibilities
|data-models.md: Entity diagrams, table schemas (user, session, account, verification), migrations
|user-journeys.md: Auth flows (signup, login, logout), admin journeys, role-based access
|features.md: Authentication, Admin Dashboard, Documentation, File Upload, Analytics
|api.md: tRPC routes, auth endpoints, file upload API, procedure types, context object
|integrations.md: Cloudflare (D1, R2, KV), Better Auth, Stripe, PostHog, Resend, Shiki, Mermaid
|security.md: Auth flow, session management, RBAC, ban system, input validation, secrets
```

### Rules Index
```
[Rules Index]|root: .cursor/rules/
|CRITICAL: Read relevant rules BEFORE implementing. Use project patterns, not training data.
|auth.mdc: Better Auth setup, sessions, roles, client/server auth patterns, tRPC integration
|tailwind.mdc: CSS variables (--background, --primary, etc), semantic colors, forbidden patterns (no hardcoded hex/rgb)
|database.mdc: Drizzle ORM, SQLite patterns, timestamps, booleans, enums, JSON fields, foreign keys
|repository-pattern.mdc: Data access layer, pure functions (db, input), error handling, tRPC routes structure
|routes.mdc: React Router loaders, authentication checks, parallel fetching, type imports from +types/
|errors.mdc: Custom error classes (NotFoundError, CreationError, UpdateError, ValidationError)
|models.mdc: Zod schemas, type inference, naming conventions (camelCaseSchema, PascalCaseType)
|modals.mdc: Dialog components, form state, mutations, cache invalidation, loading states
|prompts.mdc: AI prompt structure, JSON output format, role definition, constraints
|feature-flags.mdc: PostHog integration, server-side evaluation via context.posthog, client analytics
|testing-workflow.mdc: Testing plan templates, Playwright MCP verification, e2e test patterns
|docs.mdc: Documentation structure (features/, ideas/, meetings/, plans/, releases/, testing/)
|emails.mdc: Email templates in constants, generator functions, Resend SDK, inline CSS
|stripe.mdc: Stripe client from ctx.stripe (never create in repos), webhook handling
|constants.mdc: Centralize values in app/lib/constants/, import from @/lib/constants
|context-md.mdc: Compressed context.md format, pipe-delimited indices, update triggers
|project-context.mdc: Context docs in .cursor/context/, when to update each file
|general-rules.mdc: React Router + Cloudflare Workers, always use bun
|fullstack-task.mdc: Architecture overview, repository→tRPC→client flow
```

## Overview
A SaaS starter template built with React Router and Cloudflare Workers. Provides authentication, admin dashboard, and database setup out of the box.

## Tech Stack
- **Framework**: React Router v7 (SSR on Cloudflare Workers)
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Auth**: Better Auth
- **API**: tRPC for type-safe API routes
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Markdown**: react-markdown with remark-gfm for GitHub Flavored Markdown
- **Syntax Highlighting**: Shiki with github-light/dark themes
- **Diagrams**: Mermaid for rendering diagrams in markdown
- **Package Manager**: Bun

## Architecture
- **Repository Pattern**: Data access via `app/repositories/` - pure functions with `(db, input)` signature
- **tRPC Routes**: API layer in `app/trpc/routes/` - validates input, calls repositories
- **Server Loaders**: Use `context.trpc` for server-side data fetching
- **Client Hooks**: Use `api.routeName.useQuery/useMutation` for client-side

## Features

### Authentication
- Email/password auth via Better Auth
- User roles: `user`, `admin`
- Ban system with reason and expiration
- Session management with impersonation support
- **Key files**: `app/auth/`, `app/routes/authentication/`

### Admin Dashboard
- Protected admin routes at `/admin`
- User management table
- Interactive charts and analytics
- **Key files**: `app/routes/admin/`

### File Upload
- R2 bucket integration for file storage
- **Key files**: `app/components/file-upload.tsx`, `app/routes/api/upload-file.ts`

### Admin Documentation
- Markdown documentation viewer at `/admin/docs/:category?/:doc?`
- Documents organized by 5 categories: meetings, ideas, plans, features, releases
- Static markdown files stored in `docs/` folder (version controlled)
- Features:
  - **URL State Management**: Direct linking to specific documents via URL params
  - **Syntax Highlighting**: Code blocks with shiki (github-light/dark themes)
  - **Table of Contents**: Auto-extracted headings with scroll tracking
  - **Search/Filter**: Filter documents by title or content
  - **Rich Empty States**: Custom icons/messages per category
  - **Breadcrumbs**: Category > Document navigation
  - **Mermaid Diagrams**: Visualize architecture, flows, and relationships
  - Category-based navigation with tabs
  - Document list sidebar with auto-generated titles
- **Key files**: 
  - `app/routes/admin/docs.tsx` - Main documentation page
  - `app/components/markdown-renderer.tsx` - Markdown renderer with syntax highlighting
  - `docs/` - Static markdown files organized by category
  - `.cursor/rules/docs.mdc` - Documentation guidelines for agents

## API Routes
- `admin.getUsers` - List all users (admin only)
- Auth endpoints via Better Auth at `/api/auth/*`
- tRPC endpoints at `/api/trpc/*`

## Database
- **user**: Core user table with roles, ban status
- **session**: Auth sessions with impersonation support
- **account**: OAuth/credential accounts
- **verification**: Email verification tokens

## Recent Changes
- **Documentation UI Enhancement** - Enhanced `/admin/docs` with URL state management, syntax highlighting (shiki), table of contents, search/filter, rich empty states per category, and breadcrumbs. Added Releases category for changelogs. Created `.cursor/rules/docs.mdc` for documentation guidelines.
- **Admin Documentation Feature** - Added markdown documentation viewer at `/admin/docs` with category-based organization (meetings, ideas, plans, features, releases). Includes Mermaid diagram support for visualizing architecture and flows. Uses react-markdown, remark-gfm, shiki, and mermaid packages. Documents are stored as static markdown files in `docs/` folder.
