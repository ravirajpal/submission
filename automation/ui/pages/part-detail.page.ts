import { expect, type Locator, type Page } from '@playwright/test';

export class PartDetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly panelTabs: Locator;
  readonly stockActionsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText(/^Part:\s*/).first();
    this.panelTabs = page.getByLabel('panel-tabs-part');
    this.stockActionsButton = page.getByRole('button', { name: 'action-menu-stock-actions' });
  }

  async expectOnDetails(): Promise<void> {
    await expect(this.page).toHaveURL(/\/web\/part\/\d+\//, { timeout: 20000 });
    await expect(this.heading).toBeVisible({ timeout: 20000 });
  }

  async expectOnSpecificDetails(): Promise<void> {
    await expect(this.page).toHaveURL(/\/web\/part\/\d+\/details/, { timeout: 20000 });
  }

  async openTab(name: string, exact = false): Promise<void> {
    await this.panelTabs.getByRole('tab', { name, exact }).click();
  }

  async openParametersTab(): Promise<void> {
    await this.openTab('Parameters');
    await expect(this.page).toHaveURL(/\/parameters/, { timeout: 20000 });
  }

  async openStockTab(): Promise<void> {
    await this.openTab('Stock', true);
    await expect(this.page).toHaveURL(/\/stock/, { timeout: 20000 });
  }

  async openBomTab(): Promise<void> {
    await this.openTab('Bill of Materials');
  }

  async openBuildOrdersTab(): Promise<void> {
    await this.openTab('Build Orders');
  }

  async openStockActionsAdd(): Promise<void> {
    await this.stockActionsButton.click();
    await this.page.getByRole('menuitem', { name: 'action-menu-stock-actions-add' }).click();
  }
}
