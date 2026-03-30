# InvenTree Cross-Functional Flow Test Plan

## Application Overview

Focused cross-functional UI flow for InvenTree Part module: Create a part in a category, add parameters, add stock, then verify representation in category view. Scope is intentionally limited to one end-to-end scenario without unrelated Purchasing, Manufacturing, or Sales paths.

## Test Scenarios

### 1. CF-001 - Part Creation to Category Verification

**Seed:** `automation/ui/tests/seed.spec.ts`

#### 1.1. Create a part, add parameters, create stock, verify in category view

**File:** `automation/ui/tests/cf-001-part-parameter-stock-category.spec.ts`

**Steps:**
  1. Log in as allaccess using the seed flow. Navigate to Parts, open Part Categories, and select a target category (for example Electronics).
    - expect: Category detail page loads and category name is visible.
    - expect: Parts sub-tab is available inside the selected category.
  2. From the selected category context, click Add Parts and choose Create Part. Enter Name = CF001_TestPart and Description = Cross functional part flow. Keep the chosen category selected. Submit the form.
    - expect: Part is created successfully.
    - expect: Browser redirects to the new Part Detail page.
    - expect: Part header shows CF001_TestPart.
  3. On the new Part Detail page, open the Parameters tab. Add one parameter entry (for example template or custom parameter) with value = 10k.
    - expect: Parameter row is added and saved.
    - expect: Parameters tab displays the parameter name and value 10k.
  4. On the same Part Detail page, use stock actions to add stock. Enter Quantity = 25 and select a valid stock location, then submit.
    - expect: Stock is created successfully.
    - expect: Part header stock indicator updates to show the part is in stock.
    - expect: Stock tab lists one stock row with quantity 25.
  5. Navigate back to the same category page and open its Parts sub-tab. Search for CF001_TestPart in the table.
    - expect: CF001_TestPart appears in the category parts list.
    - expect: Category view shows non-zero stock for CF001_TestPart (reflecting the created stock).
  6. Open CF001_TestPart from the category list to re-check details.
    - expect: Part Detail page opens for CF001_TestPart.
    - expect: Previously added parameter value remains saved.
    - expect: Stock quantity remains 25, confirming data consistency between detail and category views.
