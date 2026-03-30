import { expect, type Locator, type Page } from '@playwright/test';

export class AddStockItemModalPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly locationInput: Locator;
  readonly quantityInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Add Stock Item' });
    this.locationInput = this.dialog.getByRole('combobox', { name: 'related-field-location' });
    this.quantityInput = this.dialog.getByRole('textbox', { name: 'number-field-quantity' });
    this.submitButton = this.dialog.getByRole('button', { name: 'Submit' });
  }

  async openFromStockTab(): Promise<void> {
    await this.page.getByRole('button', { name: 'action-button-add-stock-item' }).click();
    await expect(this.dialog).toBeVisible({ timeout: 20000 });
  }

  async addStock(location: string, quantity: string): Promise<void> {
    await this.locationInput.fill(location);
    await expect(this.page.getByRole('listbox')).toBeVisible({ timeout: 20000 });
    await this.page.getByRole('listbox').getByRole('option').first().click();
    await this.quantityInput.fill(quantity);
    await this.submitButton.click();
  }
}
