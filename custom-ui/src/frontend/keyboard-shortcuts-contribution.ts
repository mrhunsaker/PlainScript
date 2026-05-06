import { CommonMenus } from '@theia/core/lib/browser';
import { open, OpenerService } from '@theia/core/lib/browser/opener-service';
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
} from '@theia/core/lib/common';
import uriCtor from '@theia/core/lib/common/uri';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

export const KEYBOARD_SHORTCUTS_COMMAND = Command.toLocalizedCommand({
  id: 'plainscript:keyboardShortcuts',
  label: 'Keyboard Shortcuts Reference',
});

const SHORTCUTS_TEXT = [
  'PlainScript - Keyboard Shortcuts',
  '='.repeat(40),
  '',
  'GENERAL',
  '  Ctrl/Cmd+Shift+P    Command Palette',
  '  Ctrl/Cmd+P          Quick Open File',
  '  Ctrl/Cmd+,          Open Preferences',
  '',
  'FILE',
  '  Ctrl/Cmd+N          New File',
  '  Ctrl/Cmd+O          Open File',
  '  Ctrl/Cmd+S          Save',
  '  Ctrl/Cmd+Shift+S    Save As',
  '  Ctrl/Cmd+W          Close Tab',
  '',
  'EDIT',
  '  Ctrl/Cmd+Z          Undo',
  '  Ctrl/Cmd+Y          Redo',
  '  Ctrl/Cmd+X          Cut',
  '  Ctrl/Cmd+C          Copy',
  '  Ctrl/Cmd+V          Paste',
  '  Ctrl/Cmd+A          Select All',
  '  Ctrl/Cmd+F          Find',
  '  Ctrl/Cmd+H          Find and Replace',
  '  Ctrl/Cmd+G          Go to Line',
  '',
  'VIEW',
  '  Ctrl/Cmd+Shift+E    Show Files Panel',
  '  Ctrl/Cmd+Shift+F    Show Search Panel',
  '  Ctrl/Cmd+`          Toggle Terminal',
  '  Ctrl/Cmd+J          Toggle Output Panel',
  '',
  'NAVIGATION',
  '  Ctrl/Cmd+Tab        Cycle Open Editors',
  '  Alt+Left            Go Back',
  '  Alt+Right           Go Forward',
  '  F12                 Go to Definition',
  '  Shift+F12           Find All References',
  '',
  'ACCESSIBILITY',
  '  Tab / Shift+Tab     Move focus between panels',
  '  F6                  Focus next panel group',
  '  Escape              Close dialog / dismiss',
].join('\n');

@injectable()
export class KeyboardShortcutsContribution implements CommandContribution, MenuContribution {
  @inject(OpenerService)
  protected readonly openerService!: OpenerService;

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(KEYBOARD_SHORTCUTS_COMMAND, {
      execute: async () => {
        const uri = new uriCtor(
          `data:text/plain;charset=utf-8,${encodeURIComponent(SHORTCUTS_TEXT)}`
        );
        await open(this.openerService, uri, { mode: 'reveal' });
      },
    });
  }

  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
      commandId: KEYBOARD_SHORTCUTS_COMMAND.id,
      label: KEYBOARD_SHORTCUTS_COMMAND.label,
      order: 'z',
    });
  }
}

export function initKeyboardShortcutsContribution({ bind }: { bind: interfaces.Bind }): void {
  bind(KeyboardShortcutsContribution).toSelf().inSingletonScope();
  bind(CommandContribution).toService(KeyboardShortcutsContribution);
  bind(MenuContribution).toService(KeyboardShortcutsContribution);
}
