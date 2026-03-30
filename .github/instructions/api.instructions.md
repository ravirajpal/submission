---
applyTo: "automation/api/**"
---

# API Test Instructions

## Stack
- Backend: Django REST Framework (DRF) — InvenTree
- API spec: OpenAPI/Swagger at `docs/Inventree_API_schema.yaml`
- Test runner: Playwright API testing mode (`@playwright/test`)
- Language: TypeScript
- Config: `automation/api/playwright.config.ts`
- Environment: `automation/api/.env` (loaded via `dotenv`)

## Golden Rule
**Always read the OpenAPI spec before writing tests.**
1. Open `docs/Inventree_API_schema.yaml`, find the relevant path and method
2. Read the request body schema, required fields, and response schema
3. Use exact field names from the spec — do not guess
4. Use `.env` variables for base URL, credentials, and endpoint paths — never hardcode them

## Project Structure
```
automation/api/
├── fixtures/
│   └── api.fixtures.ts              ← all fixtures live here; extend this file when adding new ones
├── tests/
│   ├── part.spec.ts                  ← Part CREATE tests (TC_API_PART_CREATE_*)
│   ├── part-read.spec.ts             ← Part GET/LIST tests (TC_API_PART_GET_*)
│   ├── part-update.spec.ts           ← Part PUT/PATCH tests (TC_API_PART_UPDATE_*)
│   ├── part-delete.spec.ts           ← Part DELETE tests (TC_API_PART_DELETE_*)
│   ├── part-endpoints.spec.ts        ← Part sub-resource tests (pricing, requirements, bom-validate)
│   ├── part-category.spec.ts         ← Category CREATE tests + auth (TC_API_CAT_CREATE_*, TC_API_CAT_AUTH_*)
│   ├── part-category-read.spec.ts    ← Category GET/LIST tests (TC_API_CAT_GET_*)
│   ├── part-category-update.spec.ts  ← Category PUT/PATCH tests (TC_API_CAT_UPDATE_*)
│   ├── part-category-delete.spec.ts  ← Category DELETE tests (TC_API_CAT_DELETE_*)
│   ├── part-authz.spec.ts            ← Role-based access control tests (TC_API_AUTHZ_*)
│   └── part-negative.spec.ts         ← Negative & edge case tests (TC_API_NEG_*)
├── playwright.config.ts
├── tsconfig.json
└── .env
```

**Spec file naming convention:** group tests by HTTP operation or sub-resource, not by feature area.
- `<resource>.spec.ts` → CREATE (POST) tests
- `<resource>-read.spec.ts` → GET list + GET detail tests
- `<resource>-update.spec.ts` → PUT + PATCH tests
- `<resource>-delete.spec.ts` → DELETE tests
- `<resource>-endpoints.spec.ts` → sub-resource endpoints (e.g. `/pricing/`, `/requirements/`, `/bom-validate/`)

## Fixtures (`automation/api/fixtures/api.fixtures.ts`)
Import from the fixtures file in every spec:
```typescript
import { test, expect } from '../fixtures/api.fixtures';
```

Available fixtures:

| Fixture | Type | Description |
|---|---|---|
| `apiCall` | function | Authenticated API call as `allaccess` user; signature: `(method, endpoint, payload?) => Promise<APIResponse>` |
| `unauthApiCall` | function | Same as `apiCall` but without `Authorization` header |
| `partListEndpoint` | string | `/api/part/` (from `ENDPOINT_PART_LIST`) |
| `partDetailEndpoint` | string | `/api/part/{id}/` — replace `{id}` with `String(pk)` |
| `partPricingEndpoint` | string | `/api/part/{id}/pricing/` |
| `partRequirementsEndpoint` | string | `/api/part/{id}/requirements/` |
| `partBomEndpoint` | string | `/api/part/{id}/bom/` |
| `partBomValidateEndpoint` | string | `/api/part/{id}/bom-validate/` |
| `stockListEndpoint` | string | `/api/stock/` |
| `partCategoryListEndpoint` | string | `/api/part/category/` (from `ENDPOINT_PART_CATEGORY_LIST`) |
| `partCategoryDetailEndpoint` | string | `/api/part/category/{id}/` — replace `{id}` with `String(pk)` |
| `allAccessAuthToken` | string | Base64 `allaccess:nolimits` |
| `readerAuthToken` | string | Base64 `reader:readonly` |
| `engineerAuthToken` | string | Base64 `engineer:partsonly` |
| `adminAuthToken` | string | Base64 `admin:inventree` |
| `readerApiCall` | function | Authenticated API call as `reader` user (read-only role); use for AUTHZ tests |

