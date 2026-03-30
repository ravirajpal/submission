import { test, expect } from '@playwright/test';

/**
 * Seed / login smoke test.
 * Used as the seed file for Playwright MCP agents (planner, generator, healer).
 * Must import directly from '@playwright/test' — custom fixtures cause a
 * "two versions of @playwright/test" conflict with the MCP server.
 */
test('seed', async ({ page }) => {
  const loginUrl = process.env.UI_LOGIN_URL ?? '/web/login/';
  const username = process.env.USER_ALLACCESS_USERNAME ?? 'allaccess';
  const password = process.env.USER_ALLACCESS_PASSWORD ?? 'nolimits';

  await page.goto(loginUrl);

  const usernameField = page.getByLabel(/username/i);
  await usernameField.waitFor({ state: 'visible', timeout: 20000 });
  await usernameField.fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL(/\/web\//, { timeout: 20000 });
});
