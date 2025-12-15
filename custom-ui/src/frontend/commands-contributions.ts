import { CommonCommands, CommonMenus } from '@theia/core/lib/browser';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, nls } from '@theia/core/lib/common';
import { inject, type interfaces } from '@theia/core/shared/inversify';
import { EditorCommands } from '@theia/editor/lib/browser';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { SearchInWorkspaceFrontendContribution } from '@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution';
import { TerminalCommands, TerminalMenus } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { WorkspaceCommands } from '@theia/workspace/lib/browser';

// Local definition matching Theia's toggle output command id
export const TOGGLE_OUTPUT_COMMAND = Command.toLocalizedCommand({
    id: 'output:toggle',
    label: 'Output',
});

export const SHOW_EXPLORER_COMMAND = Command.toLocalizedCommand({
    id: 'fileNavigator:activate',
    label: 'Files',
});

export const SHOW_SEARCH_COMMAND = Command.toLocalizedCommand({
    id: 'searchInWorkspace:activate',
    label: 'Search',
});

class MyCommandsContribution implements CommandContribution, MenuContribution {
    @inject(FileNavigatorContribution)
    protected readonly fileNavigatorContribution!: FileNavigatorContribution;

    @inject(SearchInWorkspaceFrontendContribution)
    protected readonly searchInWorkspaceFrontendContribution!: SearchInWorkspaceFrontendContribution;

    registerCommands(registry: CommandRegistry): void {
        // Register spy to log any commands
        this._spyCommands(registry);

        // Remove about comand + menu
        registry.unregisterCommand(CommonCommands.ABOUT_COMMAND);

        // Remove workspace commands
        registry.unregisterCommand(WorkspaceCommands.OPEN_WORKSPACE);
        registry.unregisterCommand(WorkspaceCommands.OPEN_WORKSPACE_FILE);
        registry.unregisterCommand(WorkspaceCommands.OPEN_RECENT_WORKSPACE);
        registry.unregisterCommand(WorkspaceCommands.SAVE_WORKSPACE_AS);

        // Disable splits other than horizontal
        registry.unregisterCommand(TerminalCommands.SPLIT);
        registry.unregisterCommand(EditorCommands.SPLIT_EDITOR_LEFT);
        registry.unregisterCommand(EditorCommands.SPLIT_EDITOR_RIGHT);
        registry.unregisterCommand(EditorCommands.SPLIT_EDITOR_DOWN);
        registry.unregisterCommand(EditorCommands.SPLIT_EDITOR_UP);
        registry.unregisterCommand(EditorCommands.SPLIT_EDITOR_VERTICAL);

        // Register Open Explorer and Search commands
        registry.registerCommand(SHOW_EXPLORER_COMMAND, {
            execute: async() => this.fileNavigatorContribution.openView({ activate: true, reveal: true }),
        });

        registry.registerCommand(SHOW_SEARCH_COMMAND, {
            execute: async() => this.searchInWorkspaceFrontendContribution.openView({ activate: true, reveal: true }),
        });

        // No-op for NEW_UNTITLED_TEXT_FILE to prevent empty file creation on double click
        registry.registerCommand(CommonCommands.NEW_UNTITLED_TEXT_FILE, {
            execute: () => null,
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        // Remove Menu -> Help
        menus.unregisterMenuAction(CommonMenus.HELP.at(-1) as string, CommonMenus.HELP.slice(0, -1));

        // Remove Menu -> Terminal
        menus.unregisterMenuAction(TerminalMenus.TERMINAL.at(-1) as string, TerminalMenus.TERMINAL.slice(0, -1));

        // Remove Menu -> View (will be recreated)
        menus.unregisterMenuAction(CommonMenus.VIEW.at(-1) as string, CommonMenus.VIEW.slice(0, -1));

        // Recreate: Menu -> View
        menus.registerSubmenu(CommonMenus.VIEW, nls.localizeByDefault('View'));

        // Create Menu -> View -> Explorer
        menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
            commandId: SHOW_EXPLORER_COMMAND.id,
            label: SHOW_EXPLORER_COMMAND.label,
            order: 'a',
        });

        // Create Menu -> View -> Search
        menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
            commandId: SHOW_SEARCH_COMMAND.id,
            label: SHOW_SEARCH_COMMAND.label,
            order: 'b',
        });

        // Create Menu -> View -> Output
        menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
            commandId: TOGGLE_OUTPUT_COMMAND.id,
            label: TOGGLE_OUTPUT_COMMAND.label,
            order: 'c',
        });

        // Create Menu -> View -> Terminal
        menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
            commandId: TerminalCommands.TOGGLE_TERMINAL.id,
            label: TerminalCommands.TOGGLE_TERMINAL.label,
            order: 'd',
        });
    }

    private _spyCommands(registry: CommandRegistry): void {
        const original = registry.executeCommand.bind(registry);

        registry.executeCommand = async(name: string, ...args: any[]) => {
            console.log(
                '[FLEXBE-UI] Command executed: %c%s%c with args:',
                'color: #1976d2; font-weight: bold;',
                name,
                '',
                args
            );

            return original(name, ...args);
        };
    }
}

export function initCommands({ bind, rebind }: { bind: interfaces.Bind; rebind: interfaces.Rebind }): void {
    bind(CommandContribution).to(MyCommandsContribution).inSingletonScope();
}

