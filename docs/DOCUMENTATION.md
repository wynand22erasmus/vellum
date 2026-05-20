# Code documentation standards

Vellum uses [TSDoc](https://tsdoc.org/) on TypeScript sources and [TypeDoc](https://typedoc.org/) to generate API reference sites (HTML and Markdown).

## Generated output

| Command | Output |
|---------|--------|
| `npm run docs:api` | `docs/api/html` and `docs/api/markdown` |
| `npm run docs:coverage` | Coverage report; updates `docs/doc-inventory.json` |
| `npm run docs:inventory` | Regenerate inventory without failing on threshold |

CI uploads `docs/api/**` as an artifact on each run.

## What to document

| Symbol | Required tags |
|--------|----------------|
| Exported function | Summary; `@param`, `@returns` when not obvious from types |
| Exported class / interface | Summary; `@remarks` for invariants or security notes |
| React component | Summary; document props via a named `*Props` interface when non-trivial |
| Module (file) | File-level `@packageDocumentation` describing responsibility |
| Internal helper | `@internal` — excluded from TypeDoc when `excludeInternal: true` |

Do not restate types that are already clear from TypeScript unless behavior matters (side effects, auth, TTLs, errors).

## Conventions

- **Summary line:** One sentence, imperative mood, under 120 characters.
- **`@internal`:** Non-public helpers; keeps generated docs focused on the app API.
- **`@see`:** Link to `docs/Vellum_Comprehensive_Design_Document.md`, Bruno requests, or `docs/CONFIG.md` instead of duplicating long prose.
- **Examples:** Use placeholder secrets (`dev-api-key-change-in-production`); never real credentials.
- **Generated code:** Do not edit `generated/` or `dist/`. Document `prisma/schema.prisma` with `///` comments.

## Non-TypeScript artifacts

| Artifact | Approach |
|----------|----------|
| `prisma/schema.prisma` | `///` on models, fields, enums |
| `bruno/**` | Bruno `docs { }` blocks (added in a later pass) |
| Docker / shell / CI YAML | File header comments; stack overview in [README.md](../README.md) |
| `.env.example` | Inline `#` comments mirrored in `docs/CONFIG.md` |

## Coverage gate

`npm run docs:coverage` fails when exported symbols in `src/` and `e2e/helpers.ts` lack a TSDoc summary. Minimum is controlled by `DOCS_COVERAGE_MIN` (default **95%**).

ESLint JSDoc rules should be enabled now that the 80% gate is met (next maintenance PR).

## Phased rollout

1. **Foundation** — `lib/env`, `lib/prisma`, `lib/redis`, `lib/utils`, theme modules, `prisma/schema.prisma`, `e2e/helpers.ts` ✓
2. **Services** — auth, storage, email, clamav ✓
3. **Jobs** — queues and workers ✓
4. **HTTP** — middleware, routes, app entrypoints ✓
5. **UI** — components and pages ✓
6. **Infra** — Docker, scripts, Bruno

See the project plan in chat history or your issue tracker for the full checklist.
