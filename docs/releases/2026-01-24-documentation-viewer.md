# Documentation Viewer Release

**Date:** 2026-01-24

## Summary

Added a comprehensive internal documentation system at `/admin/docs` for organizing and viewing project documentation with a professional reading experience.

## New Features

### Documentation Viewer (`/admin/docs`)
- **5 Category Organization**: meetings, ideas, plans, features, releases
- **URL State Management**: Direct linking to documents via `/admin/docs/:category/:doc`
- **Syntax Highlighting**: Shiki with github-light/dark themes for code blocks
- **Table of Contents**: Auto-extracted headings with scroll tracking
- **Search/Filter**: Filter documents by title or content
- **Rich Empty States**: Custom icons and messages per category
- **Breadcrumbs**: Category > Document navigation
- **Mermaid Diagrams**: Support for visualizing architecture and flows

### Agent Improvements
- Documentation guidelines rule (`.cursor/rules/docs.mdc`)
- Planning skill with subagent assignments (`.cursor/skills/plan-with-subagents/SKILL.md`)
- Enhanced tester agent with documentation output requirements
- PR checker now validates documentation files

## Key Files

| File | Description |
|------|-------------|
| `app/routes/admin/docs.tsx` | Main documentation page |
| `app/components/markdown-renderer.tsx` | Markdown renderer with shiki + mermaid |
| `.cursor/rules/docs.mdc` | Documentation guidelines |
| `e2e/docs.spec.ts` | E2E tests for documentation |

## Bug Fixes

None - initial release.

## Breaking Changes

None.

## Dependencies Added

- `shiki` - Syntax highlighting
- `mermaid` - Diagram rendering
- `react-markdown` - Markdown parsing
- `remark-gfm` - GitHub Flavored Markdown support
