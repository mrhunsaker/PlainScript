import { ContainerModule } from '@theia/core/shared/inversify';

import { initCommands } from './commands-contributions';
import { registerFilters } from './contribution-filters';
import * as AppShell from './application-shell';
import * as Navigator from './navigator-widget-factory';
import { initOutputContribution } from './output-toolbar-contribution';
import { initAIChatContribution } from './ai-chat-contribution';
import { AIChatWidget } from './ai-chat-widget';
import { AIService } from './ai-service';
import { WidgetFactory } from '@theia/core/lib/browser';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    // Filter out modules we don't want to see in the editor
    registerFilters({ bind, rebind });

    // Register or unregister commands and menus
    initCommands({ bind, rebind });

    // SEARCH: Rebind Search in workspace to disable dragging to other containers
    // (No custom search widget configuration present)

    // EXPLORER: Rebind Navigation factory to remove open editors widget
    Navigator.initFileNavigator({ bind, rebind });

    // OUTPUT: Rebind Output widget to disable closing
    initOutputContribution({ bind, rebind });

    // AI: Register AI Chat service and widget
    bind(AIService).toSelf().inSingletonScope();
    bind(AIChatWidget).toSelf();
    bind(WidgetFactory).toDynamicValue((context) => ({
        id: AIChatWidget.ID,
        createWidget: () => context.container.get(AIChatWidget),
    })).inSingletonScope();
    initAIChatContribution({ bind });

    // Shell: Disable collapsing panels and dnd
    AppShell.initApplicationShell({ bind, rebind });
});