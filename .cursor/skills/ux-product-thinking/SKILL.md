---
name: ux-product-thinking
description: Guides UI/UX design decisions alongside product goals using competitive research, market research reports, ICP analysis, and mermaid diagrams. Use when designing new features, planning user flows, researching competitors, analyzing ICPs, generating UI concepts, or when the user asks about UX decisions, user journeys, or interface design.
---

# UX Product Thinking

A structured approach to UI/UX design that aligns interface decisions with product goals. Uses Tavily for competitive research, market research reports for ICP analysis, image generation for UI concepts, and produces mermaid diagrams for visualization. Integrates with context-keeper for documentation.

## Project Context

**mise en place** — A recipe management app for home cooks who save recipes from YouTube cooking videos and food blogs. Instead of manually copying ingredients and steps, users paste a URL and AI extracts everything automatically—including video timestamps for easy reference. The app also features weekly meal planning with aggregated grocery lists.

**Target Audience**: Home cooks who frequently discover recipes online and want a single place to organize, plan, and shop for their meals.

**Design Direction**: Editorial cookbook aesthetic—warm, artisanal design inspired by classic cookbooks. Playfair Display for headings, Source Sans 3 for body text. Terracotta and sage color palette with grain textures and warm shadows.

## Rules Reference

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning.**

Read `.cursor/context.md` for the compressed Rules Index. When implementing designs, ensure compliance with:
- `tailwind.mdc` - CSS variables and semantic colors (no hardcoded hex values)
- `modals.mdc` - Modal component patterns
- `routes.mdc` - Route and page structure

## When to Use

- Researching competitors and design inspiration
- Gathering branding colors and guidelines
- Designing a new feature or screen
- Mapping user journeys and flows
- Breaking down UI into components
- Evaluating UX trade-offs
- Documenting interface architecture
- **Analyzing market research reports with ICP data**
- **Generating UI concepts for different user personas**

## Core Framework: RESEARCH → GOALS → USERS → FLOWS → DESIGN → UI → CONCEPTS

```mermaid
flowchart LR
    R[Research] --> G[Product Goals]
    G --> U[User Needs/ICPs]
    U --> F[User Flows]
    F --> C[Components]
    C --> D[Design Spec]
    D --> UI[UI Concepts]
    UI --> I[Implementation]
```

Work through each layer before moving to the next. The **UI Concepts** phase generates visual mockups for each ICP before implementation.

---

## Input Sources

This skill supports two research input paths:

### Path A: Live Research (Tavily + Browser Renderer)
Use when you need to gather fresh competitive intelligence. See **Phase 0** below.

### Path B: Market Research Reports
Use when you have existing research documents (from tools, consultants, or prior analysis).

**When to use Path B:**
- User provides a market research report file
- Research already contains ICP analysis with fit scores
- Competitive analysis is already documented
- You want to skip to ICP-targeted design

**Market Research Report Extraction:**
```markdown
When given a research report, extract:

1. **ICPs (Ideal Customer Profiles)**
   - Demographics and attributes
   - Pain points and frustrations
   - Goals and motivations
   - Fit scores if provided
   - Preferred channels

2. **Competitive Positioning**
   - Key competitors
   - Feature comparison
   - Differentiation opportunities
   - Market gaps

3. **Recommended Features**
   - Priority ranking
   - Demand level
   - Coverage status (none/partial/saturated)
```

---

## Phase 0: Competitive Research (Tavily)

Before defining goals, research the landscape. Use **Tavily MCP tools** to gather competitive intelligence and design inspiration.

### Research Workflow

```mermaid
flowchart TD
    Start([Define research scope]) --> Search[tavily_search: Find competitors]
    Search --> Extract[tavily_extract: Pull landing pages]
    Extract --> Crawl[tavily_crawl: Explore site structure]
    Crawl --> Analyze[Analyze patterns]
    Analyze --> Document[Document findings]
```

### 1. Find Competitors and Similar Products

Use `tavily_search` to discover competitors:

```
tavily_search:
  query: "[your product type] SaaS alternatives 2026"
  max_results: 10
  search_depth: "advanced"
```

**Search queries to try:**
- `"[product category] best tools comparison"`
- `"[product category] landing page examples"`
- `"[competitor name] design system"`
- `"[industry] SaaS UI trends 2026"`

