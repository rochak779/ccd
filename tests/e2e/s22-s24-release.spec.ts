import { expect, test } from "@playwright/test";

test("failure remains visible, preserves approved state and recovers into the same review", async ({ page }) => {
  await page.goto("/sample?failure=parser");
  await expect(page.getByRole("heading", { name: "Workbook parsing failed" })).toBeVisible();
  await expect(page.getByText("Approved tracker · Awaiting response · preserved throughout")).toBeVisible();
  await page.getByRole("button", { name: "Use validated prepared extraction" }).click();
  await expect(page.getByRole("heading", { name: "Customer evidence incomplete" })).toBeVisible();
  await expect(page.getByText("Current approved")).toBeVisible();
});

test("restricted local persona receives no Northstar metadata", async ({ page }) => {
  await page.goto("/sample?persona=member-without-access");
  await expect(page.getByRole("heading", { name: "You do not have access to this deal" })).toBeVisible();
  await expect(page.getByText("Project Northstar")).toHaveCount(0);
  await expect(page.getByText("C-14")).toHaveCount(0);
});

test("critical review reflows at 320px and retains source and decision access", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/sample");
  await page.getByRole("button", { name: "Review 3 sources" }).click();
  await expect(page.getByRole("heading", { name: "Customer evidence incomplete" })).toBeVisible();
  await page.getByRole("tab", { name: "Workbook" }).click();
  await expect(page.locator("#source-panel-workbook").getByText("Customer Summary!C3", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Approve as partial" })).toBeVisible();
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});

test("second-response completion remains an explicit decision after reset", async ({ page }) => {
  await page.goto("/sample");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Review 3 sources" }).click();
  await page.getByRole("button", { name: "Completion review" }).click();
  await expect(page.getByText("Current approved · Partial — evidence missing", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Confirm complete" }).click();
  await expect(page.getByText("Approved status · Complete")).toBeVisible();
});

test("seeded shell stays within the local font and readiness budgets", async ({ page }) => {
  const fontSizes: number[] = [];
  page.on("response", async (response) => {
    if (response.url().endsWith(".woff2")) fontSizes.push((await response.body()).byteLength);
  });
  const started = Date.now();
  await page.goto("/sample", { waitUntil: "networkidle" });
  const readyMs = Date.now() - started;
  expect(readyMs).toBeLessThan(2_000);
  expect(fontSizes.length).toBeLessThanOrEqual(3);
  expect(fontSizes.reduce((sum, size) => sum + size, 0)).toBeLessThanOrEqual(180 * 1024);
});
