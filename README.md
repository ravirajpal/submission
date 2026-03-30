# InvenTree Part Module — Test Submission

End-to-end testing submission for the InvenTree Part module. Covers API and UI automation, manual test cases, test plans, and reference documentation.

Target application: [InvenTree Demo](https://demo.inventree.org) — open-source inventory management system.

---

## Repository Structure

```
submission/
├── automation/
│   ├── api/          # API test suite (Playwright, TypeScript)
│   └── ui/           # UI E2E test suite (Playwright, TypeScript)
├── docs/             # Reference documentation
├── specs/            # Test plans
├── test-cases/       # Manual test cases
└── video/            # Screen recordings
```

---

## automation/api/

**Playwright API testing mode (TypeScript).** Tests exercise the InvenTree REST API directly via HTTP, using the `request` fixture.

| What's inside | Description |
|---|---|
| `tests/` | 11 spec files covering Part CRUD, Part Category CRUD, role-based authorization, and negative/edge cases |
| `fixtures/api.fixtures.ts` | Shared `apiContext` fixture with authenticated request context |
| `playwright.config.ts` | Four named projects: `api`, `part`, `part-category`, `authz` |
| `README.md` | How to run, test file table with IDs and coverage, skipped tests, design decisions |

Key test IDs: `TC_API_PART_*`, `TC_API_CAT_*`, `TC_API_AUTHZ_*`, `TC_API_NEG_*`

---

## automation/ui/

**Playwright E2E UI tests (TypeScript) with Page Object Model.** Tests drive the InvenTree React frontend through a real browser (Chromium).

| What's inside | Description |
|---|---|
| `tests/` | 7 spec files covering part creation (happy path, validation, duplicates) and cross-functional flows (CF-001, TC_CF_002) |
| `pages/` | 5 page objects: `PartsPage`, `AddPartModalPage`, `AddParameterModalPage`, `AddStockItemModalPage`, `PartDetailPage` |
| `fixtures/ui.fixtures.ts` | `authenticatedPage` fixture — logs in as `allaccess` before each test |
| `playwright.config.ts` | Single project: `chromium` (Desktop Chrome), sequential execution |
| `README.md` | How to run, test file table with IDs and coverage, page object descriptions, design decisions |

Key test IDs: `TC_PART_CREATE_001`, `TC_PART_CREATE_001_NEG1`, `TC_PART_CREATE_001_NEG2`, `TC_PART_CREATE_016`, `CF-001`, `TC_CF_002`

---

## docs/

Reference material used when writing tests and test plans.

| File | Description |
|---|---|
| `Inventree_API_schema.yaml` | Full OpenAPI 3.x schema for the InvenTree REST API. Used to verify endpoint paths, request/response shapes, and field constraints. |
| `InvenTree_Part_Module_Requirements_Understanding.md` | Analysed requirements for the InvenTree Part module — covers part creation rules, BOM behaviour, build order lifecycle, stock reconciliation, and authorization model. |

---

## specs/

Test plans produced by the Playwright MCP planner agent and refined manually.

| File | Description |
|---|---|
| `TC_PART_CREATE_001-test-plan.md` | Test plan for happy path and validation scenarios when creating a part (UI) |
| `TC_PART_CREATE_016-test-plan.md` | Test plan for duplicate part name rejection (UI) |
| `TC_CF_002-test-plan.md` | Test plan for the Assembly BOM → Build Order → Stock Reconciliation cross-functional flow (UI) |
| `cross-functional-flow-test-plan.md` | Broader cross-functional test plan covering CF-001 and TC_CF_002 scenarios |
| `README.md` | Short note on the specs directory purpose |

---

## test-cases/

Manual test case documentation.

| File | Description |
|---|---|
| `ui-manual-tests.md` | Manual test cases for the InvenTree UI — part creation, navigation, and validation scenarios |
| `api-manual-tests.xlsx` | Manual test cases for the InvenTree API — endpoint coverage, expected responses, and edge cases |

---

## video/

Screen recordings demonstrating test generation and execution workflows.

| File | Description |
|---|---|
| `api-automation-test-generation.mp4` | Recording of API automation test generation process |
| `api-manual-test-case-generation.mp4` | Recording of API manual test case generation |
| `ui-automation-correction-performed.mp4` | Recording of UI automation correction and healing workflow |
| `ui-manual-test-case-generation.mp4` | Recording of UI manual test case generation |

---

## Agent Artifacts

All AI agent configuration, prompts, and instructions used to produce this submission.

### `.github/copilot-instructions.md` — root agent config

The top-level system instruction file loaded by GitHub Copilot for every conversation in this workspace. It establishes:
- Project overview and workspace layout (`automation/api/`, `automation/ui/`)
- Pointers to the OpenAPI spec and requirements doc
- The scoped-instruction pattern: Copilot automatically loads `api.instructions.md` when working in `automation/api/**` and `ui.instructions.md` when working in `automation/ui/**`
- Hard rules (no mixed dependencies, no merged configs, always check the spec first)

### `.github/instructions/api.instructions.md` — API test instructions

Scoped to `automation/api/**`. Loaded automatically by Copilot when working on API tests. Contains:
- Stack declaration (Playwright API mode, TypeScript, DRF/InvenTree)
- The "golden rule": always read `docs/Inventree_API_schema.yaml` before writing tests
- Project structure map and file-naming conventions
- Full fixture API documentation (available fixtures, how to extend)
- Test-writing patterns, data-driven approach, `.env` variable usage

### `.github/instructions/ui.instructions.md` — UI test instructions

Scoped to `automation/ui/**`. Loaded automatically by Copilot when working on UI tests. Contains:
- Agent workflow: how to resolve a test case ID → manual test → automated spec
- Stack declaration (Playwright E2E, Chromium, Page Object Model)
- Mandatory fixture policy (`authenticatedPage`, never import from `@playwright/test` directly)
- Page object conventions and spec file naming rules
- Login/credential handling via `.env`

### `.github/agents/` — custom Playwright agent modes

Three `.agent.md` files that define purpose-built Copilot agents, each with a restricted tool set and an optional model pin:

| Agent | Purpose |
|---|---|
| `playwright-test-planner.agent.md` | Browses the live InvenTree app and produces structured test plans |
| `playwright-test-generator.agent.md` | Takes a test plan item and writes the Playwright spec file |
| `playwright-test-healer.agent.md` | Debugs failing tests using `test_run`, `test_debug`, and browser inspection tools; pinned to Claude Sonnet 4.6 |

### Manual test case instructions

Manual test case generation was driven by the same Copilot session using:
- `docs/InvenTree_Part_Module_Requirements_Understanding.md` — requirements understanding fed into prompts
- `docs/Inventree_API_schema.yaml` — spec used as ground truth for API manual tests
- Output stored in `test-cases/ui-manual-tests.md` and `test-cases/api-manual-tests.xlsx`

---

## Quick Start

### API Tests

```powershell
cd automation/api
npm install
npx playwright test --project=api
npx playwright show-report
```

### UI Tests

```powershell
cd automation/ui
npm install
npx playwright test --project=chromium
npx playwright show-report
```

> Both suites target `https://demo.inventree.org`. No local InvenTree instance is required.
