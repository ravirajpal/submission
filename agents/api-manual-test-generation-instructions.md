# InvenTree – API Manual Test Case Generation Instructions

## Reference Document

All API test cases must be derived strictly from:

- InvenTree API Schema yml file is attached.
This schema is the single source of truth for:
- Endpoints
- Request/response structures
- Authentication
- Parameters

Do not introduce assumptions beyond the schema.

- Refer to the requirement understanding document which is attached for functional knowledege. That should help to generate more realistic functional API tests.

---

## Objective

Generate a comprehensive suite of manual API test cases for the Part and Part Category Modules APIs.

The output must cover:
- Functional correctness (CRUD operations)
- Request/response validation
- Authentication and authorization
- Negative and boundary scenarios
- Data integrity and consistency

---

## Scope of Testing

### 1. Endpoint Coverage

Generate test cases for all relevant 'part' and 'part category' endpoints.

For each endpoint, cover:

- GET (list / retrieve)
- POST (create)
- PUT/PATCH (update)
- DELETE (where applicable)

---

### 2. Request Validation

Validate:

- Required fields
- Optional fields
- Data types (string, integer, boolean, etc.)
- Field constraints (length, format)
- Invalid payload handling
- Missing fields
- Extra/unexpected fields

---

### 3. Response Validation

Validate:

- Status codes (200, 201, 400, 401, 403, 404, etc.)
- Response schema structure
- Field correctness and data types
- Consistency between request and response
- Error response format

---

### 4. Authentication

Validate all supported authentication mechanisms:

- Token authentication (Token <value>)
- Basic authentication
- OAuth (if applicable)
- Cookie-based authentication

Test scenarios must include:

- Valid authentication
- Missing authentication
- Invalid/expired token
- Unauthorized access

---

### 5. Authorization (RBAC)

Validate permission-based behavior:

- Access to endpoints based on user roles
- Create/update/delete restrictions
- Read-only vs write access
- Forbidden responses (403)

Include:

- User with full access
- User with limited permissions
- User with no access

---

### 6. Query Parameters & Filtering

Validate:

- Filtering parameters
- Pagination (limit, offset)
- Sorting (ordering)
- Invalid query parameters
- Combination of filters

---

### 7. Data Integrity

Validate:

- Data persistence after create/update
- Data consistency across endpoints
- Referential integrity (e.g., related parts)
- Duplicate handling (e.g., IPN uniqueness)

---

### 8. Negative and Boundary Scenarios

Must include:

- Invalid payload formats (wrong data types)
- Missing required fields
- Duplicate data (e.g., duplicate IPN)
- Invalid IDs (non-existent resources)
- Unauthorized access attempts
- Empty request body
- Large payloads / boundary values
- SQL injection / malformed input
- Invalid query parameters

---

### 9. API Behavior Validation

Cover:

- Idempotency (PUT vs POST behavior)
- Partial updates (PATCH)
- Concurrency scenarios (if applicable)
- Error handling consistency across endpoints
- Rate limiting (if applicable)

---

## Test Case Design Standards

Each test case must include:

- Module / Feature (e.g., Part API / Create Part)
- Test Case ID  
- Title  
- Endpoint  
- HTTP Method  
- Requirement Reference (API endpoint)  
- Preconditions  
- Request Headers  
- Request Payload  
- Test Steps  
- Expected Status Code  
- Expected Response  
- Priority (High / Medium / Low)  

---

## Test Case ID Naming Convention

Format:
`TC_API_<MODULE>_<FEATURE>_<NUMBER>`

Examples:
- `TC_API_PART_CREATE_001`
- `TC_API_PART_GET_002`
- `TC_API_PART_UPDATE_003`
- `TC_API_PART_DELETE_004`
- `TC_API_PART_AUTH_005`

Guidelines:
- Use uppercase
- Keep module/feature concise
- Maintain sequential numbering per feature
- Avoid duplicates

---

## Test Data Guidelines

- Preconditions define:
  - Existing data (e.g., part exists)
  - User roles and permissions
  - Environment setup

- Request Payload must include:
  - Explicit JSON values
  - No placeholders like "valid data"

Example:
```json
{
  "name": "Resistor_10K_01",
  "description": "10K Ohm resistor",
  "active": true
}