"use client";

import { useEffect, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";

// Initialize mermaid with default config
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "inherit",
});

interface MermaidBlockProps {
  code: string;
}

function MermaidBlock({ code }: MermaidBlockProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Generate a valid ID (mermaid doesn't like special characters)
        const safeId = `mermaid-${id.replace(/:/g, "-")}`;
        const { svg } = await mermaid.render(safeId, code);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    };

    renderDiagram();
  }, [code, id]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Failed to render diagram: {error}</p>
        <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-lg border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlight = async () => {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });
        setHtml(highlighted);
      } catch {
        // Fallback for unknown languages
        const fallback = await codeToHtml(code, {
          lang: "text",
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });
        setHtml(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    highlight();
  }, [code, language]);

  if (isLoading) {
    return (
      <pre className="my-4 rounded-lg border bg-muted p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="my-4 rounded-lg border overflow-x-auto [&>pre]:!bg-muted [&>pre]:!p-4 [&>pre]:!m-0 [&>pre]:text-sm dark:[&>pre]:!bg-muted"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  hideFirstH1?: boolean;
}

export function MarkdownRenderer({ content, className, hideFirstH1 = true }: MarkdownRendererProps) {
  // Preprocess content to remove the first H1 if requested
  // This is more reliable than trying to track state in the component
  const processedContent = hideFirstH1
    ? content.replace(/^#\s+[^\n]+\n?/, "")
    : content;
  return (
    <div
      className={cn(
        // Base prose with better typography
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-lg", // Larger base font size for readability
        
        // Better line height and paragraph spacing
        "prose-p:leading-7 prose-p:!mb-6 prose-p:text-muted-foreground",
        
        // Reset prose heading margins (custom components control spacing)
        "prose-headings:!m-0",
        
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
        
        // Code
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal",
        "prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg",
        
        // Lists with proper styling
        "prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4",
        "prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4",
        "prose-li:my-2 prose-li:leading-relaxed",
        "prose-li:marker:text-muted-foreground",
        
        // Tables - disable prose table styles (we use custom components)
        "[&_table]:my-0 [&_table]:not-prose",
        
        // Blockquotes
        "prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic",
        
        // Strong and emphasis
        "prose-strong:font-semibold",
        
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block handler for Mermaid and syntax highlighting
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match?.[1];
            const codeString = String(children).replace(/\n$/, "");

            // Render Mermaid diagrams
            if (language === "mermaid") {
              return <MermaidBlock code={codeString} />;
            }

            // Inline code (no language specified and no newlines)
            if (!language && !codeString.includes("\n")) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            // Code blocks with syntax highlighting
            if (language) {
              return <CodeBlock code={codeString} language={language} />;
            }

            // Fallback for code blocks without language
            return (
              <code className={cn(className, "block")} {...props}>
                {children}
              </code>
            );
          },
          // Ensure pre doesn't double-wrap custom blocks
          pre({ children, ...props }) {
            // Check if the child is a mermaid or code block (already rendered)
            const child = children as React.ReactElement;
            if (child?.type === MermaidBlock || child?.type === CodeBlock) {
              return <>{children}</>;
            }
            return <pre {...props}>{children}</pre>;
          },
          // Custom table with proper styling
          table({ children, ...props }) {
            return (
              <div className="my-6 w-full overflow-x-auto rounded-lg border">
                <table className="w-full text-sm" {...props}>{children}</table>
              </div>
            );
          },
          thead({ children, ...props }) {
            return (
              <thead className="bg-muted/50 border-b" {...props}>{children}</thead>
            );
          },
          th({ children, ...props }) {
            return (
              <th className="px-4 py-3 text-left font-semibold text-foreground" {...props}>{children}</th>
            );
          },
          td({ children, ...props }) {
            return (
              <td className="px-4 py-3 border-b border-muted/50 last:border-b-0" {...props}>{children}</td>
            );
          },
          tr({ children, ...props }) {
            return (
              <tr className="hover:bg-muted/30 transition-colors" {...props}>{children}</tr>
            );
          },
          // Custom list components for better styling
          ul({ children, ...props }) {
            return (
              <ul className="my-4 ml-6 list-disc space-y-1" {...props}>{children}</ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol className="my-4 ml-6 list-decimal space-y-1" {...props}>{children}</ol>
            );
          },
          li({ children, ...props }) {
            return (
              <li className="text-base leading-relaxed text-muted-foreground [&>code]:text-base [&>code]:font-normal" {...props}>{children}</li>
            );
          },
          // Custom heading components with better styling and spacing
          h1({ children, ...props }) {
            const id = children?.toString().toLowerCase().replace(/\s+/g, "-");
            return (
              <h1
                id={id}
                className="text-2xl font-bold tracking-tight text-foreground border-b border-border pb-3 !mb-6 !mt-10 first:!mt-0"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            const id = children?.toString().toLowerCase().replace(/\s+/g, "-");
            return (
              <h2
                id={id}
                className="text-xl font-semibold tracking-tight text-foreground !mb-4 !mt-10 first:!mt-0 scroll-mt-20"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const id = children?.toString().toLowerCase().replace(/\s+/g, "-");
            return (
              <h3
                id={id}
                className="text-base font-semibold tracking-tight text-foreground !mb-3 !mt-6 first:!mt-0 scroll-mt-20"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4({ children, ...props }) {
            const id = children?.toString().toLowerCase().replace(/\s+/g, "-");
            return (
              <h4
                id={id}
                className="text-sm font-semibold text-foreground !mb-2 !mt-4 first:!mt-0 scroll-mt-20"
                {...props}
              >
                {children}
              </h4>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
