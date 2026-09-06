import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/sample");
  await page.evaluate(() => localStorage.removeItem("ccd:c14:first-decision"));
  await page.reload();
  await page.getByRole("button", { name: "Review 3 sources" }).click();
});

test("approves partial once, persists it and retains the open gaps", async ({ page }) => {
  await page.getByRole("button", { name: "Approve as partial" }).click();
  await expect(page.getByText("C-14 remains open with 3 missing items.")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Review 3 sources" }).click();
  await expect(page.getByRole("button", { name: "Partial recorded" })).toBeDisabled();
  await expect(page.locator("#overview").getByText("1 of 4 supported · 3 missing", { exact: true })).toBeVisible();
});

test("rejects without changing approved state and requires material reasons", async ({ page }) => {
  await page.getByRole("button", { name: "Reject proposal" }).click();
  await page.getByRole("button", { name: "Record reject" }).click();
  await expect(page.getByText("Enter a reason before recording this decision.")).toBeVisible();
  await page.getByLabel("Decision rationale").fill("The FY26 workbook does not answer the full request.");
  await page.getByRole("button", { name: "Record reject" }).click();
  await expect(page.getByText("Proposal rejected. The approved tracker remains unchanged.")).toBeVisible();
  await expect(page.locator("#overview").getByText("Awaiting response", { exact: true })).toBeVisible();
});

test("records a correction history and local escalation without email", async ({ page }) => {
  await page.getByText("Corrections and escalation").click();
  await page.getByRole("button", { name: "Correct period or relevance" }).click();
  await page.getByLabel("Decision rationale").fill("FY26 period verified from the workbook header.");
  await page.getByRole("button", { name: "Record correct" }).click();
  await expect(page.getByText(/earlier approval remains historical/i)).toBeVisible();
  await page.getByRole("button", { name: "Escalate to deal lead" }).click();
  await page.getByRole("button", { name: "Record escalate" }).click();
  await expect(page.getByText("Finding assigned to deal lead Sam Lee. No email was sent.")).toBeVisible();
});
