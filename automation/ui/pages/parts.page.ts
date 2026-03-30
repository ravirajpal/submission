import { expect, type Locator, type Page } from '@playwright/test';

export class PartsPage {
  readonly page: Page;
  readonly topPartsTab: Locator;
  readonly partCategoriesTab: Locator;
  readonly panelPartsTab: Locator;
  readonly addPartsButton: Locator;
  readonly createPartMenuItem: Locator;
  readonly tableSearchInput: Locator;
  readonly noRecordsText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topPartsTab = page.getByRole('tab', { name: 'Parts', exact: true }).first();
    this.partCategoriesTab = page.getByRole('tab', { name: 'Part Categories', exact: true }).first();
    this.panelPartsTab = page.getByLabel('panel-tabs-partcategory').getByRole('tab', { name: 'Parts', exact: true });
    this.addPartsButton = page.getByRole('button', { name: 'action-menu-add-parts' });
    this.createPartMenuItem = page.getByRole('menuitem', { name: 'action-menu-add-parts-create-' });
    this.tableSearchInput = page.getByRole('textbox', { name: 'table-search-input' });
    this.noRecordsText = page.getByText('No records found');
  }

  async gotoPartsTable(): Promise<void> {
    await this.topPartsTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.topPartsTab.click();
    await this.panelPartsTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.panelPartsTab.click();
    await expect(this.tableSearchInput).toBeVisible({ timeout: 15000 });
    await expect(this.page).toHaveURL(/\/web\/part\//, { timeout: 20000 });
  }

  async openCreatePartModal(): Promise<void> {
    await this.addPartsButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addPartsButton.click();
    await this.createPartMenuItem.waitFor({ state: 'visible', timeout: 15000 });
    await this.createPartMenuItem.click();
  }

  async openPartCategoriesTab(): Promise<void> {
    await this.partCategoriesTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.partCategoriesTab.click();
    await expect(this.page).toHaveURL(/\/subcategories/, { timeout: 20000 });
  }

  async openCategoryByName(name: string): Promise<void> {
    await this.page.getByRole('cell', { name }).first().click();
    await expect(this.page).toHaveURL(/\/web\/part\/category\/\d+\/(subcategories|details)/, { timeout: 20000 });
  }

  async openPartsSubTabInCategory(): Promise<void> {
    await this.panelPartsTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.panelPartsTab.click();
    await expect(this.page).toHaveURL(/\/web\/part\/category\/.+\/parts/, { timeout: 20000 });
  }

  async searchInPartsTable(value: string): Promise<void> {
    await this.tableSearchInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.tableSearchInput.fill(value);
  }
}
