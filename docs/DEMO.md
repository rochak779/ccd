# CC’d seeded demo

## Reset and start

Open `/sample`, clear site data (or run `localStorage.clear()` in the browser console), then refresh. The sample is isolated from the empty onboarding workspace. All names, messages and source files are synthetic.

Canonical files and locators are listed in `fixtures/northstar/manifest.json`. C-14 is an imported tracker row linked to the normalised request email; the demo does not claim that opening the sample created that historic email.

## Five-minute path

1. From `/`, choose **Explore a sample deal** and open the one ranked exception.
2. Read the four requested components and the first response: one supported, three missing.
3. Select FY26 revenue and inspect the email, `Customer_Revenue_FY26.xlsx` at `Customer Summary!A2:C12`, and the 31% observation at C3.
4. Compare the separately cited FY25 22% observation with FY26 31%. Treat management’s “stable” wording as a potential conflict, not a confirmed contradiction.
5. Choose **Approve as partial**. Confirm that C-14 remains open, three gaps remain and the conflict is still open.
6. Open **Evidence chain**, inspect its nodes, then choose **Verify stored events**.
7. Open **Completion review** to demonstrate the prepared second response. Confirming complete and accepting management’s explanation are separate reviewer decisions.

## Returning and recovery paths

- A recorded first-response decision survives refresh in the local browser.
- `/sample?failure=parser` retains the received source and approved status, then demonstrates validated prepared extraction.
- `/sample?failure=model` demonstrates validated prepared evaluation while preserving raw sources.
- `/sample?failure=interrupted`, `unsupported`, `no-attachment` and `unrelated` expose the remaining prepared degraded states.
- `/sample?source=warning` blocks completion when the replacement workbook is unreadable.
- `/sample?persona=member-without-access` demonstrates product-level deal isolation without presenting browser storage as a production security boundary.

Optional follow-up drafting, alert delivery, exports, Gmail and live model evaluation are not built and do not appear in this script.