### 2. Extract Branding & Design from Competitor Sites

Use `tavily_extract` to pull content from competitor pages:

```
tavily_extract:
  urls: ["https://competitor.com", "https://competitor.com/about"]
  extract_depth: "advanced"
  include_images: true
  query: "branding colors design style"
```

**Pages to extract:**
- Landing/home page (hero messaging, CTA style)
- Pricing page (tier structure, feature presentation)
- About page (brand voice, values)
- Product screenshots (UI patterns)

### 3. Explore Site Structure

Use `tavily_crawl` to understand information architecture:

```
tavily_crawl:
  url: "https://competitor.com"
  max_depth: 2
  instructions: "Find navigation structure, key features, and design patterns"
  include_images: true
```

### Research Documentation Template

```markdown
## Competitive Research: [Feature/Product]

### Competitors Analyzed
| Competitor | URL | Strengths | Weaknesses |
|------------|-----|-----------|------------|
| [Name] | [URL] | [What they do well] | [Gaps/opportunities] |

### Branding Patterns Observed
**Color Palettes:**
- Competitor A: Primary #XXXXX, Accent #XXXXX
- Competitor B: Primary #XXXXX, Accent #XXXXX
- **Common trend**: [e.g., "Dark mode with vibrant accents"]

**Typography:**
- Headlines: [Common font styles]
- Body: [Common font choices]

**Visual Style:**
- [e.g., "Minimalist with bold CTAs"]
- [e.g., "Illustration-heavy, friendly tone"]

### UX Patterns Worth Adopting
1. [Pattern]: [Where seen] - [Why it works]
2. [Pattern]: [Where seen] - [Why it works]

### Differentiation Opportunities
- [Gap in market we can fill]
- [Unique angle competitors miss]

### Design Inspiration
| Element | Source | Screenshot/URL | Notes |
|---------|--------|----------------|-------|
| Hero layout | [Competitor] | [URL] | [What to borrow] |
| Pricing cards | [Competitor] | [URL] | [What to borrow] |
```

### Competitive Landscape Diagram

```mermaid
quadrantChart
    title Competitive Positioning
    x-axis Simple --> Feature-Rich
    y-axis Low Price --> Premium
    quadrant-1 Enterprise
    quadrant-2 Power Users
    quadrant-3 Budget
    quadrant-4 Sweet Spot
    Competitor A: [0.7, 0.8]
    Competitor B: [0.3, 0.4]
    Our Product: [0.5, 0.6]
```

### Alternative: Cloudflare Browser Renderer

When Tavily doesn't provide enough detail, or you need actual visual screenshots for design analysis, use **Cloudflare Browser Renderer MCP** as a supplement or alternative.

#### When to Use Cloudflare Browser Renderer

| Scenario | Use This Tool |
|----------|---------------|
| Need actual screenshots for visual analysis | `get_url_screenshot` |
| Tavily extraction misses content (JS-rendered pages) | `get_url_markdown` or `get_url_html_content` |
| Need to see exact layout/spacing/colors | `get_url_screenshot` with custom viewport |
| Want structured content without search | `get_url_markdown` |
| Need raw HTML for style/class inspection | `get_url_html_content` |

#### Screenshot for Visual Analysis

Capture competitor pages for visual reference:

```
get_url_screenshot:
  url: "https://competitor.com/pricing"
  viewport:
    width: 1440
    height: 900
```

**Viewport presets for different analyses:**
- Desktop: `width: 1440, height: 900`
- Tablet: `width: 768, height: 1024`
- Mobile: `width: 375, height: 812`

#### Extract Page Content as Markdown

When you need the actual text content:

```
get_url_markdown:
  url: "https://competitor.com/features"
```

Use this when:
- Tavily extract returns incomplete content
- Page has JavaScript-rendered content
- You want clean, structured text for analysis

#### Get Raw HTML for Style Inspection

Inspect actual CSS classes and structure:

```
get_url_html_content:
  url: "https://competitor.com"
```

Use this to:
- Find exact color values from inline styles
- Understand component structure
- Identify CSS framework usage (Tailwind classes, etc.)

#### Combined Workflow: Tavily + Browser Renderer

