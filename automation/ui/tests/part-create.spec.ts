import { test, expect } from '../fixtures/ui.fixtures';
import { AddPartModalPage } from '../pages/add-part-modal.page';
import { PartDetailPage } from '../pages/part-detail.page';
import { PartsPage } from '../pages/parts.page';

test.describe('TC_PART_CREATE_001 – Part Creation Happy Path and Validation', () => {
  test('TC_PART_CREATE_001 – Create part with Name and Description only (happy path)', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const addPartModal = new AddPartModalPage(page);
    const partDetailPage = new PartDetailPage(page);
    const partName = `Resistor_10K_TC001_${Date.now()}`;
    const description = '10K Ohm through-hole resistor';

    const formatDate = (d: Date) => d.toISOString().slice(0, 10);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const allowedCreationDates = [formatDate(today), formatDate(yesterday)];

    // Step 1-4: Navigate to parts table and open Add Part modal.
    await partsPage.gotoPartsTable();
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();

    // Step 5: Leave Category empty (assert field is visible and untouched).
    await expect(page.getByRole('combobox', { name: 'related-field-category' })).toBeVisible({ timeout: 20000 });

    // Step 6: Enter part Name.
    await addPartModal.fillName(partName);

    // Step 7: Enter part Description.
    await addPartModal.fillDescription(description);

    // Step 8: Keep all other fields at defaults.
    await expect(page.getByRole('textbox', { name: 'number-field-default_expiry' })).toHaveValue('0', { timeout: 20000 });
    await expect(page.getByRole('textbox', { name: 'number-field-minimum_stock' })).toHaveValue('0', { timeout: 20000 });

    // Step 9: Submit the Add Part form.
    await addPartModal.submit();

    // Step 10: Verify redirect to Part Detail page and heading.
    await partDetailPage.expectOnSpecificDetails();
    await expect(page.getByText(new RegExp(`Part:\\s*${partName}`))).toBeVisible({ timeout: 20000 });

    // Step 11: Verify description appears below the heading.
    await expect(page.getByText(description).first()).toBeVisible({ timeout: 20000 });

    // Step 12: Verify Part Details tab is visible/selected.
    await expect(page.getByRole('tab', { name: 'Part Details' })).toBeVisible({ timeout: 20000 });

    // Step 13: Verify Name and Description are displayed in details.
    const partDetailsPanel = page.getByLabel('Part Details');
    await expect(partDetailsPanel.getByText(partName)).toBeVisible({ timeout: 20000 });
    await expect(partDetailsPanel.getByText(description)).toBeVisible({ timeout: 20000 });

    // Step 14: Verify Creation Date is recent (today or previous UTC day due timezone differences).
    const creationDateCell = page.getByText(/^\d{4}-\d{2}-\d{2}$/).first();
    await expect(creationDateCell).toBeVisible({ timeout: 20000 });
    const creationDateText = (await creationDateCell.textContent())?.trim();
    expect(creationDateText).toBeTruthy();
    expect(allowedCreationDates).toContain(creationDateText as string);
  });
});