When a new endpoint is needed, add it to `api.fixtures.ts` as a string fixture backed by the corresponding `process.env.ENDPOINT_*` variable (which should already exist in `.env`).

## Writing Tests

### Test ID convention
Test titles must begin with the test case ID from the CSV/requirements: `TC_API_<RESOURCE>_<OPERATION>_<NNN>`.
```typescript
test('TC_API_PART_CREATE_001: Create a minimal part with only required fields', async ({ apiCall, partListEndpoint }) => {
```

### Do not modify or delete existing live data
**Never target hardcoded or pre-existing server records.** The demo server (`https://demo.inventree.org`) is shared — tests that delete or mutate fixed records will break other users and other test runs.

**Rule:** Any test that performs a mutating operation (PUT, PATCH, DELETE) or needs a specific record as a precondition **must create that record itself** in the test body via a POST, capture the returned `pk`, and operate only on that `pk`.

```typescript
// ✓ Correct — create then operate on own pk
const createRes = await apiCall('post', partListEndpoint, { name: `Target_${Date.now()}`, description: '...' });
expect(createRes.status()).toBe(201);
const partId = (await createRes.json()).pk;
const detailUrl = partDetailEndpoint.replace('{id}', String(partId));

const deleteRes = await apiCall('delete', detailUrl);
expect(deleteRes.status()).toBe(204);

// ✗ Wrong — targets a live record that may be shared or may not exist
const deleteRes = await apiCall('delete', '/api/part/1/');
```

This applies to: update tests, delete tests, authz tests (the full-access user creates the target; the restricted user tries to act on it), and any test that reads a record and then asserts mutable fields on it.

The only exception is read-only GET tests that filter against known static data (e.g. `?category=1`) — these are safe because they do not mutate anything.

### Unique names
Always append `Date.now()` (and an index for loops) to any `name` or `IPN` field to avoid conflicts on the shared demo server:
```typescript
name: `Resistor_10K_${Date.now()}`,
IPN: `RES-10K-${Date.now()}`,
```

### Endpoint substitution
```typescript
const detailUrl = partDetailEndpoint.replace('{id}', String(partId));
```

### Assertion pattern
Always assert both status and key response fields:
```typescript
expect(response.status()).toBe(201);
const body = await response.json();
expect(body.pk).toEqual(expect.any(Number));
expect(body.name).toBe(payload.name);
```

### Error shape (DRF)
- Field errors: `{ "field_name": ["error message"] }` — assert with `.toHaveProperty('field_name')` and check the array
- Non-field errors: `{ "detail": "..." }` — assert the field exists and is a non-empty string; **do not hardcode the exact message**

InvenTree overrides the default DRF 404 detail per resource (e.g. `"No Part matches the given query."` instead of `"Not found."`). Hardcoding the string will break across resources and InvenTree versions.

```typescript
// ✓ Correct — version/resource agnostic
expect(errorBody).toHaveProperty('detail');
expect(typeof errorBody.detail).toBe('string');
expect(errorBody.detail.length).toBeGreaterThan(0);

// ✗ Wrong — brittle, breaks on InvenTree-specific messages
expect(errorBody.detail).toBe('Not found.');
```

For field validation errors, match on a substring rather than an exact string:
```typescript
expect(errorBody).toHaveProperty('IPN');
expect(errorBody.IPN.some((msg: string) => msg.toLowerCase().includes('already exists'))).toBe(true);
```

### DRF pagination
List endpoints return `{ count, next, previous, results[] }`:
```typescript
expect(body).toHaveProperty('count');
expect(body).toHaveProperty('results');
expect(Array.isArray(body.results)).toBe(true);
```

### Conditional/skip pattern
For tests that depend on external state (e.g. supplier links):
```typescript
if (!supplierPartsBody.results || supplierPartsBody.results.length === 0) {
  test.skip(true, 'Precondition not met — skipping');
  return;
}
```

### Uniqueness / duplicate-rejection tests
Tests that assert a 400 on duplicate values (e.g. duplicate IPN) **must** account for the possibility that the server has the uniqueness constraint turned off via a global setting.

**Pattern — always do both steps:**

1. **Check the governing global setting first.** Query `/api/settings/global/{KEY}/` before asserting a rejection. If the setting permits duplicates, call `test.skip()` with an explanatory message.
2. **Prefer fetching an existing conflicting value over creating one.** Use a GET list call to find a record that already has the field set. Only fall back to creating a seed record if none exists. This avoids race conditions on a shared server.