```mermaid
flowchart TD
    Start([Research goal]) --> Search[tavily_search: Find competitors]
    Search --> Extract[tavily_extract: Pull content]
    Extract --> Check{Content sufficient?}
    Check -->|Yes| Analyze[Analyze patterns]
    Check -->|No| Screenshot[get_url_screenshot: Visual capture]
    Screenshot --> Markdown[get_url_markdown: Full content]
    Markdown --> Analyze
    Analyze --> Document[Document findings]
```

**Best practice**: Start with Tavily for broad research, then use Browser Renderer for specific pages that need deeper visual or content analysis.

---

## Phase 1: Product Goals Analysis

Before any UI work, clarify what success looks like.

### Goal Mapping Template

```markdown
## Feature: [Name]

### Business Goals
- Primary: [e.g., Increase conversion by 15%]
- Secondary: [e.g., Reduce support tickets]

### Success Metrics
| Metric | Current | Target | How Measured |
|--------|---------|--------|--------------|
| [Metric] | [Value] | [Value] | [Method] |

### Constraints
- Technical: [e.g., Must work offline]
- Business: [e.g., Ship by Q2]
- Design: [e.g., Match existing design system]
```

### Goal Priority Diagram

```mermaid
quadrantChart
    title Feature Priority Matrix
    x-axis Low User Value --> High User Value
    y-axis Low Business Value --> High Business Value
    quadrant-1 Do First
    quadrant-2 Plan Next
    quadrant-3 Deprioritize
    quadrant-4 Quick Wins
```

---

## Phase 2: User Analysis

Understand who uses the feature and what they need.

### ICP Analysis (from Market Research)

When working with market research reports that contain ICP data, structure the analysis:

```markdown
### ICP Overview

| ICP | Fit Score | Primary Pain | Key Feature Need |
|-----|-----------|--------------|------------------|
| [Name] | XX/100 | [Pain point] | [Feature] |

### ICP 1: [Name]
**Fit Score**: XX/100 | [Primary/Secondary/Tertiary Target]

| Attribute | Detail |
|-----------|--------|
| **Demographics** | [Age, role, context] |
| **Discovery** | [How they find products] |
| **Primary Pain** | [Main frustration] |
| **Secondary Pain** | [Additional frustrations] |
| **Key Feature Need** | [What they need most] |
| **Willingness to Pay** | [Low/Medium/High + context] |

**Messaging Focus**: "[One-line positioning]"

**Hero Copy Options**:
- "[Option 1]"
- "[Option 2]"
- "[Option 3]"
```

### ICP Positioning Diagram

```mermaid
quadrantChart
    title ICP Fit vs Market Size
    x-axis Small Market --> Large Market
    y-axis Low Fit --> High Fit
    quadrant-1 Primary Target
    quadrant-2 Growth Opportunity
    quadrant-3 Deprioritize
    quadrant-4 Quick Wins
    "ICP 1": [0.35, 0.72]
    "ICP 2": [0.75, 0.68]
    "ICP 3": [0.40, 0.58]
```

### User Persona Quick Template

```markdown
## Persona: [Name]

**Role**: [Job title or user type]
**Goal**: [What they're trying to accomplish]
**Pain Points**: 
- [Current frustration 1]
- [Current frustration 2]

**Context**: [When/where they use the product]
**Tech Comfort**: [Low/Medium/High]
```

### User Mental Model Diagram

```mermaid
mindmap
  root((Feature))
    User Expectation 1
      Sub-expectation
      Sub-expectation
    User Expectation 2
      Sub-expectation
    User Expectation 3
```

---

## Phase 3: User Flow Design

Map how users move through the feature.

### Flow Types

1. **Happy Path**: Ideal journey to goal completion
2. **Error Paths**: Recovery from mistakes
3. **Edge Cases**: Unusual but valid scenarios

### User Flow Diagram Template

```mermaid
flowchart TD
    Start([User arrives]) --> A{Has account?}
    A -->|Yes| B[Show dashboard]
    A -->|No| C[Show signup CTA]
    B --> D[User takes action]
    D --> E{Action successful?}
    E -->|Yes| F[Show success state]
    E -->|No| G[Show error + recovery]
    G --> D
    F --> End([Goal completed])
```

### Journey Map Template

```mermaid
journey
    title User Journey: [Feature Name]
    section Discovery
      Find feature: 3: User
      Understand purpose: 4: User
    section Engagement
      Start task: 5: User
      Complete steps: 4: User
    section Completion
      See results: 5: User
      Share/export: 3: User
```

