import { expect, type Locator, type Page } from '@playwright/test';

export class AddPartModalPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;
  readonly duplicateError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Add Part' });
    this.nameInput = page.getByRole('textbox', { name: 'text-field-name' });
    this.descriptionInput = page.getByRole('textbox', { name: 'text-field-description' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.duplicateError = page.getByText('The fields name, IPN, revision must make a unique set.');
  }

  async waitForOpen(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 15000 });
    await expect(this.nameInput).toBeVisible({ timeout: 15000 });
  }

  async isOpen(timeout = 2000): Promise<boolean> {
    return this.heading.isVisible({ timeout }).catch(() => false);
  }

  async fillName(value: string): Promise<void> {
    await this.nameInput.fill(value);
  }

  async fillDescription(value: string): Promise<void> {
    await this.descriptionInput.fill(value);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectHidden(): Promise<void> {
    await expect(this.heading).toBeHidden({ timeout: 20000 });
  }

  async expectNameValue(value: string): Promise<void> {
    await expect(this.nameInput).toHaveValue(value, { timeout: 15000 });
  }

  async expectDescriptionValue(value: string): Promise<void> {
    await expect(this.descriptionInput).toHaveValue(value, { timeout: 15000 });
  }

  async expectDuplicateErrorVisible(): Promise<void> {
    await expect(this.duplicateError).toBeVisible({ timeout: 15000 });
  }
}
