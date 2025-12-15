import { createFileTreeContainer } from '@theia/filesystem/lib/browser';
import { WidgetFactory } from '@theia/core/lib/browser';
import { nls } from '@theia/core/lib/common';
import { injectable, type interfaces } from '@theia/core/shared/inversify';
import { EXPLORER_VIEW_CONTAINER_ID, EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS, FILE_NAVIGATOR_ID, FileNavigatorModel, FileNavigatorWidget as TheiaFileNavigatorWidget, NavigatorDecoratorService, NavigatorWidgetFactory as TheiaNavigatorWidgetFactory } from '@theia/navigator/lib/browser';
import { FILE_NAVIGATOR_PROPS } from '@theia/navigator/lib/browser/navigator-container';
import { FileNavigatorTree } from '@theia/navigator/lib/browser/navigator-tree';
import type { ViewContainer } from '@theia/core/lib/browser';


export function initFileNavigator({ bind, rebind }: { bind: interfaces.Bind; rebind: interfaces.Rebind }): void {
    // EXPLORER: Rebind Navigation factory to remove open editors widget
    rebind(TheiaNavigatorWidgetFactory).to(NavigatorWidgetFactory).inSingletonScope();

    // EXPLORER: Patched files widget
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: FILE_NAVIGATOR_ID,
        createWidget: () => {
            return createFileTreeContainer(container, {
                // NOTE: This is our overrided widget
                widget: FileNavigatorWidget,
                // NOTE: This is standard Theia classes
                tree: FileNavigatorTree,
                model: FileNavigatorModel,
                decoratorService: NavigatorDecoratorService,
                props: FILE_NAVIGATOR_PROPS,
            }).get(FileNavigatorWidget);
        },
    })).inSingletonScope();
}

@injectable()
export class FileNavigatorWidget extends TheiaFileNavigatorWidget {
    protected override doUpdateRows(): void {
        super.doUpdateRows();

        // Rename tree root in UI to a simpler label
        this.title.label = nls.localizeByDefault('Files');
    }
}

@injectable()
export class NavigatorWidgetFactory extends TheiaNavigatorWidgetFactory {
    protected override fileNavigatorWidgetOptions: ViewContainer.Factory.WidgetOptions = {
        order: 0,
        // NOTE: Disable hiding from container
        canHide: false,
        initiallyCollapsed: false,
        weight: 120,
        disableDraggingToOtherContainers: true,
    };

    override async createWidget(): Promise<ViewContainer> {
        const viewContainer = this.viewContainerFactory({
            id: EXPLORER_VIEW_CONTAINER_ID,
            progressLocationId: 'explorer',
        });

        viewContainer.setTitleOptions({
            ...EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS,
            label: 'Files',
            // NOTE: Don't allow remove explorer from action bar
            closeable: false,
        });

        const navigatorWidget = await this.widgetManager.getOrCreateWidget(FILE_NAVIGATOR_ID);

        viewContainer.addWidget(navigatorWidget, this.fileNavigatorWidgetOptions);

        // NOTE: Removed open editors widget
        // const openEditorsWidget = await this.widgetManager.getOrCreateWidget(OpenEditorsWidget.ID);
        // viewContainer.addWidget(openEditorsWidget, this.openEditorsWidgetOptions);

        return viewContainer;
    }
}