### State Machine for Complex UI

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: user action
    Loading --> Success: data received
    Loading --> Error: request failed
    Success --> Idle: reset
    Error --> Loading: retry
    Error --> Idle: dismiss
```

---

## Phase 4: Component Architecture

Break the UI into logical, reusable parts.

### Component Hierarchy Diagram

```mermaid
flowchart TD
    subgraph Page["Page: FeaturePage"]
        subgraph Layout["Layout Components"]
            Header[Header]
            Sidebar[Sidebar]
            Main[Main Content]
        end
        subgraph Feature["Feature Components"]
            FC1[FeatureCard]
            FC2[FeatureList]
            FC3[FeatureDetail]
        end
        subgraph Shared["Shared UI"]
            Button[Button]
            Input[Input]
            Modal[Modal]
        end
    end
```

### Component Spec Template

```markdown
## Component: [Name]

**Purpose**: [Single responsibility]
**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| | | | |

**States**: [idle, loading, error, success]
**Events**: [onClick, onChange, onSubmit]
**Accessibility**: [keyboard nav, aria labels, focus management]
```

### Data Flow Diagram

```mermaid
flowchart LR
    subgraph Client
        UI[UI Component] --> Hook[React Hook]
        Hook --> State[Local State]
    end
    subgraph Server
        Hook --> tRPC[tRPC Route]
        tRPC --> Repo[Repository]
        Repo --> DB[(Database)]
    end
```

---

## Phase 5: Wireframe Specification

Text-based wireframe for AI implementation.

### Wireframe Template

```markdown
## Screen: [Name]

### Layout
┌─────────────────────────────────────┐
│ Header: Logo | Nav | User Menu      │
├─────────────────────────────────────┤
│ Sidebar    │ Main Content           │
│ - Nav 1    │ ┌─────────────────┐    │
│ - Nav 2    │ │ Card Component  │    │
│ - Nav 3    │ │ - Title         │    │
│            │ │ - Description   │    │
│            │ │ - Action Button │    │
│            │ └─────────────────┘    │
├─────────────────────────────────────┤
│ Footer: Links | Copyright           │
└─────────────────────────────────────┘

### Responsive Behavior
- Mobile: Sidebar becomes bottom nav
- Tablet: Sidebar collapses to icons
- Desktop: Full sidebar visible

### Interactions
1. [Element]: [Interaction] → [Result]
2. [Element]: [Interaction] → [Result]
```

---

## Phase 6: Frontend Design Specification

Define the **distinctive visual identity** before implementation. This phase transforms wireframes into a memorable, production-ready design direction.

**Read and apply the `frontend-design` skill** (`.cursor/skills/frontend-design/SKILL.md`) for detailed guidelines on:
- Design thinking (purpose, tone, constraints, differentiation)
- Typography (distinctive fonts, never Inter/Roboto/Arial)
- Color & theme (dominant + sharp accent)
- Motion (high-impact moments over scattered micro-interactions)
- Spatial composition (asymmetry, overlap, grid-breaking)
- Visual details (textures, gradients, depth)

### Design Spec Output Template

Document in the architecture doc:

```markdown
## Frontend Design Specification

### Aesthetic Direction
**Tone**: [e.g., brutally minimal, maximalist, retro-futuristic, editorial]
**Memorable Element**: [The ONE thing users will remember]

### Typography
| Usage | Font | Weight |
|-------|------|--------|
| Display | [Distinctive font] | [Weight] |
| Body | [Refined font] | [Weight] |

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| --primary | #XXXXXX | [Usage] |
| --accent | #XXXXXX | [Usage] |
| --background | #XXXXXX | [Usage] |

### Motion Design
- **Page load**: [Animation approach]
- **Key interaction**: [Signature moment]

### Visual Effects
[Background treatment, textures, shadows]
```

---

## Phase 7: UI Concept Generation

Generate visual mockups for each ICP using image generation tools. This creates tangible design references before implementation.

### When to Generate UI Concepts

- Landing pages targeting multiple ICPs
- Marketing pages with persona-specific messaging
- Feature pages that need ICP-specific framing
- A/B test variations for different audiences

### UI Concept Generation Workflow

```mermaid
flowchart TD
    ICPs[Identify ICPs from research] --> Design[Define design direction per ICP]
    Design --> Prompts[Craft detailed image prompts]
    Prompts --> Generate[Generate images with GenerateImage tool]
    Generate --> Save[Save to public/docs/]
    Save --> Embed[Embed in architecture document]
