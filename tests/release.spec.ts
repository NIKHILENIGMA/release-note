import { test, expect } from "@playwright/test";

test.describe("Release Checklist App Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page before each test
    await page.goto("/");
  });

  test("should display the page title and initial dashboard state", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("LoomRelease");
  });

  test("should create, update, checklist, and delete a release", async ({ page }) => {
    const testReleaseName = `e2e-release-${Date.now()}`;

    // 1. Create a release
    await page.click('button:has-text("New Release")');
    
    // Fill form
    await page.fill('input[placeholder*="v2.1.0-alpha"]', testReleaseName);
    
    // Set due date (using ISO format but for local datetime input we need YYYY-MM-DDTHH:mm)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    await page.fill('input[type="datetime-local"]', dateStr);
    
    // Fill additional info
    await page.fill('textarea[placeholder*="Add any initial scope"]', "E2E Test Details");
    
    // Submit
    await page.click('button:has-text("Create Release")');

    // 2. Verify release is added to the list and selected
    const releaseCard = page.locator(`text=${testReleaseName}`).first();
    await expect(releaseCard).toBeVisible();

    // Verify it is automatically selected and shows "planned" status
    const statusBadge = page.locator('span:has-text("planned")').first();
    await expect(statusBadge).toBeVisible();

    // 3. Verify checklist is shown
    await expect(page.locator("text=Deployment Checklist")).toBeVisible();
    await expect(page.locator("text=Code Freeze").first()).toBeVisible();

    // 4. Toggle the first step (Code Freeze)
    const codeFreezeStep = page.locator("text=Code Freeze").first();
    await codeFreezeStep.click();

    // Status should transition from 'planned' to 'ongoing'
    await expect(page.locator('span:has-text("ongoing")').first()).toBeVisible();
    await expect(page.locator("text=Steps completed >> text=1/9")).toBeVisible();

    // 5. Update additional info and verify auto-save status
    const notesTextarea = page.locator("textarea[placeholder*=\"Add release notes\"]");
    await notesTextarea.clear();
    await notesTextarea.fill("Updated notes via Playwright E2E");
    
    // Wait for auto-save status change to saved
    await expect(page.locator("text=Auto-saved")).toBeVisible();

    // 6. Delete the release
    const deleteButton = page.locator(`div:has-text("${testReleaseName}")`).locator('button[title="Delete Release"]').first();
    await deleteButton.click();
    
    // Should change button to confirmation
    await expect(deleteButton).toContainText("Delete?");
    
    // Confirm delete
    await deleteButton.click();

    // Verify the card is gone
    await expect(page.locator(`text=${testReleaseName}`)).not.toBeVisible();
  });
});
