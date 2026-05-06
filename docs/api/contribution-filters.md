# Contribution Filters

**File:** `custom-ui/src/frontend/contribution-filters.ts`

---

## Overview

Implements a Theia `FilterContribution` that prevents selected frontend contributions from being
registered. This is how PlainScript removes entire feature areas (tests, SCM, debug panels, etc.)
from the UI.

---

## Functions

### `registerFilters`

```typescript
export function registerFilters({
  bind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void;
```

InversifyJS wiring entry point. Binds `RemoveFromUIFilterContribution` to Theia's
`FilterContribution` service.

| Action                                 | Service              | Implementation                   |
| -------------------------------------- | -------------------- | -------------------------------- |
| `bind(...).to(...).inSingletonScope()` | `FilterContribution` | `RemoveFromUIFilterContribution` |

---

## Classes

### `RemoveFromUIFilterContribution`

```typescript
@injectable()
export class RemoveFromUIFilterContribution implements FilterContribution
```

Registers one wildcard filter (`"*"`) that returns `false` for blocked contributions.

#### `registerContributionFilters(registry: ContributionFilterRegistry): void`

Adds a predicate that blocks contributions by:

1. **instance check** (`contrib instanceof SomeClass`) for imported test view contributions.
2. **constructor name check** for contributions listed in `filteredNames`.

If either condition matches, the contribution is filtered out.

---

## Filter Configuration

### `filteredInstances`

An array of imported test contribution classes from `@theia/test`:

- `TestViewContribution`
- `TestRunViewContribution`
- `TestResultViewContribution`
- `TestOutputViewContribution`

These are filtered via `instanceof` checks.

### `filteredNames`

A string list of constructor names filtered by runtime name matching:

- `DebugFrontendApplicationContribution`
- `DebugFrontendContribution`
- `ScmContribution`
- `OutlineViewContribution`
- `CallHierarchyContribution`
- `ProblemContribution`
- `PluginApiFrontendContribution`
- `PluginFrontendViewContribution`
- `WindowContribution`

This fallback exists so PlainScript does not need to import every module just to filter it.

---

## Maintenance Note

The constructor-name filtering is version-sensitive. If Theia renames any contribution class,
filtering can silently fail. The file includes a maintenance header with the last verified Theia
version and validation method. Re-verify these names on each Theia upgrade.
