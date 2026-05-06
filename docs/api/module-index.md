# Module Entry Point

**File:** `custom-ui/src/frontend/index.ts`

---

## Overview

This file exports the single InversifyJS `ContainerModule` that Theia loads as a frontend plugin. It
is the root wiring point for all PlainScript customisations: every other module in `custom-ui`
exposes an `init*` or `register*` function that receives `bind` / `rebind` from here.

---

## Exported Symbol

### `default` — `ContainerModule`

```typescript
export default new ContainerModule((bind, unbind, isBound, rebind) => { … });
```

The default export is a Theia `ContainerModule`. Theia discovers it via the `theiaExtensions` field
in `custom-ui/package.json` and merges it into the application's InversifyJS container at startup.

#### Wiring Order

The module calls the init/register functions in this order:

| Call                                              | Source module                                                              | Effect                                                             |
| ------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `registerFilters({ bind, rebind })`               | [`contribution-filters.ts`](contribution-filters.md)                       | Blocks unwanted Theia contributions                                |
| `initCommands({ bind, rebind })`                  | [`commands-contributions.ts`](commands-contributions.md)                   | Unregisters built-in commands, registers custom commands and menus |
| `Navigator.initFileNavigator({ bind, rebind })`   | [`navigator-widget-factory.ts`](navigator-widget-factory.md)               | Replaces navigator factory, binds patched file widget              |
| `initOutputContribution({ bind, rebind })`        | [`output-toolbar-contribution.ts`](output-toolbar-contribution.md)         | Replaces output widget and toolbar contribution                    |
| `initKeyboardShortcutsContribution({ bind })`     | [`keyboard-shortcuts-contribution.ts`](keyboard-shortcuts-contribution.md) | Registers keyboard-shortcuts command and menu entry                |
| `AppShell.initApplicationShell({ bind, rebind })` | [`application-shell.ts`](application-shell.md)                             | Replaces shell and side-panel handler, binds layout contribution   |

---

## Source

```typescript title="custom-ui/src/frontend/index.ts"
import { ContainerModule } from '@theia/core/shared/inversify';

import { initCommands } from './commands-contributions';
import { registerFilters } from './contribution-filters';
import * as AppShell from './application-shell';
import * as Navigator from './navigator-widget-factory';
import { initKeyboardShortcutsContribution } from './keyboard-shortcuts-contribution';
import { initOutputContribution } from './output-toolbar-contribution';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  registerFilters({ bind, rebind });
  initCommands({ bind, rebind });
  Navigator.initFileNavigator({ bind, rebind });
  initOutputContribution({ bind, rebind });
  initKeyboardShortcutsContribution({ bind });
  AppShell.initApplicationShell({ bind, rebind });
});
```
