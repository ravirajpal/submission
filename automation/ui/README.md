# InvenTree Part Module — UI Test Suite

Automated end-to-end UI tests for the InvenTree Part module using Playwright (TypeScript) with a Page Object Model.

Target: `https://demo.inventree.org`

---

## Running Tests

### Projects

| Project | Scope | Spec files |
|---|---|---|
| `chromium` | All tests (Desktop Chrome) | All `*.spec.ts` files except `seed.spec.ts` |

```powershell
# All tests
npx playwright test --project=chromium

# Single spec file
npx playwright test tests/part-create.spec.ts --project=chromium

# Open HTML report
npx playwright show-report
```

> **Note:** Tests run sequentially (`workers: 1`, `fullyParallel: false`) — the demo server is shared and stateful login sessions cannot run in parallel.

---

## Test Files

| File | Test IDs | Coverage |
|---|---|---|
| `tests/part-create.spec.ts` | TC_PART_CREATE_001 | Create part with Name and Description only (happy path); verifies redirect, heading, description, creation date |
| `tests/tc-part-create-001-neg1-cancel.spec.ts` | TC_PART_CREATE_001_NEG1 | Cancel the Add Part modal discards the form without creating a part |
| `tests/tc-part-create-001-neg2-empty-name.spec.ts` | TC_PART_CREATE_001_NEG2 | Submit with empty Name shows required field validation error |
| `tests/tc-part-create-016-duplicate-name.spec.ts` | TC_PART_CREATE_016 | Create a part with a Name that already exists; verifies duplicate rejection error |
| `tests/cf-001-part-parameter-stock-category.spec.ts` | CF-001 | Cross-functional flow: create part → add parameter → add stock → verify part appears in category view with correct stock count |
| `tests/tc-cf-002-assembly-bom-build-stock-reconciliation.spec.ts` | TC_CF_002 | Cross-functional flow: create component + assembly parts, define BOM, create build order, verify Required Parts tab shows correct quantities |
| `tests/part-category-nav.spec.ts` | TC_PART_CAT_002, TC_PART_CAT_003 | Part Category Navigation: verify a category page lists its direct sub-categories; verify clicking a part name navigates to the Part Detail View |
| `tests/seed.spec.ts` | (seed) | Login smoke test; used as seed file for Playwright MCP planner/generator/healer agents |

---

## Page Objects

| File | Class | Responsibilities |
|---|---|---|
| `pages/part-category.page.ts` | `PartCategoryPage` | Click into a category by name; wait for subcategories table; assert category description, subcategory rows, pagination count, and breadcrumbs; open the Parts panel tab; click a part thumbnail cell to navigate to Part Detail |
| `pages/parts.page.ts` | `PartsPage` | Navigate to parts table; open Part Categories tab; select a category; navigate to the Parts sub-tab within a category; open the Create Part modal; search in the parts table |
| `pages/add-part-modal.page.ts` | `AddPartModalPage` | Fill and submit the Add Part dialog; cancel; assert modal open/closed; detect duplicate-name error |
| `pages/add-parameter-modal.page.ts` | `AddParameterModalPage` | Open the Add Parameter dialog from the actions menu; select a parameter template; fill value and submit |
| `pages/add-stock-item-modal.page.ts` | `AddStockItemModalPage` | Open the Add Stock Item dialog from the stock tab; fill location (autocomplete) and quantity; submit |
| `pages/part-detail.page.ts` | `PartDetailPage` | Assert URL is on Part Detail; open named panel tabs (Parameters, Stock, Part Details); trigger stock actions menu |

---

## Fixtures

`fixtures/ui.fixtures.ts` — exports `authenticatedPage`, a `Page` fixture that logs in as `allaccess` before each test using credentials from environment variables (`USER_ALLACCESS_USERNAME`, `USER_ALLACCESS_PASSWORD`).

---

## Key Design Decisions

- **`Date.now()` suffixes** — all dynamically created part names include `Date.now()` to prevent conflicts when multiple runs or users share the demo server.
- **`waitFor` before interactions** — every click on a button or modal element is preceded by `locator.waitFor({ state: 'visible' })` rather than relying solely on `expect(...).toBeVisible` to ensure elements are interactable before actions are taken.
- **Mantine modal overlay handling** — InvenTree uses Mantine UI; after submitting or closing a dialog, `waitFor({ state: 'detached' })` is called on the modal overlay before interacting with the underlying page. This prevents `ElementHandle intercept` click failures.
- **Part names render as cells, not links** — the InvenTree parts table renders part names as plain text inside `role=cell`, not as `role=link`. Locating parts uses `getByRole('cell').filter({ hasText: name }).first()`.
- **Tab disambiguation** — the top navigation has a `Parts` tab and category panel also has a nested `Parts` tab. `PartsPage.gotoPartsTable()` scopes each tab click using `first()` for the top nav tab and `getByLabel('panel-tabs-partcategory')` for the inner panel tab to avoid strict mode violations.
- **Build order workflow (TC_CF_002)** — InvenTree build orders follow the state machine: `Pending` → **Issue Order** (confirm in modal) → `Production` → Auto-Allocate stock → **Complete Order**. The test verifies the Required Parts tab reflects the BOM-derived required quantity (BOM qty × build qty).
- **Seed file isolation** — `seed.spec.ts` imports directly from `@playwright/test` (not from custom fixtures) to avoid a "two versions of @playwright/test" conflict with Playwright MCP tooling. It is excluded from the `chromium` project via `testIgnore` and is only used as a seed/reference file for Playwright MCP agents.
- **Creation date timezone tolerance** — `part-create.spec.ts` accepts either today or the previous UTC day as a valid creation date to handle timezone differences between the test runner and the demo server.
