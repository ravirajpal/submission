# TC_PART_CREATE_016 Test Plan

## Application Overview

Manual validation plan for TC_PART_CREATE_016 focused strictly on requirement 4.3 / 21: part Name must be unique. This version intentionally contains only the core duplicate-name scenario with no edge variants.

## Test Scenarios

### 1. Part Creation Duplicate Name Validation

**Seed:** `automation/ui/tests/seed.spec.ts`

#### 1.1. TC_PART_CREATE_016: Create a part with a Name that already exists in the system

**File:** `automation/ui/tests/part-create.spec.ts`

**Steps:**
  1. Log in with create permission and ensure a baseline part already exists with Name = Resistor_10K_001.
    - expect: Authenticated session is active.
    - expect: Baseline part Resistor_10K_001 exists and is searchable in Parts.
  2. Navigate to Parts > Add Parts > Create Part to open the Add Part modal.
    - expect: Create Part modal opens with required Name field and Submit button visible.
  3. Enter Name = Resistor_10K_001 (duplicate).
    - expect: Duplicate value is present in the Name input.
  4. Enter Description = Duplicate name test.
    - expect: Description field contains Duplicate name test.
  5. Click Submit.
    - expect: Form does not submit successfully.
    - expect: Modal remains open (or creation is otherwise blocked) and user stays in creation context.
    - expect: Inline Name validation indicates the value must be unique (wording may vary).
    - expect: No new part record is created with duplicate Name.
