import './style/application-shell.less';
import './style/side-panel.less';

import { ApplicationShell as TheiaApplicationShell, BoxLayout, BoxPanel, FrontendApplicationContribution, Panel, SidePanelHandler as TheiaSidePanelHandler, type SideTabBar } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { TheiaSplitPanel } from '@theia/core/lib/browser/shell/theia-split-panel';
import { DefaultFrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application-contribution';
import { inject, injectable, postConstruct, type interfaces } from '@theia/core/shared/inversify';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { OutputContribution } from '@theia/output/lib/browser/output-contribution';
import { SearchInWorkspaceFrontendContribution } from '@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution';

export function initApplicationShell({ bind, rebind }: { bind: interfaces.Bind; rebind: interfaces.Rebind }): void {
    // Replace shell with our customized version
    rebind(TheiaApplicationShell).to(ApplicationShell).inSingletonScope();

    // Replace side panel handler to move to top layout
    rebind(TheiaSidePanelHandler).to(SidePanelHandler);

    // Shell initialization contribution to prepare default layout
    bind(ShellInitContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(ShellInitContribution);
}

@injectable()
export class ShellInitContribution extends DefaultFrontendApplicationContribution {
    @inject(FileNavigatorContribution)
    protected readonly navigatorContribution!: FileNavigatorContribution;

    @inject(SearchInWorkspaceFrontendContribution)
    protected readonly searchContribution!: SearchInWorkspaceFrontendContribution;

    @inject(OutputContribution)
    protected readonly outputContribution!: OutputContribution;

    @inject(FrontendApplicationStateService)
    protected readonly appStateService!: FrontendApplicationStateService;

    async onDidInitializeLayout(): Promise<void> {
        await this.openDefaultLayout();
    }

    async onStart(): Promise<void> {
        this.appStateService.onStateChanged((state) => {
            if (state === 'ready') {
                document.body.classList.add('theia-app-ready');
            }
        });
    }

    protected async openDefaultLayout(): Promise<void> {
        await this.navigatorContribution.openView({
            area: 'left',
            reveal: true,
            rank: 100,
        });

        await this.searchContribution.openView({
            area: 'left',
            reveal: false,
            rank: 200,
        });

        void this.outputContribution.openView({
            area: 'bottom',
            reveal: true,
        });
    }
}

/**
 * Custom side panel handler: move side tabs to the top bar and prevent collapsing/dragging.
 */
@injectable()
export class SidePanelHandler extends TheiaSidePanelHandler {
    protected override createSideBar(): SideTabBar {
        const sideBar = super.createSideBar();

        sideBar.tabsMovable = false;
        sideBar.removeClass('theia-app-left');
        sideBar.removeClass('theia-app-right');
        sideBar.addClass('theia-app-top');

        return sideBar;
    }

    protected override createContainer(): Panel {
        this.tabBar.orientation = 'horizontal';

        const sidePanelLayout = new BoxLayout({ direction: 'top-to-bottom', spacing: 0 });
        const container = new BoxPanel({ layout: sidePanelLayout });
        const headerPanel = new Panel();

        BoxPanel.setStretch(headerPanel, 0);
        sidePanelLayout.addWidget(headerPanel);

        BoxPanel.setStretch(this.toolBar, 0);
        sidePanelLayout.addWidget(this.toolBar);

        BoxPanel.setStretch(this.dockPanel, 1);
        sidePanelLayout.addWidget(this.dockPanel);

        BoxPanel.setStretch(this.tabBar, 1);
        headerPanel.addWidget(this.tabBar);

        BoxPanel.setStretch(this.topMenu, 0);
        headerPanel.addWidget(this.topMenu);

        headerPanel.addClass('theia-header-panel');
        container.id = `theia-${ this.side }-content-panel`;

        return container;
    }

    // Disable collapse to keep tabs visible
    override async collapse(): Promise<void> { return; }
}

@injectable()
export class ApplicationShell extends TheiaApplicationShell {
    @postConstruct()
    protected init(): void {
        this.options = {
            leftPanel: {
                ...this.options.leftPanel,
                initialSizeRatio: 0.25,
            },
            bottomPanel: {
                ...this.options.bottomPanel,
                emptySize: 0,
                expandDuration: 0,
                initialSizeRatio: 0.2,
            },
            rightPanel: {
                ...this.options.rightPanel,
                emptySize: 0,
                expandThreshold: 0,
                initialSizeRatio: 0,
            },
        };

        super.init();
    }

    getInsertionOptions(options?: TheiaApplicationShell.WidgetOptions) {
        if (options?.area === 'right') {
            options.area = 'left';
        }
        return super.getInsertionOptions(options);
    }

    override handleEvent(event: Event): void {
        switch (event.type) {
            case 'lm-dragenter':
            case 'lm-dragleave':
            case 'lm-dragover':
            case 'lm-drop':
                return;
        }
        return super.handleEvent(event);
    }

    /**
     * Create a custom layout with spacing between panels.
     */
    protected createLayout() {
        const SPACING = 6;

        const bottomSplitLayout = this.createSplitLayout(
            [this.mainPanel, this.bottomPanel],
            [1, 0],
            { orientation: 'vertical', spacing: SPACING }
        );
        const panelForBottomArea = new TheiaSplitPanel({ layout: bottomSplitLayout });
        panelForBottomArea.id = 'theia-bottom-split-panel';

        const leftRightSplitLayout = this.createSplitLayout(
            [this.leftPanelHandler.container, panelForBottomArea, this.rightPanelHandler.container],
            [0, 1, 0],
            { orientation: 'horizontal', spacing: SPACING }
        );
        const mainIDEPanel = new TheiaSplitPanel({ layout: leftRightSplitLayout });
        mainIDEPanel.id = 'theia-main-ide-panel';

        return this.createBoxLayout(
            [this.topPanel, mainIDEPanel, this.statusBar],
            [0, 1, 0],
            { direction: 'top-to-bottom', spacing: 0 }
        );
    }
}
