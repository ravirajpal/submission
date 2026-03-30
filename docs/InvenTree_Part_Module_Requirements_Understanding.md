# InvenTree – Part Module: Requirements Understanding Document

**Document Type:** Functional Requirements Understanding (Pre-Test Case Generation)  
**Prepared By:** Senior QA Architect  
**Source:** https://docs.inventree.org/en/stable/part/ and all referenced sub-pages  
**Purpose:** To serve as the source of truth for generating functional UI test cases for the Part module of InvenTree.

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Part Categories](#2-part-categories)
3. [Part Attributes & Types](#3-part-attributes--types)
4. [Creating a Part](#4-creating-a-part)
5. [Part Detail View (Tabs & Panels)](#5-part-detail-view-tabs--panels)
6. [Part Parameters](#6-part-parameters)
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
19. [Supplier & Manufacturer Integration (from Part context)](#19-supplier--manufacturer-integration-from-part-context)
20. [Part Import / Export](#20-part-import--export)
21. [Global Part Settings](#21-global-part-settings)
22. [Permissions & Access Control](#22-permissions--access-control)
23. [Key Data Fields Reference](#23-key-data-fields-reference)

---

## 1. Module Overview

### 1.1 What is a Part?
- The **Part** is the **core element** of the InvenTree ecosystem.
- A Part object is the **archetype** (blueprint/template definition) of any stock item in the inventory.
- Parts define what something *is*, while **Stock Items** represent physical instances of that part.
- Every Part has a set of configurable attributes that govern how it behaves across the system (purchasing, building, selling, testing, etc.).

### 1.2 Navigation Entry Point
- Parts are accessible via the **Parts** section in the main navigation of the InvenTree UI.
- Parts are organized under **Part Categories**, which are hierarchical.

---

## 2. Part Categories

### 2.1 What are Part Categories?
- Part categories are **hierarchical containers** used to organize and filter parts by function.
- They are flexible and can be arranged to match any user requirement.
- Categories form a tree structure — a category can have **sub-categories**.

### 2.2 Category View Behavior
- Each part category page displays:
  - A **list of all parts** within that category AND all parts under descendant (child) sub-categories.
  - A **list of sub-categories** beneath the current category.
  - An **overview** of each part (name, stock quantity, etc.).
- The part list can be **filtered** using multiple user-configurable filters, useful when many parts exist.
- Clicking a **part name** in the category list navigates to the **Part Detail View**.

### 2.3 Category-Level Configuration
- **Default Location:** A default stock location can be set at the category level. Parts created in that category inherit this default location.
- **Default Keywords:** Default keywords can be assigned to a category. These are inherited by parts created within it.
- **Parameter Templates:** A list of parameter templates can be associated with a category. When a new part is created in this category (and the relevant setting is enabled), those parameters are automatically added to the new part.
- **Icon:** An optional icon can be set for a category.
- Categories have the following fields:
  - Name (required)
  - Description (optional)
  - Parent Category (nullable — top-level categories have no parent)
  - Default Location
  - Default Keywords
  - Icon

### 2.4 Subscribing to a Category
- Users can subscribe to a Part Category to receive notifications for events within that category.
- (See Section 14 – Part Notifications for details.)

---

## 3. Part Attributes & Types

Each Part has a set of boolean **type flags** that define its behavior. These flags are not mutually exclusive — a single part can be, for example, both an Assembly and Purchaseable.

### 3.1 Virtual
- A **Virtual** part represents a **non-physical item** that should still be tracked in the system.
- Examples: a process step, machine time, software license, labor cost.
- **Restrictions:**
  - Virtual parts **cannot have stock items** associated with them.
  - Stock-related UI elements are hidden when viewing a virtual part.
- **Behaviors:**
  - Virtual parts **can** be added as a sub-component in a Bill of Materials (BOM). This is useful for labor cost tracking.
  - During a Build Order, virtual BOM items are **hidden from the required parts list** (they do not need to be physically allocated).
  - Virtual parts **can** be added to Sales Orders (to represent services). They are not allocated from stock during fulfillment but are included in the order and cost calculations.

### 3.2 Template
- A **Template** part is one that can have **Variants** (child parts) underneath it.
- Template/variant relationship is different from category/part relationship — it is a direct parent-child linkage.
- See Section 7 – Part Templates & Variants.

### 3.3 Assembly
- If a part is designated as **Assembly**, it can be **created (built) from other component parts**.
- Example: A circuit board assembly built from multiple electronic components.
- An Assembly part has a **Bill of Materials (BOM)** listing all required sub-components.
- The **BOM tab** is only visible on Assembly parts.
- The **Build Orders tab** is visible on Assembly parts.

### 3.4 Component
- If a part is designated as a **Component**, it can be used as a **sub-component of an Assembly**.
- The **Used In tab** is only visible for Component parts.
- The **Allocated tab** is visible for Component parts (showing allocation to Build Orders).

### 3.5 Testable
- **Testable** parts can have **Test Templates** defined against them.
- Test results can be recorded against individual stock items (instances) of that part.
- The **Tests tab** is visible on Testable parts.
- See Section 12 – Part Test Templates.

### 3.6 Trackable
- **Trackable** parts can be assigned **Batch Numbers** or **Serial Numbers**.
- Serial numbers and batch numbers uniquely identify individual stock items.
- Any stock item for a trackable part **must** have either a batch or serial number.
- This applies to stock created manually or via Purchase Orders / Build Orders.
- See Section 10 – Trackable Parts.

### 3.7 Purchaseable
- If designated as **Purchaseable**, the part can be **procured from external suppliers**.
- Purchaseable parts can be linked to **Supplier Parts** and procured via **Purchase Orders**.
- The **Suppliers tab** is only visible for Purchaseable parts.
- The **Purchase Orders tab** is only visible for Purchaseable parts.

### 3.8 Salable
- If designated as **Salable**, the part can be **sold to external customers**.
- Salable parts can be added to **Sales Orders**.
- The **Allocated tab** is visible for Salable parts (showing allocation to Sales Orders).

---

## 4. Creating a Part

### 4.1 Navigation to Create
- Navigate to the **Parts** view in the UI.
- Click the **Add Parts** dropdown menu above the parts table.
- Options available: **Create Part** or **Import from File**.
- If the user does not have **"create" permission** for the Part permission group, the "Add Parts" menu will **not be available**.
- Parts can also be created from within a **Part Category view** using the **Import Part** button.

### 4.2 Manual Part Creation Form
- Selecting **"Create Part"** opens a part creation form.
- Required fields must be filled before the form can be submitted.
- Form errors are displayed inline and must be resolved before submission.
- On successful submission, the browser is **redirected to the new Part Detail Page**.

### 4.3 Core Part Form Fields
The following fields are available in the part creation form:

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | Text | Yes | Must be unique. Simple text label. |
| Description | Text | Yes (typically) | Longer-form description of the part. |
| Category | Dropdown | No | Assigns the part to a category. |
| IPN (Internal Part Number) | Text | No | Links part to a custom numbering system. Max 100 chars. |
| Revision | Text | No | Optional revision code for the part version. |
| Keywords | Text | No | Searchable keywords. |
| Link | URL | No | External URL for additional documentation. |
| Units | Text | No | Unit of measure (default: pcs / dimensionless). |
| Default Location | Dropdown | No | Default stock location. |
| Default Supplier | Dropdown | No | Default supplier for this part. |
| Minimum Stock | Number | No | Threshold for low-stock notifications. |
| Notes | Markdown | No | Free-form notes, supports markdown. |
| Image | Image Upload | No | Part image/thumbnail. |
| Active | Checkbox | No | Defaults to true (active). |
| Virtual | Checkbox | No | Marks as non-physical part. |
| Template | Checkbox | No | Marks as a template part for variants. |
| Assembly | Checkbox | No | Can be built from other parts. |
| Component | Checkbox | No | Can be used in BOMs of other assemblies. |
| Testable | Checkbox | No | Can have test templates defined. |
| Trackable | Checkbox | No | Requires serial/batch numbers on stock items. |
| Purchaseable | Checkbox | No | Can be purchased from suppliers. |
| Salable | Checkbox | No | Can be sold to customers. |
| Locked | Checkbox | No | Prevents modification after creation. |

### 4.4 Create Initial Stock (Conditional Section)
- If the global setting **"Create Initial Stock"** is enabled, an extra section appears in the part creation form.
- When the **"Create Initial Stock"** checkbox is checked in the form, the user can define an initial stock quantity for the new part.

### 4.5 Add Supplier Data (Conditional Section)
- If the part is marked as **Purchaseable**, additional fields appear in the form for manufacturer and/or supplier information.
- When the **"Add Supplier Data"** option is checked, both **Supplier Part** and **Manufacturer Part** information can be entered directly during part creation.

### 4.6 Importing Parts from a File
- Parts can be imported via the **"Import from File"** option.
- This launches a **multi-stage data import wizard**.
- The wizard guides the user through:
  1. Selecting the file.
  2. Confirming/mapping fields from the file to InvenTree part fields.
  3. Confirming the category.
  4. Selecting parameters.
  5. Creating initial stock (if applicable).
- Supported formats: various spreadsheet and table-data formats.
- This feature must be **enabled in Part Settings** for staff-member access from the part list view.
- Parts can also be imported via the **Admin Page** (admin users only), which requires a well-formatted file but is more performant.

### 4.7 Supplier Plugin Integration for Import
- InvenTree can integrate with external suppliers via plugins to auto-create parts, supplier parts, and manufacturer parts.
- To use this, a supplier plugin must be installed and configured via: **Admin Center > Plugins > [Supplier Plugin]**.
- Some plugins may require API tokens or additional settings.

### 4.8 Duplicating a Part
- A part can be duplicated (cloned) to create a new part based on an existing one.
- This is also used to create Variants and Revisions (see Sections 7 and 8).

---

## 5. Part Detail View (Tabs & Panels)

### 5.1 Overview
- The **Part Detail View** provides a complete view of a single part.
- The page is divided into a **header/details panel** and multiple **tabs**.
- The part's **category breadcrumb** is displayed in the top navigation bar.
- The **"Show Part Details"** toggle in the header panel shows/hides the core part information summary.

### 5.2 Header Panel — Core Fields Displayed
- Name (unique text label)
- IPN (Internal Part Number)
- Description
- Revision
- External Link (URL to external documentation)
- Creation Date & Creator User
- Units (Unit of Measure; default is `pcs`)
- Category path

### 5.3 Tab: Details / Parameters
- Displays all **Part Parameters** defined for this part.
- If the part is a Template Part, the **Variants tab** is also visible.
- See Section 6 – Part Parameters.

### 5.4 Tab: Stock
- Shows **all stock items** for this part.
- Displays: quantity per item, location, status.
- Available actions from this tab:
  - **Export Stocktake Data** — downloads a file with all stock item data for this part.
  - **Create New Stock Item** — launches a dialog to add a new stock item.
  - When stock items are selected in the table, **bulk stock actions** are enabled (via dropdown).

### 5.5 Tab: Allocated
- Displays how many units of this part have been **allocated** to:
  - Pending **Build Orders** (if the part is a Component)
  - Pending **Sales Orders** (if the part is Salable)
- **Visibility:** Only visible if the Part is a Component OR Salable.

### 5.6 Tab: BOM (Bill of Materials)
- Displays the **Bill of Materials** — a list of sub-components needed to build this assembly.
- Each BOM row specifies: a sub-component Part and the required Quantity.
- **Visibility:** Only visible if the Part is an Assembly.
- See Section 18 – Bill of Materials.

### 5.7 Tab: Build Orders
- Lists all **Build Orders** for this assembly part.
- Displays: quantity, status, creation date, completion date.
- **Visibility:** Only visible for Assembly parts.

### 5.8 Tab: Used In
- Shows a list of **other parts (assemblies)** that use this part as a sub-component.
- **Visibility:** Only visible if the Part is a Component.

### 5.9 Tab: Suppliers
- Displays all **Supplier Parts** and **Manufacturer Parts** linked to this part.
- **Visibility:** Only visible if the Part is Purchaseable.

### 5.10 Tab: Purchase Orders
- Lists all **Purchase Orders** referencing this part.
- **Visibility:** Only visible if the Part is Purchaseable.

### 5.11 Tab: Sales Orders
- Lists all **Sales Orders** referencing this part.
- **Visibility:** Only visible if the Part is Salable.

### 5.12 Tab: Tests
- If the part is marked as **Testable**, this tab is visible.
- Allows definition and management of **Test Templates**.
- See Section 12 – Part Test Templates.

### 5.13 Tab: Pricing
- Displays all **pricing information** for the part.
- See Section 11 – Part Pricing.

### 5.14 Tab: Variants
- Displays all **variant parts** that exist under a Template Part.
- **Visibility:** Only visible if the Part is a Template Part.
- See Section 7 – Part Templates & Variants.

### 5.15 Tab: Revisions
- Displays all **revisions** of the part.
- Used to create new revisions.
- See Section 8 – Part Revisions.

### 5.16 Tab: Related Parts
- Displays other parts that have been designated as "related" to this part.
- See Section 15 – Related Parts.

### 5.17 Tab: Attachments
- Lists all **file attachments** associated with this part (e.g., datasheets, drawings).
- See Section 16 – Part Attachments.

### 5.18 Tab: Stock History
- Displays a **chart** of historical stock quantity and cost data.
- Also shows corresponding **tabulated data**.
- Visible only if the **"Enable Stock History"** user setting is enabled in Display Settings.
- See Section 13 – Part Stock History (Stocktake).

### 5.19 Tab: Notes
- A free-form notes field for the part.
- Supports **Markdown** formatting.

---

## 6. Part Parameters

### 6.1 Overview
- Parts can have multiple **defined parameters** (key-value metadata attributes).
- Parameters are based on **Parameter Templates**, which define the parameter name, units, and type.
- Parameter templates can be defined globally or associated with a part category.

### 6.2 Parameter Templates
- A **Parameter Template** defines:
  - **Name:** Unique name for the parameter type (e.g., "Resistance", "Capacitance").
  - **Units:** The base unit for the parameter (e.g., "Ohms", "Farads"). Defines what units values must be expressed in.
  - **Type/Choices:** A parameter can have a restricted set of choices (selection list) or accept free-form numeric/text values.
- Parameter templates are managed via the **Admin Center** or via the API.
- Plugins can lock selection lists to enforce a known valid state.

### 6.3 Unit Compatibility & Conversion
- If a parameter template has a **units field** defined, any parameter values created against it must be specified in **compatible units**.
- InvenTree has built-in **unit conversion** — values can be entered in different dimensions, as long as the dimension is compatible with the template's base unit.
  - Example: A resistance parameter in Ohms can accept "10k" and will interpret this as 10,000 Ohms.
- If a parameter value is created with **incompatible units**, it will be **rejected by the system**.
- This unit validation behavior can be **disabled** via a setting, allowing any parameter value to be accepted.

### 6.4 Category-Linked Parameter Templates
- In global settings, staff users can associate a list of parameter templates with a part category.
- When a new part is created in that category (and the relevant setting is enabled), those parameter templates are **automatically added** to the new part as empty parameters to be filled.

### 6.5 Parametric Parts Table
- The parametric parts table allows parts to be **filtered by specific parameter values**.
- Each parameter column has a filter button.
- Filter behavior depends on parameter type:
  - **Selection list parameters:** Filter by available choices.
  - **Numeric parameters:** Filter by value and operator (e.g., greater than, less than, equal to).
- **Multiple parameters** can be combined as filters — results show only parts matching ALL specified filters.
- **Multiple filters on the same parameter** are also supported (e.g., Resistance > 10k AND < 100k).
- Each parameter column visually indicates whether a filter is currently active.
- To remove a filter, click the button associated with that filter.

### 6.6 Available Filter Operators (for Numeric Parameters)
- Greater than (`>`)
- Less than (`<`)
- Equal to (`=`)
- Greater than or equal (`>=`)
- Less than or equal (`<=`)

---

## 7. Part Templates & Variants

### 7.1 Overview
- A **Template Part** is a part that acts as a parent for a set of **Variant parts**.
- Variants represent different configurations, options, or versions of the same base part.
- Use cases include:
  - **Manufacturing variants** — different options a customer can order (e.g., color, connector type, specs).
  - Different hardware revisions grouped under a common template.

### 7.2 Relationship Rules
- Variants **reference** their Template part, creating a visible direct relationship.
- **Serial Numbers:** Parts in a template/variant relationship must have **unique serial numbers across all variants and the template**. (E.g., if Widget is the template and Widget-01, Widget-02 are variants, serial numbers must be unique across all three.)
- **Stock Reporting:** The "stock" count for a template part **includes stock for all variants** under that template.
- **Logical Grouping:** The template/variant relationship is distinct from the category/part relationship. A variant part still belongs to a category, but it is additionally linked to its template.

### 7.3 Creating a Variant
- Navigate to a **specific part's detail page** (the template part).
- Click on the **"Variants" tab**.
- Click **"New Variant"** button.
- The **"Duplicate Part" form** is displayed.
- Modify the fields as needed (e.g., change the name to reflect the variant configuration).
- Submit to create the variant.

### 7.4 BOM Inheritance for Variants
- BOM Line Items can be marked as **Inherited**, causing them to be automatically included in the BOM of any variant (or sub-variant) of the template part.
- Non-inherited BOM items are only present in the template's own BOM, not passed down to variants.

---

## 8. Part Revisions

### 8.1 Overview
- Part revisions allow the tracking of **design changes over time** without overwriting existing data.
- Creating a new revision ensures that all existing related data (stock items, build orders, purchase orders, etc.) remain linked to the **original (previous) revision** and are unaffected.
- A revision is itself a fully independent Part — it has its own part number, stock items, parameters, BOM, etc.
- What differentiates a revision from a regular part is the **"Revision Of"** link back to the original.

### 8.2 Revision Fields
Each part has two revision-related fields:
- **Revision:** A user-defined string value representing the revision code/number (e.g., "A", "B", "Rev2").
- **Revision Of:** A reference (link) to the original part of which this part is a revision.

### 8.3 Template Constraint
- A revision of a variant part **must point to the same template** as the original part (to maintain correct template linkage in the variant hierarchy).

### 8.4 Settings Controlling Revision Behavior

| Setting | Description |
|---|---|
| Enable Revisions | If disabled, parts cannot have revisions. Default: enabled. |
| Assembly Revisions Only | If enabled, only Assembly parts can have revisions. Useful to restrict revision tracking to assemblies only. |

### 8.5 Creating a New Revision
- Navigate to the **Part Detail Page** of the part to be revised.
- Click on the **"Revisions" tab**.
- Select **"Duplicate Part"** action.
- The "Duplicate Part" form opens.
- Modify the **Revision** field (and any other necessary changes).
- Press **Submit**.
- On success, the browser redirects to the new part revision's detail page.

---

## 9. Virtual Parts

### 9.1 Overview
- Virtual parts represent **non-physical items** tracked in the system.
- Examples: process steps, machine time, software licenses, labor.

### 9.2 Behavior & Restrictions
| Behavior | Details |
|---|---|
| Stock items | **Cannot** be associated with virtual parts (they do not physically exist). |
| Stock UI elements | Hidden when viewing a virtual part. |
| BOM inclusion | **Can** be added as a sub-component in a BOM. |
| Build Order allocation | Virtual parts in a BOM are **hidden** from the required-parts list in Build Orders (no allocation needed). |
| Cost calculation | Still included in BOM cost calculations. |
| Sales Orders | **Can** be added to Sales Orders (to represent services/non-physical items). |
| Sales Order fulfillment | Not allocated from stock during fulfillment, but included in order totals. |

### 9.3 Creating Virtual Parts
- In the part creation form, check the **"Virtual"** checkbox.
- All other behavior is the same as creating a regular part.

---

## 10. Trackable Parts

### 10.1 Overview
- Marking a part as **Trackable** changes how stock items for that part are handled.
- Trackable parts impose **additional restrictions** on associated stock items.
- Use when simple stock level tracking is insufficient and individual item tracking is required.

### 10.2 Key Restriction
- Every stock item for a trackable part **must have either a Batch Number or a Serial Number**.
- This applies to stock created:
  - Manually
  - Via a Purchase Order
  - Via a Build Order

### 10.3 Serial Number Input Formats
InvenTree supports flexible serial number entry. Multiple formats can be combined using spaces or commas:

| Format | Example | Result |
|---|---|---|
| Single value | `5` | Serial number 5 |
| Range | `1-5` | Serial numbers 1, 2, 3, 4, 5 |
| Incremental from last | `<N>` | Next N serials after the last used |
| Comma-separated list | `1,3,7` | Serial numbers 1, 3, 7 |

### 10.4 Build Order Behavior for Trackable Parts
- Build Orders have **additional requirements** when:
  - Building a **trackable part** (the output must receive a serial/batch number).
  - Using **trackable sub-components** in the BOM (each sub-component stock item must be specifically allocated per build output).

---

## 11. Part Pricing

### 11.1 Overview
- The **Pricing tab** on a Part detail page consolidates all available pricing data.
- Pricing data is shown as a **range** (min/max) to account for variability.

### 11.2 Pricing Data Sources

| Source | Description | Condition |
|---|---|---|
| Internal Price Breaks | Quantity-based pricing set manually by the user. Independent of external pricing or BOM data. | Always available |
| Purchase History | Historical purchase cost from completed Purchase Orders. | Part is Purchaseable |
| Supplier Pricing | Pricing from linked supplier parts. | Part is Purchaseable and has supplier parts |
| BOM Pricing | Price of assembly calculated from the cost of all BOM sub-components. | Part is an Assembly |
| Sale History | Historical sale price data from completed Sales Orders. | Part is Salable |

### 11.3 Internal Price Breaks
- Users can set **quantity-based price breaks** (e.g., price per unit decreases at higher quantities).
- Internal pricing is entirely user-defined.
- If **"Internal Price Override"** setting is enabled, internal pricing **overrides all other pricing sources**.

### 11.4 Manual Price Overrides
- Both **minimum price** and **maximum price** can be specified manually, independent of any calculated values.
- Manual overrides take precedence over all calculated pricing.

### 11.5 Pricing Overview Section
- The top of the pricing tab shows a **synopsis (overview)** of all available pricing categories.
- Each pricing category is presented in its own section based on what data is available.
- Different parts may show different pricing sections, depending on the part type and available data.

### 11.6 Pricing Caching
- Pricing calculations (especially for complex BOMs) can be expensive.
- All pricing overview data is **pre-calculated and cached** in the database in the **default currency**.
- This ensures fast retrieval even for large BOMs.

### 11.7 Automatic Pricing Updates
- A **periodic background task** runs to keep pricing data current.
- Controlled by the **"Pricing Rebuild Interval"** setting (default: 30 days).
- Setting the interval to `0` disables periodic updates.
- **Auto Update Pricing** is **enabled by default**.
  - If disabled, users must manually trigger pricing recalculation.
- Manual recalculation can be triggered from the pricing overview via the **"Recalculate"** button.

---

## 12. Part Test Templates

### 12.1 Overview
- Parts marked as **Testable** can have **Test Templates** defined against them.
- A Test Template defines the *parameters* of a test — the actual test results are recorded against individual **stock items**.

### 12.2 Test Template Cascade to Variants
- Test templates **cascade downward** to variant parts.
- If a master/template part has test templates defined, all variant parts under it inherit those test templates.
- Any stock items of the variant parts will have the same test templates associated with them.

### 12.3 Test Template Fields
| Field | Description |
|---|---|
| Name | Simple string. Defines the test name. Must be unique for a given part (or across its variant family). The name is used to generate a unique test "key" for matching test results. |
| Description | Longer description of what the test involves. |
| Required | Whether this test must pass before a stock item can be considered complete. |
| Requires Value | Whether a recorded value is required for this test result. |
| Requires Attachment | Whether a file attachment (e.g., test report) is required. |

### 12.4 Creating & Managing Test Templates
- Navigate to the **Part Detail Page** for a Testable part.
- Click the **"Tests" tab**.
- Add, edit, or delete test templates from this view.

---

## 13. Part Stock History (Stocktake)

### 13.1 Overview
- InvenTree tracks **historical stock levels** for each part via the **Stocktake** system.
- Historical data can be viewed in the **"Stock History"** tab on the Part detail page.

### 13.2 What is Tracked per Stocktake Record?
| Field | Description |
|---|---|
| Date | When the stocktake record was created. |
| Stock Items | Number of distinct stock entries (e.g., "3 reels of capacitors"). |
| Stock Quantity | Total cumulative stock count (e.g., "4,560 total capacitors"). |
| Cost (Min/Max) | Total cost of stock on hand, presented as a range. |

### 13.3 Cost Calculation Logic
- If a stock item has a **recorded purchase price**, that value is used.
- If no direct pricing is available, the **part's price range** is used as a fallback.
- Cost is always provided as a **range of values** to account for pricing variability.

### 13.4 Display Requirements
- The Stock History tab shows:
  - A **chart** of historical stock quantity and cost over time.
  - A **table** of corresponding historical records.
- The tab is **only visible** if the **"Enable Stock History"** user setting is enabled in the Display Settings section.

---

## 14. Part Notifications

### 14.1 Subscribing to a Part
- Any user can **subscribe** to a Part to receive notifications.
- Subscription is toggled via a **subscribe/unsubscribe icon** on the Part detail page.
- When subscribed, a user receives notifications for events related to that specific part.

### 14.2 Notification Events (for Part subscription)
- New stock item added for the part.
- Part edited or modified.
- Low stock threshold reached.
- New Build Order created for the part.

### 14.3 Subscribing to a Part Category
- Users can also subscribe to a **Part Category** to receive notifications for events within that category.
- When subscribed to a category, notifications are received for events pertaining to parts within that category.

### 14.4 Low Stock Notifications
- If a **Minimum Stock** threshold is configured for a Part, a **"low stock"** notification is generated when the actual stock level falls below this threshold.
- Notifications are sent via **email** to all subscribed users.

### 14.5 Build Order Low Stock Check
- When a new **Build Order** is created, the system automatically checks if any required parts are **low on stock**.
- If any parts are low on stock, notifications are generated for users subscribed to those parts.

---

## 15. Related Parts

### 15.1 Overview
- **Related Parts** denote a loose relationship between two parts.
- Used to indicate that two parts are related in usage, function, or are alternatives to each other.
- This is not a hierarchical relationship — it is a flat, bidirectional association.

### 15.2 Visibility & Toggle
- Related parts are shown in the **"Related Parts"** table within the Part detail view.
- This feature can be **enabled or disabled** via the **global part settings**.

### 15.3 Adding Related Parts
- Navigate to the Part Detail View.
- Locate the Related Parts section/table.
- Add a related part by selecting another part from the system.

---

## 16. Part Attachments

### 16.1 Overview
- Multiple **file attachments** can be uploaded per Part.
- Useful for storing datasheets, technical drawings, compliance certificates, etc.

### 16.2 The Attachments Tab
- Displayed in the **"Attachments"** tab on the Part Detail View.
- Lists all uploaded files with their names and download links.

### 16.3 Behaviors
- Multiple attachments are supported per part.
- No defined limit on attachment types — any file type can be uploaded.

---

## 17. Part Locking & Active/Inactive Status

### 17.1 Locking a Part
- Parts can be **locked** to prevent modification.
- Useful for parts that are in active production and should not be changed.
- Restrictions applied to locked parts:
  - The part's core fields cannot be edited.
  - The BOM cannot be modified.
  - (Other modification restrictions apply — specific details dependent on the system implementation.)

### 17.2 Active / Inactive Status
- By default, all parts are **Active**.
- Marking a part as **Inactive** means:
  - The part is not available for many actions within the system.
  - The part **remains in the database** (it is not deleted).
- If a part becomes **obsolete**, the recommended action is to mark it as inactive — **not to delete it** — to preserve historical data integrity.

---

## 18. Bill of Materials (BOM)

### 18.1 Overview
- The BOM (Bill of Materials) is a list of sub-components required to **build an assembly**.
- A BOM is only applicable to parts designated as **Assembly**.
- Each BOM line item specifies a sub-component Part and the required Quantity.

### 18.2 BOM Line Item Fields
| Field | Required | Description |
|---|---|---|
| Part (Sub-component) | Yes | The part required for this BOM line. |
| Quantity | Yes | How many units of the sub-component are required per assembly. |
| Reference | No | A reference designator (e.g., "R1", "C2" for PCB components). |
| Overage | No | An additional quantity (or percentage) to account for waste/spoilage. |
| Note | No | Optional notes for this BOM line. |
| Consumable | No | If checked, this BOM item is tracked but **not allocated** to Build Orders. |
| Inherited | No | If checked, this BOM item is **inherited by all variant parts** under this template. |

### 18.3 Consumable BOM Items
- When a BOM item is marked as **Consumable**:
  - The part and quantity are tracked in the BOM.
  - The line item **does not get allocated** to a Build Order.
  - Useful for low-value, abundant, or hard-to-track items (e.g., screws, washers).
  - In the Build Order allocation table, consumable items cannot be allocated.

### 18.4 Substitute Parts in BOM
- **Substitute Parts** can be assigned to a BOM line item to allow alternative parts to be used during assembly.
- When calculating available stock for a BOM line item, stock from all substitute parts is **included in the availability calculation**.

### 18.5 BOM Sub-Assembly Loading
- In the BOM table view, sub-assemblies are **not loaded by default**.
- Sub-assembly BOMs can be loaded on demand by clicking an expand icon on the relevant sub-assembly row.

### 18.6 Inherited BOM Items (for Variants)
- BOM Line Items marked as **Inherited** flow downward through the variant hierarchy.
- If a template part has inherited BOM items, ALL variants and sub-variants automatically include those items in their BOMs.
- Non-inherited BOM items only apply to the specific part they are defined on.

### 18.7 Adding BOM Items (Manual)
- Navigate to the **Part/Assembly Detail Page**.
- Click the **"BOM"** tab.
- Click the add/edit icon, then the add item icon.
- Fill in: Quantity (required), Reference, Overage, and Note (optional).
- Click **Submit**.

### 18.8 BOM Import / Export
- BOMs can be **uploaded from external files** in multiple formats.
- A **detailed BOM export** is available which includes all data stored in the InvenTree database for the BOM.

---

## 19. Supplier & Manufacturer Integration (from Part context)

### 19.1 Suppliers Tab on Part Detail
- Accessible from the **Suppliers tab** (only for Purchaseable parts).
- Shows:
  - All **Supplier Parts** linked to this part (supplier + supplier's part number, price breaks, pack size, availability).
  - All **Manufacturer Parts** linked to this part (manufacturer + manufacturer's part number).

### 19.2 Supplier Part Key Attributes
| Attribute | Description |
|---|---|
| Supplier | The external company providing the part. |
| SKU / Supplier Part Number | The supplier's part number/code. |
| Pack Size | Quantity per purchase unit (default: 1). Affects stock received in Purchase Orders. |
| Price Breaks | Quantity-based pricing from the supplier. |
| Availability | Current availability status (can be updated manually or via plugin). |
| Active | Whether the supplier part is available for use in new Purchase Orders. |

### 19.3 Supplier Part Pack Size Behavior
- If a supplier part has a **pack size of 5** and is ordered in a quantity of 4 (packs), then **20 individual parts** are added to stock when received.
- When adding stock manually, parts can be added either in packs or individually (for partially opened packages).

### 19.4 Disabling vs. Deleting a Supplier Part
- It is recommended to **disable** a supplier part (rather than delete) when it is no longer available.
- Disabling prevents the supplier part from appearing in new Purchase Orders.
- Existing Purchase Orders referencing the supplier part remain intact.

### 19.5 Manufacturer Parts
- Manufacturer parts are linked to a manufacturer company and represent the manufacturer's catalog item.
- Creating a manufacturer part requires **Purchase Orders user permissions**.
- Manufacturer parts can be linked to supplier parts (a supplier may sell a manufacturer's part under their own SKU).

---

## 20. Part Import / Export

### 20.1 Import Methods
| Method | Access Level | Notes |
|---|---|---|
| Part List View (import wizard) | Staff members | Must be enabled in Part Settings. Multi-stage wizard with field mapping. |
| Part Settings page | Staff members | Same wizard interface. |
| Admin Page | Admin users only | Requires well-formatted file. More performant for large imports. |
| Import from Category View | Staff members | Import button on the Part Category page. |

### 20.2 Import Wizard Steps
1. Select file.
2. Map file fields to InvenTree part fields.
3. Confirm the target category.
4. Select parameters.
5. Create initial stock (optional).

### 20.3 Supplier Data Import via Plugin
- Plugins can auto-create parts, supplier parts, and manufacturer parts from external supplier catalogs.
- Requires installing and configuring a supplier-specific plugin.

---

## 21. Global Part Settings

The following settings affect Part module behavior system-wide. These are configured by Admin/Staff users.

| Setting | Description |
|---|---|
| Part Import Enabled | Enables the import feature on the Part List View for staff members. |
| Create Initial Stock | If enabled, shows an initial stock creation section in the part creation form. |
| Internal Price Override | If enabled, internal price breaks override all other pricing sources. |
| Auto Update Pricing | If enabled, pricing data is automatically recalculated by background tasks. |
| Pricing Rebuild Interval | How often (in days) the background pricing task runs. Default: 30. Set to 0 to disable. |
| Enable Part Revisions | Enables the revision feature for parts. |
| Assembly Revisions Only | If enabled, only Assembly parts can have revisions. |
| Enable Related Parts | Enables the Related Parts feature in the Part detail view. |
| Enable Stock History | Enables the Stock History tab on Part detail pages. (User-level display setting.) |
| IPN Field Editable | If disabled, the IPN field cannot be edited after part creation by regular users. Only admins retain edit ability. |
| Parameter Templates Auto-copy | If enabled, category-linked parameter templates are auto-added to new parts created in that category. |
| Copy Category Parameters on create | Per-form option to copy category parameters when creating a new part. |

---

## 22. Permissions & Access Control

### 22.1 Create Permission
- Users must have **"create" permission** for the Part permission group to see and use the "Add Parts" menu.

### 22.2 Supplier/Manufacturer Part Permissions
- Viewing, adding, editing, and deleting **Supplier Parts** and **Manufacturer Parts** require **Purchase Orders user permissions**.

### 22.3 Staff-Only Actions
- Importing parts via the Part List View requires **staff member** access.
- Admin Page import requires **admin** access.

### 22.4 IPN Field
- If the IPN field editability is disabled in global settings, only **admin users** can edit the IPN field after part creation.

---

## 23. Key Data Fields Reference

Complete field-level reference as derived from the documentation and API schema:

| Field Name | API Key | Type | Description |
|---|---|---|---|
| Internal Part Number | `IPN` | String (max 100) | Optional custom numbering identifier. |
| Active | `active` | Boolean | Is this part active? Default: true. |
| Allocated to Build Orders | `allocated_to_build_orders` | Number (read-only) | Quantity allocated to active build orders. |
| Allocated to Sales Orders | `allocated_to_sales_orders` | Number (read-only) | Quantity allocated to active sales orders. |
| Assembly | `assembly` | Boolean | Can this part be built from other parts? |
| Barcode Hash | `barcode_hash` | String (read-only) | Unique hash of barcode data. |
| Building | `building` | Number (read-only) | Quantity currently in production. |
| Category | `category` | Integer (FK) | The category this part belongs to. |
| Component | `component` | Boolean | Can this part be used to build other parts? |
| Creation Date | `creation_date` | Date (read-only) | Date the part was created. |
| Creation User | `creation_user` | Integer (read-only) | User who created the part. |
| Default Expiry | `default_expiry` | Integer | Default expiry time (days) for stock items. |
| Default Location | `default_location` | Integer (FK) | Default stock location for this part. |
| Default Supplier | `default_supplier` | Integer (FK) | Default supplier for this part. |
| Description | `description` | String | Longer description of the part. |
| External Stock | `external_stock` | Number (read-only) | Quantity in external stock. |
| Full Name | `full_name` | String (read-only) | Full display name (including IPN and revision). |
| Image | `image` | Image | Part thumbnail image. |
| In Stock | `in_stock` | Number (read-only) | Total in-stock quantity. |
| Is Template | `is_template` | Boolean | Is this part a template for variants? |
| Keywords | `keywords` | String | Searchable keywords. |
| Link | `link` | URL | External link for documentation. |
| Locked | `locked` | Boolean | If true, part cannot be modified. |
| Minimum Stock | `minimum_stock` | Number | Minimum stock threshold for low-stock alerts. |
| Name | `name` | String | Part name (unique). |
| Notes | `notes` | Markdown | Free-form notes. |
| Ordering | `ordering` | Number (read-only) | Quantity on order (from purchase orders). |
| Purchaseable | `purchaseable` | Boolean | Can this part be purchased from suppliers? |
| Required for Build Orders | `required_for_build_orders` | Integer (read-only) | Quantity required to fulfill active build orders. |
| Required for Sales Orders | `required_for_sales_orders` | Integer (read-only) | Quantity required to fulfill active sales orders. |
| Responsible | `responsible` | Integer (FK) | User/group responsible for this part. |
| Revision | `revision` | String | Revision code for this part. |
| Salable | `salable` | Boolean | Can this part be sold? |
| Testable | `testable` | Boolean | Can test results be recorded for this part? |
| Trackable | `trackable` | Boolean | Does this part require serial/batch numbers? |
| Units | `units` | String | Unit of measure (default: pcs). |
| Virtual | `virtual` | Boolean | Is this a non-physical/virtual part? |

---

## Appendix A: Key UI Flows Summary

### A.1 Create a New Part (Happy Path)
1. Navigate to Parts view.
2. Click "Add Parts" > "Create Part".
3. Fill in: Name (required), Description (required), Category, and relevant flag checkboxes.
4. (If Create Initial Stock enabled) Check "Create Initial Stock" and enter quantity.
5. (If Purchaseable and Add Supplier Data enabled) Fill in supplier/manufacturer details.
6. Click "Submit".
7. Redirected to new Part Detail page.

### A.2 Create a Variant Part
1. Navigate to Template Part detail page.
2. Click "Variants" tab.
3. Click "New Variant".
4. Modify fields in the "Duplicate Part" form (especially Name/IPN).
5. Submit.

### A.3 Create a New Revision
1. Navigate to Part detail page.
2. Click "Revisions" tab.
3. Select "Duplicate Part" action.
4. Update the Revision field in the form.
5. Submit.
6. Redirected to new revision's detail page.

### A.4 Add a BOM Item to an Assembly
1. Navigate to Assembly Part detail page.
2. Click "BOM" tab.
3. Click add icon.
4. Select sub-component part, enter Quantity.
5. Optionally fill Reference, Overage, Note; check Consumable or Inherited as needed.
6. Click "Submit".

### A.5 Import Parts from File
1. Navigate to Parts view.
2. Click "Add Parts" > "Import from File".
3. Follow the wizard: upload file → map fields → confirm category → select parameters → (optionally) create initial stock.
4. Submit.

---

## Appendix B: Tab Visibility Matrix

| Tab | Condition for Visibility |
|---|---|
| Stock | Always visible |
| Allocated | Part is a Component OR Salable |
| BOM | Part is an Assembly |
| Build Orders | Part is an Assembly |
| Used In | Part is a Component |
| Suppliers | Part is Purchaseable |
| Purchase Orders | Part is Purchaseable |
| Sales Orders | Part is Salable |
| Tests | Part is Testable |
| Variants | Part is a Template |
| Revisions | "Enable Revisions" setting is ON |
| Related Parts | "Enable Related Parts" setting is ON |
| Stock History | "Enable Stock History" user display setting is ON |
| Pricing | Always visible |
| Attachments | Always visible |
| Notes | Always visible |

---

*End of Requirements Understanding Document*  
*This document was compiled by a Senior QA Architect from the InvenTree official documentation at https://docs.inventree.org/en/stable/part/ and all referenced sub-pages. No assumptions were made — all content is sourced directly from the documentation.*
