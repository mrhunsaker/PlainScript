# Keyboard Shortcuts Contribution

**File:** `custom-ui/src/frontend/keyboard-shortcuts-contribution.ts`

---

## Overview

Defines a custom command that opens a generated plain-text keyboard shortcuts reference in an editor
tab using a `data:` URI. Also adds the command to **View → Views**.

---

## Functions

### `initKeyboardShortcutsContribution`

```typescript
export function initKeyboardShortcutsContribution({ bind }: { bind: interfaces.Bind }): void;
```

InversifyJS wiring entry point.

| Action                                                               | Service              |
| -------------------------------------------------------------------- | -------------------- |
| `bind(KeyboardShortcutsContribution).toSelf().inSingletonScope()`    | Class self-binding   |
| `bind(CommandContribution).toService(KeyboardShortcutsContribution)` | Command registration |
| `bind(MenuContribution).toService(KeyboardShortcutsContribution)`    | Menu registration    |

---

## Constants

### `KEYBOARD_SHORTCUTS_COMMAND`

```typescript
export const KEYBOARD_SHORTCUTS_COMMAND = Command.toLocalizedCommand({
  id: 'plainscript:keyboardShortcuts',
  label: 'Keyboard Shortcuts Reference',
});
```

| Field   | Value                             |
| ------- | --------------------------------- |
| `id`    | `"plainscript:keyboardShortcuts"` |
| `label` | `"Keyboard Shortcuts Reference"`  |

### `SHORTCUTS_TEXT` _(internal)_

Multiline text blob built by joining an array with `"\n"`. It contains shortcut sections:

- GENERAL
- FILE
- EDIT
- VIEW
- NAVIGATION
- ACCESSIBILITY

---

## Classes

### `KeyboardShortcutsContribution`

```typescript
@injectable()
export class KeyboardShortcutsContribution
  implements CommandContribution, MenuContribution
```

#### Injected Dependencies

| Property        | Type            | Purpose                                            |
| --------------- | --------------- | -------------------------------------------------- |
| `openerService` | `OpenerService` | Opens generated `data:text/plain` URI in an editor |

#### `registerCommands(registry: CommandRegistry): void`

Registers `KEYBOARD_SHORTCUTS_COMMAND` with this execution flow:

1. Build a `URI` using `data:text/plain;charset=utf-8,` + `encodeURIComponent(SHORTCUTS_TEXT)`.
2. Call `open(openerService, uri, { mode: "reveal" })`.

Result: an editor tab opens with the keyboard reference text.

#### `registerMenus(menus: MenuModelRegistry): void`

Adds a menu action under `CommonMenus.VIEW_VIEWS`:

| Field       | Value                              |
| ----------- | ---------------------------------- |
| `commandId` | `KEYBOARD_SHORTCUTS_COMMAND.id`    |
| `label`     | `KEYBOARD_SHORTCUTS_COMMAND.label` |
| `order`     | `"z"`                              |