```

### Image Prompt Template

For each ICP, create a detailed prompt:

```
Landing page UI concept for [product] targeting [ICP name and description].
[Design aesthetic] aesthetic with [tone description].

Layout: [Layout type], [viewport] view ([dimensions])
- [Hero section description]
- [Key visual elements]

Color palette:
- [Background color with hex]
- [Primary color with hex] for [usage]
- [Accent color with hex] for [usage]
- [Text color with hex] for [usage]

Typography:
- [Headline style]: "[Headline text]"
- [Subheadline style]: "[Subheadline text]"
- [CTA text and style]

Visual elements:
- [Element 1]
- [Element 2]
- [Element 3]

Style: [Overall style description]. [Tone]. [What to avoid].
```

### Example: ICP-Specific Prompts

**ICP 1: Video-First User**
```
Focus on: Dynamic, playful energy
Hero visual: Video player with timestamp markers
Key elements: Platform logos (YouTube, TikTok), floating timestamp pills
Color emphasis: Heavier primary color for energy
Messaging: Action-oriented ("Stop pausing. Start cooking.")
```

**ICP 2: Overwhelmed Planner**
```
Focus on: Calm, organized, reassuring
Hero visual: Calendar/planner grid with recipe cards
Key elements: Grocery list, time-saved statistics
Color emphasis: More accent color for calm
Messaging: Relief-oriented ("Finally answered.")
```

**ICP 3: Legacy Preserver**
```
Focus on: Nostalgic, warm, heritage
Hero visual: Handwritten → digital transformation
Key elements: Family sharing visualization, preservation badges
Color emphasis: Deeper, warmer tones, gold accents
Messaging: Emotional ("Safe forever.")
```

### Saving and Embedding Concepts

1. **Generate images** using the `GenerateImage` tool
2. **Copy to public folder**: `public/docs/[feature-name]/`
3. **Embed in architecture doc** using relative paths:

```markdown
### Concept 1: "[Concept Name]" ([ICP Name])

![Concept 1 Description](/docs/[feature]/concept-1.png)

**Visual Direction**: [Description]
**Hero Design**: [Key elements]
**Color Emphasis**: [What stands out]
**Headline**: "[Copy]"
**Subheadline**: "[Copy]"
```

### UI Concepts Section Template

Add to architecture document:

```markdown
## UI Concepts

Three distinct concepts, each tailored to resonate with a specific ICP 
while maintaining the [design system] aesthetic.

### Concept 1: "[Theme Name]" ([ICP Name])

![Concept 1](/docs/[feature]/concept-1.png)

**Visual Direction**: [Tone and feel]
**Target Fit Score**: XX/100
**Hero Design**:
- [Layout description]
- [Key visual element]
- [Interactive element]

**Color Emphasis**: [Which colors dominate and why]

**Key Visual Elements**:
- [Element 1]
- [Element 2]
- [Element 3]

**Headline**: "[Copy]"
**Subheadline**: "[Copy]"

---

[Repeat for each ICP]
```

---

## Required Output: Architecture Document

**IMPORTANT**: Always create a comprehensive architecture document in `docs/features/[feature-name]-architecture.md` that consolidates all UX research and design decisions.

### Architecture Document Structure

The document MUST include these sections:

1. **Overview** - Vision, core value proposition, competitive positioning chart
2. **User Flow** - Primary flow diagram, state machine, journey map
3. **System Architecture** - High-level architecture, processing pipeline sequence diagram
4. **Data Model** - ER diagram, TypeScript interfaces
5. **Feature Breakdown** - Detailed feature specifications with diagrams
6. **UI Components** - Component hierarchy, screen wireframes (ASCII art), design system tokens
7. **Technical Stack** - Stack mindmap, API endpoints table, dependencies
8. **Future Roadmap** - Phased rollout plan

### Architecture Document Template

```markdown
# [Feature Name]: Information Architecture

A professional-grade [description of what it does].

---

## Table of Contents

