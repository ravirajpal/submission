# Part Category Navigation Tests

## Application Overview

InvenTree Part Category UI tests. InvenTree is an open-source inventory management system. The Part Categories module organises parts into a hierarchical tree. This plan covers two low-complexity navigation tests: verifying that a category page lists its direct sub-categories and that clicking a part name navigates to the Part Detail View. Tests run against https://demo.inventree.org using the allaccess user (credentials: allaccess / nolimits).

## Test Scenarios

### 1. Part Category Navigation

**Seed:** `automation/ui/tests/seed.spec.ts`

#### 1.1. TC_PART_CAT_002 - Category page lists direct sub-categories

**File:** `automation/ui/tests/part-category-nav.spec.ts`

**Steps:**
  1. Navigate to the login page at the base URL /web/login/
    - expect: Login form is displayed with Username and Password fields and a Log In button
  2. Fill in Username with 'allaccess' and Password with 'nolimits', then click the Log In button
    - expect: Browser redirects to /web/home (Dashboard)
    - expect: Top navigation shows tabs: Dashboard, Parts, Stock, Manufacturing, Purchasing, Sales
  3. Click the Parts tab in the top navigation bar
    - expect: URL changes to /web/part/category/index/details
    - expect: Page heading shows 'Parts'
    - expect: Panel tabs visible: Category Details, Part Categories, Parts
  4. Click the Part Categories tab in the panel
    - expect: URL ends with /subcategories
    - expect: A table of top-level categories is displayed with 11 rows including Electronics, Mechanical, Furniture, Paint and others
  5. Click the name cell 'Electronics' in the categories table
    - expect: URL changes to /web/part/category/1/subcategories
    - expect: Page heading is 'Part Category' with description 'Electronic components and systems'
    - expect: Breadcrumb shows: Parts › Electronics
    - expect: The Subcategories tab is active and selected
  6. Observe the sub-categories table in the Subcategories tab panel
    - expect: Table contains exactly 6 rows
    - expect: Row 1: Name=Connectors, Description='Connectors, pin headers, etc', Path=Electronics/Connectors, Parts=57
    - expect: Row 2: Name=IC, Description='Integrated Circuits', Path=Electronics/IC, Parts=2
    - expect: Row 3: Name=PCB, Description='Printed circuit boards', Path=Electronics/PCB, Parts=2
    - expect: Row 4: Name=PCBA, Description='PCB assemblies', Path=Electronics/PCBA, Parts=7
    - expect: Row 5: Name=Passives, Description='Passive components', Path=Electronics/Passives, Parts=60
    - expect: Row 6: Name=Wire, Description='Electronic wire and cables', Path=Electronics/Wire, Parts=6
  7. Click the name cell 'Passives' in the sub-categories table
    - expect: URL changes to /web/part/category/4/subcategories
    - expect: Page description changes to 'Passive components'
    - expect: Breadcrumb shows: Parts › Electronics › Passives
    - expect: Subcategories tab is active on the Passives category page

#### 1.2. TC_PART_CAT_003 - Clicking a part name in category list navigates to Part Detail View

**File:** `automation/ui/tests/part-category-nav.spec.ts`

**Steps:**
  1. Navigate to the login page at the base URL /web/login/
    - expect: Login form is displayed with Username and Password fields and a Log In button
  2. Fill in Username with 'allaccess' and Password with 'nolimits', then click the Log In button
    - expect: Browser redirects to /web/home (Dashboard)
  3. Click the Parts tab in the top navigation bar
    - expect: URL contains /web/part/
    - expect: Panel tabs are visible including Part Categories
  4. Click the Part Categories tab in the panel
    - expect: URL ends with /subcategories
    - expect: Top-level categories table is shown
  5. Click the name cell 'Electronics' in the categories table
    - expect: URL changes to /web/part/category/1/subcategories
    - expect: Subcategories tab is active with 6 sub-category rows visible
  6. Click the name cell 'Passives' in the sub-categories table
    - expect: URL changes to /web/part/category/4/subcategories
    - expect: Breadcrumb shows: Parts › Electronics › Passives
  7. Click the Parts tab inside the Passives category panel
    - expect: URL changes to /web/part/category/4/parts
    - expect: A parts table is displayed
    - expect: First row shows part name 'C_100nF_0402' with description 'Ceramic capacitor, 100nF in 0402 SMD package'
  8. Click the part name / thumbnail cell for 'C_100nF_0402' in the parts table
    - expect: URL changes to /web/part/52/details
    - expect: Browser tab title is 'InvenTree Demo Server | Part: C_100nF_0402'
    - expect: Page heading shows 'Part: C_100nF_0402'
    - expect: Part description 'Ceramic capacitor, 100nF in 0402 SMD package' is visible
    - expect: Breadcrumb shows: Parts › Electronics › Passives › Capacitors
    - expect: Stock summary section is visible showing In Stock, Available, Allocated values
