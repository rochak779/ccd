import { expect, test } from "@playwright/test";

async function openInspector(page: import("@playwright/test").Page, query = "") {
  await page.goto(`/sample${query}`);
  await page.getByRole("button", { name: "Review 3 sources" }).click();
}

test("every C-14 citation opens exact evidence through common source IDs", async ({ page }) => {
  await openInspector(page);
  const tabs = page.getByRole("tablist", { name: "Evidence sources" });
  await expect(tabs.getByRole("tab")).toHaveCount(4);
  await expect(page.getByText("source-workbook-customer-revenue-fy26-v1", { exact: true })).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("Customer Summary!C3", { exact: true })).toBeVisible();
  await expect(page.getByText(/raw value/)).toContainText("0.31");
  await expect(page.getByText(/raw value/)).toContainText("=B3/$B$13");

  await page.getByRole("button", { name: "Open surrounding rows" }).click();
  await expect(page.getByRole("table", { name: "Workbook surrounding rows" }).getByRole("row")).toHaveCount(5);
  await tabs.getByRole("tab", { name: "Email", exact: true }).click();
  await expect(page.getByText("source-email-c14-reply-20260905", { exact: true })).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText(/Customer concentration remains stable/)).toBeVisible();
  await tabs.getByRole("tab", { name: "Previous evidence" }).click();
  await expect(page.getByText("source-pdf-northstar-ic-memo-v3", { exact: true })).toBeVisible();
  await expect(page.getByText(/22% of FY25 revenue/)).toBeVisible();
  await tabs.getByRole("tab", { name: "Audit" }).click();
  await expect(page.getByText(/not yet analyst-approved/)).toBeVisible();

  await tabs.getByRole("tab", { name: "Workbook", exact: true }).click();
  await expect(page.getByRole("button", { name: "Close surrounding rows" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Revenue by customer FY26" })).toBeVisible();
});

test("separate conflict citations navigate without changing the selected component", async ({ page }) => {
  await openInspector(page);
  await page.getByRole("button", { name: "Email · paragraph 2" }).click();
  await expect(page.getByRole("tab", { name: "Email", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "IC memo · p.2" }).click();
  await expect(page.getByRole("tab", { name: "Previous evidence" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Revenue by customer FY26" })).toBeVisible();
});

for (const [query, heading] of [["?source=unavailable", "Source unavailable"], ["?source=invalid", "Invalid locator"], ["?source=no-access", "No local file access"]] as const) {
  test(`${heading} retains the exact workbook identity`, async ({ page }) => {
    await openInspector(page, query);
    const sourceAlert = page.locator(".source-context").getByRole("alert");
    await expect(sourceAlert.getByText(heading, { exact: true })).toBeVisible();
    await expect(sourceAlert).toContainText("source-workbook-customer-revenue-fy26-v1");
    await expect(sourceAlert).toContainText("Customer Summary!C3");
  });
}

test("parse warning retains cell values and formula context", async ({ page }) => {
  await openInspector(page, "?source=warning");
  await expect(page.getByRole("status").getByText("Parse warning", { exact: true })).toBeVisible();
  const formulaContext = page.getByRole("tabpanel").locator("p", { hasText: "Cell C3" });
  await expect(formulaContext).toContainText("31%");
  await expect(formulaContext).toContainText("=B3/$B$13");
});
