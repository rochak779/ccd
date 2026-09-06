import { expect, test } from "@playwright/test";

test.describe("S20–S21 review lifecycle module", () => {
  test("reconstructs lineage, filters activity and reports exact tamper failure", async ({ page }) => {
    await page.goto("/sample");
    await page.getByRole("button", { name: "Review 3 sources" }).click();
    await page.getByRole("button", { name: "Evidence chain" }).click();
    await expect(page.getByRole("button", { name: /Open request: C-14/ })).toBeVisible();
    await page.getByRole("button", { name: "Verify stored events" }).click();
    await expect(page.getByText(/Event chain verified · \d+ events/)).toBeVisible();
    await page.getByRole("button", { name: "Activity" }).click();
    await page.getByLabel("Filter").selectOption("Human decisions");
    await expect(page.getByText("Partial status approved")).toBeVisible();
  });

  test("requires readable support, human completion and separate explanation acceptance", async ({ page }) => {
    await page.goto("/sample");
    await page.getByRole("button", { name: "Review 3 sources" }).click();
    await page.getByRole("button", { name: "Completion review" }).click();
    await expect(page.getByText("4 of 4", { exact: false })).toBeVisible();
    await expect(page.getByText("Current approved · Partial — evidence missing", { exact: true })).toBeVisible();
    await expect(page.getByText(/receiving an explanation does not dismiss/i)).toBeVisible();
    await page.getByLabel("Accept explanation as resolving F-009").check();
    await page.getByRole("button", { name: "Confirm complete" }).click();
    await expect(page.getByText("Approved status · Complete")).toBeVisible();
  });
});
