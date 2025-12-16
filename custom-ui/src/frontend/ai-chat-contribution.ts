import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, nls, Command } from '@theia/core/lib/common';
import { inject, injectable, type interfaces } from '@theia/core/shared/inversify';
import { CommonMenus } from '@theia/core/lib/browser';
import { WidgetOpenHandler } from '@theia/core/lib/browser';
import { AIChatWidget } from './ai-chat-widget';

export const OPEN_AI_CHAT_COMMAND = Command.toLocalizedCommand({
    id: 'ai:openChat',
    label: 'AI Chat',
});

@injectable()
export class AIChatWidgetOpenHandler extends WidgetOpenHandler<AIChatWidget> {
    readonly id = AIChatWidget.ID;

    canHandle(): number {
        return 1;
    }

    async open(): Promise<AIChatWidget> {
        return super.open();
    }
}

@injectable()
export class AIChatCommandContribution implements CommandContribution, MenuContribution {
    @inject(AIChatWidgetOpenHandler)
    protected readonly openHandler!: AIChatWidgetOpenHandler;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OPEN_AI_CHAT_COMMAND, {
            execute: async() => {
                const widget = await this.openHandler.open();
                return widget;
            },
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        // Add AI Chat to View menu
        menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
            commandId: OPEN_AI_CHAT_COMMAND.id,
            label: OPEN_AI_CHAT_COMMAND.label,
            order: 'e',
        });
    }
}

export function initAIChatContribution({ bind }: { bind: interfaces.Bind }): void {
    bind(AIChatCommandContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(AIChatCommandContribution);

    bind(AIChatWidgetOpenHandler).toSelf().inSingletonScope();
    bind(WidgetOpenHandler).toService(AIChatWidgetOpenHandler);
}
