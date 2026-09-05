import { expect, test } from "@playwright/test";

test("root route renders the CC’d shell and survives refresh", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/CC’d/);
  await expect(page.getByRole("link", { name: "CC’d home" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The diligence tracker you keep in the loop." }),
  ).toBeVisible();
  await expect(page.getByText("Partial — evidence missing")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Evidence-linked diligence")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});

test("root route keeps the skip link keyboard accessible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
