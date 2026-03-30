import { expect, type Locator, type Page } from '@playwright/test';

export class AddParameterModalPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly templateInput: Locator;
  readonly valueInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Add Parameter' });
    this.templateInput = this.dialog.getByRole('combobox', { name: 'related-field-template' });
    this.valueInput = this.dialog.getByRole('textbox', { name: 'text-field-data' });
    this.submitButton = this.dialog.getByRole('button', { name: 'Submit' });
  }

  async openFromActionsMenu(): Promise<void> {
    await this.page.getByRole('button', { name: 'action-menu-add-parameters' }).click();
    await this.page.getByRole('menuitem', { name: 'action-menu-add-parameters-create-parameter' }).click();
    await expect(this.dialog).toBeVisible({ timeout: 20000 });
  }

  async addParameter(template: string, value: string): Promise<void> {
    await this.templateInput.fill(template);
    await this.page.getByRole('option', { name: new RegExp(template, 'i') }).first().click();
    await this.valueInput.fill(value);
    await this.submitButton.click();
  }
}