1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [System Architecture](#system-architecture)
4. [Data Model](#data-model)
5. [Feature Breakdown](#feature-breakdown)
6. [UI Components](#ui-components)
7. [Frontend Design Specification](#frontend-design-specification)
8. [Technical Stack](#technical-stack)
9. [Future Roadmap](#future-roadmap)

---

## Overview

### Vision
[What problem this solves and for whom]

### Core Value Proposition
- **One Input**: [What user provides]
- **Key Outputs**: [What user gets]

### Competitive Positioning
[quadrantChart showing market position]

---

## User Flow

### Primary Flow Diagram
[flowchart TD showing main user journey]

### Detailed State Machine
[stateDiagram-v2 showing all states]

### User Journey Map
[journey diagram showing emotional touchpoints]

---

## System Architecture

### High-Level Architecture
[flowchart TB showing system components]

### Processing Pipeline
[sequenceDiagram showing API interactions]

---

## Data Model

### Entity Relationship Diagram
[erDiagram showing tables and relationships]

### TypeScript Data Structures
[Code block with interfaces]

---

## Feature Breakdown

### Feature 1: [Name]
[flowchart and specifications]

### Feature 2: [Name]
[flowchart and specifications]

---

## UI Components

### Component Hierarchy
[flowchart showing component tree]

### Screen Wireframes

#### Screen: [Name]
[ASCII wireframe]

### Design System
[Table of design tokens]

---

## Frontend Design Specification

### Aesthetic Direction
**Tone**: [e.g., "Brutally minimal with one playful accent"]
**Memorable Element**: [The ONE thing users will remember]

### Typography
| Usage | Font | Weight |
|-------|------|--------|
| Display | [Font] | [Weight] |
| Body | [Font] | [Weight] |

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #XXXXXX | [Usage] |
| Accent | #XXXXXX | [Usage] |
| Background | #XXXXXX | [Usage] |

### Motion Design
[Key animation moments and timing]

### Visual Effects
[Background treatments, textures, shadows]

---

## Technical Stack

### Stack Overview
[mindmap of technologies]

### API Endpoints
[Table of endpoints]

### Dependencies
[Code block with bun add commands]

---

## Future Roadmap

### Phase 1 (Current)
[List of current scope]

### Phase 2+
[List of future phases]

---

*Architecture Document v1.0*
```

### File Location

Always save to: `docs/features/[feature-name]-architecture.md`

Examples:
- `docs/features/recipe-extraction-architecture.md`
- `docs/features/user-onboarding-architecture.md`
- `docs/features/payment-flow-architecture.md`

---

## Integration: Context-Keeper Documentation

After completing UX design work AND creating the architecture document, invoke the context-keeper subagent to update context.md with a summary.

### What to Document in context.md

1. **Feature overview** with link to architecture doc
2. **Key user flow** (simplified mermaid diagram)
3. **Main components** list
4. **Key UX decisions** with rationale

### Example Context Update

```markdown
## Features

### [Feature Name]
**Purpose**: [What problem it solves]
**Architecture Doc**: `docs/features/[feature-name]-architecture.md`

**User Flow**:
\`\`\`mermaid
flowchart TD
    A[Entry Point] --> B[Main Screen]
    B --> C[Action]
    C --> D[Result]
\`\`\`

**Key Components**: 
- `FeatureCard` - displays item summary
- `FeatureDetail` - full item view with actions

**UX Decisions**:
- Chose modal over page navigation for quick edits (reduces context switching)
- Progressive disclosure: advanced options hidden by default
```

### Invoking Context-Keeper

After UX design is complete:

```
Use the context-keeper subagent to update .cursor/context.md with:
1. The feature overview and purpose
2. Link to the architecture document
3. Simplified user flow mermaid diagram
4. Component list
5. Key UX decisions and rationale
```

---

## Quick Reference: Mermaid Diagram Types

| Diagram | Use For | Syntax Start |
|---------|---------|--------------|
| Flowchart | User flows, decision trees | `flowchart TD` |
| Sequence | API interactions, multi-step processes | `sequenceDiagram` |
| State | UI states, component lifecycle | `stateDiagram-v2` |
| Journey | User experience mapping | `journey` |
| Mindmap | Mental models, feature exploration | `mindmap` |
| ER | Data relationships | `erDiagram` |
| Quadrant | Priority matrices | `quadrantChart` |

---

## Workflow Checklist

Copy and track progress:

```
UX Product Thinking Progress:

INPUT (choose one):
- [ ] Path A: Competitive research with Tavily + Browser Renderer
  - [ ] Search for competitors (tavily_search)
  - [ ] Extract content (tavily_extract or get_url_markdown)
  - [ ] Capture screenshots for visual analysis (get_url_screenshot)
- [ ] Path B: Market research report provided
  - [ ] Extract ICPs with fit scores
  - [ ] Extract competitive positioning
  - [ ] Extract recommended features

PHASES:
- [ ] Phase 1: Define product goals and success metrics
- [ ] Phase 2: Analyze users/ICPs and their needs
  - [ ] Create ICP overview table with fit scores
  - [ ] Document each ICP's pain points and messaging
  - [ ] Create ICP positioning quadrant chart
- [ ] Phase 3: Design user flows (mermaid diagrams)
- [ ] Phase 4: Plan component architecture
- [ ] Phase 5: Create wireframe specifications
- [ ] Phase 6: Frontend design specification (CRITICAL FOR DISTINCTIVE UI)
  - [ ] Select tone/aesthetic direction
  - [ ] Define memorable element
  - [ ] Specify typography (distinctive fonts, not Inter/Roboto)
  - [ ] Define color palette (dominant + sharp accent)
  - [ ] Plan motion/animation moments
  - [ ] Document spatial composition approach
- [ ] Phase 7: Generate UI concepts for each ICP (RECOMMENDED)
  - [ ] Create detailed image prompts per ICP
  - [ ] Generate images with GenerateImage tool
  - [ ] Save to public/docs/[feature]/
  - [ ] Embed in architecture document

OUTPUT:
- [ ] **CREATE ARCHITECTURE DOC**: Write `docs/features/[feature]-architecture.md` (REQUIRED)
- [ ] Document: Update context.md via context-keeper with summary + link to architecture doc
```

**IMPORTANT**: The architecture document is a required deliverable. Phase 6 (Frontend Design) ensures distinctive implementation. Phase 7 (UI Concepts) provides visual references for each ICP before coding begins.

---

## Tools Quick Reference

### Tavily MCP (Search & Discovery)

| Tool | Use For | Key Parameters |
|------|---------|----------------|
| `tavily_search` | Find competitors, trends, inspiration | `query`, `max_results`, `search_depth` |
| `tavily_extract` | Pull content from specific URLs | `urls`, `include_images`, `extract_depth` |
| `tavily_crawl` | Explore site structure | `url`, `max_depth`, `instructions` |

### Cloudflare Browser Renderer MCP (Visual & Content)

| Tool | Use For | Key Parameters |
|------|---------|----------------|
| `get_url_screenshot` | Visual screenshots for design analysis | `url`, `viewport.width`, `viewport.height` |
| `get_url_markdown` | Page content as clean markdown | `url` |
| `get_url_html_content` | Raw HTML for style/structure inspection | `url` |

### Image Generation (UI Concepts)

| Tool | Use For | Key Parameters |
|------|---------|----------------|
| `GenerateImage` | Create UI mockups for ICPs | `description`, `filename` |

**GenerateImage Tips:**
- Include full layout description (viewport, sections)
- Specify exact colors with hex values
- Describe typography style and actual copy text
- List visual elements explicitly
- Describe overall aesthetic and tone
- Use `filename` like `landing-concept-1-[icp-name].png`

### When to Use Which

| Need | Tool |
|------|------|
| Discover competitors | `tavily_search` |
| Extract multiple pages quickly | `tavily_extract` |
| Visual reference/screenshot | `get_url_screenshot` |
| JS-rendered content | `get_url_markdown` |
| Inspect CSS/HTML structure | `get_url_html_content` |
| Site architecture overview | `tavily_crawl` |
| **Generate ICP-specific UI mockups** | `GenerateImage` |

---

## Additional Resources

For extended examples and templates, see:
- [mermaid-templates.md](mermaid-templates.md) - Copy-paste diagram templates
- [examples.md](examples.md) - Complete feature design examples
- [competitive-research.md](competitive-research.md) - Tavily research examples and queries
- `.cursor/skills/frontend-design/SKILL.md` - Distinctive frontend design skill (read and apply during Phase 6)
