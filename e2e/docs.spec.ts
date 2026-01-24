import { test, expect } from "@playwright/test";

test.describe("Documentation Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the docs page
    await page.goto("/admin/docs");
  });

  test.describe("Category Navigation", () => {
    test("should display all 5 category tabs", async ({ page }) => {
      const tabs = page.locator('[data-testid="docs-category-tabs"]');
      await expect(tabs).toBeVisible();

      // Verify all category tabs exist
      await expect(page.locator('[data-testid="docs-tab-meetings"]')).toBeVisible();
      await expect(page.locator('[data-testid="docs-tab-ideas"]')).toBeVisible();
      await expect(page.locator('[data-testid="docs-tab-plans"]')).toBeVisible();
      await expect(page.locator('[data-testid="docs-tab-features"]')).toBeVisible();
      await expect(page.locator('[data-testid="docs-tab-releases"]')).toBeVisible();
    });

    test("should default to Features category", async ({ page }) => {
      // Features tab should be selected by default (it has content)
      const featuresTab = page.locator('[data-testid="docs-tab-features"]');
      await expect(featuresTab).toHaveAttribute("data-state", "active");
    });

    test("should navigate to category via URL", async ({ page }) => {
      await page.goto("/admin/docs/ideas");
      const ideasTab = page.locator('[data-testid="docs-tab-ideas"]');
      await expect(ideasTab).toHaveAttribute("data-state", "active");
    });

    test("should switch categories when clicking tabs", async ({ page }) => {
      // Click on Plans tab
      await page.click('[data-testid="docs-tab-plans"]');
      
      // Verify URL changed
      await expect(page).toHaveURL(/\/admin\/docs\/plans/);
      
      // Verify Plans tab is now active
      const plansTab = page.locator('[data-testid="docs-tab-plans"]');
      await expect(plansTab).toHaveAttribute("data-state", "active");
    });
  });

  test.describe("Empty States", () => {
    test("should show empty state for Meetings category", async ({ page }) => {
      await page.goto("/admin/docs/meetings");
      
      // Verify empty state is displayed
      const emptyState = page.locator('[data-testid="docs-empty-state"]');
      await expect(emptyState).toBeVisible();
      
      // Verify the correct title
      const emptyTitle = page.locator('[data-testid="docs-empty-title"]');
      await expect(emptyTitle).toContainText("No meeting notes yet");
    });

    test("should show empty state for Releases category", async ({ page }) => {
      await page.goto("/admin/docs/releases");
      
      // Verify empty state is displayed
      const emptyState = page.locator('[data-testid="docs-empty-state"]');
      await expect(emptyState).toBeVisible();
      
      // Verify the correct title
      const emptyTitle = page.locator('[data-testid="docs-empty-title"]');
      await expect(emptyTitle).toContainText("Track your releases");
    });
  });

  test.describe("Document Display", () => {
    test("should display document content with breadcrumbs", async ({ page }) => {
      await page.goto("/admin/docs/features");
      
      // Wait for content to load
      const content = page.locator('[data-testid="docs-content"]');
      await expect(content).toBeVisible();
      
      // Verify breadcrumb is visible
      const breadcrumb = page.locator('[data-testid="docs-breadcrumb"]');
      await expect(breadcrumb).toBeVisible();
    });

    test("should navigate to specific document via URL", async ({ page }) => {
      await page.goto("/admin/docs/features/authentication");
      
      // Verify content is displayed
      const content = page.locator('[data-testid="docs-content"]');
      await expect(content).toBeVisible();
      
      // Verify the correct document is shown
      await expect(page.locator("h1")).toContainText("Authentication");
    });
  });

  test.describe("Search Functionality", () => {
    test("should filter documents when typing in search", async ({ page }) => {
      await page.goto("/admin/docs/features");
      
      // Type in search
      const searchInput = page.locator('[data-testid="docs-search-input"]');
      await searchInput.fill("xyz");
      
      // Verify no results message
      const noResults = page.locator('[data-testid="docs-no-results"]');
      await expect(noResults).toBeVisible();
      await expect(noResults).toContainText("No matching documents");
    });

    test("should clear search when clicking X button", async ({ page }) => {
      await page.goto("/admin/docs/features");
      
      // Type in search
      const searchInput = page.locator('[data-testid="docs-search-input"]');
      await searchInput.fill("test");
      
      // Click clear button
      const clearButton = page.locator('[data-testid="docs-search-clear"]');
      await clearButton.click();
      
      // Verify search is cleared
      await expect(searchInput).toHaveValue("");
    });

    test("should find documents matching search query", async ({ page }) => {
      await page.goto("/admin/docs/features");
      
      // Type in search that matches
      const searchInput = page.locator('[data-testid="docs-search-input"]');
      await searchInput.fill("auth");
      
      // Verify the document is still visible
      const docItem = page.locator('[data-testid="docs-item-authentication"]');
      await expect(docItem).toBeVisible();
    });
  });

  test.describe("URL State Management", () => {
    test("should persist category in URL", async ({ page }) => {
      await page.click('[data-testid="docs-tab-ideas"]');
      await expect(page).toHaveURL(/\/admin\/docs\/ideas/);
    });

    test("should handle browser back/forward navigation", async ({ page }) => {
      // Navigate to features
      await page.goto("/admin/docs/features");
      
      // Navigate to ideas
      await page.click('[data-testid="docs-tab-ideas"]');
      await expect(page).toHaveURL(/\/admin\/docs\/ideas/);
      
      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/\/admin\/docs\/features/);
      
      // Go forward
      await page.goForward();
      await expect(page).toHaveURL(/\/admin\/docs\/ideas/);
    });
  });

  test.describe("Visual Regression", () => {
    test("should match snapshot for features page", async ({ page }) => {
      await page.goto("/admin/docs/features");
      await page.waitForLoadState("networkidle");
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot("docs-features.png", {
        maxDiffPixels: 100,
      });
    });

    test("should match snapshot for empty state", async ({ page }) => {
      await page.goto("/admin/docs/meetings");
      await page.waitForLoadState("networkidle");
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot("docs-empty-state.png", {
        maxDiffPixels: 100,
      });
    });
  });
});
