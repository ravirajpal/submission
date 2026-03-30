# TC_PART_CREATE_001 — Create a New Part with Required Fields Only

## Application Overview

InvenTree is an open-source inventory management system. This test plan covers the Part Creation flow accessed via the Parts section of the web UI. A user navigates to Parts → Parts sub-tab → clicks the 'Add Parts' action button → selects 'Create Part' → fills the modal form → clicks Submit → and is redirected to the new Part Detail page. The demo server (https://demo.inventree.org) uses a React SPA with 5–15s hydration delays. All assertions use explicit timeouts of 20000ms. Key UI elements: 'action-menu-add-parts' button opens a dropdown; 'Add Part' modal has fields: Category (optional), Name* (required), IPN, Description, Revision, Keywords, Units, Link, Default Location, Default Expiry, Minimum Stock, Responsible, and boolean toggles (Component ON, Purchaseable ON by default, Active near bottom). Submit is a green sticky-footer button. On success the browser redirects to /web/part/{id}/details with page heading 'Part: {name}'.

## Test Scenarios

### 1. TC_PART_CREATE_001 – Part Creation Happy Path and Validation

**Seed:** `automation/ui/tests/seed.spec.ts`

#### 1.1. TC_PART_CREATE_001 – Create part with Name and Description only (happy path)

**File:** `automation/ui/tests/part-create.spec.ts`

**Steps:**
  1. Log in as 'allaccess' user (handled by authenticatedPage fixture). Navigate to the Parts section by clicking the 'Parts' tab in the top navigation bar.
    - expect: The URL changes to contain '/web/part'. The 'Parts' tab is selected. The part category page loads with a left-side panel showing 'Category Details', 'Part Categories', and 'Parts' sub-tabs.
  2. Click the 'Parts' sub-tab (third tab inside the panel-tabs-partcategory tablist) to open the parts table.
    - expect: The URL contains '/web/part/category/index/parts'. A table of existing parts is visible with columns: Part, IPN, Revision, Units, Description, Category, Total Stock.
  3. Locate the toolbar above the parts table. Click the 'Add Parts' dropdown button (aria-name 'action-menu-add-parts', positioned at the left side of the table toolbar).
    - expect: A dropdown menu appears containing exactly two items: 'Create Part' and 'Import from File'.
  4. Click the 'Create Part' menu item (aria-name 'action-menu-add-parts-create-part').
    - expect: A modal dialog titled 'Add Part' opens. The form is visible with fields: Category (search combobox, optional), Name* (required text field), IPN, Description, Revision, and further fields accessible by scrolling. A green 'Submit' button and a 'Cancel' button are visible in the sticky footer of the dialog.
  5. Leave the Category field empty (do not type or select anything).
    - expect: The Category combobox remains empty showing placeholder 'Search...'.
  6. Click the Name field (aria-name 'text-field-name') and type 'Resistor_10K_001'.
    - expect: The text 'Resistor_10K_001' appears in the Name field.
  7. Click the Description field (aria-name 'text-field-description') and type '10K Ohm through-hole resistor'.
    - expect: The text '10K Ohm through-hole resistor' appears in the Description field.
  8. Leave all other fields (IPN, Revision, Keywords, Units, Link, Default Location, Default Expiry, Minimum Stock, Responsible) at their default values. Do not interact with any toggle switches.
    - expect: All other fields remain at their defaults. Default Expiry = 0, Minimum Stock = 0. Component toggle = ON, Purchaseable toggle = ON. No other fields have been changed.
  9. Click the green 'Submit' button in the dialog footer.
    - expect: The modal dialog closes. The browser begins navigating to the new part's detail page. No error message or validation failure is shown.
  10. Wait for the Part Detail page to fully load (allow up to 20 seconds for React SPA hydration on the demo server).
    - expect: The URL matches the pattern /\/web\/part\/\d+\/details/ (e.g., /web/part/1253/details). The page title is 'InvenTree Demo Server | Part: Resistor_10K_001'. The page heading reads 'Part: Resistor_10K_001'.
  11. Inspect the subtitle / description text displayed directly below the 'Part: Resistor_10K_001' heading.
    - expect: The text '10K Ohm through-hole resistor' is displayed as a paragraph or subtitle below the heading.
  12. Verify the 'Part Details' panel is active and visible. In the Part Details panel, locate the Name row.
    - expect: The 'Part Details' tab is selected by default. The Name row shows value 'Resistor_10K_001'.
  13. In the Part Details panel, locate the Description row.
    - expect: The Description row shows value '10K Ohm through-hole resistor'.
  14. In the Part Details panel, locate the Creation Date field.
    - expect: The Creation Date field shows today's date in YYYY-MM-DD format (e.g., 2026-03-30).

#### 1.2. TC_PART_CREATE_001_NEG1 – Cancel the Add Part modal discards the form without creating a part

**File:** `automation/ui/tests/part-create.spec.ts`

**Steps:**
  1. Log in as 'allaccess' user. Navigate to Parts → Parts sub-tab so the parts table is visible.
    - expect: Parts table is visible. URL contains '/web/part/category/index/parts'.
  2. Click the 'Add Parts' dropdown button and select 'Create Part'.
    - expect: The 'Add Part' modal dialog opens.
  3. Type 'CancelTest_Part_DISCARD' into the Name field.
    - expect: The Name field shows 'CancelTest_Part_DISCARD'.
  4. Click the 'Cancel' button (outlined, bottom of dialog, to the left of Submit).
    - expect: The modal closes immediately. The URL has not changed. The browser remains on the parts list page.
  5. In the parts table search box, search for 'CancelTest_Part_DISCARD'.
    - expect: No results are returned. The table shows 'No records found' or an empty state. The part was not created.

#### 1.3. TC_PART_CREATE_001_NEG2 – Submit with empty Name field shows required field validation error

**File:** `automation/ui/tests/part-create.spec.ts`

**Steps:**
  1. Log in as 'allaccess' user. Navigate to Parts → Parts sub-tab. Click 'Add Parts' → 'Create Part'.
    - expect: The 'Add Part' modal dialog opens with an empty Name field.
  2. Leave the Name field completely empty. Optionally type 'No name test' in the Description field.
    - expect: Name field remains empty. Description (if filled) shows the text.
  3. Click the green 'Submit' button.
    - expect: The form does NOT submit. The modal remains open. A validation error is displayed on or directly below the Name field (e.g., red border, error text 'This field may not be blank' or 'This field is required'). The browser does not navigate away from the parts page.

#### 1.4. TC_PART_CREATE_001_KEEPOPEN – 'Keep form open' toggle retains modal after successful submission

**File:** `automation/ui/tests/part-create.spec.ts`

**Steps:**
  1. Log in as 'allaccess' user. Navigate to Parts → Parts sub-tab. Click 'Add Parts' → 'Create Part'.
    - expect: The 'Add Part' modal opens. The 'Keep form open' toggle at the bottom-left is OFF by default.
  2. Click the 'Keep form open' toggle to turn it ON.
    - expect: The 'Keep form open' toggle is now ON (enabled).
  3. Type a unique name (e.g., 'KeepOpen_Part_001') into the Name field.
    - expect: Name field shows the typed value.
  4. Click the 'Submit' button.
    - expect: The part is created (no error shown). The modal dialog stays open. The form fields are cleared or reset, ready for another entry. The browser does NOT navigate away to the part detail page.
  5. Verify the 'Add Part' modal is still visible and the Name field is now empty.
    - expect: Modal is still open. Name field is empty (or cleared). The dialog title still reads 'Add Part'.
  6. Click 'Cancel' to close the modal.
    - expect: Modal closes. The parts table is still visible.
