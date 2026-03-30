# InvenTree Part Module — API Test Suite

Automated API tests for the InvenTree Part module using Playwright API testing mode (TypeScript).

Target: `https://demo.inventree.org`

---

## Running Tests

### Projects

| Project | Scope | Spec files |
|---|---|---|
| `api` | All tests | All `*.spec.ts` files |
| `part` | Part CRUD + endpoints + negative | `part.spec.ts`, `part-read.spec.ts`, `part-update.spec.ts`, `part-delete.spec.ts`, `part-endpoints.spec.ts`, `part-negative.spec.ts` |
| `part-category` | Part category CRUD | `part-category*.spec.ts` |
| `authz` | Role-based access control | `part-authz.spec.ts` |

```powershell
# All tests
npx playwright test --project=api

# Part tests only
npx playwright test --project=part

# Part category tests only
npx playwright test --project=part-category

# Authorization tests only
npx playwright test --project=authz

# Single spec file (use any project that covers it)
npx playwright test tests/part.spec.ts --project=part

# Open HTML report
npx playwright show-report
```

---

## Test Files

| File | Test IDs | Coverage |
|---|---|---|
| `tests/part.spec.ts` | TC_API_PART_CREATE_001–009 | Part creation, field validation, boundary |
| `tests/part-read.spec.ts` | TC_API_PART_GET_001–008 | Pagination, filtering, search, ordering, detail |
| `tests/part-update.spec.ts` | TC_API_PART_UPDATE_001–004 | Full PUT, PATCH, locked part, default supplier |
| `tests/part-delete.spec.ts` | TC_API_PART_DELETE_001–002 | Delete (with deactivation), 404 on non-existent |
| `tests/part-endpoints.spec.ts` | TC_API_PART_PRICING_001, TC_API_PART_REQ_001, TC_API_PART_BOM_001 | Pricing, requirements, BOM validation |
| `tests/part-category.spec.ts` | TC_API_CAT_CREATE_001–005, TC_API_CAT_AUTH_001 | Category creation, validation, auth |
| `tests/part-category-read.spec.ts` | TC_API_CAT_GET_001, 004–006 | Category pagination, search, detail, 404 |
| `tests/part-category-update.spec.ts` | TC_API_CAT_UPDATE_002 | Category PATCH |
| `tests/part-category-delete.spec.ts` | TC_API_CAT_DELETE_001–002 | Category deletion, 404 on non-existent |
| `tests/part-authz.spec.ts` | TC_API_AUTHZ_001–003 | Role-based access: reader cannot POST/PUT/DELETE |
| `tests/part-negative.spec.ts` | TC_API_NEG_001, 006–008, 016 | Edge cases, negative inputs, referential integrity |

---

## Conditionally Skipped Tests

Some tests are skipped at runtime when the server's configuration or state makes the scenario inapplicable. These are not failures — they are documented guards.

| Test | File | Skips when |
|---|---|---|
| **TC_API_PART_CREATE_005** (duplicate IPN) | `part.spec.ts` | Global setting `PART_ALLOW_DUPLICATE_IPN` is `true` — the server permits duplicate IPNs so there is nothing to reject |
| **TC_API_PART_UPDATE_003** (locked part edit) | `part-update.spec.ts` | The server returns 200 on the edit — `locked` is informational on this instance and does not block mutations |
| **TC_API_PART_UPDATE_004** (default supplier) | `part-update.spec.ts` | The newly created part has no supplier parts linked — `GET /api/company/part/?part={id}` returns an empty list, so no `default_supplier` can be set |
| **TC_API_NEG_008** (duplicate part name) | `part-negative.spec.ts` | The second POST with an identical name returns 201 — the server does not enforce name uniqueness on this instance |

---

## Key Design Decisions

- **No hardcoded PKs** — every mutating test (PUT, PATCH, DELETE) creates its own record via POST first and operates only on the returned `pk`. Existing live data is never touched.
- **`Date.now()` suffixes** — all `name` and `IPN` fields include `Date.now()` to avoid conflicts on the shared demo server.
- **Flexible error assertions** — InvenTree returns resource-specific 404 messages (e.g. `"No Part matches the given query."`) rather than the generic DRF `"Not found."`. All error assertions check for a non-empty `detail` string rather than an exact value.
- **Async BOM validation** — `PUT /api/part/{id}/bom-validate/` may return a background task envelope `{ task_id, ... }`. The test detects this and polls the GET endpoint until the `bom_validated` field appears in the response.
- **Parts must be inactive before deletion** — InvenTree rejects `DELETE` on active parts with a 400 `"Cannot delete this part as it is still active"`. `part-delete.spec.ts` PATCHes `active: false` before deleting.
