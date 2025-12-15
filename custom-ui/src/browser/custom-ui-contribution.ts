import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';

export const CustomUiCommand: Command = {
    id: 'CustomUi.command',
    label: 'Say Hello'
};

@injectable()
export class CustomUiCommandContribution implements CommandContribution {
    
    @inject(MessageService)
    protected readonly messageService!: MessageService;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(CustomUiCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class CustomUiMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: CustomUiCommand.id,
            label: CustomUiCommand.label
        });
    }
}
