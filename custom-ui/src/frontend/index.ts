import { ContainerModule } from '@theia/core/shared/inversify';

import { initCommands } from './commands-contributions';
import { registerFilters } from './contribution-filters';
import * as appShell from './application-shell';
import * as navigator from './navigator-widget-factory';
import { initKeyboardShortcutsContribution } from './keyboard-shortcuts-contribution';
import { initOutputContribution } from './output-toolbar-contribution';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // Filter out modules we don't want to see in the editor
  registerFilters({ bind, rebind });

  // Register or unregister commands and menus
  initCommands({ bind, rebind });

  // SEARCH: Rebind Search in workspace to disable dragging to other containers
  // (No custom search widget configuration present)

  // EXPLORER: Rebind Navigation factory to remove open editors widget
  navigator.initFileNavigator({ bind, rebind });

  // OUTPUT: Rebind Output widget to disable closing
  initOutputContribution({ bind, rebind });
  initKeyboardShortcutsContribution({ bind });

  // Shell: Disable collapsing panels and dnd
  appShell.initApplicationShell({ bind, rebind });
});
