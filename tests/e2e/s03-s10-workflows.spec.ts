import { expect, test } from "@playwright/test";

test("theme persists and both deliberate landing paths are usable", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Dark").check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.getByLabel("Dark")).toBeChecked();
  await page.getByRole("link", { name: "Explore a sample deal" }).first().click();
  await expect(page.getByRole("heading", { name: "Project Northstar" })).toBeVisible();
  await expect(page.getByText("12 awaiting response")).toBeVisible();
});

test("local onboarding creates a deal inbox and reaches all requests", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Full name").fill("Priya Shah");
  await page.getByLabel("Phone number").fill("+44 7700 900000");
  await page.getByLabel("Designation").fill("Investment Associate");
  await page.getByRole("button", { name: /Continue to organisation/ }).click();
  await page.getByLabel("Organisation name").fill("Acme Capital");
  await page.getByRole("button", { name: /Continue to team/ }).click();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await page.getByLabel("Deal name").fill("Project Northstar");
  await page.getByRole("button", { name: /Create deals and continue/ }).click();
  await expect(page.getByText("project-northstar@inbound.ccd.app")).toBeVisible();
  await page.getByRole("button", { name: /Go to all requests/ }).click();
  await expect(page.getByRole("heading", { name: "All requests" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Requests across your deals" })).toBeVisible();
});

test("deal alias, activation, baseline and tracker workflows persist", async ({ page }) => {
  await page.goto("/deals/new");
  await page.getByLabel("Project name").fill("Project Northstar");
  await page.getByLabel("Target company").fill("Northstar Ltd");
  await page.getByRole("button", { name: "Create deal" }).click();
  await expect(page.getByLabel("Secure deal address")).toHaveValue("northstar@inbound.ccd.test");
  await page.getByRole("button", { name: "Send test message" }).click();
  await expect(page.getByText("Test message received and routed.")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Secure deal address")).toHaveValue("northstar@inbound.ccd.test");

  await page.goto("/sample#baseline");
  await page.getByRole("button", { name: "Select prepared memo and tracker" }).click();
  await page.getByRole("button", { name: "Process files" }).click();
  await expect(page.getByText("2 of 2 ready")).toBeVisible();
  await page.getByRole("button", { name: "Confirm baseline" }).click();
  await expect(page.getByText("Confirmed by Priya Shah.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Northstar baseline confirmed" })).toBeVisible();

  await page.getByLabel("Search requests").fill("customer concentration");
  await expect(page.getByRole("button", { name: /Open C-14/ })).toBeVisible();
  await page.getByRole("button", { name: /Open C-14/ }).click();
  await expect(page.getByText("Northstar_Diligence_Tracker.xlsx · Requests!A15:H15")).toBeVisible();
  await page.getByRole("button", { name: "← Back to requests" }).click();
  await expect(page.getByLabel("Search requests")).toHaveValue("customer concentration");
});
