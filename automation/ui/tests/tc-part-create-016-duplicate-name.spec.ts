// spec: specs/TC_PART_CREATE_016-test-plan.md
// seed: automation/ui/tests/seed.spec.ts

import { test, expect } from '../fixtures/ui.fixtures';
import { AddPartModalPage } from '../pages/add-part-modal.page';
import { PartsPage } from '../pages/parts.page';

test.describe('Part Creation Duplicate Name Validation', () => {
  test('TC_PART_CREATE_016: Create a part with a Name that already exists in the system', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const baselineName = 'Resistor_10K_001';
    const partsPage = new PartsPage(page);
    const addPartModal = new AddPartModalPage(page);

    // 1. Log in with create permission and ensure a baseline part already exists with Name = Resistor_10K_001.
    await expect(page.getByRole('button', { name: 'Ally Access' })).toBeVisible({ timeout: 15000 });
    await partsPage.gotoPartsTable();
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();
    await addPartModal.fillName(baselineName);
    await addPartModal.fillDescription('Baseline setup for TC_PART_CREATE_016');
    await addPartModal.submit();

    const baselineRejectedAsDuplicate = await addPartModal.duplicateError.isVisible({ timeout: 7000 }).catch(() => false);

    if (!baselineRejectedAsDuplicate) {
      const onPartDetails = /\/web\/part\/\d+\/details/.test(page.url());

      if (onPartDetails) {
        await partsPage.gotoPartsTable();
      }
    }

    const isCreatePartModalOpen = await addPartModal.isOpen();

    // 2. Navigate to Parts > Add Parts > Create Part to open the Add Part modal.
    if (!isCreatePartModalOpen) {
      await partsPage.openCreatePartModal();
      await addPartModal.waitForOpen();
    }

    // 3. Enter Name = Resistor_10K_001 (duplicate).
    await addPartModal.fillName(baselineName);
    await expect(addPartModal.nameInput).toHaveValue(baselineName, { timeout: 15000 });

    // 4. Enter Description = Duplicate name test.
    await addPartModal.fillDescription('Duplicate name test');
    await expect(addPartModal.descriptionInput).toHaveValue('Duplicate name test', { timeout: 15000 });

    // 5. Click Submit.
    await addPartModal.submit();
    await addPartModal.waitForOpen();
    await addPartModal.expectDuplicateErrorVisible();
    await expect(page).not.toHaveURL(/\/web\/part\/\d+\/details/, { timeout: 3000 });
  });
});