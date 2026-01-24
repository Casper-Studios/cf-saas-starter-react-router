"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { SiteHeader } from "./layout/site-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconCalendarEvent,
  IconBulb,
  IconMap,
  IconApps,
  IconFileText,
  IconList,
  IconSearch,
  IconX,
  IconRocket,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

// Import all markdown files at build time using Vite's import.meta.glob
const markdownFiles = import.meta.glob("/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Types for table of contents
interface TocHeading {
  id: string;
  text: string;
  level: number;
}

// Extract headings from markdown content
function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Match ## and ### headings (not # which is the title)
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/\s+/g, "-");
      headings.push({ id, text, level });
    }
  }

  return headings;
}

// Table of Contents Component (inline with content)
interface TableOfContentsProps {
  headings: TocHeading[];
  activeId: string | null;
  onHeadingClick: (id: string) => void;
}

function TableOfContents({ headings, activeId, onHeadingClick }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        On This Page
      </p>
      {headings.map((heading) => (
        <button
          key={heading.id}
          onClick={() => onHeadingClick(heading.id)}
          className={cn(
            "block w-full text-left text-sm leading-snug py-1.5 transition-colors border-l-2",
            heading.level === 2 && "pl-3",
            heading.level === 3 && "pl-5",
            activeId === heading.id
              ? "text-primary border-primary font-medium"
              : "text-muted-foreground hover:text-foreground border-transparent hover:border-muted-foreground/30"
          )}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );
}

// Categories configuration
const categories = [
  { id: "meetings", label: "Meetings", icon: IconCalendarEvent },
  { id: "ideas", label: "Ideas", icon: IconBulb },
  { id: "plans", label: "Plans", icon: IconMap },
  { id: "features", label: "Features", icon: IconApps },
  { id: "releases", label: "Releases", icon: IconRocket },
] as const;

type CategoryId = (typeof categories)[number]["id"];

// Empty state configuration for each category
const emptyStateConfig: Record<
  CategoryId,
  { title: string; description: string; icon: React.ComponentType<{ className?: string }> }
> = {
  meetings: {
    title: "No meeting notes yet",
    description: "Document your team syncs, stand-ups, and planning sessions here.",
    icon: IconCalendarEvent,
  },
  ideas: {
    title: "Capture your ideas",
    description: "Brainstorm new features, improvements, and innovations for your project.",
    icon: IconBulb,
  },
  plans: {
    title: "Plan your roadmap",
    description: "Create strategic plans, roadmaps, and project timelines.",
    icon: IconMap,
  },
  features: {
    title: "Document your features",
    description: "Write technical documentation for your product's features and capabilities.",
    icon: IconApps,
  },
  releases: {
    title: "Track your releases",
    description: "Document changelogs, release notes, and shipped features.",
    icon: IconRocket,
  },
};

// Parse file path to extract category and document info
function parseFilePath(path: string) {
  // Path format: /docs/{category}/{filename}.md
  const match = path.match(/^\/docs\/([^/]+)\/(.+)\.md$/);
  if (!match) return null;

  const [, category, filename] = match;
  // Convert filename to title (e.g., "2026-01-24-kickoff" -> "2026 01 24 Kickoff")
  const title = filename
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { category, filename, title, path };
}

// Group documents by category
function getDocumentsByCategory() {
  const docs: Record<CategoryId, Array<{ filename: string; title: string; path: string; content: string }>> = {
    meetings: [],
    ideas: [],
    plans: [],
    features: [],
    releases: [],
  };

  for (const [path, content] of Object.entries(markdownFiles)) {
    const parsed = parseFilePath(path);
    if (parsed && parsed.category in docs) {
      docs[parsed.category as CategoryId].push({
        filename: parsed.filename,
        title: parsed.title,
        path: parsed.path,
        content: content as string,
      });
    }
  }

  // Sort documents by filename (which includes date for meetings)
  for (const category of Object.keys(docs) as CategoryId[]) {
    docs[category].sort((a, b) => b.filename.localeCompare(a.filename));
  }

  return docs;
}

export default function DocsPage() {
  const documents = useMemo(() => getDocumentsByCategory(), []);
  const params = useParams<{ category?: string; doc?: string }>();
  const navigate = useNavigate();
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Determine active category from URL or default
  const activeCategory = useMemo(() => {
    const cat = params.category as CategoryId | undefined;
    if (cat && categories.some((c) => c.id === cat)) {
      return cat;
    }
    return "features"; // Default to features (has content)
  }, [params.category]);

  // Get the current document content
  const allDocsInCategory = documents[activeCategory];

  // Filter documents by search query
  const currentDocs = useMemo(() => {
    if (!searchQuery.trim()) {
      return allDocsInCategory;
    }
    const query = searchQuery.toLowerCase();
    return allDocsInCategory.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
    );
  }, [allDocsInCategory, searchQuery]);

  // Determine selected doc from URL or default to first
  const selectedDoc = useMemo(() => {
    if (params.doc) {
      const docPath = `/docs/${activeCategory}/${params.doc}.md`;
      if (currentDocs.some((d) => d.path === docPath)) {
        return docPath;
      }
    }
    return currentDocs[0]?.path || null;
  }, [params.doc, activeCategory, currentDocs]);

  const currentDoc = currentDocs.find((d) => d.path === selectedDoc) || currentDocs[0];

  // Extract headings from current document
  const headings = useMemo(() => {
    if (!currentDoc) return [];
    return extractHeadings(currentDoc.content);
  }, [currentDoc]);

  // Get scroll container - the main content div with overflow-y-auto
  const getScrollContainer = useCallback(() => {
    return contentRef.current?.querySelector(".overflow-y-auto") as HTMLElement | null;
  }, []);

  // Handle scroll to track active heading
  const handleScroll = useCallback(() => {
    const scrollContainer = getScrollContainer();
    if (!scrollContainer || headings.length === 0) return;

    const offset = 120; // Account for header offset

    // Find the heading that's currently in view
    let currentHeading: string | null = null;
    for (const heading of headings) {
      const element = scrollContainer.querySelector(`#${CSS.escape(heading.id)}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        if (rect.top - containerRect.top <= offset) {
          currentHeading = heading.id;
        }
      }
    }

    setActiveHeadingId(currentHeading);
  }, [headings, getScrollContainer]);

  // Set up scroll listener
  useEffect(() => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, currentDoc, getScrollContainer]);

  // Handle heading click - smooth scroll
  const handleHeadingClick = useCallback((id: string) => {
    const scrollContainer = getScrollContainer();
    if (!scrollContainer) return;

    const element = scrollContainer.querySelector(`#${CSS.escape(id)}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(id);
    }
  }, [getScrollContainer]);

  // Navigate to a specific document
  const navigateToDoc = useCallback(
    (category: CategoryId, docFilename?: string) => {
      const path = docFilename
        ? `/admin/docs/${category}/${docFilename}`
        : `/admin/docs/${category}`;
      navigate(path, { replace: true });
      setActiveHeadingId(null);
    },
    [navigate]
  );

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSearchQuery(""); // Clear search when changing category
    navigateToDoc(category as CategoryId);
  };

  // Handle document selection
  const handleDocSelect = (docPath: string) => {
    // Extract filename from path (e.g., "/docs/features/authentication.md" -> "authentication")
    const match = docPath.match(/^\/docs\/([^/]+)\/(.+)\.md$/);
    if (match) {
      const [, , filename] = match;
      navigateToDoc(activeCategory, filename);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Documentation" />

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 overflow-hidden">
        {/* Category Tabs */}
        <Tabs
          value={activeCategory}
          onValueChange={handleCategoryChange}
          className="w-full"
          data-testid="docs-category-tabs"
        >
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="gap-1.5"
                data-testid={`docs-tab-${category.id}`}
              >
                <category.icon className="size-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Document Browser */}
        <div className="flex flex-1 gap-0 overflow-hidden rounded-lg border bg-card">
          {/* Document List Sidebar */}
          <div className="w-56 shrink-0 border-r">
            <div className="p-3 border-b space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                {categories.find((c) => c.id === activeCategory)?.label} (
                {currentDocs.length})
              </h3>
              {/* Search Input */}
              <div className="relative">
                <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8 h-8 text-sm"
                  data-testid="docs-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="docs-search-clear"
                  >
                    <IconX className="size-4" />
                  </button>
                )}
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-85px)]">
              <div className="p-2">
                {/* Document List */}
                <div className="space-y-0.5" data-testid="docs-document-list">
                  {currentDocs.length === 0 && !searchQuery ? (
                    <p className="text-sm text-muted-foreground p-2" data-testid="docs-no-documents">
                      No documents yet
                    </p>
                  ) : currentDocs.length === 0 && searchQuery ? (
                    <p className="text-sm text-muted-foreground p-2" data-testid="docs-no-results">
                      No matching documents
                    </p>
                  ) : (
                    currentDocs.map((doc) => (
                      <Button
                        key={doc.path}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start gap-2 h-auto py-2 px-2",
                          selectedDoc === doc.path && "bg-accent"
                        )}
                        onClick={() => handleDocSelect(doc.path)}
                        data-testid={`docs-item-${doc.filename}`}
                      >
                        <IconFileText className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-left">{doc.title}</span>
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Document Content Area - flex row for content + ToC */}
          <div className="flex-1 min-w-0 flex" ref={contentRef}>
            {/* Main Content - scrollable */}
            <div className="flex-1 min-w-0 overflow-y-auto">
              <div className="p-6 lg:p-8 max-w-4xl">
                {currentDoc ? (
                  <div className="space-y-6" data-testid="docs-content">
                    {/* Breadcrumb */}
                    <Breadcrumb data-testid="docs-breadcrumb">
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <span className="text-muted-foreground">
                            {categories.find((c) => c.id === activeCategory)?.label}
                          </span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{currentDoc.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>

                    {/* Document Header */}
                    <header className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight">
                        {currentDoc.title}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {currentDoc.filename}
                      </p>
                    </header>

                    <Separator />

                    {/* Document Content */}
                    <article className="pb-16">
                      <MarkdownRenderer content={currentDoc.content} />
                    </article>
                  </div>
                ) : allDocsInCategory.length === 0 ? (
                  // Rich empty state for category with no documents
                  <Empty className="h-[400px] border" data-testid="docs-empty-state">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        {(() => {
                          const config = emptyStateConfig[activeCategory];
                          const Icon = config.icon;
                          return <Icon className="size-5" />;
                        })()}
                      </EmptyMedia>
                      <EmptyTitle data-testid="docs-empty-title">{emptyStateConfig[activeCategory].title}</EmptyTitle>
                      <EmptyDescription>
                        {emptyStateConfig[activeCategory].description}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  // No document selected but documents exist
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <IconFileText className="size-12 mb-4 opacity-50" />
                    <p>Select a document to view</p>
                  </div>
                )}
              </div>
            </div>

            {/* Table of Contents - Right Sidebar (sticky) */}
            {currentDoc && headings.length > 0 && (
              <div className="hidden lg:block w-52 shrink-0 border-l overflow-y-auto">
                <div className="sticky top-0 p-4">
                  <TableOfContents
                    headings={headings}
                    activeId={activeHeadingId}
                    onHeadingClick={handleHeadingClick}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
