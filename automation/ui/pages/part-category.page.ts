import { expect, type Locator, type Page } from '@playwright/test';

export class PartCategoryPage {
  readonly page: Page;
  readonly panelTabs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.panelTabs = page.getByLabel('panel-tabs-partcategory');
  }

  async clickCategoryByName(name: string): Promise<void> {
    await this.page.getByRole('cell', { name, exact: true }).first().click();
    await expect(this.page).toHaveURL(/\/web\/part\/category\/\d+\/subcategories/, { timeout: 20000 });
  }

  async waitForSubcategoriesTable(firstCellName: string): Promise<void> {
    await this.page.getByRole('cell', { name: firstCellName, exact: true }).waitFor({ state: 'visible' });
  }

  async expectDescription(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectSubcategoryVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('cell', { name, exact: true })).toBeVisible();
  }

  async expectPaginationCount(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectBreadcrumb(ariaLabel: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: ariaLabel })).toBeVisible();
  }

  async openPartsTab(): Promise<void> {
    await this.panelTabs.getByRole('tab', { name: 'Parts' }).click();
    await expect(this.page).toHaveURL(/\/parts$/, { timeout: 20000 });
  }

  async waitForPartInTable(partName: string): Promise<void> {
    await this.page.getByRole('cell', { name: new RegExp(`Thumbnail\\s*${partName}`) }).waitFor({ state: 'visible' });
  }

  async clickPartByThumbnailCell(partName: string): Promise<void> {
    await this.page.getByRole('cell', { name: `Thumbnail ${partName}` }).click();
  }
}
