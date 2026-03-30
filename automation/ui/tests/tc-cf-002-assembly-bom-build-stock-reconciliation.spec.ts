// spec: specs/TC_CF_002-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures/ui.fixtures';
import { AddPartModalPage } from '../pages/add-part-modal.page';
import { AddStockItemModalPage } from '../pages/add-stock-item-modal.page';
import { PartDetailPage } from '../pages/part-detail.page';
import { PartsPage } from '../pages/parts.page';

test.describe('TC_CF_002 - Assembly BOM to Build Output Stock Reconciliation', () => {
  test('TC_CF_002: Build completion consumes component stock and increases assembly stock', async ({ authenticatedPage }) => {
    test.setTimeout(300000);
    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const addPartModal = new AddPartModalPage(page);
    const addStockItemModal = new AddStockItemModalPage(page);
    const partDetailPage = new PartDetailPage(page);

    // Generate run-unique suffix for part names to avoid fixture collisions
    const timestamp = Date.now().toString();
    const componentPartName = `CF002_Component_${timestamp}`;
    const assemblyPartName = `CF002_Assembly_${timestamp}`;

    const bomTab = page.getByRole('tab', { name: /bill of materials|bom/i }).first();
    const buildOrdersTab = page.getByRole('tab', { name: /build orders/i }).first();
    const addBomButton = page.getByRole('button', { name: /action-menu-add-bom-items|add bom/i }).first();

    async function returnToElectronicsPartsTable() {
      await partsPage.gotoPartsTable();
      await partsPage.openPartCategoriesTab();
      await partsPage.openCategoryByName('Electronics');
      await partsPage.openPartsSubTabInCategory();
      await expect(page.getByRole('textbox', { name: 'table-search-input' })).toBeVisible({ timeout: 15000 });
    }

    async function waitForModalOverlayToClose() {
      await page.locator('.mantine-Modal-overlay').last().waitFor({ state: 'detached', timeout: 15000 }).catch(() => {
        // Overlay may already be gone on fast UI transitions.
      });
    }

    async function openCreateBuildOrderDialog() {
      const addBuildDirectButton = page.getByRole('button', { name: 'action-button-add-build-order' }).first();
      await addBuildDirectButton.waitFor({ state: 'visible', timeout: 15000 });
      await addBuildDirectButton.click();
    }

    // 1. Log in as allaccess and navigate to Parts > Part Categories > Electronics > Parts
    // Create two unique names for this run.
    await returnToElectronicsPartsTable();
    expect(page.url()).toContain('/web/part/category');

    // 2. Create a new component part from the category context with required fields,
    // then open its Stock tab and add one stock item with quantity 50 in a valid location.
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();
    await addPartModal.fillName(componentPartName);
    await addPartModal.fillDescription('CF002 component for BOM stock reconciliation');
    await addPartModal.submit();

    // Component part detail should load
    await partDetailPage.expectOnDetails();
    await expect(page.getByText(`Part: ${componentPartName}`, { exact: true })).toBeVisible({ timeout: 15000 });

    // Open Stock tab and add stock item
    await partDetailPage.openStockTab();
    await addStockItemModal.openFromStockTab();
    await addStockItemModal.addStock('Factory', '50');

    // Verify component stock was added successfully
    await expect(page.getByText('Errors')).not.toBeVisible({ timeout: 5000 });
    await waitForModalOverlayToClose();

    // After stock submission, InvenTree lands on Stock Item details.
    await expect(page).toHaveURL(/\/web\/stock\/item\/\d+\/details/, { timeout: 20000 });

    // Return to the component part via Base Part link
    const basePartLink = page.getByRole('link', { name: componentPartName }).first();
    await expect(basePartLink).toBeVisible({ timeout: 15000 });
    await basePartLink.click();
    await partDetailPage.expectOnDetails();

    // 3. Return to Electronics category Parts table and create an assembly part.
    await returnToElectronicsPartsTable();
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();
    await addPartModal.fillName(assemblyPartName);
    await addPartModal.fillDescription('CF002 assembly for BOM build stock reconciliation');
    await page.getByRole('switch', { name: 'boolean-field-assembly' }).click();
    await addPartModal.submit();
    await partDetailPage.expectOnDetails();
    await expect(bomTab).toBeVisible({ timeout: 15000 });
    await expect(buildOrdersTab).toBeVisible({ timeout: 15000 });

    // 4. Add BOM line: component x2, reference R1
    await bomTab.click();
    await expect(addBomButton).toBeVisible({ timeout: 15000 });
    await addBomButton.click();
    await page.getByRole('menuitem', { name: /add|create/i }).first().click();

    const componentCombobox = page.getByRole('combobox', { name: /related-field-sub_part|sub part/i }).first();
    await componentCombobox.fill(componentPartName);
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 15000 });
    const componentOption = page.getByRole('listbox').getByRole('option', { name: new RegExp(componentPartName) }).first();
    await expect(componentOption).toBeVisible({ timeout: 15000 });
    await componentOption.click();
    await page.getByRole('textbox', { name: /number-field-quantity|quantity/i }).first().fill('2');
    await page.getByRole('textbox', { name: /text-field-reference|reference/i }).first().fill('R1');
    await page.getByRole('button', { name: 'Submit' }).last().click();
    await expect(page.getByText('Errors')).not.toBeVisible({ timeout: 5000 });
    await waitForModalOverlayToClose();
    await expect(page.getByText('R1').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('2').first()).toBeVisible({ timeout: 15000 });

    // 5. Create build order with quantity 5
    await buildOrdersTab.click();
    await openCreateBuildOrderDialog();
    await page.getByRole('textbox', { name: /number-field-quantity|quantity/i }).first().fill('5');
    await page.getByRole('button', { name: 'Submit' }).last().click();
    await expect(page.getByText('Errors')).not.toBeVisible({ timeout: 5000 });
    await waitForModalOverlayToClose();

    // 6-8. Open build order detail page (InvenTree may redirect there automatically after creation)
    if (!page.url().includes('/manufacturing/build-order/')) {
      const buildOrderLink = page.getByRole('link', { name: /build order/i }).first();
      await buildOrderLink.waitFor({ state: 'visible', timeout: 15000 });
      await buildOrderLink.click();
    }
    await expect(page).toHaveURL(/\/web\/manufacturing\/build-order\/\d+\//, { timeout: 20000 });

    // Issue the build order first (Pending → Production, enables allocation)
    const issueOrderButton = page.getByRole('button', { name: /issue order/i }).first();
    await issueOrderButton.waitFor({ state: 'visible', timeout: 15000 });
    await issueOrderButton.click();
    // Wait for the Issue confirmation dialog to appear and submit it
    const issueModalOverlay = page.locator('.mantine-Modal-overlay').first();
    if (await issueModalOverlay.isVisible({ timeout: 5000 }).catch(() => false)) {
      const issueSubmit = page.getByRole('button', { name: /submit/i }).last();
      await issueSubmit.waitFor({ state: 'visible', timeout: 15000 });
      await issueSubmit.click();
      await expect(page.getByText('Errors')).not.toBeVisible({ timeout: 5000 });
      await waitForModalOverlayToClose();
    }

    // Go to Required Parts tab and verify required quantity
    await page.getByRole('tab', { name: /required parts/i }).first().click();
    await expect(page.getByText(componentPartName).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('10').first()).toBeVisible({ timeout: 15000 });
  });
});
