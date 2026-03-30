import { test as base, expect } from '@playwright/test';

export { expect };

export const test = base.extend<{ authenticatedPage: import('@playwright/test').Page }>({
  authenticatedPage: async ({ page }, use) => {
    const loginUrl = process.env.UI_LOGIN_URL ?? '/web/login/';
    const username = process.env.USER_ALLACCESS_USERNAME ?? 'allaccess';
    const password = process.env.USER_ALLACCESS_PASSWORD ?? 'nolimits';

    await page.goto(loginUrl);

    // Wait for stable login-page text before interacting with inputs.
    await expect(page.getByText(/InvenTree demo instance/i)).toBeVisible({ timeout: 20000 });

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
