# TC_CF_002 Test Plan

## Application Overview

Cross-functional validation that an assembly build order consumes component stock according to BOM quantity and produces output stock correctly, with reconciled values visible across Build Order, Part Detail, and Category views. Assumes a fresh state by generating unique part names during execution.

## Test Scenarios

### 1. TC_CF_002 - Assembly BOM to Build Output Stock Reconciliation

**Seed:** `automation/ui/tests/seed.spec.ts`

#### 1.1. TC_CF_002: Build completion consumes component stock and increases assembly stock

**File:** `automation/ui/tests/tc-cf-002-assembly-bom-build-stock-reconciliation.spec.ts`

**Steps:**
  1. Log in as allaccess and navigate to Parts > Part Categories > Electronics > Parts. Create two unique names: one component part and one assembly part for this run.
    - expect: User lands on Electronics category Parts table.
    - expect: Names are unique for this run and no pre-existing records are required.
  2. Create a new component part from the category context with required fields, then open its Stock tab and add one stock item with quantity 50 in a valid location (for example Factory or Stock).
    - expect: Component part is created and opens in Part Detail.
    - expect: A stock item is created successfully.
    - expect: Component part In Stock value is 50.
  3. Return to Electronics category Parts table. Create a new assembly part with required fields and Assembly flag enabled.
    - expect: Assembly part is created and opens in Part Detail.
    - expect: Bill of Materials tab and Build Orders tab are visible for the assembly part.
  4. Open Bill of Materials tab for the assembly part. Add one BOM line using the newly created component part with quantity per build = 2 and a reference value (for example R1).
    - expect: BOM row is created and visible for the component.
    - expect: BOM row shows quantity 2.
    - expect: No validation errors are shown for a valid BOM line.
  5. Open Build Orders tab for the assembly part. Create a new build order with build quantity 5 and valid source/destination locations.
    - expect: Build order is created and listed in the Build Orders table.
    - expect: Build order status is created/production state and references the assembly part.
    - expect: Build quantity shown on build order is 5.
  6. Open the new build order detail page and go to Required Parts tab. Verify required quantity calculation for the component is 10 (2 x 5).
    - expect: Required Parts row for the component is visible.
    - expect: Required quantity equals 10.
    - expect: Before allocation, allocated quantity is 0 and consumed quantity is 0.
  7. Negative checkpoint: attempt completion before allocation (or verify completion control/state indicates insufficient readiness). Then allocate stock for required parts (manual allocate or auto-allocate) and confirm allocations.
    - expect: System does not allow invalid completion without required allocation/consumption readiness, or clearly indicates incomplete state.
    - expect: After allocation, allocated quantity reaches required quantity 10.
    - expect: No unexpected error toast or modal failure appears during allocation.
  8. Complete the build order using Complete Order and confirm output quantity 5 is produced.
    - expect: Build order status transitions to completed.
    - expect: Completed Outputs reflects 5 units.
    - expect: Consumed Stock reflects 10 units of the component (or equivalent fully consumed progress against required quantity).
  9. Open component part detail page and verify post-build stock.
    - expect: Component In Stock value is reduced from 50 to 40.
    - expect: Stock movement/history reflects build consumption action.
  10. Open assembly part detail page and verify produced stock.
    - expect: Assembly In Stock value increases from 0 to 5.
    - expect: Part detail counters and stock table are consistent with completed build output.
  11. Navigate to Electronics category Parts table and search for both newly created parts.
    - expect: Assembly row shows total stock 5.
    - expect: Component row shows total stock 40.
    - expect: Category list values match part detail values for both parts.
  12. Record failure conditions and cleanup notes.
    - expect: Failure if any mismatch appears across BOM math, build order required/allocated/consumed metrics, part stock totals, or category stock totals.
    - expect: Failure if completion is allowed in an invalid state without required parts readiness.
    - expect: Test remains independent by using run-unique part names and no reliance on fixed IDs.
