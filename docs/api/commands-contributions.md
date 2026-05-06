# Commands & Menus

**File:** `custom-ui/src/frontend/commands-contributions.ts`

---

## Overview

Prunes unwanted built-in Theia commands and menu items, then registers PlainScript's own commands
for opening the Files panel, the Search panel, and toggling the Output panel.

---

## Functions

### `initCommands`

```typescript
export function initCommands({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void;
```

InversifyJS wiring entry point. Called from the root `ContainerModule`.

Binds `MyCommandsContribution` as both a `CommandContribution` and (implicitly via the class
implementation) `MenuContribution`.

---

## Constants

### `TOGGLE_OUTPUT_COMMAND`

```typescript
export const TOGGLE_OUTPUT_COMMAND = Command.toLocalizedCommand({
  id: 'output:toggle',
  label: 'Output',
});
```

Wraps Theia's built-in output-toggle command id so it can be added to the View menu.

| Field   | Value             |
| ------- | ----------------- |
| `id`    | `"output:toggle"` |
| `label` | `"Output"`        |

---

### `SHOW_EXPLORER_COMMAND`

```typescript
export const SHOW_EXPLORER_COMMAND = Command.toLocalizedCommand({
  id: 'fileNavigator:activate',
  label: 'Files',
});
```

Command that activates and reveals the file navigator (Files panel).

| Field   | Value                      |
| ------- | -------------------------- |
| `id`    | `"fileNavigator:activate"` |
| `label` | `"Files"`                  |

---

### `SHOW_SEARCH_COMMAND`

```typescript
export const SHOW_SEARCH_COMMAND = Command.toLocalizedCommand({
  id: 'searchInWorkspace:activate',
  label: 'Search',
});
```

Command that activates and reveals the search-in-workspace panel.

| Field   | Value                          |
| ------- | ------------------------------ |
| `id`    | `"searchInWorkspace:activate"` |
| `label` | `"Search"`                     |

---

## Classes

### `MyCommandsContribution` _(internal)_

```typescript
class MyCommandsContribution implements CommandContribution, MenuContribution
```

Not exported directly — bound through `initCommands`.

#### Injected Dependencies

| Property                                | Type                                    | Purpose                       |
| --------------------------------------- | --------------------------------------- | ----------------------------- |
| `fileNavigatorContribution`             | `FileNavigatorContribution`             | Used to open the Files panel  |
| `searchInWorkspaceFrontendContribution` | `SearchInWorkspaceFrontendContribution` | Used to open the Search panel |

#### `registerCommands(registry: CommandRegistry): void`

Unregisters the following built-in commands (removes them from the command palette and keyboard
shortcuts):

| Removed command                           | Reason                             |
| ----------------------------------------- | ---------------------------------- |
| `CommonCommands.ABOUT_COMMAND`            | Hides "About" menu entry           |
| `WorkspaceCommands.OPEN_WORKSPACE`        | No multi-workspace support needed  |
| `WorkspaceCommands.OPEN_WORKSPACE_FILE`   | —                                  |
| `WorkspaceCommands.OPEN_RECENT_WORKSPACE` | —                                  |
| `WorkspaceCommands.SAVE_WORKSPACE_AS`     | —                                  |
| `TerminalCommands.SPLIT`                  | Only horizontal splits are allowed |
| `EditorCommands.SPLIT_EDITOR_LEFT`        | —                                  |
| `EditorCommands.SPLIT_EDITOR_RIGHT`       | —                                  |
| `EditorCommands.SPLIT_EDITOR_DOWN`        | —                                  |
| `EditorCommands.SPLIT_EDITOR_UP`          | —                                  |
| `EditorCommands.SPLIT_EDITOR_VERTICAL`    | —                                  |

Then registers:

| Registered command      | Handler                                             |
| ----------------------- | --------------------------------------------------- |
| `SHOW_EXPLORER_COMMAND` | Opens Files panel (`activate: true, reveal: true`)  |
| `SHOW_SEARCH_COMMAND`   | Opens Search panel (`activate: true, reveal: true`) |

#### `registerMenus(menus: MenuModelRegistry): void`

Removes the **Help** top-level menu and registers the following entries under **View → Views**:

| Menu entry | Command                            | Order |
| ---------- | ---------------------------------- | ----- |
| Files      | `SHOW_EXPLORER_COMMAND`            | `"a"` |
| Search     | `SHOW_SEARCH_COMMAND`              | `"b"` |
| Output     | `TOGGLE_OUTPUT_COMMAND`            | `"c"` |
| Terminal   | `TerminalCommands.TOGGLE_TERMINAL` | `"d"` |
