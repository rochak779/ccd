import { expect, test } from "@playwright/test";

test("ranked overview exception opens a complete read-only C-14 review", async ({ page }) => {
  await page.goto("/sample");
  await expect(page.getByText("1 exception requires review.")).toBeVisible();
  await expect(page.getByText("F-009 · Customer response is incomplete")).toBeVisible();
  await expect(page.getByText(/1 email, 1 workbook, 1 previous claim/)).toBeVisible();
  await page.getByRole("button", { name: "Review 3 sources" }).click();

  await expect(page.getByRole("heading", { name: "Customer evidence incomplete" })).toBeVisible();
  await expect(page.locator("#overview").getByText("Awaiting response", { exact: true })).toBeVisible();
  await expect(page.locator("#overview").getByText("Partial — evidence missing", { exact: true })).toBeVisible();
  await expect(page.locator("#overview").getByText("1 of 4 supported · 3 missing", { exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Request coverage" }).getByRole("button")).toHaveCount(4);
  await expect(page.getByText("+9 pp")).toBeVisible();
  await expect(page.getByText("High · suggested")).toBeVisible();
  await expect(page.getByText("97%", { exact: true })).toBeVisible();
  await expect(page.getByText(/decision controls arrive in a later step/i)).toBeVisible();
});

test("coverage selection links only supported evidence and explains a missing gap", async ({ page }) => {
  await page.goto("/sample");
  await page.getByRole("button", { name: "Review 3 sources" }).click();
  await expect(page.getByText("Customer Summary!A2:C12", { exact: true })).toBeVisible();
  await page.getByRole("group", { name: "Request coverage" }).getByRole("button", { name: /Top ten customer contracts/ }).click();
  await expect(page.getByRole("heading", { name: "Top ten customer contracts" })).toBeVisible();
  await expect(page.getByText("No supporting source")).toBeVisible();
  await expect(page.getByText("Customer Summary!A2:C12", { exact: true })).not.toBeVisible();
});

test("evaluation and source failures retain the approved tracker and raw reply", async ({ page }) => {
  await page.goto("/sample?evaluation=unavailable");
  await page.getByRole("button", { name: "Review 3 sources" }).click();
  await expect(page.getByText("Evaluation unavailable", { exact: true }).first()).toBeVisible();
  await expect(page.locator("#overview").getByText("Awaiting response", { exact: true })).toBeVisible();
  await expect(page.getByText(/Customer concentration remains stable/)).toBeVisible();

  await page.goto("/sample?source=unavailable");
  await page.getByRole("button", { name: "Review 3 sources" }).click();
  await expect(page.getByText("Source unavailable")).toBeVisible();
  await expect(page.getByText(/Customer_Revenue_FY26.xlsx/)).toBeVisible();
});
