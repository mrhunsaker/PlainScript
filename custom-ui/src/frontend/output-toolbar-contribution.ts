import { injectable, type interfaces } from '@theia/core/shared/inversify';
import { OutputToolbarContribution as TheiaOutputToolbarContribution } from '@theia/output/lib/browser/output-toolbar-contribution';
import { OutputWidget as TheiaOutputWidget } from '@theia/output/lib/browser/output-widget';
import { OutputCommands } from '@theia/output/lib/browser/output-commands';

import type { TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

export const initOutputContribution = ({ bind, rebind }: { bind: interfaces.Bind; rebind: interfaces.Rebind }): void => {
    bind(OutputToolbarContribution).toSelf().inSingletonScope();
    rebind(TheiaOutputToolbarContribution).toService(OutputToolbarContribution);
    rebind(TheiaOutputWidget).to(OutputWidget).inSingletonScope();
};

@injectable()
export class OutputWidget extends TheiaOutputWidget {
    // NOTE: Locked by default
    protected _state: TheiaOutputWidget.State = { locked: true };
    
    constructor() {
        super();
        // NOTE: Don't show close
        this.title.closable = false;
    }
}

// Area in the right side of the output widget
@injectable()
export class OutputToolbarContribution extends TheiaOutputToolbarContribution {
    override registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): void {
        super.registerToolbarItems(toolbarRegistry);
        
        // NOTE: Hide clear, lock, unlock buttons
        toolbarRegistry.unregisterItem(OutputCommands.CLEAR__WIDGET.id);
        toolbarRegistry.unregisterItem(OutputCommands.LOCK__WIDGET.id);
        toolbarRegistry.unregisterItem(OutputCommands.UNLOCK__WIDGET.id);
    }
}