```typescript
test('TC_API_..._005: Reject duplicate IPN', async ({ apiCall, partListEndpoint }) => {
  // 1. Guard: skip if the server allows duplicate IPNs
  const settingRes = await apiCall('get', '/api/settings/global/PART_ALLOW_DUPLICATE_IPN/');
  if (settingRes.status() === 200) {
    const setting = await settingRes.json();
    if (setting.value === true || setting.value === 'true') {
      test.skip(true, 'PART_ALLOW_DUPLICATE_IPN is enabled — skipping uniqueness test');
      return;
    }
  }

  // 2. Prefer an existing IPN over creating a new one
  const listRes = await apiCall('get', `${partListEndpoint}?limit=100`);
  expect(listRes.status()).toBe(200);
  let ipn: string | null = null;
  for (const part of (await listRes.json()).results) {
    if (part.IPN && part.IPN.trim() !== '') { ipn = part.IPN; break; }
  }
  if (!ipn) {
    ipn = `DUPE-IPN-${Date.now()}`;
    const seed = await apiCall('post', partListEndpoint, { name: `Seed_${Date.now()}`, description: 'seed', IPN: ipn });
    expect(seed.status()).toBe(201);
  }

  // 3. Assert rejection
  const second = await apiCall('post', partListEndpoint, { name: `Dupe_${Date.now()}`, description: 'dupe', IPN: ipn });
  expect(second.status()).toBe(400);
  const err = await second.json();
  expect(err).toHaveProperty('IPN');
  expect(err.IPN.some((msg: string) => msg.toLowerCase().includes('already exists'))).toBe(true);
});
```

**Known InvenTree global settings that gate uniqueness / behaviour:**

| Setting key | Effect when `true` |
|---|---|
| `PART_ALLOW_DUPLICATE_IPN` | Duplicate IPNs are permitted → duplicate IPN test must skip |
| `PART_ALLOW_EDIT_LOCKED_BOM` | Locked BOM can be edited → locked-part edit test must skip |
| `STOCK_ALLOW_DUPLICATE_SN` | Duplicate serial numbers are permitted |

To check any setting: `GET /api/settings/global/{KEY}/` — returns `{ key, value, ... }`. The `value` field is a string or boolean depending on the setting type; check both forms: `setting.value === true || setting.value === 'true'`.

## DRF / InvenTree Rules
- All endpoints require trailing slashes: `/api/part/` ✓, `/api/part` ✗
- Auth header: `Authorization: Basic <base64(user:pass)>` — not Bearer
- `Content-Type: application/json` is required for POST/PUT/PATCH (the `apiCall` fixture sets this automatically when a payload is provided)
- Locked parts (`locked: true`) cannot be modified — any PATCH/PUT returns 400
- The `initial_stock` field on POST `/api/part/` only creates stock if the global setting "Create Initial Stock" is enabled on the server
- **Category filter is tree-aware:** `?category=1` returns parts in category 1 *and all its subcategories*. Never assert `item.category === 1` for every result — instead verify that the parts you created appear in the results by name/pk.
- **Some endpoints are async:** InvenTree may return a background task envelope `{ task_id, pending, complete, success, http_status }` instead of the schema-defined response body. Always check for `task_id` in the response and poll if present. Poll the same GET endpoint with a delay until the response **switches from the task envelope to the actual schema object** (i.e. the discriminating field like `bom_validated` appears). Do not rely on `complete` or `pending` flags — the GET response transitions directly to the resource schema once the task finishes. Example:
  ```typescript
  const body = await response.json();
  if (body.task_id !== undefined) {
    let resultBody: any = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const poll = await apiCall('get', endpointUrl);
      const pollBody = await poll.json();
      // Stop polling when the response contains the expected schema field
      if (pollBody.bom_validated !== undefined) { resultBody = pollBody; break; }
    }
    expect(resultBody).not.toBeNull();
    // assert on resultBody fields
  } else {
    // sync path — assert fields directly on body
  }
  ```

## InvenTree API Reference
- Full spec: `docs/Inventree_API_schema.yaml`
- Part endpoints: `/api/part/`, `/api/part/{id}/`, `/api/part/{id}/pricing/`, `/api/part/{id}/requirements/`, `/api/part/{id}/bom-validate/`
- Stock endpoint: `/api/stock/?part={pk}`
- Supplier part lookup: `/api/company/part/?part={pk}`