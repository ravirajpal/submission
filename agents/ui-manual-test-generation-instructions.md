# InvenTree – Manual Test Case Generation Instructions

## Reference Document

All test cases must be derived strictly from the following document:

- InvenTree Part Module Requirements Understanding Document (attached in repository)

This document is the single source of truth.  
Test cases must be traceable to specific sections of this document.  
Do not introduce assumptions or undocumented behaviors.

---

## Objective

Generate a comprehensive, high-quality suite of manual UI test cases for the Part Module of the InvenTree application.

The output must reflect production-grade QA standards, covering:
- Functional correctness
- UI behavior and visibility rules
- Business rules and constraints
- Negative and boundary conditions

---

## Scope of Testing

### 1. Part Creation

#### Manual Creation Flow
Cover:
- Field-level validation (required, optional, formats, length limits)
- Default value behavior (category inheritance, parameters, defaults)
- Conditional UI sections:
  - Create Initial Stock
  - Supplier / Manufacturer data (Purchaseable parts)
- Attribute flag impact (Virtual, Assembly, Template, etc.)
- Form submission behavior:
  - Success (redirect to detail page)
  - Inline validation errors
  - Permission-based access (Create permission)

#### Import Flow
Cover:
- File upload validation (supported/unsupported formats)
- Field mapping accuracy
- Category assignment
- Parameter mapping
- Multi-step wizard behavior
- Error handling:
  - Missing required fields
  - Invalid mappings
  - Partial failures

---

### 2. Part Detail View (Tabs & Panels)

Generate test cases for all applicable tabs:

- Stock  
- BOM  
- Allocated  
- Build Orders  
- Parameters  
- Variants  
- Revisions  
- Attachments  
- Related Parts  
- Test Templates  
- Pricing  
- Notes  
- Stock History  

Validation must include:
- Tab visibility conditions (based on part attributes and settings)
- Data accuracy and consistency
- Available user actions per tab
- Empty state behavior
- Navigation and breadcrumb correctness

---

### 3. Part Categories

Cover:
- Hierarchical structure (parent-child relationships)
- Category navigation and breadcrumb rendering
- Part listing behavior (including sub-category aggregation)
- Filtering:
  - Single and multi-filter combinations
  - Parametric filtering (numeric + selection)
- Category-level configurations:
  - Default location inheritance
  - Default keywords
  - Parameter templates auto-assignment

---

### 4. Part Attributes / Type Flags

Validate behavior for:

- Virtual  
- Template  
- Assembly  
- Component  
- Trackable  
- Purchaseable  
- Salable  
- Active / Inactive  
- Locked  

Focus areas:
- UI changes triggered by each flag
- Tab visibility matrix enforcement
- Functional constraints:
  - Virtual → no stock allowed
  - Trackable → serial/batch mandatory
  - Assembly → BOM + Build Orders visible
  - Component → Used In + Allocated visible

---

### 5. Units of Measure

- Default unit behavior
- Custom unit entry
- Unit validation for parameters
- Compatibility and conversion scenarios
- Invalid unit rejection scenarios

---

### 6. Part Revisions

Cover:
- Revision creation via duplication
- Revision field validation
- "Revision Of" relationship integrity
- Constraints:
  - No circular references
  - No revision-of-revision chains
  - Unique revision codes (where applicable)
  - Template consistency for variants

---

### 7. Negative and Boundary Scenarios

Must include, at minimum:

- Duplicate IPN handling  
- Duplicate Part Name validation  
- Missing required fields  
- Invalid data formats  
- Invalid file imports  
- Inactive part usage restrictions  
- Locked part modification attempts  
- Revision constraint violations  
- Trackable part without serial/batch  
- Virtual part with stock (should be blocked)  
- Parameter unit incompatibility  
- Permission-based access failures  

---

### 8. Permissions and Role-Based Access Control

Validate system behavior based on user roles and permissions.

Cover:

#### Part Creation Permissions
- "Add Parts" menu visibility based on Create permission
- Ability/inability to create parts without proper permissions
- UI behavior when permission is missing (hidden vs disabled)

#### Import Permissions
- Import from Part List View (Staff only)
- Import via Admin Page (Admin only)
- Access restriction for non-staff users

#### Supplier / Manufacturer Data Permissions
- Visibility and edit access to Supplier Parts
- Visibility and edit access to Manufacturer Parts
- Dependency on Purchase Order permissions

#### IPN Field Restrictions
- Editability of IPN field based on global settings
- Admin vs non-admin behavior

#### General Access Control
- Access to Part Detail View
- Ability to edit vs view-only based on role
- Behavior when attempting unauthorized actions

#### Negative Scenarios
- Attempt restricted actions without permissions
- Direct URL access to restricted features
- UI vs API-level enforcement (where applicable)

---

## Test Case Design Standards

Each test case must include:

- Module / Feature  
- Test Case ID  
- Title  
- Requirement Reference (section from source document)  
- Preconditions  
- Test Steps  
- Expected Result  
- Priority (High / Medium / Low)  

---

## Test Case ID Naming Convention

Follow a consistent and descriptive naming pattern:

Format:
`TC_<MODULE>_<FEATURE>_<NUMBER>`

Examples:
- `TC_PART_CREATE_001`
- `TC_PART_IMPORT_002`
- `TC_PART_BOM_005`
- `TC_PART_REVISION_003`
- `TC_PART_PERMISSION_004`

Guidelines:
- Use uppercase
- Keep module and feature short but meaningful
- Use sequential numbering per feature
- Avoid duplicate IDs

---

## Test Data Guidelines

- Preconditions must define only:
  - System state
  - Required existing data (e.g., categories, users, permissions)
  - Configuration setup

- Test Steps must include:
  - Explicit user actions
  - Exact input data values (no ambiguity)

- Avoid vague inputs such as:
  - "Enter valid name"
  - "Provide correct data"

- Instead, always specify concrete values, e.g.:
  - Name = `Resistor_10K_01`
  - IPN = `IPN-1001`

- For large datasets (e.g., import files):
  - Reference a sample file or define structured test data separately

---

## Coverage Expectations

- 100% coverage of all relevant sections in the reference document  
- Explicit coverage of:
  - Happy paths
  - Negative scenarios
  - Boundary conditions
- No duplicate or redundant test cases
- Logical grouping by feature/module

---

## Quality Guidelines

- Test cases must be atomic and independently executable  
- Steps must be clear, deterministic, and reproducible  
- Expected results must be precise and verifiable  
- Avoid ambiguity and vague assertions  
- Ensure strong traceability to requirements  

---

## Constraints

- Do not assume undocumented behavior  
- Do not skip edge cases  
- Do not duplicate coverage  
- Do not mix multiple validations into a single test case unless required  

---

## Output Expectations

- Structured, well-organized test suite grouped by feature  
- Clear, concise, and execution-ready test cases  
- Suitable for manual QA execution and future automation conversion  