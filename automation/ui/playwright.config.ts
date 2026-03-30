import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  /* UI tests run sequentially — shared demo server and stateful login sessions */
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: parseInt(process.env.BROWSER_TIMEOUT_MS ?? '30000', 10),
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://demo.inventree.org',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    headless: false, // Set to true to run tests in headless mode
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
