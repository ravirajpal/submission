# InvenTree – Part Module: Manual UI Test Cases

**Document Type:** Manual UI Test Suite  
**Module:** Part Module  
**Source Requirement Document:** InvenTree_Part_Module_Requirements_Understanding.md  
**Reference URL:** https://docs.inventree.org/en/stable/part/  
**Prepared By:** Senior QA Architect  
**Coverage:** Functional, UI Behavior, Business Rules, Negative & Boundary, RBAC

---

## Table of Contents

1. [Part Creation – Manual Flow](#1-part-creation--manual-flow)
2. [Part Import Flow](#2-part-import-flow)
3. [Part Detail View – Tabs & Panels](#3-part-detail-view--tabs--panels)
4. [Part Categories](#4-part-categories)
5. [Part Attributes & Type Flags](#5-part-attributes--type-flags)
6. [Part Parameters & Units of Measure](#6-part-parameters--units-of-measure)
7. [Part Templates & Variants](#7-part-templates--variants)
8. [Part Revisions](#8-part-revisions)
9. [Virtual Parts](#9-virtual-parts)
10. [Trackable Parts](#10-trackable-parts)
11. [Part Pricing](#11-part-pricing)
12. [Part Test Templates](#12-part-test-templates)
13. [Part Stock History (Stocktake)](#13-part-stock-history-stocktake)
14. [Part Notifications](#14-part-notifications)
15. [Related Parts](#15-related-parts)
16. [Part Attachments](#16-part-attachments)
17. [Part Locking & Active/Inactive Status](#17-part-locking--activeinactive-status)
18. [Bill of Materials (BOM)](#18-bill-of-materials-bom)
19. [Supplier & Manufacturer Integration](#19-supplier--manufacturer-integration)
20. [Permissions & Role-Based Access Control](#20-permissions--role-based-access-control)
21. [Negative & Boundary Scenarios](#21-negative--boundary-scenarios)

---

## 1. Part Creation – Manual Flow

---

### TC_PART_CREATE_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Manual |
| **Test Case ID** | TC_PART_CREATE_001 |
| **Title** | Create a new part with all required fields only |
| **Requirement Reference** | Section 4.2, 4.3 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission for the Part permission group.
- At least one Part Category exists (e.g., "Electronics").
- Global setting "Create Initial Stock" is disabled.

**Test Steps:**
1. Navigate to the **Parts** section in the main navigation.
2. Click the **"Add Parts"** dropdown button.
3. Select **"Create Part"**.
4. In the part creation form, enter:
   - Name = `Resistor_10K_001`
   - Description = `10K Ohm through-hole resistor`
5. Leave all other fields at their defaults.
6. Click **"Submit"**.

**Expected Result:**
- The part is created successfully.
- The browser redirects to the new Part Detail page for `Resistor_10K_001`.
- The Part Detail page header displays: Name = `Resistor_10K_001`, Description = `10K Ohm through-hole resistor`.
- The Creation Date is set to today's date.

---

### TC_PART_CREATE_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Manual |
| **Test Case ID** | TC_PART_CREATE_002 |
| **Title** | Create a new part with all available fields populated |
| **Requirement Reference** | Section 4.2, 4.3 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission.
- A Part Category named `Passives` exists.
- A stock location named `Bin A1` exists.
- A supplier named `Supplier_Alpha` exists.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Fill in the form with:
   - Name = `Capacitor_100nF_002`
   - Description = `100 nanofarad ceramic capacitor, 50V`
   - Category = `Passives`
   - IPN = `IPN-CAP-0001`
   - Revision = `A`
   - Keywords = `capacitor ceramic 100nF 50V`
   - Link = `https://example.com/datasheet/cap100nf`
   - Units = `pcs`
   - Default Location = `Bin A1`
   - Default Supplier = `Supplier_Alpha`
   - Minimum Stock = `100`
   - Notes = `**Important:** Handle ESD sensitive.`
   - Active = checked (default)
   - Component = checked
   - Purchaseable = checked
3. Click **"Submit"**.

**Expected Result:**
- Part is created and browser redirects to the new Part Detail page.
- All entered fields are correctly saved and displayed in the header and Details tab.
- The IPN `IPN-CAP-0001` appears in the detail view.
- The Units field shows `pcs`.
- The Notes tab renders the markdown (`**Important:**` displayed as bold).

---

### TC_PART_CREATE_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Form Validation |
| **Test Case ID** | TC_PART_CREATE_003 |
| **Title** | Submit part creation form with Name field empty |
| **Requirement Reference** | Section 4.2, 4.3 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Leave the **Name** field blank.
3. Enter Description = `Test description`.
4. Click **"Submit"**.

**Expected Result:**
- The form does NOT submit.
- An inline validation error is displayed on the Name field (e.g., "This field is required" or equivalent).
- The user remains on the part creation form.

---

### TC_PART_CREATE_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Form Validation |
| **Test Case ID** | TC_PART_CREATE_004 |
| **Title** | Submit part creation form with Description field empty |
| **Requirement Reference** | Section 4.3 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_NoDescript_003`.
3. Leave the **Description** field blank.
4. Click **"Submit"**.

**Expected Result:**
- Form does not submit (Description is typically required).
- An inline validation error is displayed on the Description field.
- User remains on the creation form.

---

### TC_PART_CREATE_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / IPN Validation |
| **Test Case ID** | TC_PART_CREATE_005 |
| **Title** | Create a part with IPN at maximum character length (100 characters) |
| **Requirement Reference** | Section 4.3 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.
- IPN field is editable (global setting allows).

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_MaxIPN_004`.
3. Enter Description = `Testing max IPN length`.
4. Enter IPN = `ABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ12` (exactly 100 characters).
5. Click **"Submit"**.

**Expected Result:**
- Part is created successfully.
- The 100-character IPN is stored and displayed correctly in the Part Detail view.

---

### TC_PART_CREATE_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / IPN Validation |
| **Test Case ID** | TC_PART_CREATE_006 |
| **Title** | Create a part with IPN exceeding 100 characters |
| **Requirement Reference** | Section 4.3 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.
- IPN field is editable.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_LongIPN_005`.
3. Enter Description = `Testing over-limit IPN`.
4. Enter IPN = `ABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ123` (101 characters).
5. Click **"Submit"**.

**Expected Result:**
- The form either:
  - Truncates the IPN to 100 characters and submits, OR
  - Displays an inline validation error stating the IPN exceeds the maximum length.
- The part is NOT created with a 101-character IPN.

---

### TC_PART_CREATE_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Link Field Validation |
| **Test Case ID** | TC_PART_CREATE_007 |
| **Title** | Create a part with an invalid URL in the Link field |
| **Requirement Reference** | Section 4.3 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_BadLink_006`.
3. Enter Description = `Testing invalid URL link`.
4. Enter Link = `not_a_valid_url`.
5. Click **"Submit"**.

**Expected Result:**
- The form does NOT submit.
- An inline validation error is shown on the Link field indicating it must be a valid URL.

---

### TC_PART_CREATE_008

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Conditional Section |
| **Test Case ID** | TC_PART_CREATE_008 |
| **Title** | Create Initial Stock section appears when global setting is enabled |
| **Requirement Reference** | Section 4.4 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission and admin access to settings.
- Global setting **"Create Initial Stock"** is **enabled**.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Observe the part creation form.

**Expected Result:**
- A **"Create Initial Stock"** section (with a checkbox and quantity field) is visible in the part creation form.

---

### TC_PART_CREATE_009

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Conditional Section |
| **Test Case ID** | TC_PART_CREATE_009 |
| **Title** | Create a part with initial stock when "Create Initial Stock" is enabled |
| **Requirement Reference** | Section 4.4 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission.
- Global setting "Create Initial Stock" is **enabled**.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_InitStock_007`.
3. Enter Description = `Testing initial stock creation`.
4. Check the **"Create Initial Stock"** checkbox.
5. Enter initial stock quantity = `50`.
6. Click **"Submit"**.

**Expected Result:**
- Part is created successfully.
- Browser redirects to new Part Detail page.
- The **Stock** tab shows a stock item with quantity `50`.

---

### TC_PART_CREATE_010

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Conditional Section |
| **Test Case ID** | TC_PART_CREATE_010 |
| **Title** | "Create Initial Stock" section absent when global setting is disabled |
| **Requirement Reference** | Section 4.4 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.
- Global setting **"Create Initial Stock"** is **disabled**.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Observe the part creation form for the "Create Initial Stock" section.

**Expected Result:**
- The **"Create Initial Stock"** section is NOT visible in the form.

---

### TC_PART_CREATE_011

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Conditional Section |
| **Test Case ID** | TC_PART_CREATE_011 |
| **Title** | Supplier/Manufacturer fields appear when part is Purchaseable and "Add Supplier Data" is checked |
| **Requirement Reference** | Section 4.5 |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission and Purchase Orders permissions.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_Supplier_008`.
3. Enter Description = `Testing supplier fields`.
4. Check the **"Purchaseable"** checkbox.
5. Observe the form for an **"Add Supplier Data"** section.
6. Check the **"Add Supplier Data"** option/checkbox.

**Expected Result:**
- Additional fields for **Supplier Part** and **Manufacturer Part** information appear in the form.

---

### TC_PART_CREATE_012

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Permission |
| **Test Case ID** | TC_PART_CREATE_012 |
| **Title** | "Add Parts" menu is hidden for users without Create permission |
| **Requirement Reference** | Section 4.1, 22.1 |
| **Priority** | High |

**Preconditions:**
- A user account exists (e.g., `readonly_user`) that has **no "create" permission** for the Part permission group.
- Log in as `readonly_user`.

**Test Steps:**
1. Log in as `readonly_user`.
2. Navigate to the **Parts** section in the main navigation.
3. Observe the area above the parts table for the **"Add Parts"** dropdown menu.

**Expected Result:**
- The **"Add Parts"** dropdown menu is **not visible** for `readonly_user`.
- The user cannot initiate part creation.

---

### TC_PART_CREATE_013

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Category Inheritance |
| **Test Case ID** | TC_PART_CREATE_013 |
| **Title** | Part inherits default location from category on creation |
| **Requirement Reference** | Section 2.3, 4.3 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.
- A category `Sensors` exists with **Default Location** set to `Shelf B3`.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TemperatureSensor_001`.
3. Enter Description = `NTC temperature sensor`.
4. Select Category = `Sensors`.
5. Do NOT manually set a Default Location.
6. Click **"Submit"**.

**Expected Result:**
- The part is created successfully.
- On the Part Detail page, the **Default Location** is populated as `Shelf B3` (inherited from the `Sensors` category).

---

### TC_PART_CREATE_014

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Category Inheritance |
| **Test Case ID** | TC_PART_CREATE_014 |
| **Title** | Part inherits default keywords from category on creation |
| **Requirement Reference** | Section 2.3 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.
- A category `Connectors` exists with **Default Keywords** = `connector plug socket`.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `USB_TypeC_Connector_001`.
3. Enter Description = `USB Type-C receptacle connector`.
4. Select Category = `Connectors`.
5. Do NOT manually enter Keywords.
6. Click **"Submit"**.

**Expected Result:**
- The part is created with Keywords = `connector plug socket` (inherited from the `Connectors` category).
- Keywords are visible on the Part Detail page.

---

### TC_PART_CREATE_015

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / From Category View |
| **Test Case ID** | TC_PART_CREATE_015 |
| **Title** | Create a part using "Import Part" button within a category view |
| **Requirement Reference** | Section 4.1 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.
- A category `ICs` exists.

**Test Steps:**
1. Navigate to the **Parts** section.
2. Click on the category **"ICs"** to open the category view.
3. Locate and click the **"Import Part"** button within the category view.
4. Observe the resulting form or wizard.

**Expected Result:**
- The part creation / import interface is launched from within the category context.
- The **Category** field in the form is pre-filled or defaults to `ICs`.

---

### TC_PART_CREATE_016

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Duplicate Part Name |
| **Test Case ID** | TC_PART_CREATE_016 |
| **Title** | Create a part with a Name that already exists in the system |
| **Requirement Reference** | Section 4.3, 21 (Name must be unique) |
| **Priority** | High |

**Preconditions:**
- User is logged in with "create" permission.
- A part named `Resistor_10K_001` already exists.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `Resistor_10K_001` (duplicate).
3. Enter Description = `Duplicate name test`.
4. Click **"Submit"**.

**Expected Result:**
- The form does NOT submit.
- An inline validation error is displayed indicating the part name must be unique.

---

### TC_PART_CREATE_017

| Field | Details |
|---|---|
| **Module / Feature** | Part Creation / Active Flag Default |
| **Test Case ID** | TC_PART_CREATE_017 |
| **Title** | Verify that new parts default to Active status |
| **Requirement Reference** | Section 4.3, 17.2 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in with "create" permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `TestPart_ActiveDefault_009`.
3. Enter Description = `Checking active default`.
4. Observe the **Active** checkbox — do not modify it.
5. Click **"Submit"**.

**Expected Result:**
- The part is created with **Active = true** (the default).
- The Part Detail page does not indicate the part is inactive.

---

## 2. Part Import Flow

---

### TC_PART_IMPORT_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Wizard Launch |
| **Test Case ID** | TC_PART_IMPORT_001 |
| **Title** | Access the "Import from File" option from the Parts view |
| **Requirement Reference** | Section 4.6, 20.1 |
| **Priority** | High |

**Preconditions:**
- User is logged in as a **staff member**.
- Global setting **"Part Import Enabled"** is set to enabled.

**Test Steps:**
1. Navigate to the **Parts** section.
2. Click the **"Add Parts"** dropdown.
3. Click **"Import from File"**.

**Expected Result:**
- The multi-stage data import wizard is launched.
- Step 1 of the wizard (file selection) is displayed.

---

### TC_PART_IMPORT_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Wizard Steps |
| **Test Case ID** | TC_PART_IMPORT_002 |
| **Title** | Complete all wizard steps with a valid CSV file |
| **Requirement Reference** | Section 4.6, 20.2 |
| **Priority** | High |

**Preconditions:**
- User is logged in as staff member.
- "Part Import Enabled" setting is ON.
- A valid CSV file (`parts_import_valid.csv`) exists with columns: `name`, `description`, `category`, `IPN`.
- The CSV contains 3 rows of valid part data:
  - Row 1: `LED_Red_001`, `Red 5mm LED`, `LEDs`, `IPN-LED-001`
  - Row 2: `LED_Green_001`, `Green 5mm LED`, `LEDs`, `IPN-LED-002`
  - Row 3: `LED_Blue_001`, `Blue 5mm LED`, `LEDs`, `IPN-LED-003`
- Category `LEDs` exists.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Import from File"**.
2. **Step 1:** Upload `parts_import_valid.csv`. Click **"Next"**.
3. **Step 2:** Map CSV columns to InvenTree fields:
   - `name` → Name
   - `description` → Description
   - `category` → Category
   - `IPN` → IPN
   Click **"Next"**.
4. **Step 3:** Confirm category mapping (confirm `LEDs`). Click **"Next"**.
5. **Step 4:** Review parameter selection. Click **"Next"**.
6. **Step 5:** Skip initial stock creation. Click **"Submit"**.

**Expected Result:**
- All 3 parts are created in the system.
- Each part appears in the `LEDs` category with the correct name, description, and IPN.
- No error messages are displayed.

---

### TC_PART_IMPORT_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / File Validation |
| **Test Case ID** | TC_PART_IMPORT_003 |
| **Title** | Upload an unsupported file format in the import wizard |
| **Requirement Reference** | Section 4.6 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in as staff member.
- "Part Import Enabled" setting is ON.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Import from File"**.
2. At Step 1, attempt to upload a file named `parts_data.pdf`.
3. Observe the system response.

**Expected Result:**
- The system rejects the file with an error indicating the file format is unsupported.
- The wizard does not advance to Step 2.

---

### TC_PART_IMPORT_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Missing Required Fields |
| **Test Case ID** | TC_PART_IMPORT_004 |
| **Title** | Import a CSV file where Name column is missing |
| **Requirement Reference** | Section 4.6, 20.2 |
| **Priority** | High |

**Preconditions:**
- User is logged in as staff member.
- A CSV file (`parts_no_name.csv`) exists with only columns: `description`, `IPN`. The `name` column is absent.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Import from File"**.
2. Upload `parts_no_name.csv`.
3. In Step 2 (field mapping), attempt to proceed without mapping a Name field.
4. Click **"Next"** / **"Submit"**.

**Expected Result:**
- The wizard displays an error or warning indicating that the required `Name` field is not mapped.
- Import does not complete. No parts are created.

---

### TC_PART_IMPORT_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Permission |
| **Test Case ID** | TC_PART_IMPORT_005 |
| **Title** | Non-staff user cannot access the "Import from File" option |
| **Requirement Reference** | Section 4.6, 20.1, 22.3 |
| **Priority** | High |

**Preconditions:**
- A non-staff user account `regular_user` exists with "create" Part permission but is **not** a staff member.
- Log in as `regular_user`.

**Test Steps:**
1. Log in as `regular_user`.
2. Navigate to **Parts** view.
3. Click the **"Add Parts"** dropdown (if visible).
4. Look for the **"Import from File"** option.

**Expected Result:**
- The **"Import from File"** option is NOT visible to `regular_user`.
- The user cannot initiate the import wizard.

---

### TC_PART_IMPORT_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / "Part Import Enabled" Setting |
| **Test Case ID** | TC_PART_IMPORT_006 |
| **Title** | Import option hidden from Part List when "Part Import Enabled" is disabled |
| **Requirement Reference** | Section 4.6, 21 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in as a staff member.
- Global setting **"Part Import Enabled"** is set to **disabled**.

**Test Steps:**
1. Log in as a staff member.
2. Navigate to the **Parts** list view.
3. Click the **"Add Parts"** dropdown.
4. Look for the **"Import from File"** option.

**Expected Result:**
- The **"Import from File"** option is **not available** in the "Add Parts" dropdown.

---

### TC_PART_IMPORT_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Admin Page |
| **Test Case ID** | TC_PART_IMPORT_007 |
| **Title** | Admin user can import parts via the Admin Page |
| **Requirement Reference** | Section 4.6, 20.1 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in as an **admin user**.
- A well-formatted CSV file (`admin_import.csv`) is prepared.

**Test Steps:**
1. Log in as an admin user.
2. Navigate to the **Admin Page** (admin interface).
3. Locate the Part import option.
4. Upload `admin_import.csv`.
5. Complete the import process.

**Expected Result:**
- Parts from the CSV file are created in InvenTree without errors.
- The admin import is more performant (no wizard steps needed).

---

### TC_PART_IMPORT_008

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Non-Admin Access to Admin Page |
| **Test Case ID** | TC_PART_IMPORT_008 |
| **Title** | Non-admin user cannot access the Admin Page import |
| **Requirement Reference** | Section 20.1, 22.3 |
| **Priority** | High |

**Preconditions:**
- A staff (non-admin) user `staff_user` exists.
- Log in as `staff_user`.

**Test Steps:**
1. Log in as `staff_user`.
2. Attempt to directly navigate to the Admin Page URL.

**Expected Result:**
- `staff_user` is denied access to the Admin Page.
- An access denied / 403 response is shown.

---

### TC_PART_IMPORT_009

| Field | Details |
|---|---|
| **Module / Feature** | Part Import / Initial Stock |
| **Test Case ID** | TC_PART_IMPORT_009 |
| **Title** | Create initial stock for imported parts during the import wizard |
| **Requirement Reference** | Section 4.6, 20.2 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in as staff member.
- A valid CSV `parts_with_stock.csv` exists with columns: `name`, `description`.
- Global setting "Create Initial Stock" is enabled.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Import from File"**.
2. Upload `parts_with_stock.csv`.
3. Map fields appropriately.
4. Advance through all wizard steps.
5. At Step 5 (Create Initial Stock), enter quantity = `25`.
6. Click **"Submit"**.

**Expected Result:**
- Imported parts each have an initial stock item with quantity `25`.
- This is visible on the Stock tab of each created part.

---

## 3. Part Detail View – Tabs & Panels

---

### TC_PART_DETAIL_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Header Panel |
| **Test Case ID** | TC_PART_DETAIL_001 |
| **Title** | Part Detail page header displays all core fields correctly |
| **Requirement Reference** | Section 5.1, 5.2 |
| **Priority** | High |

**Preconditions:**
- A part exists with:
  - Name = `Header_Test_Part`
  - IPN = `IPN-HDR-001`
  - Description = `Testing detail view header`
  - Revision = `B`
  - Link = `https://example.com/hdr`
  - Units = `pcs`
  - Category = `Test Category`

**Test Steps:**
1. Navigate to the Part Detail page for `Header_Test_Part`.
2. Observe the header / details panel.
3. Click **"Show Part Details"** toggle if not already expanded.

**Expected Result:**
- The header panel displays:
  - Name: `Header_Test_Part`
  - IPN: `IPN-HDR-001`
  - Description: `Testing detail view header`
  - Revision: `B`
  - External Link: `https://example.com/hdr` (clickable)
  - Creation Date: (today's date or actual creation date)
  - Units: `pcs`
  - Category breadcrumb: includes `Test Category`

---

### TC_PART_DETAIL_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Category Breadcrumb |
| **Test Case ID** | TC_PART_DETAIL_002 |
| **Title** | Category breadcrumb reflects hierarchical category path |
| **Requirement Reference** | Section 5.2, 2.1 |
| **Priority** | Medium |

**Preconditions:**
- A category hierarchy exists: `Electronics` > `Passives` > `Resistors`.
- A part `R_100Ohm` exists in the `Resistors` category.

**Test Steps:**
1. Navigate to the Part Detail page for `R_100Ohm`.
2. Observe the category breadcrumb in the navigation bar.

**Expected Result:**
- The breadcrumb shows the full hierarchy: `Electronics > Passives > Resistors`.
- Each breadcrumb level is a clickable link navigating to that category.

---

### TC_PART_DETAIL_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Stock Tab |
| **Test Case ID** | TC_PART_DETAIL_003 |
| **Title** | Stock tab is always visible on the Part Detail page |
| **Requirement Reference** | Section 5.4, Appendix B |
| **Priority** | High |

**Preconditions:**
- Any part exists in the system (with no special flags required).

**Test Steps:**
1. Navigate to the Part Detail page for any part.
2. Observe the list of tabs.

**Expected Result:**
- The **Stock** tab is visible regardless of part type or flags.

---

### TC_PART_DETAIL_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Stock Tab Actions |
| **Test Case ID** | TC_PART_DETAIL_004 |
| **Title** | Stock tab allows creating a new stock item |
| **Requirement Reference** | Section 5.4 |
| **Priority** | High |

**Preconditions:**
- A non-virtual part `StockTestPart` exists.
- User has stock management permissions.

**Test Steps:**
1. Navigate to the Part Detail page for `StockTestPart`.
2. Click the **"Stock"** tab.
3. Click **"Create New Stock Item"**.
4. In the dialog, enter quantity = `10`, location = `Bin C1`.
5. Click **"Submit"**.

**Expected Result:**
- A new stock item is created with quantity `10` at location `Bin C1`.
- The new stock item appears in the Stock tab list.

---

### TC_PART_DETAIL_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / BOM Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_005 |
| **Title** | BOM tab is visible only for Assembly parts |
| **Requirement Reference** | Section 5.6, 3.3, Appendix B |
| **Priority** | High |

**Preconditions:**
- Two parts exist:
  - `Assembly_Part_A` with **Assembly = true**
  - `Non_Assembly_Part_B` with **Assembly = false**

**Test Steps:**
1. Navigate to the Part Detail page for `Assembly_Part_A`.
2. Observe the tabs — confirm **"BOM"** tab is present.
3. Navigate to the Part Detail page for `Non_Assembly_Part_B`.
4. Observe the tabs — confirm **"BOM"** tab absence.

**Expected Result:**
- **BOM** tab is visible for `Assembly_Part_A`.
- **BOM** tab is **NOT visible** for `Non_Assembly_Part_B`.

---

### TC_PART_DETAIL_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Allocated Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_006 |
| **Title** | Allocated tab visibility based on Component and Salable flags |
| **Requirement Reference** | Section 5.5, Appendix B |
| **Priority** | High |

**Preconditions:**
- Three parts exist:
  - `Part_Component_Only`: Component = true, Salable = false
  - `Part_Salable_Only`: Component = false, Salable = true
  - `Part_Neither`: Component = false, Salable = false

**Test Steps:**
1. Navigate to the Part Detail page for `Part_Component_Only`. Check for **"Allocated"** tab.
2. Navigate to the Part Detail page for `Part_Salable_Only`. Check for **"Allocated"** tab.
3. Navigate to the Part Detail page for `Part_Neither`. Check for **"Allocated"** tab.

**Expected Result:**
- **Allocated** tab is visible for `Part_Component_Only` ✓
- **Allocated** tab is visible for `Part_Salable_Only` ✓
- **Allocated** tab is **NOT visible** for `Part_Neither` ✗

---

### TC_PART_DETAIL_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Build Orders Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_007 |
| **Title** | Build Orders tab is visible only for Assembly parts |
| **Requirement Reference** | Section 5.7, Appendix B |
| **Priority** | High |

**Preconditions:**
- `Assembly_Part_A` exists with Assembly = true.
- `Regular_Part_C` exists with Assembly = false.

**Test Steps:**
1. Navigate to Part Detail page for `Assembly_Part_A`. Confirm **"Build Orders"** tab is present.
2. Navigate to Part Detail page for `Regular_Part_C`. Confirm **"Build Orders"** tab is absent.

**Expected Result:**
- **Build Orders** tab is visible for `Assembly_Part_A`.
- **Build Orders** tab is **NOT visible** for `Regular_Part_C`.

---

### TC_PART_DETAIL_008

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Used In Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_008 |
| **Title** | Used In tab is visible only for Component parts |
| **Requirement Reference** | Section 5.8, 3.4, Appendix B |
| **Priority** | High |

**Preconditions:**
- `Component_Part_X`: Component = true.
- `Non_Component_Part_Y`: Component = false.

**Test Steps:**
1. Navigate to Part Detail page for `Component_Part_X`. Check for **"Used In"** tab.
2. Navigate to Part Detail page for `Non_Component_Part_Y`. Check for **"Used In"** tab.

**Expected Result:**
- **Used In** tab is visible for `Component_Part_X`.
- **Used In** tab is **NOT visible** for `Non_Component_Part_Y`.

---

### TC_PART_DETAIL_009

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Suppliers Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_009 |
| **Title** | Suppliers and Purchase Orders tabs visible only for Purchaseable parts |
| **Requirement Reference** | Section 5.9, 5.10, Appendix B |
| **Priority** | High |

**Preconditions:**
- `Purchaseable_Part_P`: Purchaseable = true.
- `Non_Purchaseable_Part_Q`: Purchaseable = false.

**Test Steps:**
1. Navigate to Part Detail page for `Purchaseable_Part_P`. Check for **"Suppliers"** and **"Purchase Orders"** tabs.
2. Navigate to Part Detail page for `Non_Purchaseable_Part_Q`. Check for **"Suppliers"** and **"Purchase Orders"** tabs.

**Expected Result:**
- **Suppliers** and **Purchase Orders** tabs are visible for `Purchaseable_Part_P`.
- Both tabs are **NOT visible** for `Non_Purchaseable_Part_Q`.

---

### TC_PART_DETAIL_010

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Sales Orders Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_010 |
| **Title** | Sales Orders tab visible only for Salable parts |
| **Requirement Reference** | Section 5.11, Appendix B |
| **Priority** | High |

**Preconditions:**
- `Salable_Part_S`: Salable = true.
- `Non_Salable_Part_T`: Salable = false.

**Test Steps:**
1. Navigate to Part Detail page for `Salable_Part_S`. Check for **"Sales Orders"** tab.
2. Navigate to Part Detail page for `Non_Salable_Part_T`. Check for **"Sales Orders"** tab.

**Expected Result:**
- **Sales Orders** tab is visible for `Salable_Part_S`.
- **Sales Orders** tab is **NOT visible** for `Non_Salable_Part_T`.

---

### TC_PART_DETAIL_011

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Tests Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_011 |
| **Title** | Tests tab is visible only for Testable parts |
| **Requirement Reference** | Section 5.12, 3.5, Appendix B |
| **Priority** | High |

**Preconditions:**
- `Testable_Part_U`: Testable = true.
- `Non_Testable_Part_V`: Testable = false.

**Test Steps:**
1. Navigate to Part Detail page for `Testable_Part_U`. Check for **"Tests"** tab.
2. Navigate to Part Detail page for `Non_Testable_Part_V`. Check for **"Tests"** tab.

**Expected Result:**
- **Tests** tab is visible for `Testable_Part_U`.
- **Tests** tab is **NOT visible** for `Non_Testable_Part_V`.

---

### TC_PART_DETAIL_012

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Variants Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_012 |
| **Title** | Variants tab is visible only for Template parts |
| **Requirement Reference** | Section 5.14, 3.2, Appendix B |
| **Priority** | High |

**Preconditions:**
- `Template_Part_W`: Template (is_template) = true.
- `Non_Template_Part_X`: Template = false.

**Test Steps:**
1. Navigate to Part Detail page for `Template_Part_W`. Check for **"Variants"** tab.
2. Navigate to Part Detail page for `Non_Template_Part_X`. Check for **"Variants"** tab.

**Expected Result:**
- **Variants** tab is visible for `Template_Part_W`.
- **Variants** tab is **NOT visible** for `Non_Template_Part_X`.

---

### TC_PART_DETAIL_013

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Stock History Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_013 |
| **Title** | Stock History tab visibility controlled by user display setting |
| **Requirement Reference** | Section 5.18, 13.4, Appendix B |
| **Priority** | Medium |

**Preconditions:**
- A part `StockHistory_Part` exists.
- User A has **"Enable Stock History"** setting = **enabled**.
- User B has **"Enable Stock History"** setting = **disabled**.

**Test Steps:**
1. Log in as User A. Navigate to Part Detail for `StockHistory_Part`. Check for **"Stock History"** tab.
2. Log out. Log in as User B. Navigate to Part Detail for `StockHistory_Part`. Check for **"Stock History"** tab.

**Expected Result:**
- **Stock History** tab is visible for User A.
- **Stock History** tab is **NOT visible** for User B.

---

### TC_PART_DETAIL_014

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Always Visible Tabs |
| **Test Case ID** | TC_PART_DETAIL_014 |
| **Title** | Pricing, Attachments, Notes, and Stock tabs are always visible |
| **Requirement Reference** | Section 5.13, 5.16, 5.17, 5.19, Appendix B |
| **Priority** | High |

**Preconditions:**
- A basic part `BasicPart_001` exists with no special flags (Virtual = false, Assembly = false, Component = false, etc.).

**Test Steps:**
1. Navigate to Part Detail page for `BasicPart_001`.
2. Check for the presence of: **"Stock"**, **"Pricing"**, **"Attachments"**, **"Notes"** tabs.

**Expected Result:**
- All four tabs — Stock, Pricing, Attachments, Notes — are visible regardless of part type.

---

### TC_PART_DETAIL_015

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Stock Tab Export |
| **Test Case ID** | TC_PART_DETAIL_015 |
| **Title** | Export Stocktake Data from the Stock tab |
| **Requirement Reference** | Section 5.4 |
| **Priority** | Medium |

**Preconditions:**
- A part `ExportTest_Part` with at least 2 stock items exists.
- User has appropriate permissions.

**Test Steps:**
1. Navigate to Part Detail page for `ExportTest_Part`.
2. Click the **"Stock"** tab.
3. Click **"Export Stocktake Data"**.

**Expected Result:**
- A file is downloaded containing all stock item data for `ExportTest_Part`.
- The file contains correct data for all stock items (quantity, location, status).

---

### TC_PART_DETAIL_016

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Revisions Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_016 |
| **Title** | Revisions tab visibility controlled by "Enable Revisions" setting |
| **Requirement Reference** | Section 5.15, 8.4, Appendix B |
| **Priority** | Medium |

**Preconditions:**
- A part `RevTest_Part` exists.
- Scenario A: Global setting **"Enable Revisions"** is ON.
- Scenario B: Global setting **"Enable Revisions"** is OFF.

**Test Steps:**
1. With "Enable Revisions" ON: Navigate to Part Detail page for `RevTest_Part`. Check for **"Revisions"** tab.
2. Disable "Enable Revisions" in settings.
3. Navigate to Part Detail page for `RevTest_Part`. Check for **"Revisions"** tab.

**Expected Result:**
- **Revisions** tab is visible when "Enable Revisions" = ON.
- **Revisions** tab is **NOT visible** when "Enable Revisions" = OFF.

---

### TC_PART_DETAIL_017

| Field | Details |
|---|---|
| **Module / Feature** | Part Detail View / Related Parts Tab Visibility |
| **Test Case ID** | TC_PART_DETAIL_017 |
| **Title** | Related Parts tab visibility controlled by "Enable Related Parts" setting |
| **Requirement Reference** | Section 5.16, 15.2, Appendix B |
| **Priority** | Medium |

**Preconditions:**
- A part `RelatedTest_Part` exists.
- Scenario A: Global setting **"Enable Related Parts"** is ON.
- Scenario B: Global setting **"Enable Related Parts"** is OFF.

**Test Steps:**
1. With "Enable Related Parts" ON: Navigate to Part Detail for `RelatedTest_Part`. Check for **"Related Parts"** tab/section.
2. Disable "Enable Related Parts" in global settings.
3. Navigate to Part Detail for `RelatedTest_Part`. Check for **"Related Parts"** tab/section.

**Expected Result:**
- Related Parts section visible when setting = ON.
- Related Parts section **NOT visible** when setting = OFF.

---

## 4. Part Categories

---

### TC_PART_CAT_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Navigation |
| **Test Case ID** | TC_PART_CAT_001 |
| **Title** | Category page displays parts from the category and all sub-categories |
| **Requirement Reference** | Section 2.2 |
| **Priority** | High |

**Preconditions:**
- Hierarchy: `Components` > `Passives` > `Resistors`
- Parts:
  - `Res_001` in `Resistors`
  - `Cap_001` in `Passives`
  - `MCU_001` in `Components`

**Test Steps:**
1. Navigate to the **"Components"** category page.
2. Observe the parts list displayed.

**Expected Result:**
- The **"Components"** category page shows `Res_001`, `Cap_001`, and `MCU_001` (all parts from the category and all descendants).
- Sub-categories `Passives` and `Resistors` are also listed on the page.

---

### TC_PART_CAT_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Sub-category Listing |
| **Test Case ID** | TC_PART_CAT_002 |
| **Title** | Category page lists direct sub-categories |
| **Requirement Reference** | Section 2.2 |
| **Priority** | Medium |

**Preconditions:**
- Hierarchy: `Electronics` > `Active` and `Electronics` > `Passive`.

**Test Steps:**
1. Navigate to the **"Electronics"** category page.
2. Observe the sub-categories section.

**Expected Result:**
- The `Electronics` category page shows `Active` and `Passive` as sub-categories.
- Clicking a sub-category navigates to that sub-category's page.

---

### TC_PART_CAT_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Navigation to Part Detail |
| **Test Case ID** | TC_PART_CAT_003 |
| **Title** | Clicking a part name in category list navigates to Part Detail View |
| **Requirement Reference** | Section 2.2 |
| **Priority** | High |

**Preconditions:**
- A category `Sensors` with at least one part `TempSensor_001`.

**Test Steps:**
1. Navigate to the **"Sensors"** category page.
2. Click on the part name **"TempSensor_001"** in the parts list.

**Expected Result:**
- Browser navigates to the Part Detail View for `TempSensor_001`.

---

### TC_PART_CAT_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Filtering |
| **Test Case ID** | TC_PART_CAT_004 |
| **Title** | Filter parts list in a category by name |
| **Requirement Reference** | Section 2.2 |
| **Priority** | Medium |

**Preconditions:**
- Category `Passives` with parts: `Resistor_100R`, `Resistor_10K`, `Capacitor_100nF`.

**Test Steps:**
1. Navigate to the **"Passives"** category page.
2. Apply a filter with keyword = `Resistor`.

**Expected Result:**
- Only `Resistor_100R` and `Resistor_10K` are shown.
- `Capacitor_100nF` is filtered out.

---

### TC_PART_CAT_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Default Location Inheritance |
| **Test Case ID** | TC_PART_CAT_005 |
| **Title** | Part created in a category inherits category default location |
| **Requirement Reference** | Section 2.3, 4.3 |
| **Priority** | High |

**Preconditions:**
- Category `Mechanical` has **Default Location** = `Drawer D5`.
- User has "create" Part permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `Bolt_M3_001`, Description = `M3 hex bolt`.
3. Select Category = `Mechanical`.
4. Do NOT set a Default Location manually.
5. Submit the form.

**Expected Result:**
- Part `Bolt_M3_001` is created with Default Location = `Drawer D5`.

---

### TC_PART_CAT_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Parameter Template Auto-Assignment |
| **Test Case ID** | TC_PART_CAT_006 |
| **Title** | Parameter templates from category are auto-added to new parts in that category |
| **Requirement Reference** | Section 2.3, 6.4, 21 |
| **Priority** | High |

**Preconditions:**
- Global setting **"Parameter Templates Auto-copy"** is **enabled**.
- Category `Resistors` has associated parameter templates: `Resistance (Ohms)`, `Power Rating (Watts)`.
- User has "create" Part permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `Res_AutoParam_001`, Description = `Auto parameter test`.
3. Select Category = `Resistors`.
4. Submit the form.
5. Navigate to the new part's detail page and view the **Parameters** section.

**Expected Result:**
- The part `Res_AutoParam_001` has `Resistance (Ohms)` and `Power Rating (Watts)` parameters pre-added (with empty values ready to be filled).

---

### TC_PART_CAT_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Parameter Auto-Assignment Disabled |
| **Test Case ID** | TC_PART_CAT_007 |
| **Title** | Parameter templates not auto-added when setting is disabled |
| **Requirement Reference** | Section 6.4, 21 |
| **Priority** | Medium |

**Preconditions:**
- Global setting **"Parameter Templates Auto-copy"** is **disabled**.
- Category `Resistors` has parameter templates defined.

**Test Steps:**
1. Create a new part in the `Resistors` category.
2. Navigate to the new part's detail page and view the Parameters section.

**Expected Result:**
- No parameters are pre-added to the new part.
- The Parameters section is empty.

---

### TC_PART_CAT_008

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Hierarchical Structure |
| **Test Case ID** | TC_PART_CAT_008 |
| **Title** | Category with no parent is treated as a top-level category |
| **Requirement Reference** | Section 2.3 |
| **Priority** | Low |

**Preconditions:**
- A category `TopLevel_Cat` exists with no parent category set.

**Test Steps:**
1. Navigate to the **Parts** section / categories view.
2. Locate `TopLevel_Cat`.

**Expected Result:**
- `TopLevel_Cat` appears as a root-level category (not nested under any other category).

---

### TC_PART_CAT_009

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Subscribe |
| **Test Case ID** | TC_PART_CAT_009 |
| **Title** | User can subscribe to a Part Category |
| **Requirement Reference** | Section 2.4, 14.3 |
| **Priority** | Medium |

**Preconditions:**
- User is logged in.
- A category `Microcontrollers` exists.

**Test Steps:**
1. Navigate to the **"Microcontrollers"** category page.
2. Locate the **subscribe/notification** option for the category.
3. Click to **subscribe** to the category.

**Expected Result:**
- The user is subscribed to the `Microcontrollers` category.
- A visual indicator confirms subscription status (icon or label changes to "subscribed").

---

### TC_PART_CAT_010

| Field | Details |
|---|---|
| **Module / Feature** | Part Categories / Icon |
| **Test Case ID** | TC_PART_CAT_010 |
| **Title** | Category icon is displayed when set |
| **Requirement Reference** | Section 2.3 |
| **Priority** | Low |

**Preconditions:**
- A category `LEDs` has an icon configured.

**Test Steps:**
1. Navigate to the categories view.
2. Locate the `LEDs` category.

**Expected Result:**
- The configured icon is displayed next to the `LEDs` category name.

---

## 5. Part Attributes & Type Flags

---

### TC_PART_ATTR_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Assembly Flag |
| **Test Case ID** | TC_PART_ATTR_001 |
| **Title** | Assembly flag enables BOM and Build Orders tabs |
| **Requirement Reference** | Section 3.3, 5.6, 5.7 |
| **Priority** | High |

**Preconditions:**
- User has "create" and "edit" Part permissions.
- A part `PCB_Assembly_001` exists with Assembly = false.

**Test Steps:**
1. Navigate to Part Detail page for `PCB_Assembly_001`.
2. Confirm **BOM** and **Build Orders** tabs are NOT visible.
3. Edit the part to set **Assembly = true**.
4. Save and reload the Part Detail page.
5. Check for **BOM** and **Build Orders** tabs.

**Expected Result:**
- After enabling Assembly, both **BOM** and **Build Orders** tabs are visible.

---

### TC_PART_ATTR_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Component Flag |
| **Test Case ID** | TC_PART_ATTR_002 |
| **Title** | Component flag enables Used In and Allocated tabs |
| **Requirement Reference** | Section 3.4, 5.5, 5.8 |
| **Priority** | High |

**Preconditions:**
- A part `Component_Part_001` exists with Component = false.

**Test Steps:**
1. Navigate to Part Detail page for `Component_Part_001`.
2. Confirm **Used In** and **Allocated** tabs are NOT visible.
3. Edit the part to set **Component = true**.
4. Save and reload.
5. Check for **Used In** and **Allocated** tabs.

**Expected Result:**
- After enabling Component, both **Used In** and **Allocated** tabs are visible.

---

### TC_PART_ATTR_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Purchaseable Flag |
| **Test Case ID** | TC_PART_ATTR_003 |
| **Title** | Purchaseable flag enables Suppliers and Purchase Orders tabs |
| **Requirement Reference** | Section 3.7, 5.9, 5.10 |
| **Priority** | High |

**Preconditions:**
- A part `Buy_Part_001` with Purchaseable = false.

**Test Steps:**
1. Navigate to Part Detail page for `Buy_Part_001`.
2. Confirm **Suppliers** and **Purchase Orders** tabs are NOT visible.
3. Edit the part to set **Purchaseable = true**.
4. Save and reload.
5. Confirm **Suppliers** and **Purchase Orders** tabs are now visible.

**Expected Result:**
- Both tabs become visible after enabling Purchaseable.

---

### TC_PART_ATTR_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Salable Flag |
| **Test Case ID** | TC_PART_ATTR_004 |
| **Title** | Salable flag enables Sales Orders and Allocated tabs |
| **Requirement Reference** | Section 3.8, 5.5, 5.11 |
| **Priority** | High |

**Preconditions:**
- A part `Sell_Part_001` with Salable = false, Component = false.

**Test Steps:**
1. Navigate to Part Detail page for `Sell_Part_001`.
2. Confirm **Sales Orders** and **Allocated** tabs are NOT visible.
3. Edit the part to set **Salable = true**.
4. Save and reload.
5. Confirm **Sales Orders** and **Allocated** tabs are visible.

**Expected Result:**
- Both tabs become visible after enabling Salable.

---

### TC_PART_ATTR_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Multiple Flags |
| **Test Case ID** | TC_PART_ATTR_005 |
| **Title** | Part with multiple flags shows all corresponding tabs |
| **Requirement Reference** | Section 3.1–3.8, Appendix B |
| **Priority** | High |

**Preconditions:**
- A part `Multi_Flag_Part` exists with: Assembly = true, Component = true, Purchaseable = true, Salable = true, Testable = true.

**Test Steps:**
1. Navigate to Part Detail page for `Multi_Flag_Part`.
2. Review all visible tabs.

**Expected Result:**
- The following tabs are visible: **Stock**, **Allocated**, **BOM**, **Build Orders**, **Used In**, **Suppliers**, **Purchase Orders**, **Sales Orders**, **Tests**, **Pricing**, **Attachments**, **Notes**.

---

### TC_PART_ATTR_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Inactive Status |
| **Test Case ID** | TC_PART_ATTR_006 |
| **Title** | Marking a part as Inactive disables it in the system but retains data |
| **Requirement Reference** | Section 17.2 |
| **Priority** | High |

**Preconditions:**
- A part `Legacy_Part_001` exists and is currently Active.

**Test Steps:**
1. Navigate to Part Detail page for `Legacy_Part_001`.
2. Edit the part to set **Active = false** (uncheck Active).
3. Save the change.
4. Reload the Part Detail page.
5. Search for `Legacy_Part_001` in the parts list.

**Expected Result:**
- The part is marked as Inactive (a visual indicator is shown, e.g., badge or warning).
- The part data remains visible in the system (it is not deleted).
- Inactive parts may not appear in default parts lists (behavior depends on filter settings).

---

### TC_PART_ATTR_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Testable Flag |
| **Test Case ID** | TC_PART_ATTR_007 |
| **Title** | Testable flag enables the Tests tab |
| **Requirement Reference** | Section 3.5, 5.12 |
| **Priority** | High |

**Preconditions:**
- A part `Testable_Part_001` with Testable = true.
- A part `NonTestable_Part_002` with Testable = false.

**Test Steps:**
1. Navigate to Part Detail page for `Testable_Part_001`. Confirm **Tests** tab is present.
2. Navigate to Part Detail page for `NonTestable_Part_002`. Confirm **Tests** tab is absent.

**Expected Result:**
- Tests tab present for Testable part; absent for non-Testable part.

---

### TC_PART_ATTR_008

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Locked Part |
| **Test Case ID** | TC_PART_ATTR_008 |
| **Title** | Locked part cannot have its core fields edited |
| **Requirement Reference** | Section 17.1 |
| **Priority** | High |

**Preconditions:**
- A part `Locked_Part_001` exists with **Locked = true**.
- User has edit permissions.

**Test Steps:**
1. Navigate to Part Detail page for `Locked_Part_001`.
2. Attempt to edit the part's Name or Description.
3. Attempt to save changes.

**Expected Result:**
- The system prevents modification of core fields.
- An appropriate error or notification is shown (e.g., "This part is locked and cannot be modified").

---

### TC_PART_ATTR_009

| Field | Details |
|---|---|
| **Module / Feature** | Part Attributes / Locked BOM |
| **Test Case ID** | TC_PART_ATTR_009 |
| **Title** | Locked Assembly part's BOM cannot be modified |
| **Requirement Reference** | Section 17.1, 18 |
| **Priority** | High |

**Preconditions:**
- A part `Locked_Assembly_001` exists with Assembly = true and **Locked = true**.

**Test Steps:**
1. Navigate to Part Detail page for `Locked_Assembly_001`.
2. Click the **BOM** tab.
3. Attempt to add a new BOM item.

**Expected Result:**
- The system prevents BOM modification.
- The add BOM item control is disabled or an error is shown upon attempt.

---

## 6. Part Parameters & Units of Measure

---

### TC_PART_PARAM_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Add Parameter |
| **Test Case ID** | TC_PART_PARAM_001 |
| **Title** | Add a parameter to a part with a valid value |
| **Requirement Reference** | Section 6.1, 6.2 |
| **Priority** | High |

**Preconditions:**
- A part `Res_Param_Test` exists.
- A parameter template `Resistance` with unit `Ohms` exists.

**Test Steps:**
1. Navigate to Part Detail page for `Res_Param_Test`.
2. Click on the **Details/Parameters** tab.
3. Click "Add Parameter" or equivalent.
4. Select parameter template = `Resistance`.
5. Enter value = `10000`.
6. Click **"Submit"**.

**Expected Result:**
- The parameter `Resistance = 10000 Ohms` is added to the part.
- It is visible in the Parameters section.

---

### TC_PART_PARAM_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Unit Conversion |
| **Test Case ID** | TC_PART_PARAM_002 |
| **Title** | Parameter value entered with compatible unit shorthand is accepted and converted |
| **Requirement Reference** | Section 6.3 |
| **Priority** | High |

**Preconditions:**
- A part `Res_Conversion_Test` exists.
- A parameter template `Resistance` with unit `Ohms` exists.

**Test Steps:**
1. Navigate to Part Detail page for `Res_Conversion_Test`.
2. Add a parameter: Template = `Resistance`, Value = `10k`.
3. Submit.

**Expected Result:**
- The value `10k` is accepted and interpreted/stored as `10000 Ohms`.
- The parameter is displayed correctly (e.g., `10k Ohms` or `10000 Ohms`).

---

### TC_PART_PARAM_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Unit Incompatibility |
| **Test Case ID** | TC_PART_PARAM_003 |
| **Title** | Parameter value with incompatible units is rejected |
| **Requirement Reference** | Section 6.3 |
| **Priority** | High |

**Preconditions:**
- A part `Cap_UnitTest` exists.
- A parameter template `Resistance` with unit `Ohms` exists.
- Global setting for unit validation is **enabled** (default).

**Test Steps:**
1. Navigate to Part Detail page for `Cap_UnitTest`.
2. Add a parameter: Template = `Resistance`, Value = `100mF` (millifarads — incompatible with Ohms).
3. Click **"Submit"**.

**Expected Result:**
- The system **rejects** the parameter value.
- An error is displayed indicating incompatible units.
- No parameter is saved.

---

### TC_PART_PARAM_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Selection List |
| **Test Case ID** | TC_PART_PARAM_004 |
| **Title** | Selection-type parameter only accepts values from the defined choices list |
| **Requirement Reference** | Section 6.2 |
| **Priority** | High |

**Preconditions:**
- A parameter template `Package_Type` exists with a fixed choices list: `DIP`, `SOIC`, `QFP`.
- A part `IC_PkgTest` exists.

**Test Steps:**
1. Navigate to Part Detail page for `IC_PkgTest`.
2. Add parameter: Template = `Package_Type`.
3. Observe the value input — confirm it is a dropdown/selection.
4. Select `SOIC`.
5. Submit.

**Expected Result:**
- Only the defined choices (`DIP`, `SOIC`, `QFP`) are available for selection.
- The value `SOIC` is saved successfully.

---

### TC_PART_PARAM_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Parametric Filtering — Numeric |
| **Test Case ID** | TC_PART_PARAM_005 |
| **Title** | Filter parametric parts table by a numeric parameter with "greater than" operator |
| **Requirement Reference** | Section 6.5, 6.6 |
| **Priority** | High |

**Preconditions:**
- Parts with `Resistance` parameter: `Res_10R` = 10, `Res_1K` = 1000, `Res_10K` = 10000.
- All parts are in the same category with the parametric table visible.

**Test Steps:**
1. Navigate to the parametric parts table view for the category containing the resistors.
2. On the `Resistance` column, click the filter button.
3. Select operator = `>` and enter value = `500`.
4. Apply the filter.

**Expected Result:**
- Only `Res_1K` (1000) and `Res_10K` (10000) are displayed.
- `Res_10R` (10) is filtered out.

---

### TC_PART_PARAM_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Parametric Filtering — Combined |
| **Test Case ID** | TC_PART_PARAM_006 |
| **Title** | Apply multiple parameter filters simultaneously |
| **Requirement Reference** | Section 6.5 |
| **Priority** | High |

**Preconditions:**
- Parts: `Res_1K_0.25W` (Resistance=1000, Power=0.25), `Res_1K_1W` (Resistance=1000, Power=1), `Res_10K_0.25W` (Resistance=10000, Power=0.25).

**Test Steps:**
1. Navigate to parametric parts table.
2. Filter `Resistance` = `1000` (equal).
3. Also filter `Power Rating` = `< 0.5`.

**Expected Result:**
- Only `Res_1K_0.25W` is displayed (matches both filters).

---

### TC_PART_PARAM_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Parametric Filtering — Same Parameter Multiple |
| **Test Case ID** | TC_PART_PARAM_007 |
| **Title** | Apply two filters on the same numeric parameter (range filter) |
| **Requirement Reference** | Section 6.5 |
| **Priority** | Medium |

**Preconditions:**
- Parts: `Res_100R`, `Res_1K`, `Res_10K`, `Res_100K` with corresponding Resistance values.

**Test Steps:**
1. Navigate to parametric parts table.
2. Add filter: `Resistance` `>` `500`.
3. Add another filter: `Resistance` `<` `5000`.

**Expected Result:**
- Only `Res_1K` is shown (> 500 AND < 5000).
- `Res_100R` (too low) and `Res_10K`, `Res_100K` (too high) are filtered out.

---

### TC_PART_PARAM_008

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Remove Filter |
| **Test Case ID** | TC_PART_PARAM_008 |
| **Title** | Removing a parameter filter restores the full parts list |
| **Requirement Reference** | Section 6.5 |
| **Priority** | Medium |

**Preconditions:**
- A filter is currently applied on the parametric parts table (see TC_PART_PARAM_005 as setup).

**Test Steps:**
1. With a filter active on `Resistance` `>` `500`, confirm filtered results show 2 parts.
2. Click the filter removal button for the `Resistance` filter.

**Expected Result:**
- All 3 resistor parts are shown again (`Res_10R`, `Res_1K`, `Res_10K`).

---

### TC_PART_PARAM_009

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Filter Active Indicator |
| **Test Case ID** | TC_PART_PARAM_009 |
| **Title** | Active filter on a parameter column is visually indicated |
| **Requirement Reference** | Section 6.5 |
| **Priority** | Low |

**Preconditions:**
- Parametric parts table is visible with a `Resistance` column.

**Test Steps:**
1. Apply a filter on the `Resistance` column.
2. Observe the `Resistance` column header/filter button.

**Expected Result:**
- The `Resistance` column visually indicates an active filter (e.g., different color, icon, or label).

---

### TC_PART_PARAM_010

| Field | Details |
|---|---|
| **Module / Feature** | Part Parameters / Unit Validation Disabled |
| **Test Case ID** | TC_PART_PARAM_010 |
| **Title** | Incompatible parameter units are accepted when unit validation is disabled |
| **Requirement Reference** | Section 6.3 |
| **Priority** | Medium |

**Preconditions:**
- Global unit validation setting is **disabled**.
- A part `UnitVal_Off_Part` exists.
- A parameter template `Resistance` with unit `Ohms` exists.

**Test Steps:**
1. Navigate to Part Detail page for `UnitVal_Off_Part`.
2. Add parameter: Template = `Resistance`, Value = `100mF`.
3. Submit.

**Expected Result:**
- The value `100mF` is **accepted** without error (since validation is disabled).
- The parameter is saved successfully.

---

## 7. Part Templates & Variants

---

### TC_PART_VARIANT_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Templates & Variants / Create Variant |
| **Test Case ID** | TC_PART_VARIANT_001 |
| **Title** | Create a new variant from a Template part |
| **Requirement Reference** | Section 7.3 |
| **Priority** | High |

**Preconditions:**
- A part `Widget_Template` exists with **Template (is_template) = true**.
- User has "create" Part permission.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Template`.
2. Click the **"Variants"** tab.
3. Click **"New Variant"**.
4. In the Duplicate Part form, change Name = `Widget_Red_Variant` and add any distinguishing details.
5. Click **"Submit"**.

**Expected Result:**
- A new part `Widget_Red_Variant` is created.
- `Widget_Red_Variant` is linked to `Widget_Template` as a variant.
- The `Widget_Template` Variants tab now lists `Widget_Red_Variant`.

---

### TC_PART_VARIANT_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Templates & Variants / Stock Count |
| **Test Case ID** | TC_PART_VARIANT_002 |
| **Title** | Template part stock count includes stock from all variants |
| **Requirement Reference** | Section 7.2 |
| **Priority** | High |

**Preconditions:**
- `Widget_Template` (template part) with variants: `Widget_Red` (stock = 10), `Widget_Blue` (stock = 5).
- `Widget_Template` itself has no direct stock.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Template`.
2. Observe the stock count displayed (e.g., in header or Stock tab).

**Expected Result:**
- The total stock for `Widget_Template` shows **15** (10 + 5, aggregated from all variants).

---

### TC_PART_VARIANT_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Templates & Variants / Serial Number Uniqueness |
| **Test Case ID** | TC_PART_VARIANT_003 |
| **Title** | Serial numbers must be unique across template and all variants |
| **Requirement Reference** | Section 7.2, 10 |
| **Priority** | High |

**Preconditions:**
- `Widget_Template` (template, Trackable = true) and variant `Widget_Red` (Trackable = true).
- Stock item of `Widget_Red` has serial number `SN-001`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Template`.
2. Click **Stock** tab > **"Create New Stock Item"**.
3. Enter serial number = `SN-001` (duplicate of existing serial across the template family).
4. Submit.

**Expected Result:**
- The system rejects the duplicate serial number.
- An error is shown indicating `SN-001` is already in use within this template/variant family.

---

### TC_PART_VARIANT_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Templates & Variants / BOM Inheritance |
| **Test Case ID** | TC_PART_VARIANT_004 |
| **Title** | Inherited BOM items appear in variant's BOM |
| **Requirement Reference** | Section 7.4, 18.6 |
| **Priority** | High |

**Preconditions:**
- `Widget_Template` (Assembly = true, Template = true) has a BOM item `Screw_M2` with **Inherited = true**.
- `Widget_Red` is a variant of `Widget_Template`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Red`.
2. Click the **BOM** tab.
3. Observe BOM items.

**Expected Result:**
- `Screw_M2` appears in `Widget_Red`'s BOM (inherited from the template).

---

### TC_PART_VARIANT_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Templates & Variants / Non-Inherited BOM |
| **Test Case ID** | TC_PART_VARIANT_005 |
| **Title** | Non-inherited BOM items do NOT appear in variant's BOM |
| **Requirement Reference** | Section 7.4, 18.6 |
| **Priority** | Medium |

**Preconditions:**
- `Widget_Template` has a BOM item `Special_Component` with **Inherited = false**.
- `Widget_Blue` is a variant.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Blue`.
2. Click the **BOM** tab.

**Expected Result:**
- `Special_Component` does **NOT** appear in `Widget_Blue`'s BOM.

---

### TC_PART_VARIANT_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Templates & Variants / Variants Tab Listing |
| **Test Case ID** | TC_PART_VARIANT_006 |
| **Title** | Template part's Variants tab lists all variants |
| **Requirement Reference** | Section 5.14, 7.3 |
| **Priority** | Medium |

**Preconditions:**
- `Widget_Template` has variants: `Widget_Red`, `Widget_Blue`, `Widget_Green`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Template`.
2. Click the **"Variants"** tab.

**Expected Result:**
- All three variants (`Widget_Red`, `Widget_Blue`, `Widget_Green`) are listed.

---

## 8. Part Revisions

---

### TC_PART_REVISION_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Revisions / Create Revision |
| **Test Case ID** | TC_PART_REVISION_001 |
| **Title** | Create a new revision from an existing part |
| **Requirement Reference** | Section 8.5 |
| **Priority** | High |

**Preconditions:**
- A part `PCB_Main_RevA` exists with Revision = `A`.
- Global setting **"Enable Revisions"** is ON.
- User has "create" Part permission.

**Test Steps:**
1. Navigate to Part Detail page for `PCB_Main_RevA`.
2. Click the **"Revisions"** tab.
3. Select **"Duplicate Part"** action.
4. In the form, change the **Revision** field to `B`.
5. Click **"Submit"**.

**Expected Result:**
- A new part `PCB_Main_RevB` (or similar) is created with Revision = `B`.
- The **"Revision Of"** field on the new part links back to `PCB_Main_RevA`.
- The browser redirects to the new revision's Part Detail page.

---

### TC_PART_REVISION_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Revisions / Data Preservation |
| **Test Case ID** | TC_PART_REVISION_002 |
| **Title** | Original part data is unaffected after creating a new revision |
| **Requirement Reference** | Section 8.1 |
| **Priority** | High |

**Preconditions:**
- `PCB_Main_RevA` has: stock items, Build Orders, Purchase Orders linked to it.
- A revision `PCB_Main_RevB` was created from it.

**Test Steps:**
1. Navigate to Part Detail page for `PCB_Main_RevA`.
2. Check the **Stock** tab — confirm original stock items still exist.
3. Check the **Build Orders** tab — confirm existing build orders are still linked to RevA.
4. Check the **Purchase Orders** tab — confirm existing purchase orders are still linked to RevA.

**Expected Result:**
- All stock items, build orders, and purchase orders remain linked to `PCB_Main_RevA` (the original).
- None of these are transferred to RevB.

---

### TC_PART_REVISION_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Revisions / Settings Enforcement |
| **Test Case ID** | TC_PART_REVISION_003 |
| **Title** | Revision feature is disabled when "Enable Revisions" setting is OFF |
| **Requirement Reference** | Section 8.4, 21 |
| **Priority** | High |

**Preconditions:**
- Global setting **"Enable Revisions"** is **disabled**.
- A part `TestPart_NoRev` exists.

**Test Steps:**
1. Navigate to Part Detail page for `TestPart_NoRev`.
2. Check for the **"Revisions"** tab.

**Expected Result:**
- The **Revisions** tab is NOT visible.
- The revision workflow is not accessible.

---

### TC_PART_REVISION_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Revisions / Assembly Revisions Only |
| **Test Case ID** | TC_PART_REVISION_004 |
| **Title** | When "Assembly Revisions Only" is ON, only Assembly parts can have revisions |
| **Requirement Reference** | Section 8.4, 21 |
| **Priority** | High |

**Preconditions:**
- Global setting **"Enable Revisions"** = ON.
- Global setting **"Assembly Revisions Only"** = ON.
- `Assembly_Part_Rev` exists with Assembly = true.
- `NonAssembly_Part_Rev` exists with Assembly = false.

**Test Steps:**
1. Navigate to Part Detail page for `Assembly_Part_Rev`. Check for **Revisions** tab.
2. Navigate to Part Detail page for `NonAssembly_Part_Rev`. Check for **Revisions** tab.

**Expected Result:**
- **Revisions** tab is visible for `Assembly_Part_Rev`.
- **Revisions** tab is **NOT visible** for `NonAssembly_Part_Rev`.

---

### TC_PART_REVISION_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Revisions / Revision Field Validation |
| **Test Case ID** | TC_PART_REVISION_005 |
| **Title** | Revision code can be any user-defined string |
| **Requirement Reference** | Section 8.2 |
| **Priority** | Medium |

**Preconditions:**
- A part `Flex_Rev_Part` exists.
- "Enable Revisions" = ON.

**Test Steps:**
1. Navigate to Part Detail page for `Flex_Rev_Part`.
2. Click the **"Revisions"** tab > **"Duplicate Part"**.
3. In the form, enter Revision = `Rev2.1-DRAFT`.
4. Submit.

**Expected Result:**
- The part revision is created with Revision code = `Rev2.1-DRAFT`.
- The "Revision Of" link correctly references `Flex_Rev_Part`.

---

### TC_PART_REVISION_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Revisions / Template Constraint |
| **Test Case ID** | TC_PART_REVISION_006 |
| **Title** | Revision of a variant part must point to the same template |
| **Requirement Reference** | Section 8.3 |
| **Priority** | Medium |

**Preconditions:**
- `Widget_Template` is a template part.
- `Widget_Red` is a variant of `Widget_Template`.
- A revision `Widget_Red_RevB` is created from `Widget_Red`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Red_RevB`.
2. Check the template linkage (via API or UI if shown).

**Expected Result:**
- `Widget_Red_RevB` is linked to the same template `Widget_Template` as `Widget_Red`.

---

## 9. Virtual Parts

---

### TC_PART_VIRTUAL_001

| Field | Details |
|---|---|
| **Module / Feature** | Virtual Parts / Stock Restriction |
| **Test Case ID** | TC_PART_VIRTUAL_001 |
| **Title** | Stock items cannot be created for a Virtual part |
| **Requirement Reference** | Section 3.1, 9.2 |
| **Priority** | High |

**Preconditions:**
- A part `Labor_Cost_Part` exists with **Virtual = true**.

**Test Steps:**
1. Navigate to Part Detail page for `Labor_Cost_Part`.
2. Click the **Stock** tab.
3. Attempt to click **"Create New Stock Item"** (if the button is visible).

**Expected Result:**
- The stock creation UI is hidden OR the action is blocked.
- Stock-related UI elements are hidden for the virtual part.
- No stock item can be created for `Labor_Cost_Part`.

---

### TC_PART_VIRTUAL_002

| Field | Details |
|---|---|
| **Module / Feature** | Virtual Parts / BOM Inclusion |
| **Test Case ID** | TC_PART_VIRTUAL_002 |
| **Title** | Virtual part can be added as a BOM sub-component in an Assembly |
| **Requirement Reference** | Section 3.1, 9.2 |
| **Priority** | High |

**Preconditions:**
- A virtual part `Machine_Time` (Virtual = true).
- An assembly `Product_Assembly` (Assembly = true).
- User has BOM edit permissions.

**Test Steps:**
1. Navigate to Part Detail page for `Product_Assembly`.
2. Click the **BOM** tab.
3. Click "Add BOM Item".
4. Select Sub-component = `Machine_Time`.
5. Enter Quantity = `1`.
6. Submit.

**Expected Result:**
- `Machine_Time` is added to the BOM of `Product_Assembly`.
- The BOM line for `Machine_Time` is visible in the BOM tab.

---

### TC_PART_VIRTUAL_003

| Field | Details |
|---|---|
| **Module / Feature** | Virtual Parts / Build Order Hidden |
| **Test Case ID** | TC_PART_VIRTUAL_003 |
| **Title** | Virtual BOM items are hidden from Build Order required parts list |
| **Requirement Reference** | Section 3.1, 9.2 |
| **Priority** | High |

**Preconditions:**
- Assembly `Product_Assembly` has BOM items: `Resistor_100R` (real) and `Machine_Time` (virtual).
- A Build Order for `Product_Assembly` exists.

**Test Steps:**
1. Navigate to the Build Order for `Product_Assembly`.
2. View the **required parts** allocation list.

**Expected Result:**
- `Resistor_100R` appears in the required parts list.
- `Machine_Time` (virtual) does **NOT** appear in the required parts allocation list.

---

### TC_PART_VIRTUAL_004

| Field | Details |
|---|---|
| **Module / Feature** | Virtual Parts / Sales Order |
| **Test Case ID** | TC_PART_VIRTUAL_004 |
| **Title** | Virtual part can be added to a Sales Order |
| **Requirement Reference** | Section 3.1, 9.2 |
| **Priority** | Medium |

**Preconditions:**
- A virtual part `Software_License` (Virtual = true, Salable = true).
- A Sales Order exists.

**Test Steps:**
1. Navigate to the Sales Order.
2. Add a line item for `Software_License` with quantity = `1`.

**Expected Result:**
- `Software_License` is added to the Sales Order successfully.
- It is included in the order cost totals but is not allocated from stock.

---

## 10. Trackable Parts

---

### TC_PART_TRACK_001

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Serial Number Required |
| **Test Case ID** | TC_PART_TRACK_001 |
| **Title** | Creating a stock item for a Trackable part requires a serial or batch number |
| **Requirement Reference** | Section 3.6, 10.2 |
| **Priority** | High |

**Preconditions:**
- A part `Serial_Part_001` with **Trackable = true**.

**Test Steps:**
1. Navigate to Part Detail page for `Serial_Part_001`.
2. Click the **Stock** tab > **"Create New Stock Item"**.
3. Enter quantity = `1`.
4. Leave serial number AND batch number empty.
5. Click **"Submit"**.

**Expected Result:**
- The form does NOT submit.
- An error is displayed indicating a serial number or batch number is required.

---

### TC_PART_TRACK_002

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Single Serial Number |
| **Test Case ID** | TC_PART_TRACK_002 |
| **Title** | Create a stock item with a single serial number |
| **Requirement Reference** | Section 10.2, 10.3 |
| **Priority** | High |

**Preconditions:**
- A part `Serial_Part_001` with Trackable = true.

**Test Steps:**
1. Navigate to Part Detail page for `Serial_Part_001`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter serial number = `SN-100`.
4. Enter quantity = `1`.
5. Submit.

**Expected Result:**
- Stock item is created with serial number `SN-100`.
- The stock item appears in the Stock tab.

---

### TC_PART_TRACK_003

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Serial Range |
| **Test Case ID** | TC_PART_TRACK_003 |
| **Title** | Create multiple stock items using a serial number range |
| **Requirement Reference** | Section 10.3 |
| **Priority** | High |

**Preconditions:**
- A part `Track_Part_Range` with Trackable = true.
- No existing stock items.

**Test Steps:**
1. Navigate to Part Detail page for `Track_Part_Range`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter serial number input = `1-5` (range format).
4. Submit.

**Expected Result:**
- Five separate stock items are created with serial numbers `1`, `2`, `3`, `4`, `5`.

---

### TC_PART_TRACK_004

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Serial Comma-Separated |
| **Test Case ID** | TC_PART_TRACK_004 |
| **Title** | Create stock items using a comma-separated serial number list |
| **Requirement Reference** | Section 10.3 |
| **Priority** | Medium |

**Preconditions:**
- A part `Track_Part_CSV` with Trackable = true.

**Test Steps:**
1. Navigate to Part Detail page for `Track_Part_CSV`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter serial number = `10,20,30`.
4. Submit.

**Expected Result:**
- Three stock items are created with serial numbers `10`, `20`, `30`.

---

### TC_PART_TRACK_005

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Incremental from Last |
| **Test Case ID** | TC_PART_TRACK_005 |
| **Title** | Create stock items using the incremental from last serial format |
| **Requirement Reference** | Section 10.3 |
| **Priority** | Medium |

**Preconditions:**
- A part `Track_Part_Incr` with Trackable = true.
- Existing stock items with last serial number = `50`.

**Test Steps:**
1. Navigate to Part Detail page for `Track_Part_Incr`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter serial number = `<3>` (next 3 after the last).
4. Submit.

**Expected Result:**
- Three stock items are created with serial numbers `51`, `52`, `53`.

---

### TC_PART_TRACK_006

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Batch Number |
| **Test Case ID** | TC_PART_TRACK_006 |
| **Title** | Create a stock item for a Trackable part using a batch number |
| **Requirement Reference** | Section 3.6, 10.2 |
| **Priority** | High |

**Preconditions:**
- A part `Batch_Part_001` with Trackable = true.

**Test Steps:**
1. Navigate to Part Detail page for `Batch_Part_001`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter batch number = `BATCH-2024-A`.
4. Enter quantity = `100`.
5. Submit.

**Expected Result:**
- Stock item is created with batch number `BATCH-2024-A` and quantity `100`.

---

### TC_PART_TRACK_007

| Field | Details |
|---|---|
| **Module / Feature** | Trackable Parts / Build Order Allocation |
| **Test Case ID** | TC_PART_TRACK_007 |
| **Title** | Build Order for a Trackable part requires serial/batch number on output |
| **Requirement Reference** | Section 10.4 |
| **Priority** | High |

**Preconditions:**
- A part `Track_Assembly_001` with Trackable = true, Assembly = true.
- A Build Order for `Track_Assembly_001` exists.

**Test Steps:**
1. Navigate to the Build Order for `Track_Assembly_001`.
2. Attempt to complete/finish the build without assigning a serial or batch number to the output.

**Expected Result:**
- The system requires a serial or batch number to be assigned to the build output.
- Build completion is blocked until a serial/batch number is provided.

---

## 11. Part Pricing

---

### TC_PART_PRICE_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / Pricing Tab Visibility |
| **Test Case ID** | TC_PART_PRICE_001 |
| **Title** | Pricing tab is always visible on Part Detail page |
| **Requirement Reference** | Section 5.13, Appendix B |
| **Priority** | High |

**Preconditions:**
- Any part exists (basic part with no special flags).

**Test Steps:**
1. Navigate to Part Detail page.
2. Observe the available tabs.

**Expected Result:**
- **Pricing** tab is visible for all parts, regardless of type.

---

### TC_PART_PRICE_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / Internal Price Breaks |
| **Test Case ID** | TC_PART_PRICE_002 |
| **Title** | Add internal price breaks to a part |
| **Requirement Reference** | Section 11.3 |
| **Priority** | High |

**Preconditions:**
- A part `Price_Break_Part` exists.
- User has pricing edit permissions.

**Test Steps:**
1. Navigate to Part Detail page for `Price_Break_Part`.
2. Click the **Pricing** tab.
3. In the Internal Price Breaks section, add a price break:
   - Quantity = `1`, Price = `5.00`
4. Add another price break:
   - Quantity = `100`, Price = `4.00`
5. Save.

**Expected Result:**
- Both price breaks are saved and visible in the Internal Price Breaks section.
- The pricing shows: Qty 1 → $5.00, Qty 100 → $4.00.

---

### TC_PART_PRICE_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / Purchase History Source |
| **Test Case ID** | TC_PART_PRICE_003 |
| **Title** | Purchase history pricing section visible for Purchaseable parts with completed POs |
| **Requirement Reference** | Section 11.2 |
| **Priority** | Medium |

**Preconditions:**
- A part `Purchased_Part_P` with Purchaseable = true.
- At least one completed Purchase Order exists for `Purchased_Part_P` with a recorded purchase cost.

**Test Steps:**
1. Navigate to Part Detail page for `Purchased_Part_P`.
2. Click the **Pricing** tab.
3. Observe the pricing sections listed.

**Expected Result:**
- A **"Purchase History"** pricing section is displayed, showing historical purchase cost data.

---

### TC_PART_PRICE_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / BOM Pricing Source |
| **Test Case ID** | TC_PART_PRICE_004 |
| **Title** | BOM pricing section displayed for Assembly parts |
| **Requirement Reference** | Section 11.2 |
| **Priority** | Medium |

**Preconditions:**
- An assembly `BOM_Price_Assembly` with sub-components that have pricing defined.

**Test Steps:**
1. Navigate to Part Detail page for `BOM_Price_Assembly`.
2. Click the **Pricing** tab.

**Expected Result:**
- A **"BOM Pricing"** section is displayed, showing the calculated cost from sub-component prices.

---

### TC_PART_PRICE_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / Internal Price Override |
| **Test Case ID** | TC_PART_PRICE_005 |
| **Title** | Internal price overrides all other pricing when "Internal Price Override" is enabled |
| **Requirement Reference** | Section 11.3, 21 |
| **Priority** | High |

**Preconditions:**
- Global setting **"Internal Price Override"** is **enabled**.
- A part `Override_Price_Part` has:
  - Internal Price Break: Qty 1 = $3.00
  - Supplier Pricing: $5.00

**Test Steps:**
1. Navigate to Part Detail page for `Override_Price_Part`.
2. Click the **Pricing** tab.
3. Observe the "effective" or "overview" pricing.

**Expected Result:**
- The internal price ($3.00) is used as the effective price, overriding the supplier price ($5.00).

---

### TC_PART_PRICE_006

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / Manual Recalculation |
| **Test Case ID** | TC_PART_PRICE_006 |
| **Title** | Manual pricing recalculation via "Recalculate" button |
| **Requirement Reference** | Section 11.7 |
| **Priority** | Medium |

**Preconditions:**
- A part `Recalc_Part` exists with pricing data.
- Global setting "Auto Update Pricing" is either ON or OFF.

**Test Steps:**
1. Navigate to Part Detail page for `Recalc_Part`.
2. Click the **Pricing** tab.
3. Click the **"Recalculate"** button in the pricing overview.

**Expected Result:**
- Pricing data is recalculated and the overview is refreshed with updated values.

---

### TC_PART_PRICE_007

| Field | Details |
|---|---|
| **Module / Feature** | Part Pricing / Sale History Source |
| **Test Case ID** | TC_PART_PRICE_007 |
| **Title** | Sale history pricing section visible for Salable parts with completed SOs |
| **Requirement Reference** | Section 11.2 |
| **Priority** | Medium |

**Preconditions:**
- A part `Sold_Part_S` with Salable = true.
- At least one completed Sales Order with pricing data for `Sold_Part_S`.

**Test Steps:**
1. Navigate to Part Detail page for `Sold_Part_S`.
2. Click the **Pricing** tab.

**Expected Result:**
- A **"Sale History"** pricing section is displayed.

---

## 12. Part Test Templates

---

### TC_PART_TEST_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Test Templates / Add Test Template |
| **Test Case ID** | TC_PART_TEST_001 |
| **Title** | Add a test template to a Testable part |
| **Requirement Reference** | Section 12.4, 12.3 |
| **Priority** | High |

**Preconditions:**
- A part `Testable_Device_001` with **Testable = true**.

**Test Steps:**
1. Navigate to Part Detail page for `Testable_Device_001`.
2. Click the **"Tests"** tab.
3. Click "Add Test Template".
4. Fill in:
   - Name = `Continuity_Test`
   - Description = `Verify electrical continuity between Pin 1 and Pin 2`
   - Required = checked
   - Requires Value = unchecked
   - Requires Attachment = unchecked
5. Click **"Submit"**.

**Expected Result:**
- Test template `Continuity_Test` is added and listed in the Tests tab.
- It is marked as Required.

---

### TC_PART_TEST_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Test Templates / Required Fields |
| **Test Case ID** | TC_PART_TEST_002 |
| **Title** | Add a test template requiring a recorded value and attachment |
| **Requirement Reference** | Section 12.3 |
| **Priority** | High |

**Preconditions:**
- A part `Testable_Device_002` with Testable = true.

**Test Steps:**
1. Navigate to Part Detail page for `Testable_Device_002`.
2. Click **"Tests"** tab > "Add Test Template".
3. Fill in:
   - Name = `Voltage_Calibration_Test`
   - Description = `Measure and record output voltage`
   - Required = checked
   - Requires Value = checked
   - Requires Attachment = checked
4. Submit.

**Expected Result:**
- Test template `Voltage_Calibration_Test` is added with "Requires Value" and "Requires Attachment" both set to true.

---

### TC_PART_TEST_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Test Templates / Duplicate Name |
| **Test Case ID** | TC_PART_TEST_003 |
| **Title** | Test template with duplicate name for the same part is rejected |
| **Requirement Reference** | Section 12.3 |
| **Priority** | High |

**Preconditions:**
- A part `Testable_Device_001` with an existing test template named `Continuity_Test`.

**Test Steps:**
1. Navigate to Part Detail page for `Testable_Device_001`.
2. Click **"Tests"** tab > "Add Test Template".
3. Enter Name = `Continuity_Test` (duplicate).
4. Submit.

**Expected Result:**
- The system rejects the duplicate name.
- An error is displayed indicating the test template name must be unique for this part.

---

### TC_PART_TEST_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Test Templates / Cascade to Variants |
| **Test Case ID** | TC_PART_TEST_004 |
| **Title** | Test templates defined on a template part cascade to variant parts |
| **Requirement Reference** | Section 12.2 |
| **Priority** | High |

**Preconditions:**
- `Widget_Template` is a template part with Testable = true and test template `Continuity_Test` defined.
- `Widget_Red` is a variant of `Widget_Template`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Red`.
2. Click the **"Tests"** tab.
3. Observe the test templates listed.

**Expected Result:**
- `Continuity_Test` is visible in the Tests tab for `Widget_Red` (cascaded from the template).

---

### TC_PART_TEST_005

| Field | Details |
|---|---|
| **Module / Feature** | Part Test Templates / Edit and Delete |
| **Test Case ID** | TC_PART_TEST_005 |
| **Title** | Edit and delete a test template |
| **Requirement Reference** | Section 12.4 |
| **Priority** | Medium |

**Preconditions:**
- A part `Testable_Device_003` with test template `Old_Test` defined.

**Test Steps:**
1. Navigate to Part Detail page for `Testable_Device_003`.
2. Click **"Tests"** tab.
3. Edit `Old_Test`:
   - Change Description = `Updated description`.
   - Save.
4. Delete `Old_Test`.

**Expected Result:**
- After edit: `Old_Test` description is updated to `Updated description`.
- After delete: `Old_Test` no longer appears in the Tests tab.

---

## 13. Part Stock History (Stocktake)

---

### TC_PART_STOCKHIST_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Stock History / Tab Visibility |
| **Test Case ID** | TC_PART_STOCKHIST_001 |
| **Title** | Stock History tab visible when "Enable Stock History" user setting is ON |
| **Requirement Reference** | Section 13.4, Appendix B |
| **Priority** | High |

**Preconditions:**
- A part `Hist_Test_Part` exists.
- Logged-in user has **"Enable Stock History"** display setting = **enabled**.

**Test Steps:**
1. Navigate to Part Detail page for `Hist_Test_Part`.
2. Check for the **"Stock History"** tab.

**Expected Result:**
- **Stock History** tab is visible.

---

### TC_PART_STOCKHIST_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Stock History / Data Display |
| **Test Case ID** | TC_PART_STOCKHIST_002 |
| **Title** | Stock History tab displays chart and tabular data |
| **Requirement Reference** | Section 13.4 |
| **Priority** | High |

**Preconditions:**
- A part `Hist_Data_Part` with historical stocktake records exists.
- User has "Enable Stock History" = ON.

**Test Steps:**
1. Navigate to Part Detail page for `Hist_Data_Part`.
2. Click the **"Stock History"** tab.
3. Observe the content.

**Expected Result:**
- A **chart** of historical stock quantity and cost over time is displayed.
- A **table** of corresponding stocktake records is shown below/alongside the chart.

---

### TC_PART_STOCKHIST_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Stock History / Stocktake Record Fields |
| **Test Case ID** | TC_PART_STOCKHIST_003 |
| **Title** | Stocktake table displays correct fields per record |
| **Requirement Reference** | Section 13.2 |
| **Priority** | Medium |

**Preconditions:**
- `Hist_Data_Part` has at least one stocktake record.

**Test Steps:**
1. Navigate to Part Detail page for `Hist_Data_Part`.
2. Click **"Stock History"** tab.
3. Review the tabular stocktake records.

**Expected Result:**
- Each row shows: **Date**, **Stock Items** (count), **Stock Quantity** (total), **Cost Min/Max** (range).

---

## 14. Part Notifications

---

### TC_PART_NOTIFY_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Notifications / Subscribe to Part |
| **Test Case ID** | TC_PART_NOTIFY_001 |
| **Title** | User can subscribe to a part for notifications |
| **Requirement Reference** | Section 14.1 |
| **Priority** | Medium |

**Preconditions:**
- A user is logged in.
- A part `Notify_Test_Part` exists.

**Test Steps:**
1. Navigate to Part Detail page for `Notify_Test_Part`.
2. Locate the **subscribe/notification icon** on the Part detail page.
3. Click the **subscribe** icon.

**Expected Result:**
- The subscription icon changes state (e.g., filled/highlighted) to indicate the user is now subscribed.

---

### TC_PART_NOTIFY_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Notifications / Unsubscribe |
| **Test Case ID** | TC_PART_NOTIFY_002 |
| **Title** | User can unsubscribe from a part |
| **Requirement Reference** | Section 14.1 |
| **Priority** | Medium |

**Preconditions:**
- The logged-in user is already subscribed to `Notify_Test_Part`.

**Test Steps:**
1. Navigate to Part Detail page for `Notify_Test_Part`.
2. Click the **unsubscribe** icon (toggling subscription off).

**Expected Result:**
- The subscription icon reverts to the unsubscribed state.
- The user is no longer subscribed to notifications for `Notify_Test_Part`.

---

### TC_PART_NOTIFY_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Notifications / Low Stock |
| **Test Case ID** | TC_PART_NOTIFY_003 |
| **Title** | Low stock notification triggered when stock drops below Minimum Stock threshold |
| **Requirement Reference** | Section 14.4 |
| **Priority** | High |

**Preconditions:**
- A part `Low_Stock_Part` has **Minimum Stock = 50**.
- A user is subscribed to `Low_Stock_Part`.
- Current stock = `60`.

**Test Steps:**
1. Reduce stock for `Low_Stock_Part` to `40` (below minimum threshold).
2. Check the subscribed user's notification/email.

**Expected Result:**
- A **low stock notification** is generated and sent via email to the subscribed user.
- The notification indicates that `Low_Stock_Part` has dropped below the minimum stock level.

---

### TC_PART_NOTIFY_004

| Field | Details |
|---|---|
| **Module / Feature** | Part Notifications / Build Order Low Stock Check |
| **Test Case ID** | TC_PART_NOTIFY_004 |
| **Title** | Notification generated when required parts are low during Build Order creation |
| **Requirement Reference** | Section 14.5 |
| **Priority** | Medium |

**Preconditions:**
- A part `Required_Component` has Minimum Stock = 100 and current stock = 20.
- A user is subscribed to `Required_Component`.
- An assembly uses `Required_Component` in its BOM.

**Test Steps:**
1. Create a new Build Order for the assembly.

**Expected Result:**
- Upon Build Order creation, the system checks stock levels.
- A notification is generated for the subscribed user about the low stock of `Required_Component`.

---

## 15. Related Parts

---

### TC_PART_RELATED_001

| Field | Details |
|---|---|
| **Module / Feature** | Related Parts / Add Related Part |
| **Test Case ID** | TC_PART_RELATED_001 |
| **Title** | Add a related part to a part |
| **Requirement Reference** | Section 15.3 |
| **Priority** | Medium |

**Preconditions:**
- Global setting **"Enable Related Parts"** is **ON**.
- Parts `Transistor_NPN_001` and `Transistor_PNP_001` exist.

**Test Steps:**
1. Navigate to Part Detail page for `Transistor_NPN_001`.
2. Click the **"Related Parts"** section/tab.
3. Add related part = `Transistor_PNP_001`.
4. Save.

**Expected Result:**
- `Transistor_PNP_001` appears in the Related Parts list for `Transistor_NPN_001`.
- The relationship is bidirectional: `Transistor_NPN_001` also appears in the Related Parts of `Transistor_PNP_001`.

---

### TC_PART_RELATED_002

| Field | Details |
|---|---|
| **Module / Feature** | Related Parts / Enable Setting |
| **Test Case ID** | TC_PART_RELATED_002 |
| **Title** | Related Parts section hidden when "Enable Related Parts" setting is OFF |
| **Requirement Reference** | Section 15.2, 21 |
| **Priority** | Medium |

**Preconditions:**
- Global setting **"Enable Related Parts"** is **OFF**.

**Test Steps:**
1. Navigate to any Part Detail page.
2. Check for the **"Related Parts"** section or tab.

**Expected Result:**
- The **Related Parts** section/tab is NOT visible.

---

### TC_PART_RELATED_003

| Field | Details |
|---|---|
| **Module / Feature** | Related Parts / Bidirectional Relationship |
| **Test Case ID** | TC_PART_RELATED_003 |
| **Title** | Related part relationship is bidirectional |
| **Requirement Reference** | Section 15.1 |
| **Priority** | Medium |

**Preconditions:**
- `Part_A` and `Part_B` exist. `Part_B` has been added as a related part of `Part_A`.

**Test Steps:**
1. Navigate to Part Detail page for `Part_B`.
2. View the **Related Parts** section.

**Expected Result:**
- `Part_A` appears in the Related Parts list of `Part_B` (the relationship is bidirectional, not one-way).

---

## 16. Part Attachments

---

### TC_PART_ATTACH_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Attachments / Upload Attachment |
| **Test Case ID** | TC_PART_ATTACH_001 |
| **Title** | Upload a file attachment to a part |
| **Requirement Reference** | Section 16.3 |
| **Priority** | High |

**Preconditions:**
- A part `Attach_Test_Part` exists.
- A file `datasheet.pdf` is available locally.

**Test Steps:**
1. Navigate to Part Detail page for `Attach_Test_Part`.
2. Click the **"Attachments"** tab.
3. Click "Upload Attachment" or equivalent.
4. Select and upload `datasheet.pdf`.
5. Submit.

**Expected Result:**
- `datasheet.pdf` appears in the Attachments tab with a download link.

---

### TC_PART_ATTACH_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Attachments / Multiple Attachments |
| **Test Case ID** | TC_PART_ATTACH_002 |
| **Title** | Multiple attachments can be uploaded to a single part |
| **Requirement Reference** | Section 16.3 |
| **Priority** | Medium |

**Preconditions:**
- A part `Multi_Attach_Part` exists.
- Files `datasheet.pdf`, `schematic.png`, `compliance_cert.docx` are available.

**Test Steps:**
1. Navigate to Part Detail page for `Multi_Attach_Part`.
2. Click the **"Attachments"** tab.
3. Upload `datasheet.pdf`.
4. Upload `schematic.png`.
5. Upload `compliance_cert.docx`.

**Expected Result:**
- All three files appear in the Attachments tab with individual download links.

---

### TC_PART_ATTACH_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Attachments / Download Attachment |
| **Test Case ID** | TC_PART_ATTACH_003 |
| **Title** | Download an attachment from the Attachments tab |
| **Requirement Reference** | Section 16.2 |
| **Priority** | Medium |

**Preconditions:**
- A part `DL_Attach_Part` with an uploaded attachment `datasheet.pdf`.

**Test Steps:**
1. Navigate to Part Detail page for `DL_Attach_Part`.
2. Click the **"Attachments"** tab.
3. Click the download link for `datasheet.pdf`.

**Expected Result:**
- `datasheet.pdf` is downloaded to the user's local machine.
- The downloaded file is the same as the uploaded file (not corrupted).

---

## 17. Part Locking & Active/Inactive Status

---

### TC_PART_LOCK_001

| Field | Details |
|---|---|
| **Module / Feature** | Part Locking / Lock a Part |
| **Test Case ID** | TC_PART_LOCK_001 |
| **Title** | Lock a part to prevent modification |
| **Requirement Reference** | Section 17.1 |
| **Priority** | High |

**Preconditions:**
- A part `Active_Part_001` exists with **Locked = false**.
- User has edit permissions.

**Test Steps:**
1. Navigate to Part Detail page for `Active_Part_001`.
2. Edit the part to set **Locked = true**.
3. Save the change.
4. Attempt to edit the Name field of `Active_Part_001`.

**Expected Result:**
- The part is locked; its core fields cannot be edited.
- Edit controls are disabled or an error is shown.

---

### TC_PART_LOCK_002

| Field | Details |
|---|---|
| **Module / Feature** | Part Locking / Inactive Preservation |
| **Test Case ID** | TC_PART_LOCK_002 |
| **Title** | Marking a part as Inactive preserves all its historical data |
| **Requirement Reference** | Section 17.2 |
| **Priority** | High |

**Preconditions:**
- A part `Obsolete_Part_001` with stock items, purchase orders, and build orders.

**Test Steps:**
1. Navigate to Part Detail page for `Obsolete_Part_001`.
2. Edit the part to set **Active = false**.
3. Save.
4. Navigate back to the Part Detail page for `Obsolete_Part_001`.
5. Check Stock, Purchase Orders, and Build Orders tabs.

**Expected Result:**
- The part is marked as Inactive.
- All historical data (stock items, purchase orders, build orders) are still visible and intact.
- The part is NOT deleted from the database.

---

### TC_PART_LOCK_003

| Field | Details |
|---|---|
| **Module / Feature** | Part Active Status / Default |
| **Test Case ID** | TC_PART_LOCK_003 |
| **Title** | Confirm inactive parts are NOT recommended for use over active parts |
| **Requirement Reference** | Section 17.2 |
| **Priority** | Medium |

**Preconditions:**
- A part `Inactive_Part` with Active = false.

**Test Steps:**
1. Attempt to create a Purchase Order and add `Inactive_Part` as a line item.

**Expected Result:**
- The system either prevents adding `Inactive_Part` to a new Purchase Order or displays a warning indicating the part is inactive.

---

## 18. Bill of Materials (BOM)

---

### TC_PART_BOM_001

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Add BOM Item |
| **Test Case ID** | TC_PART_BOM_001 |
| **Title** | Add a BOM item to an Assembly part |
| **Requirement Reference** | Section 18.7, 18.2 |
| **Priority** | High |

**Preconditions:**
- A part `PCB_Build_001` with Assembly = true.
- A component part `Capacitor_100nF` exists.

**Test Steps:**
1. Navigate to Part Detail page for `PCB_Build_001`.
2. Click the **BOM** tab.
3. Click the add BOM item icon.
4. Select Sub-component = `Capacitor_100nF`.
5. Enter Quantity = `4`.
6. Enter Reference = `C1, C2, C3, C4`.
7. Leave other fields blank.
8. Click **"Submit"**.

**Expected Result:**
- BOM line item for `Capacitor_100nF`, Qty=4, Reference=`C1, C2, C3, C4` is added.
- The item appears in the BOM tab.

---

### TC_PART_BOM_002

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Required Fields |
| **Test Case ID** | TC_PART_BOM_002 |
| **Title** | BOM item requires Part and Quantity fields |
| **Requirement Reference** | Section 18.2 |
| **Priority** | High |

**Preconditions:**
- An assembly `PCB_Build_002` with Assembly = true.

**Test Steps:**
1. Navigate to Part Detail page for `PCB_Build_002`.
2. Click **BOM** tab > add BOM item.
3. Leave the **Part** field empty. Enter Quantity = `1`. Submit.

**Expected Result:**
- Form does not submit; error shown for missing Part field.

**Then:**
4. Enter Part = `Resistor_100R`. Leave **Quantity** empty. Submit.

**Expected Result:**
- Form does not submit; error shown for missing Quantity field.

---

### TC_PART_BOM_003

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Consumable BOM Item |
| **Test Case ID** | TC_PART_BOM_003 |
| **Title** | Consumable BOM item is not allocated in Build Orders |
| **Requirement Reference** | Section 18.3 |
| **Priority** | High |

**Preconditions:**
- An assembly `PCB_Build_003` with Assembly = true.
- BOM contains `Solder_Wire` with **Consumable = true** and `Resistor_100R` with Consumable = false.
- A Build Order for `PCB_Build_003` exists.

**Test Steps:**
1. Navigate to the Build Order for `PCB_Build_003`.
2. View the parts allocation table.

**Expected Result:**
- `Resistor_100R` appears in the allocation table (can be allocated).
- `Solder_Wire` does **NOT** appear in the allocation table (consumable — not allocated).

---

### TC_PART_BOM_004

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Substitute Parts |
| **Test Case ID** | TC_PART_BOM_004 |
| **Title** | Substitute parts included in BOM line availability calculation |
| **Requirement Reference** | Section 18.4 |
| **Priority** | High |

**Preconditions:**
- Assembly `Build_With_Sub` with Assembly = true.
- BOM item: `Resistor_10K_Primary` with substitute `Resistor_10K_Alt`.
- `Resistor_10K_Primary` has 0 stock. `Resistor_10K_Alt` has 20 stock.

**Test Steps:**
1. Navigate to Part Detail page for `Build_With_Sub`.
2. Click the **BOM** tab.
3. Observe the availability for the `Resistor_10K_Primary` BOM line.

**Expected Result:**
- The availability for the `Resistor_10K_Primary` BOM line includes stock from `Resistor_10K_Alt` (substitute).
- The total available shows 20 (from the substitute), not 0.

---

### TC_PART_BOM_005

| Field | Details |
|---|---|
| **Module / Feature** | BOM / BOM Overage Field |
| **Test Case ID** | TC_PART_BOM_005 |
| **Title** | BOM item with overage quantity is correctly recorded |
| **Requirement Reference** | Section 18.2 |
| **Priority** | Medium |

**Preconditions:**
- An assembly `Build_Overage` with Assembly = true.

**Test Steps:**
1. Navigate to Part Detail page for `Build_Overage`.
2. Click **BOM** tab > add BOM item.
3. Select Part = `Small_Screw_M2`, Quantity = `4`, Overage = `10%`.
4. Submit.

**Expected Result:**
- BOM item `Small_Screw_M2` is added with Quantity=4 and Overage=10%.
- The overage is visible in the BOM line item.

---

### TC_PART_BOM_006

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Sub-assembly Loading |
| **Test Case ID** | TC_PART_BOM_006 |
| **Title** | Sub-assembly BOMs are not loaded by default but can be expanded |
| **Requirement Reference** | Section 18.5 |
| **Priority** | Medium |

**Preconditions:**
- Assembly `Top_Assembly` has BOM item `Sub_Assembly_A` (which is itself an Assembly with its own BOM).

**Test Steps:**
1. Navigate to Part Detail page for `Top_Assembly`.
2. Click the **BOM** tab.
3. Observe the `Sub_Assembly_A` row — confirm its sub-BOM is NOT automatically expanded.
4. Click the expand icon on the `Sub_Assembly_A` row.

**Expected Result:**
- Initially, `Sub_Assembly_A`'s BOM items are NOT shown.
- After clicking the expand icon, `Sub_Assembly_A`'s BOM items are displayed inline.

---

### TC_PART_BOM_007

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Inherited BOM Items |
| **Test Case ID** | TC_PART_BOM_007 |
| **Title** | BOM items marked Inherited flow to variant parts |
| **Requirement Reference** | Section 18.6 |
| **Priority** | High |

**Preconditions:**
- `Widget_Template` (Template = true, Assembly = true) has BOM item `Common_Part` with **Inherited = true**.
- `Widget_Variant` is a variant of `Widget_Template`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Variant`.
2. Click the **BOM** tab.

**Expected Result:**
- `Common_Part` is listed in `Widget_Variant`'s BOM (inherited).

---

### TC_PART_BOM_008

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Export |
| **Test Case ID** | TC_PART_BOM_008 |
| **Title** | Export BOM data from an Assembly part |
| **Requirement Reference** | Section 18.8 |
| **Priority** | Medium |

**Preconditions:**
- Assembly `Export_BOM_Part` with Assembly = true and multiple BOM items.

**Test Steps:**
1. Navigate to Part Detail page for `Export_BOM_Part`.
2. Click the **BOM** tab.
3. Click the **"Export BOM"** option.

**Expected Result:**
- A file is downloaded containing all BOM data for `Export_BOM_Part`.
- The file includes all BOM line items with their quantities and references.

---

### TC_PART_BOM_009

| Field | Details |
|---|---|
| **Module / Feature** | BOM / Import |
| **Test Case ID** | TC_PART_BOM_009 |
| **Title** | Import BOM data from a file |
| **Requirement Reference** | Section 18.8 |
| **Priority** | Medium |

**Preconditions:**
- Assembly `Import_BOM_Part` with Assembly = true and no BOM items.
- A valid BOM file `bom_data.csv` with columns: `part_name`, `quantity`, `reference`.

**Test Steps:**
1. Navigate to Part Detail page for `Import_BOM_Part`.
2. Click the **BOM** tab.
3. Click "Upload BOM" or equivalent import option.
4. Upload `bom_data.csv`.
5. Map fields and submit.

**Expected Result:**
- BOM items from `bom_data.csv` are created for `Import_BOM_Part`.
- The BOM tab shows the imported items with correct quantities.

---

## 19. Supplier & Manufacturer Integration

---

### TC_PART_SUPPLIER_001

| Field | Details |
|---|---|
| **Module / Feature** | Supplier Integration / Suppliers Tab |
| **Test Case ID** | TC_PART_SUPPLIER_001 |
| **Title** | Suppliers tab displays linked Supplier Parts and Manufacturer Parts |
| **Requirement Reference** | Section 19.1 |
| **Priority** | High |

**Preconditions:**
- A part `Purchaseable_IC_001` with Purchaseable = true.
- A Supplier Part linked: Supplier = `Mouser`, SKU = `MOUSER-12345`.
- A Manufacturer Part linked: Manufacturer = `Texas Instruments`, MPN = `TI-IC-001`.

**Test Steps:**
1. Navigate to Part Detail page for `Purchaseable_IC_001`.
2. Click the **"Suppliers"** tab.

**Expected Result:**
- **Supplier Parts** section shows Mouser with SKU `MOUSER-12345`.
- **Manufacturer Parts** section shows Texas Instruments with MPN `TI-IC-001`.

---

### TC_PART_SUPPLIER_002

| Field | Details |
|---|---|
| **Module / Feature** | Supplier Integration / Pack Size |
| **Test Case ID** | TC_PART_SUPPLIER_002 |
| **Title** | Supplier part pack size correctly affects stock received quantity |
| **Requirement Reference** | Section 19.3 |
| **Priority** | High |

**Preconditions:**
- A part `Tape_Reel_Cap` with Purchaseable = true.
- Supplier Part linked with **Pack Size = 1000**.
- A Purchase Order line for `Tape_Reel_Cap`, Quantity = 2 (packs).

**Test Steps:**
1. Receive the Purchase Order for `Tape_Reel_Cap` (Qty=2 packs).
2. Navigate to Part Detail page for `Tape_Reel_Cap`.
3. Click the **Stock** tab.

**Expected Result:**
- Stock is received as **2000 individual parts** (2 packs × 1000 per pack).

---

### TC_PART_SUPPLIER_003

| Field | Details |
|---|---|
| **Module / Feature** | Supplier Integration / Disable Supplier Part |
| **Test Case ID** | TC_PART_SUPPLIER_003 |
| **Title** | Disabling a supplier part prevents it from appearing in new Purchase Orders |
| **Requirement Reference** | Section 19.4 |
| **Priority** | High |

**Preconditions:**
- A part `End_Of_Life_Part` with a Supplier Part linked.
- The Supplier Part is **set to inactive/disabled**.

**Test Steps:**
1. Create a new Purchase Order.
2. Attempt to add `End_Of_Life_Part` as a line item using the disabled supplier part.

**Expected Result:**
- The disabled supplier part does **NOT appear** in the supplier part selection list for new Purchase Orders.
- The existing Purchase Orders referencing this supplier part remain unaffected.

---

### TC_PART_SUPPLIER_004

| Field | Details |
|---|---|
| **Module / Feature** | Supplier Integration / Manufacturer Part Permission |
| **Test Case ID** | TC_PART_SUPPLIER_004 |
| **Title** | Creating Manufacturer Parts requires Purchase Orders user permissions |
| **Requirement Reference** | Section 19.5, 22.2 |
| **Priority** | High |

**Preconditions:**
- A user `no_po_user` exists WITHOUT Purchase Orders user permissions.
- A part `Mfg_Part_Test` with Purchaseable = true.

**Test Steps:**
1. Log in as `no_po_user`.
2. Navigate to Part Detail page for `Mfg_Part_Test`.
3. Click the **Suppliers** tab.
4. Attempt to add a new Manufacturer Part.

**Expected Result:**
- The option to add a Manufacturer Part is **not available** or is blocked with an appropriate error.

---

### TC_PART_SUPPLIER_005

| Field | Details |
|---|---|
| **Module / Feature** | Supplier Integration / Supplier Price Breaks |
| **Test Case ID** | TC_PART_SUPPLIER_005 |
| **Title** | Supplier part price breaks are visible in the Suppliers tab |
| **Requirement Reference** | Section 19.2 |
| **Priority** | Medium |

**Preconditions:**
- A part `Price_Break_IC` with Purchaseable = true.
- Supplier Part has price breaks: Qty 1 = $2.00, Qty 100 = $1.50, Qty 1000 = $1.00.

**Test Steps:**
1. Navigate to Part Detail page for `Price_Break_IC`.
2. Click **Suppliers** tab.
3. View the Supplier Part's price breaks.

**Expected Result:**
- Price breaks are listed: Qty 1 → $2.00, Qty 100 → $1.50, Qty 1000 → $1.00.

---

## 20. Permissions & Role-Based Access Control

---

### TC_PART_PERMISSION_001

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / Create Permission |
| **Test Case ID** | TC_PART_PERMISSION_001 |
| **Title** | User with "create" Part permission sees "Add Parts" menu |
| **Requirement Reference** | Section 4.1, 22.1 |
| **Priority** | High |

**Preconditions:**
- A user `creator_user` with "create" permission for the Part permission group.

**Test Steps:**
1. Log in as `creator_user`.
2. Navigate to the **Parts** section.
3. Observe the top area of the parts table.

**Expected Result:**
- The **"Add Parts"** dropdown is visible and accessible.

---

### TC_PART_PERMISSION_002

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / No Create Permission |
| **Test Case ID** | TC_PART_PERMISSION_002 |
| **Title** | User without "create" Part permission cannot see "Add Parts" menu |
| **Requirement Reference** | Section 4.1, 22.1 |
| **Priority** | High |

**Preconditions:**
- A user `viewer_user` with only "view" permission for Parts (no "create" permission).

**Test Steps:**
1. Log in as `viewer_user`.
2. Navigate to the **Parts** section.

**Expected Result:**
- The **"Add Parts"** dropdown is **NOT visible**.

---

### TC_PART_PERMISSION_003

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / Import — Staff Only |
| **Test Case ID** | TC_PART_PERMISSION_003 |
| **Title** | Non-staff users cannot access Part import from Part List |
| **Requirement Reference** | Section 20.1, 22.3 |
| **Priority** | High |

**Preconditions:**
- A non-staff user `regular_creator` has "create" Part permission but is not a staff member.
- "Part Import Enabled" setting is ON.

**Test Steps:**
1. Log in as `regular_creator`.
2. Navigate to the **Parts** section.
3. Click **"Add Parts"** dropdown.
4. Check for **"Import from File"** option.

**Expected Result:**
- **"Import from File"** option is NOT visible to `regular_creator`.

---

### TC_PART_PERMISSION_004

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / Admin Page Import |
| **Test Case ID** | TC_PART_PERMISSION_004 |
| **Title** | Non-admin staff cannot access Admin Page import |
| **Requirement Reference** | Section 20.1, 22.3 |
| **Priority** | High |

**Preconditions:**
- A staff (non-admin) user `staff_only_user`.

**Test Steps:**
1. Log in as `staff_only_user`.
2. Attempt to navigate to the **Admin Page** URL directly.

**Expected Result:**
- Access is denied. A 403 or redirect to login page is shown.

---

### TC_PART_PERMISSION_005

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / IPN Field — Non-Admin |
| **Test Case ID** | TC_PART_PERMISSION_005 |
| **Title** | Non-admin user cannot edit IPN field when "IPN Field Editable" is disabled |
| **Requirement Reference** | Section 21, 22.4 |
| **Priority** | High |

**Preconditions:**
- Global setting **"IPN Field Editable"** is **disabled**.
- A non-admin user `regular_user` has edit Part permissions.
- A part `IPN_Test_Part` with IPN = `IPN-ORIG-001` exists.

**Test Steps:**
1. Log in as `regular_user`.
2. Navigate to Part Detail page for `IPN_Test_Part`.
3. Attempt to edit the **IPN** field.

**Expected Result:**
- The IPN field is **read-only** / disabled for `regular_user`.
- `regular_user` cannot modify the IPN.

---

### TC_PART_PERMISSION_006

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / IPN Field — Admin |
| **Test Case ID** | TC_PART_PERMISSION_006 |
| **Title** | Admin user can edit IPN field even when "IPN Field Editable" is disabled |
| **Requirement Reference** | Section 21, 22.4 |
| **Priority** | High |

**Preconditions:**
- Global setting **"IPN Field Editable"** is **disabled**.
- An admin user `admin_user` is available.
- A part `IPN_Test_Part` with IPN = `IPN-ORIG-001`.

**Test Steps:**
1. Log in as `admin_user`.
2. Navigate to Part Detail page for `IPN_Test_Part`.
3. Edit the **IPN** field to `IPN-ADMIN-002`.
4. Save.

**Expected Result:**
- Admin user can successfully edit and save the new IPN = `IPN-ADMIN-002`.

---

### TC_PART_PERMISSION_007

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / Supplier Part — No PO Permission |
| **Test Case ID** | TC_PART_PERMISSION_007 |
| **Title** | User without Purchase Orders permission cannot view/add Supplier Parts |
| **Requirement Reference** | Section 22.2 |
| **Priority** | High |

**Preconditions:**
- A user `no_po_perm` without Purchase Orders permissions.
- A part `Purchaseable_Part_X` with Purchaseable = true.

**Test Steps:**
1. Log in as `no_po_perm`.
2. Navigate to Part Detail page for `Purchaseable_Part_X`.
3. Check if the **Suppliers** tab is visible and accessible.
4. Attempt to add a Supplier Part.

**Expected Result:**
- The Suppliers tab is either not visible or the add/edit actions are blocked.
- `no_po_perm` cannot add or view Supplier Parts.

---

### TC_PART_PERMISSION_008

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / View-Only User |
| **Test Case ID** | TC_PART_PERMISSION_008 |
| **Title** | View-only user can access Part Detail page but cannot edit |
| **Requirement Reference** | Section 22 |
| **Priority** | High |

**Preconditions:**
- A user `viewer_user` with only "view" permission for Parts.
- A part `ViewOnly_Part` exists.

**Test Steps:**
1. Log in as `viewer_user`.
2. Navigate to Part Detail page for `ViewOnly_Part`.
3. Observe the page.
4. Attempt to edit any field.

**Expected Result:**
- `viewer_user` can view the Part Detail page.
- Edit buttons and controls are either hidden or disabled.
- No changes can be saved.

---

### TC_PART_PERMISSION_009

| Field | Details |
|---|---|
| **Module / Feature** | RBAC / Direct URL Access |
| **Test Case ID** | TC_PART_PERMISSION_009 |
| **Title** | Unauthorized user cannot access restricted features via direct URL |
| **Requirement Reference** | Section 22 |
| **Priority** | High |

**Preconditions:**
- A user `no_access_user` with no Part permissions.
- The URL of a Part Detail page is known (e.g., `/part/123/`).

**Test Steps:**
1. Log in as `no_access_user`.
2. Navigate directly to the URL `/part/123/` by typing it in the browser address bar.

**Expected Result:**
- Access is denied (403 Forbidden or redirect to login/permission denied page).
- The Part Detail page is NOT rendered for `no_access_user`.

---

## 21. Negative & Boundary Scenarios

---

### TC_PART_NEG_001

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Duplicate IPN |
| **Test Case ID** | TC_PART_NEG_001 |
| **Title** | Cannot create two parts with the same IPN |
| **Requirement Reference** | Section 4.3, 23 |
| **Priority** | High |

**Preconditions:**
- A part already exists with IPN = `IPN-DUP-001`.
- User has "create" Part permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `Duplicate_IPN_Test`, Description = `Duplicate IPN test`.
3. Enter IPN = `IPN-DUP-001` (duplicate of existing).
4. Click **"Submit"**.

**Expected Result:**
- The form does NOT submit.
- An error is shown indicating that IPN `IPN-DUP-001` is already in use.

---

### TC_PART_NEG_002

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Virtual Part With Stock |
| **Test Case ID** | TC_PART_NEG_002 |
| **Title** | Stock item creation is blocked for Virtual parts |
| **Requirement Reference** | Section 3.1, 9.2 |
| **Priority** | High |

**Preconditions:**
- A virtual part `Virtual_Component` (Virtual = true).

**Test Steps:**
1. Navigate to Part Detail page for `Virtual_Component`.
2. Attempt to create a stock item (if the UI option is visible).

**Expected Result:**
- Stock creation is blocked. Stock-related UI elements are hidden OR the action is rejected.
- No stock item is created for `Virtual_Component`.

---

### TC_PART_NEG_003

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Trackable Without Serial/Batch |
| **Test Case ID** | TC_PART_NEG_003 |
| **Title** | Cannot create stock item for Trackable part without serial or batch number |
| **Requirement Reference** | Section 3.6, 10.2 |
| **Priority** | High |

**Preconditions:**
- A part `Trackable_Part_X` with Trackable = true.

**Test Steps:**
1. Navigate to Part Detail page for `Trackable_Part_X`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter quantity = `5`.
4. Leave both Serial Number and Batch Number fields empty.
5. Submit.

**Expected Result:**
- Form does NOT submit.
- Error: serial number or batch number is required for trackable parts.

---

### TC_PART_NEG_004

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Locked Part Edit |
| **Test Case ID** | TC_PART_NEG_004 |
| **Title** | Cannot edit a locked part's fields |
| **Requirement Reference** | Section 17.1 |
| **Priority** | High |

**Preconditions:**
- A part `Locked_Part_NEG` with Locked = true.

**Test Steps:**
1. Navigate to Part Detail page for `Locked_Part_NEG`.
2. Attempt to edit the Name field (change to `Modified_Name`).
3. Save.

**Expected Result:**
- Edit is blocked. An error message or UI restriction prevents saving.

---

### TC_PART_NEG_005

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Parameter Unit Incompatibility |
| **Test Case ID** | TC_PART_NEG_005 |
| **Title** | Parameter with incompatible units is rejected |
| **Requirement Reference** | Section 6.3 |
| **Priority** | High |

**Preconditions:**
- A parameter template `Voltage` with unit `Volts` exists.
- A part `UnitTest_Part` exists.
- Unit validation is enabled.

**Test Steps:**
1. Navigate to Part Detail page for `UnitTest_Part`.
2. Add parameter: Template = `Voltage`, Value = `100Hz`.
3. Submit.

**Expected Result:**
- System rejects the value. Error: unit `Hz` is incompatible with `Volts`.

---

### TC_PART_NEG_006

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Revision — Assembly Revisions Only Violation |
| **Test Case ID** | TC_PART_NEG_006 |
| **Title** | Non-Assembly part cannot have revisions when "Assembly Revisions Only" is ON |
| **Requirement Reference** | Section 8.4 |
| **Priority** | High |

**Preconditions:**
- Global settings: "Enable Revisions" = ON, "Assembly Revisions Only" = ON.
- A part `Regular_Part_NoAssembly` with Assembly = false.

**Test Steps:**
1. Navigate to Part Detail page for `Regular_Part_NoAssembly`.
2. Check for the **Revisions** tab.

**Expected Result:**
- The **Revisions** tab is NOT visible for `Regular_Part_NoAssembly`.

---

### TC_PART_NEG_007

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Missing Required Fields on Import |
| **Test Case ID** | TC_PART_NEG_007 |
| **Title** | Import wizard fails gracefully when required fields are missing |
| **Requirement Reference** | Section 4.6 |
| **Priority** | High |

**Preconditions:**
- A CSV file `import_missing_name.csv` with only a `description` column (no `name` column).
- User is a staff member.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Import from File"**.
2. Upload `import_missing_name.csv`.
3. In field mapping step, do not map any column to `name`.
4. Attempt to proceed.

**Expected Result:**
- Wizard displays an error or warning that the required `Name` field is not mapped.
- Import is NOT completed. No parts are created.

---

### TC_PART_NEG_008

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Invalid File Format Import |
| **Test Case ID** | TC_PART_NEG_008 |
| **Title** | Uploading an invalid file format in the import wizard shows an error |
| **Requirement Reference** | Section 4.6 |
| **Priority** | Medium |

**Preconditions:**
- User is a staff member.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Import from File"**.
2. Upload a file `parts_data.exe` (unsupported format).

**Expected Result:**
- The system rejects the file with an error indicating unsupported file format.
- Wizard does not advance.

---

### TC_PART_NEG_009

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Inactive Part |
| **Test Case ID** | TC_PART_NEG_009 |
| **Title** | Inactive part is restricted in system workflows |
| **Requirement Reference** | Section 17.2 |
| **Priority** | High |

**Preconditions:**
- A part `Inactive_IC_001` with Active = false.

**Test Steps:**
1. Attempt to create a Build Order that includes `Inactive_IC_001` as a BOM component.

**Expected Result:**
- The system either prevents adding `Inactive_IC_001` to new workflows or displays a clear warning that the part is inactive.

---

### TC_PART_NEG_010

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Non-Assembly BOM |
| **Test Case ID** | TC_PART_NEG_010 |
| **Title** | BOM tab not accessible for non-Assembly parts |
| **Requirement Reference** | Section 3.3, 5.6, Appendix B |
| **Priority** | High |

**Preconditions:**
- A part `Regular_Part_NoBOM` with Assembly = false.

**Test Steps:**
1. Navigate to Part Detail page for `Regular_Part_NoBOM`.
2. Look for a **BOM** tab.
3. Attempt to navigate directly to the BOM URL for this part (if known).

**Expected Result:**
- BOM tab is NOT visible.
- Direct URL access either redirects or returns an error, not the BOM view.

---

### TC_PART_NEG_011

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Revision When Disabled |
| **Test Case ID** | TC_PART_NEG_011 |
| **Title** | Revision creation is blocked when "Enable Revisions" is OFF |
| **Requirement Reference** | Section 8.4, 21 |
| **Priority** | High |

**Preconditions:**
- Global setting "Enable Revisions" = **disabled**.

**Test Steps:**
1. Navigate to Part Detail page for any part.
2. Confirm **Revisions** tab is absent.
3. Attempt to access revision URL directly (if known).

**Expected Result:**
- Revisions tab is absent.
- Direct URL access either redirects or returns an error/access denied response.

---

### TC_PART_NEG_012

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Minimum Stock Zero |
| **Test Case ID** | TC_PART_NEG_012 |
| **Title** | Minimum Stock field does not accept negative values |
| **Requirement Reference** | Section 4.3, 23 |
| **Priority** | Medium |

**Preconditions:**
- User has "create" Part permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `NegStock_Part`, Description = `Negative minimum stock test`.
3. Enter Minimum Stock = `-10`.
4. Click **"Submit"**.

**Expected Result:**
- Form does NOT submit with a negative Minimum Stock.
- An error is shown indicating the value must be zero or a positive number.

---

### TC_PART_NEG_013

| Field | Details |
|---|---|
| **Module / Feature** | Negative / BOM Circular Reference |
| **Test Case ID** | TC_PART_NEG_013 |
| **Title** | A part cannot be added as a BOM sub-component of itself |
| **Requirement Reference** | Section 18 |
| **Priority** | High |

**Preconditions:**
- An assembly `Self_Ref_Assembly` (Assembly = true).

**Test Steps:**
1. Navigate to Part Detail page for `Self_Ref_Assembly`.
2. Click **BOM** tab > add BOM item.
3. Select Sub-component = `Self_Ref_Assembly` (the part itself).
4. Enter Quantity = `1`.
5. Submit.

**Expected Result:**
- The system rejects the self-referential BOM item.
- An error is shown: a part cannot be a sub-component of itself.

---

### TC_PART_NEG_014

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Test Template Duplicate |
| **Test Case ID** | TC_PART_NEG_014 |
| **Title** | Test template with a duplicate name for the same part is blocked |
| **Requirement Reference** | Section 12.3 |
| **Priority** | High |

**Preconditions:**
- A Testable part `TestDup_Part` with existing test template `Burn_In_Test`.

**Test Steps:**
1. Navigate to Part Detail page for `TestDup_Part`.
2. Click **Tests** tab > "Add Test Template".
3. Enter Name = `Burn_In_Test` (duplicate).
4. Submit.

**Expected Result:**
- The system rejects the duplicate test template name.
- Error: test template name must be unique for this part.

---

### TC_PART_NEG_015

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Create Initial Stock on Virtual Part |
| **Test Case ID** | TC_PART_NEG_015 |
| **Title** | Initial stock cannot be created for a Virtual part even when global setting is enabled |
| **Requirement Reference** | Section 3.1, 4.4, 9.2 |
| **Priority** | High |

**Preconditions:**
- Global setting "Create Initial Stock" is **enabled**.
- User is creating a new part.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `Virtual_NoStock_001`, Description = `Virtual with stock attempt`.
3. Check the **Virtual** checkbox.
4. Check the **"Create Initial Stock"** checkbox.
5. Enter quantity = `10`.
6. Submit.

**Expected Result:**
- Either: the "Create Initial Stock" section is hidden/disabled when Virtual is checked, OR the part is created as virtual with no stock item (the stock creation request is silently ignored or an error is shown).
- No stock item is created for the virtual part.

---

### TC_PART_NEG_016

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Serial Number Duplicate in Variant Family |
| **Test Case ID** | TC_PART_NEG_016 |
| **Title** | Duplicate serial number across variant family is rejected |
| **Requirement Reference** | Section 7.2 |
| **Priority** | High |

**Preconditions:**
- `Widget_Template` (template, Trackable = true) and variants `Widget_Red`, `Widget_Blue`.
- `Widget_Red` has a stock item with serial number = `WGT-001`.

**Test Steps:**
1. Navigate to Part Detail page for `Widget_Blue`.
2. Click **Stock** > **"Create New Stock Item"**.
3. Enter serial number = `WGT-001` (already used by `Widget_Red`).
4. Submit.

**Expected Result:**
- System rejects the duplicate serial number across the variant family.
- Error: serial number `WGT-001` is already assigned within this template/variant family.

---

### TC_PART_NEG_017

| Field | Details |
|---|---|
| **Module / Feature** | Negative / Part Creation Without Description |
| **Test Case ID** | TC_PART_NEG_017 |
| **Title** | Part creation fails when Description field is left empty (if required) |
| **Requirement Reference** | Section 4.3 |
| **Priority** | High |

**Preconditions:**
- User has "create" Part permission.

**Test Steps:**
1. Navigate to **Parts** > **"Add Parts"** > **"Create Part"**.
2. Enter Name = `NoDesc_Part_001`.
3. Leave **Description** completely blank.
4. Click **"Submit"**.

**Expected Result:**
- Form does NOT submit.
- An inline validation error is displayed on the Description field.

---

### TC_PART_NEG_018

| Field | Details |
|---|---|
| **Module / Feature** | Negative / BOM on Non-Assembly (Via URL) |
| **Test Case ID** | TC_PART_NEG_018 |
| **Title** | Direct URL access to BOM of a non-Assembly part is blocked |
| **Requirement Reference** | Section 3.3, 5.6 |
| **Priority** | Medium |

**Preconditions:**
- A part `NonAssem_Part_99` with Assembly = false. Part ID = 99 (example).
- BOM URL format known.

**Test Steps:**
1. Navigate to the BOM URL for `NonAssem_Part_99` directly (e.g., `/part/99/bom/`).

**Expected Result:**
- The BOM page is NOT rendered.
- User is redirected, shown an error, or a 404/403 response is returned.

---

## Appendix: Tab Visibility Matrix Verification Summary

| Tab | Condition | Test Case(s) |
|---|---|---|
| Stock | Always visible | TC_PART_DETAIL_003 |
| Allocated | Component OR Salable | TC_PART_DETAIL_006 |
| BOM | Assembly = true | TC_PART_DETAIL_005, TC_PART_ATTR_001 |
| Build Orders | Assembly = true | TC_PART_DETAIL_007 |
| Used In | Component = true | TC_PART_DETAIL_008 |
| Suppliers | Purchaseable = true | TC_PART_DETAIL_009 |
| Purchase Orders | Purchaseable = true | TC_PART_DETAIL_009 |
| Sales Orders | Salable = true | TC_PART_DETAIL_010 |
| Tests | Testable = true | TC_PART_DETAIL_011 |
| Variants | Template = true | TC_PART_DETAIL_012 |
| Revisions | "Enable Revisions" ON | TC_PART_DETAIL_016 |
| Related Parts | "Enable Related Parts" ON | TC_PART_DETAIL_017 |
| Stock History | "Enable Stock History" ON (user setting) | TC_PART_DETAIL_013 |
| Pricing | Always visible | TC_PART_DETAIL_014 |
| Attachments | Always visible | TC_PART_DETAIL_014 |
| Notes | Always visible | TC_PART_DETAIL_014 |

---

*End of Manual UI Test Suite*  
*Total Test Cases: 107*  
*Coverage: Part Creation, Import, Detail View, Categories, Attributes, Parameters, Templates & Variants, Revisions, Virtual Parts, Trackable Parts, Pricing, Test Templates, Stock History, Notifications, Related Parts, Attachments, Locking, BOM, Supplier Integration, RBAC, Negative & Boundary Scenarios*
