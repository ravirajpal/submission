import { test, expect } from '../fixtures/ui.fixtures';
import { AddPartModalPage } from '../pages/add-part-modal.page';
import { PartsPage } from '../pages/parts.page';

test.describe('TC_PART_CREATE_001 – Part Creation Happy Path and Validation', () => {
  test('TC_PART_CREATE_001_NEG2 – Submit with empty Name field shows required field validation error', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const addPartModal = new AddPartModalPage(page);

    // Step 1: Navigate to Parts and open Create Part dialog.
    await partsPage.gotoPartsTable();
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();

    // Step 2: Leave Name empty and optionally fill Description.
    await addPartModal.fillDescription('No name test');

    // Step 3: Submit and verify required-field validation for Name.
    await addPartModal.submit();

    await addPartModal.waitForOpen();
    await expect(page.getByText('Form Error')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('This field is required.')).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/web\/part\/category\/index\/parts/, { timeout: 20000 });
  });
});
