# Project Context

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
