import { test, expect } from '../fixtures/ui.fixtures';
import { AddParameterModalPage } from '../pages/add-parameter-modal.page';
import { AddPartModalPage } from '../pages/add-part-modal.page';
import { AddStockItemModalPage } from '../pages/add-stock-item-modal.page';
import { PartDetailPage } from '../pages/part-detail.page';
import { PartsPage } from '../pages/parts.page';

test.describe('CF-001 - Part Creation to Category Verification', () => {
  test('Create a part, add parameters, create stock, verify in category view', async ({ authenticatedPage }) => {
    test.setTimeout(120000);

    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const addPartModal = new AddPartModalPage(page);
    const partDetailPage = new PartDetailPage(page);
    const addParameterModal = new AddParameterModalPage(page);
    const addStockItemModal = new AddStockItemModalPage(page);
    const partName = `CF001_TestPart_${Date.now()}`;
    const partDescription = 'Cross functional part flow';
    const parameterTemplate = 'Resistance';
    const parameterValue = '10k';
    const stockQuantity = '25';

    // Step 1: Log in as allaccess using the seed flow. Navigate to Parts, open Part Categories, and select a target category (for example Electronics).
    await partsPage.gotoPartsTable();
    await partsPage.openPartCategoriesTab();
    await partsPage.openCategoryByName('Electronics');
    await expect(page.getByLabel('panel-tabs-partcategory').getByRole('tab', { name: 'Parts' })).toBeVisible({ timeout: 20000 });

    const categoryPartsUrl = page.url().replace('/subcategories', '/parts');

    // Step 2: From the selected category context, click Add Parts and choose Create Part. Enter Name and Description, then submit.
    await partsPage.openPartsSubTabInCategory();
    await partsPage.openCreatePartModal();
    await addPartModal.waitForOpen();
    await addPartModal.fillName(partName);
    await addPartModal.fillDescription(partDescription);
    await addPartModal.submit();

    await partDetailPage.expectOnDetails();
    await expect(page.getByText(new RegExp(`Part:\\s*${partName}`))).toBeVisible({ timeout: 20000 });

    // Step 3: On the new Part Detail page, open the Parameters tab and add one parameter with value = 10k.
    await partDetailPage.openParametersTab();
    await addParameterModal.openFromActionsMenu();
    await addParameterModal.addParameter(parameterTemplate, parameterValue);

    await expect(page.getByRole('row', { name: new RegExp(`${parameterTemplate}.*${parameterValue}`) })).toBeVisible({ timeout: 20000 });

    // Step 4: On the same Part Detail page, create stock with quantity = 25 and a valid location.
    await partDetailPage.openStockActionsAdd();

    const addStockDialog = page.getByRole('dialog', { name: 'Add Stock' });
    await expect(addStockDialog).toBeVisible({ timeout: 20000 });
    await addStockDialog.getByRole('button', { name: 'Cancel' }).click();

    await partDetailPage.openStockTab();
    await addStockItemModal.openFromStockTab();
    await addStockItemModal.addStock('Stock', stockQuantity);

    await expect(page).toHaveURL(/\/web\/stock\/item\/\d+\/details/, { timeout: 20000 });
    await expect(page.getByText(new RegExp(`Quantity:\\s*${stockQuantity}`))).toBeVisible({ timeout: 20000 });

    // Step 5: Navigate back to the same category page, open Parts sub-tab, and search for the new part.
    await page.goto(categoryPartsUrl);
    await expect(page.getByRole('textbox', { name: 'table-search-input' })).toBeVisible({ timeout: 30000 });

    await page.getByRole('textbox', { name: 'table-search-input' }).fill(partName);

    const categoryRow = page.getByRole('row', { name: new RegExp(partName) });
    await expect(categoryRow).toBeVisible({ timeout: 30000 });
    await expect(categoryRow).toContainText(stockQuantity, { timeout: 30000 });

    // Step 6: Open the part from category list and verify parameter and stock persist.
    await page.getByRole('cell', { name: new RegExp(`Thumbnail\\s*${partName}`) }).click();

    await expect(page).toHaveURL(/\/web\/part\/\d+\//, { timeout: 20000 });
    await expect(page.getByText(new RegExp(`Part:\\s*${partName}`))).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(new RegExp(`In Stock:\\s*${stockQuantity}`))).toBeVisible({ timeout: 20000 });

    await partDetailPage.openParametersTab();
    await expect(page.getByRole('row', { name: new RegExp(`${parameterTemplate}.*${parameterValue}`) })).toBeVisible({ timeout: 20000 });
  });
});
