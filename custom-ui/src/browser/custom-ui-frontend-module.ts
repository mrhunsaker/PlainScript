/**
 * Generated using theia-extension-generator
 */
import { CustomUiCommandContribution, CustomUiMenuContribution } from './custom-ui-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(CustomUiCommandContribution);
    bind(MenuContribution).to(CustomUiMenuContribution);
});
