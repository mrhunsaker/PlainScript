# Output Toolbar Contribution

**File:** `custom-ui/src/frontend/output-toolbar-contribution.ts`

---

## Overview

Customises Theia's output view to keep it always available and stable:

- Output widget starts in a locked state.
- Output tab is not closeable.
- Toolbar buttons for clear/lock/unlock are removed.

---

## Functions

### `initOutputContribution`

```typescript
export const initOutputContribution = ({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void
```

InversifyJS wiring entry point.

#### Bindings

| Action   | From                             | To                                           |
| -------- | -------------------------------- | -------------------------------------------- |
| `bind`   | —                                | `OutputToolbarContribution` (self singleton) |
| `rebind` | `TheiaOutputToolbarContribution` | `OutputToolbarContribution`                  |
| `rebind` | `TheiaOutputWidget`              | `OutputWidget` (singleton)                   |

---

## Classes

### `OutputWidget`

```typescript
@injectable()
export class OutputWidget extends TheiaOutputWidget
```

#### Custom State

```typescript
protected _state: TheiaOutputWidget.State = { locked: true };
```

Starts with output locked.

#### Constructor

Calls `super()` then sets:

```typescript
this.title.closable = false;
```

This prevents users from closing the Output tab.

---

### `OutputToolbarContribution`

```typescript
@injectable()
export class OutputToolbarContribution extends TheiaOutputToolbarContribution
```

#### `registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): void`

Calls `super.registerToolbarItems(toolbarRegistry)` first, then unregisters:

| Toolbar item id                    | Command       |
| ---------------------------------- | ------------- |
| `OutputCommands.CLEAR__WIDGET.id`  | Clear output  |
| `OutputCommands.LOCK__WIDGET.id`   | Lock output   |
| `OutputCommands.UNLOCK__WIDGET.id` | Unlock output |

Result: output toolbar is simplified and immutable for end users.
