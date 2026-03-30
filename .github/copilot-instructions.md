# Copilot Instructions

## Project Overview
This is a monorepo with two workspaces:
- `/automation/api/` — API tests using playwright `requests` fixture
- `/automation/ui/` — Playwright-based E2E tests

This project integrates with **InvenTree**, an open-source inventory management system.
- InvenTree docs: https://docs.inventree.org
- InvenTree GitHub: https://github.com/inventree/InvenTree
- Requirement docs related to parts module is locally stored at: `docs\InvenTree_Part_Module_Requirements_Understanding.md`

## Scoped Instructions
More detailed instructions are scoped to each workspace — Copilot will apply these automatically based on the file you are working in:
- **UI tests** → `.github/instructions/ui.instructions.md` (applies to `automation/ui/**`)
  - Playwright MCP Agent, Page Object Model, fixtures, data-driven tests, screenshot on failure
- **API tests** → `.github/instructions/api.instructions.md` (applies to `automation/api/**`)
  - OpenAPI/Swagger spec-driven, Playwright API mode, fixtures, data-driven tests

Always read the relevant scoped instructions file before generating tests for either workspace.

## Subagent Invocation Rules
Scoped instruction files are **not** automatically injected into subagents. When invoking any subagent (e.g. `playwright-test-generator`, `playwright-test-healer`, `playwright-test-planner`):

1. **Read the scoped instructions file first** using `read_file` before constructing the subagent prompt.
2. **Include the full content of the scoped instructions** in the subagent prompt — either inline or as an explicit instruction to read the file at the start of execution.
3. For UI subagents, always include: *"Before writing any code, read and follow all rules in `.github/instructions/ui.instructions.md`"*
4. For API subagents, always include: *"Before writing any code, read and follow all rules in `.github/instructions/api.instructions.md`"*

Failure to pass scoped instructions to subagents will result in missing page objects, wrong imports, raw selectors in spec files, and other policy violations.

## General Rules
- Always check the OpenAPI spec at `docs\Inventree_API_schema.yaml` before writing API-related code or tests
- Follow existing naming conventions in each workspace
- Do not mix api/ and ui/ dependencies or test configs
- Each workspace has its own `playwright.config.ts` — do not merge them