import { test, expect } from '../fixtures/ui.fixtures';
import { AddPartModalPage } from '../pages/add-part-modal.page';
import { PartsPage } from '../pages/parts.page';

test.describe('TC_PART_CREATE_001 – Part Creation Happy Path and Validation', () => {
  test('TC_PART_CREATE_001_NEG1 – Cancel the Add Part modal discards the form without creating a part', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const addPartModal = new AddPartModalPage(page);
    const partName = `CancelTest_Part_DISCARD_${Date.now()}`;

    // Step 1-2: Navigate to Parts and open Create Part.
    await partsPage.gotoPartsTable();
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();

    // Step 3: Type the candidate part name.
    await addPartModal.fillName(partName);

    // Step 4: Click Cancel and ensure modal is closed.
    await addPartModal.cancel();
    await addPartModal.expectHidden();

    // Step 5: Search for the canceled part name and assert no records are found.
    await partsPage.searchInPartsTable(partName);
    await expect(partsPage.noRecordsText).toBeVisible({ timeout: 20000 });
  });
});
