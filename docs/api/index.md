# API Reference

This section documents every exported symbol from the `custom-ui` Theia frontend plugin.

All source files live under `custom-ui/src/frontend/`.

---

## Modules

| Module                                                   | File                                 | Description                                                |
| -------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| [Module Entry Point](module-index.md)                    | `index.ts`                           | InversifyJS `ContainerModule` that wires all contributions |
| [Application Shell](application-shell.md)                | `application-shell.ts`               | Custom shell, side-panel, and default layout               |
| [Commands & Menus](commands-contributions.md)            | `commands-contributions.ts`          | Command constants, pruned/added commands and menu items    |
| [Contribution Filters](contribution-filters.md)          | `contribution-filters.ts`            | Filter unwanted Theia contributions out of the UI          |
| [Keyboard Shortcuts](keyboard-shortcuts-contribution.md) | `keyboard-shortcuts-contribution.ts` | Keyboard shortcuts reference command                       |
| [Navigator Widget](navigator-widget-factory.md)          | `navigator-widget-factory.ts`        | Custom file navigator (no Open Editors widget)             |
| [Output Toolbar](output-toolbar-contribution.md)         | `output-toolbar-contribution.ts`     | Locked output widget with hidden toolbar buttons           |

---

## Design Conventions

- All contribution classes are decorated with `@injectable()`.
- Injected Theia services are declared as `protected readonly` properties with `@inject()`.
- Init functions (`init*`, `register*`) accept `{ bind, rebind }` and handle all InversifyJS wiring,
  keeping classes free of container knowledge.
- `rebind` replaces an existing Theia binding; `bind` adds a new one.
