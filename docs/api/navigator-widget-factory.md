# Navigator Widget Factory

**File:** `custom-ui/src/frontend/navigator-widget-factory.ts`

---

## Overview

Replaces Theia's default navigator widget factory to keep the explorer focused and minimal:

- Keeps only the Files tree widget.
- Removes the Open Editors widget from the explorer container.
- Prevents dragging the widget to other containers.
- Renames the view title to `Files`.

---

## Functions

### `initFileNavigator`

```typescript
export function initFileNavigator({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void;
```

InversifyJS wiring entry point.

#### Bindings

| Action   | From                          | To                                                                      |
| -------- | ----------------------------- | ----------------------------------------------------------------------- |
| `rebind` | `TheiaNavigatorWidgetFactory` | `NavigatorWidgetFactory` (singleton)                                    |
| `bind`   | `WidgetFactory`               | Dynamic factory for `FILE_NAVIGATOR_ID` returning `FileNavigatorWidget` |

The dynamic widget factory uses `createFileTreeContainer(...)` with custom widget + standard Theia
tree/model/decorator services.

---

## Classes

### `FileNavigatorWidget`

```typescript
@injectable()
export class FileNavigatorWidget extends TheiaFileNavigatorWidget
```

Overrides `doUpdateRows()`:

1. Calls `super.doUpdateRows()`.
2. Sets `this.title.label = nls.localizeByDefault("Files")`.

This ensures the tree root label is consistently `Files`.

---

### `NavigatorWidgetFactory`

```typescript
@injectable()
export class NavigatorWidgetFactory extends TheiaNavigatorWidgetFactory
```

Customises explorer container composition and widget options.

#### Overridden Property

##### `fileNavigatorWidgetOptions`

```typescript
protected override fileNavigatorWidgetOptions: ViewContainer.Factory.WidgetOptions = {
  order: 0,
  canHide: false,
  initiallyCollapsed: false,
  weight: 120,
  disableDraggingToOtherContainers: true,
};
```

| Option                             | Value   | Effect                                 |
| ---------------------------------- | ------- | -------------------------------------- |
| `canHide`                          | `false` | Files widget cannot be hidden          |
| `disableDraggingToOtherContainers` | `true`  | Prevents moving widget out of explorer |
| `order`                            | `0`     | Appears first in container             |
| `weight`                           | `120`   | Theia layout weight                    |

#### `createWidget(): Promise<ViewContainer>`

Creates explorer container with id `EXPLORER_VIEW_CONTAINER_ID`, then:

1. Sets container title options with label `Files` and `closeable: false`.
2. Gets/creates `FILE_NAVIGATOR_ID` widget.
3. Adds only navigator widget to container.
4. Omits Theia's Open Editors widget (commented out intentionally).

Returns the configured `ViewContainer`.
