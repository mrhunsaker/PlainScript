# Application Shell

**File:** `custom-ui/src/frontend/application-shell.ts`

---

## Overview

Replaces Theia's default `ApplicationShell` and `SidePanelHandler` to implement PlainScript's
top-oriented tab layout and accessibility-focused panel management. Also provides a
`FrontendApplicationContribution` that opens the default view layout once Theia has initialised.

---

## Functions

### `initApplicationShell`

```typescript
export function initApplicationShell({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void;
```

InversifyJS wiring entry point. Called from the root `ContainerModule`.

**Bindings applied:**

| Action   | From                              | To                                      |
| -------- | --------------------------------- | --------------------------------------- |
| `rebind` | `TheiaApplicationShell`           | `ApplicationShell` (singleton)          |
| `rebind` | `TheiaSidePanelHandler`           | `SidePanelHandler` (singleton)          |
| `bind`   | —                                 | `ShellInitContribution` (singleton)     |
| `bind`   | `FrontendApplicationContribution` | `ShellInitContribution` (service alias) |

---

## Classes

### `ShellInitContribution`

```typescript
@injectable()
export class ShellInitContribution extends DefaultFrontendApplicationContribution
```

A `FrontendApplicationContribution` that opens the default panel layout when Theia is ready.

#### Injected Dependencies

| Property                | Type                                    | Purpose                                            |
| ----------------------- | --------------------------------------- | -------------------------------------------------- |
| `navigatorContribution` | `FileNavigatorContribution`             | Opens the Files panel in the left area             |
| `searchContribution`    | `SearchInWorkspaceFrontendContribution` | Opens the Search panel (hidden) in the left area   |
| `outputContribution`    | `OutputContribution`                    | Opens the Output panel in the bottom area          |
| `appStateService`       | `FrontendApplicationStateService`       | Listens for the `"ready"` state to add a CSS class |

#### Methods

| Method                    | Return          | Description                                                                                     |
| ------------------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| `onDidInitializeLayout()` | `Promise<void>` | Calls `openDefaultLayout()` after Theia has built the initial layout                            |
| `onStart()`               | `Promise<void>` | Adds `theia-app-ready` CSS class to `document.body` when state is `"ready"`                     |
| `openDefaultLayout()`     | `Promise<void>` | Opens Navigator (left, rank 100), Search (left hidden, rank 200), and Output (bottom, revealed) |

---

### `SidePanelHandler`

```typescript
@injectable()
export class SidePanelHandler extends TheiaSidePanelHandler
```

Overrides Theia's `SidePanelHandler` to reposition the tab bar to the **top** of the side panel and
to prevent panel collapsing (keeping tabs always visible for accessibility).

#### Overridden Methods

##### `createSideBar(): SideTabBar`

Calls `super.createSideBar()`, then:

- Sets `tabsMovable = false` — prevents accidental reordering.
- Removes Theia's positional CSS classes (`theia-app-left`, `theia-app-right`).
- Adds `theia-app-top` — triggers the top-oriented tab-bar CSS.

##### `createContainer(): Panel`

Builds a vertical `BoxLayout` (`top-to-bottom`) that stacks:

1. A `headerPanel` (role=`navigation`, aria-label=`"Editor panel navigation"`) containing the tab
   bar and top menu.
2. The toolbar.
3. The dock panel.

This places tabs above content instead of Theia's default side position.

##### `collapse(): Promise<void>`

```typescript
override async collapse(): Promise<void> {
  return;   // no-op — prevents panels from collapsing
}
```

Disabling collapse ensures keyboard users can never accidentally hide a panel.

---

### `ApplicationShell`

```typescript
@injectable()
export class ApplicationShell extends TheiaApplicationShell
```

Overrides Theia's `ApplicationShell` to set initial panel size ratios and to redirect `"right"` area
widget insertions to the `"left"` area.

#### `@postConstruct() init()`

Runs after InversifyJS construction. Applies these panel defaults before calling `super.init()`:

| Panel         | Option             | Value  | Rationale                      |
| ------------- | ------------------ | ------ | ------------------------------ |
| `leftPanel`   | `initialSizeRatio` | `0.25` | 25 % of window width           |
| `bottomPanel` | `emptySize`        | `0`    | Collapse to zero when empty    |
| `bottomPanel` | `expandDuration`   | `0`    | No animation on expand         |
| `bottomPanel` | `initialSizeRatio` | `0.2`  | 20 % of window height          |
| `rightPanel`  | `emptySize`        | `0`    | Right panel effectively hidden |
| `rightPanel`  | `expandThreshold`  | `0`    | —                              |
| `rightPanel`  | `initialSizeRatio` | `0`    | Right panel starts collapsed   |

#### `getInsertionOptions`

```typescript
getInsertionOptions(
  options?: TheiaApplicationShell.WidgetOptions
): TheiaApplicationShell.WidgetOptions
```

Redirects any widget that requests `area: "right"` to `area: "left"`, preventing an unused right
panel from appearing. Delegates to `super.getInsertionOptions` after the area redirect.

#### `handleEvent`

Overrides event handling to suppress `lm-dragenter`, `lm-dragover`, and `lm-drop` events, which
disables drag-and-drop panel rearrangement entirely.
