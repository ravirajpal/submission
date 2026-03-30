// spec: specs/TC_PART_CAT_002_003-test-plan.md
// seed: automation/ui/tests/seed.spec.ts

import { test, expect } from '../fixtures/ui.fixtures';
import { PartCategoryPage } from '../pages/part-category.page';
import { PartsPage } from '../pages/parts.page';

test.describe('Part Category Navigation', () => {
  test('TC_PART_CAT_002 - Category page lists direct sub-categories', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const categoryPage = new PartCategoryPage(page);

    // 1. Navigate to the Parts section via the top navigation tab
    await partsPage.gotoPartsTable();

    // 2. Click the Part Categories tab in the panel
    await partsPage.openPartCategoriesTab();

    // 3. Click 'Electronics' in the top-level categories table
    await categoryPage.clickCategoryByName('Electronics');
    await expect(page).toHaveURL(/\/web\/part\/category\/1\/subcategories/, { timeout: 20000 });

    // 4. Verify page description for Electronics
    await categoryPage.expectDescription('Electronic components and systems');

    // 5. Wait for sub-categories table to load
    await categoryPage.waitForSubcategoriesTable('Connectors');

    // 6. Verify all 6 direct sub-categories are listed with correct names
    await categoryPage.expectSubcategoryVisible('Connectors');
    await categoryPage.expectSubcategoryVisible('IC');
    await categoryPage.expectSubcategoryVisible('PCB');
    await categoryPage.expectSubcategoryVisible('PCBA');
    await categoryPage.expectSubcategoryVisible('Passives');
    await categoryPage.expectSubcategoryVisible('Wire');

    // Verify pagination shows exactly 6 records
    await categoryPage.expectPaginationCount('1 - 6 / 6');

    // 7. Click 'Passives' in the sub-categories table
    await categoryPage.clickCategoryByName('Passives');
    await expect(page).toHaveURL(/\/web\/part\/category\/4\/subcategories/, { timeout: 20000 });

    // Verify Passives category description and breadcrumb
    await categoryPage.expectDescription('Passive components');
    await categoryPage.expectBreadcrumb('breadcrumb-2-passives');
  });

  test('TC_PART_CAT_003 - Clicking a part name in category list navigates to Part Detail View', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const partsPage = new PartsPage(page);
    const categoryPage = new PartCategoryPage(page);

    // 1. Navigate to the Parts section via the top navigation tab
    await partsPage.gotoPartsTable();

    // 2. Click the Part Categories tab in the panel
    await partsPage.openPartCategoriesTab();

    // 3. Click 'Electronics' in the top-level categories table
    await categoryPage.clickCategoryByName('Electronics');
    await expect(page).toHaveURL(/\/web\/part\/category\/1\/subcategories/, { timeout: 20000 });
    await categoryPage.waitForSubcategoriesTable('Connectors');

    // 4. Click 'Passives' in the sub-categories table
    await categoryPage.clickCategoryByName('Passives');
    await expect(page).toHaveURL(/\/web\/part\/category\/4\/subcategories/, { timeout: 20000 });
    await categoryPage.expectBreadcrumb('breadcrumb-2-passives');

    // 5. Click the Parts tab inside the Passives category panel
    await categoryPage.openPartsTab();
    await expect(page).toHaveURL(/\/web\/part\/category\/4\/parts/, { timeout: 20000 });

    // 6. Wait for parts table and verify C_100nF_0402 is listed
    await categoryPage.waitForPartInTable('C_100nF_0402');

    // 7. Click the part thumbnail cell for C_100nF_0402
    await categoryPage.clickPartByThumbnailCell('C_100nF_0402');

    // 8. Verify URL changes to the Part Detail View
    await expect(page).toHaveURL(/\/web\/part\/52\/details/, { timeout: 20000 });

    // Verify browser tab title
    await expect(page).toHaveTitle('InvenTree Demo Server | Part: C_100nF_0402');

    // Verify part heading and description
    await expect(page.getByText('Part: C_100nF_0402').first()).toBeVisible();
    await expect(page.getByText('Ceramic capacitor, 100nF in 0402 SMD package').first()).toBeVisible();

    // Verify breadcrumb shows the full category path ending in Capacitors
    await categoryPage.expectBreadcrumb('breadcrumb-3-capacitors');

    // Verify stock summary section is visible
    await expect(page.getByText('In Stock', { exact: true })).toBeVisible();
  });
});
