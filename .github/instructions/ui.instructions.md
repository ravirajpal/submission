---
applyTo: "automation/ui/**"
---

# UI Test Instructions

## Agent Workflow
When given a test case ID (e.g. `TC_PART_CREATE_001`):
1. Look up the full test case details in `test-cases/ui-manual-tests.md` — it contains the title, preconditions, steps, and expected results for every test case
2. If anything is unclear about InvenTree behaviour or business rules, refer to `docs/InvenTree_Part_Module_Requirements_Understanding.md`
3. Use `tests/seed.spec.ts` as the seed file when invoking any Playwright MCP agent (planner, generator, healer)
4. **Base URL** is in `automation/ui/playwright.config.ts` → `baseURL` (read from `BASE_URL` in `automation/ui/.env`, defaults to `https://demo.inventree.org`) — do not ask the user for the URL
5. **Credentials** are in `automation/ui/.env` — `USER_ALLACCESS_USERNAME=allaccess` / `USER_ALLACCESS_PASSWORD=nolimits` — do not ask the user for credentials

## Stack
- Application: InvenTree (https://demo.inventree.org)
- Test runner: Playwright E2E (`@playwright/test`)
- Language: TypeScript
- Config: `automation/ui/playwright.config.ts`
- Browser: Chromium only (`workers: 1`, `fullyParallel: false` — shared demo server, stateful login)

## Environment Variables
Loaded from `automation/ui/.env` via `dotenv` in `playwright.config.ts`. Key variables:

| Variable | Used in |
|---|---|
| `BASE_URL` | `playwright.config.ts` → `baseURL` |
| `BROWSER_TIMEOUT_MS` | `playwright.config.ts` → `timeout` |
| `UI_LOGIN_URL` | `ui.fixtures.ts` → login navigation |
| `USER_ALLACCESS_USERNAME` / `USER_ALLACCESS_PASSWORD` | `ui.fixtures.ts` → `authenticatedPage` |

Never hardcode URLs or credentials — always read from `process.env.*` with a fallback default.

## Project Structure
```
automation/ui/
├── fixtures/
│   └── ui.fixtures.ts              ← all fixtures live here
├── pages/                          ← Page Object Model classes
│   └── <page-name>.page.ts
├── tests/
│   ├── seed.spec.ts                ← login smoke test; used as seed by Playwright agents
│   └── <feature>.spec.ts           ← one spec file per feature/page
├── playwright.config.ts
├── tsconfig.json
├── .env
└── package.json
```

**Spec file naming convention:**
- `part-create.spec.ts` — Part creation form tests
- `part-list.spec.ts` — Part list, search, filter
- `part-detail.spec.ts` — Part detail view, edit, delete
- `part-category.spec.ts` — Category navigation

## Mandatory Fixture Policy
For every UI spec file under `automation/ui/tests/*.spec.ts`, always use the custom fixture import and `authenticatedPage` test argument.

Required pattern:
```typescript
import { test, expect } from '../fixtures/ui.fixtures';

test('...', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  // test steps
});
```

Hard rules:
- Never import `test` / `expect` from `@playwright/test` in UI spec files.
- Never use `async ({ page })` directly in UI spec files.
- Always include `const page = authenticatedPage;` for consistency.
- If an existing UI spec violates this, convert it during the same change.
- Exception: `automation/ui/tests/seed.spec.ts` must continue importing from `@playwright/test`.

## Fixtures (`automation/ui/fixtures/ui.fixtures.ts`)
**Every spec file MUST import `test` and `expect` from `'../fixtures/ui.fixtures'` — never directly from `'@playwright/test'`.** This provides the `authenticatedPage` fixture.
```typescript
import { test, expect } from '../fixtures/ui.fixtures';
```

`authenticatedPage` fixture — logs in as `allaccess` before each test and returns `page`:
```typescript
import { test as base, expect } from '@playwright/test';

export { expect };

export const test = base.extend<{ authenticatedPage: import('@playwright/test').Page }>({
  authenticatedPage: async ({ page }, use) => {
    const loginUrl = process.env.UI_LOGIN_URL ?? '/web/login/';
    const username = process.env.USER_ALLACCESS_USERNAME ?? 'allaccess';
    const password = process.env.USER_ALLACCESS_PASSWORD ?? 'nolimits';

    await page.goto(loginUrl);
    // Wait for username field — React hydration on demo server can take 5–15s
    const usernameField = page.getByLabel(/username/i);
    await usernameField.waitFor({ state: 'visible', timeout: 20000 });
    await usernameField.fill(username);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/web\//, { timeout: 20000 });

    await use(page);
  },
});
```

## Page Object Model
- One class per InvenTree page/panel, placed in `automation/ui/pages/`
- File naming: `<page-name>.page.ts`, class naming: `<PageName>Page`
- Every UI spec under `automation/ui/tests/*.spec.ts` must use page object classes for page actions and locators.
- If a required page object does not exist, create it in `automation/ui/pages/` as part of the same change.
- Keep specs orchestration-focused: assertions and business flow in spec, selector/action plumbing in page classes.
- Do not add new raw `page.getBy*` selectors in spec files unless there is a temporary blocker; prefer adding a method/property to a page class.

```typescript
// automation/ui/pages/part-list.page.ts
import { Page, Locator } from '@playwright/test';

export class PartListPage {
  readonly page: Page;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: /search/i });
  }

  async goto() {
    await this.page.goto('/web/part/');
  }
}
```

## Test Structure
Test titles must begin with the test case ID from the manual test suite (`TC_PART_*`):
```typescript
import { test, expect } from '../fixtures/ui.fixtures';

test.describe('Part Creation', () => {
  test('TC_PART_CREATE_001: Create a new part with required fields only', async ({ authenticatedPage }) => {
    // ...
  });
});
```

## Mandatory POM Policy
- UI specs must instantiate and use page classes (for example `new PartsPage(page)` and `new AddPartModalPage(page)`).
- Shared flows (navigation, modal open/close, form submit, table search) must be encapsulated in page-object methods.
- When refactoring or adding tests, migrate duplicated selectors into page classes instead of copying selectors between specs.

## Selectors — Priority Order
1. `getByRole` (accessibility role + name)
2. `getByLabel` / `getByPlaceholder`
3. `getByText` (exact match for buttons/links)
4. `data-testid` attribute if present in the DOM
5. CSS selector as last resort — never use XPath

## Demo Server Slowness
`demo.inventree.org` is a public shared server. React SPA hydration and API responses regularly take 5–15 seconds. Rules:
- **Never** assume an element is immediately available after `page.goto()`
- **Always** wait for a specific element to be visible before interacting: `await locator.waitFor({ state: 'visible', timeout: 15000 })`
- **Do not** rely solely on `waitForLoadState('networkidle')` — it can resolve before React has rendered the target component
- Use `networkidle` only as a secondary wait **after** a `.waitFor()` on a concrete element
- All `expect()` assertions on elements should use explicit timeouts: `await expect(locator).toBeVisible({ timeout: 15000 })`
- Post-navigation URL assertions: `await expect(page).toHaveURL(/pattern/, { timeout: 20000 })`

## Waiting & Assertions
- Prefer `await locator.waitFor({ state: 'visible', timeout: 15000 })` before interacting with any element
- Use `await expect(page).toHaveURL(/pattern/, { timeout: 20000 })` for navigation assertions
- Never use `page.waitForTimeout()` — use explicit element waits instead
- After form submissions, wait for a success indicator element to be visible — do not rely on `networkidle`
- Pass explicit `timeout` values on all `expect()` calls that follow navigation or form actions

## Seed File (`tests/seed.spec.ts`)
`seed.spec.ts` contains a login smoke test used as the **seed file for Playwright MCP agents** (planner, generator, healer). It verifies the login flow works end-to-end. When invoking any Playwright agent, pass `tests/seed.spec.ts` as the seed file.

**Important:** `seed.spec.ts` MUST import from `'@playwright/test'` directly, NOT from `'../fixtures/ui.fixtures'`. The MCP server has its own Playwright instance — importing a custom fixture causes a "two versions of @playwright/test" conflict and the seed will fail to run.

## InvenTree UI Notes
- Login page: `/web/login/`
- Parts list: `/web/part/`
- Part detail: `/web/part/{pk}/`
- After login, InvenTree redirects to the dashboard at `/web/`
- InvenTree uses a React-based SPA — after navigation, wait for a specific element with `await locator.waitFor({ state: 'visible', timeout: 15000 })` rather than relying on `networkidle`
- The "Create Part" button is in a dropdown — click the dropdown trigger first, then select "New Part"
- Form dialogs are modal overlays — assert on the modal container, not the full page
