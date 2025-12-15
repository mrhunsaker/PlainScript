import { ContributionFilterRegistry, FilterContribution } from '@theia/core/lib/common';
import { injectable, interfaces } from '@theia/core/shared/inversify';

// Run Test Contribution
import { TestOutputViewContribution } from '@theia/test/lib/browser/view/test-output-view-contribution';
import { TestResultViewContribution } from '@theia/test/lib/browser/view/test-result-view-contribution';
import { TestRunViewContribution } from '@theia/test/lib/browser/view/test-run-view-contribution';
import { TestViewContribution } from '@theia/test/lib/browser/view/test-view-contribution';

const filteredInstances = [
    TestViewContribution,
    TestRunViewContribution,
    TestResultViewContribution,
    TestOutputViewContribution,
];

// Fallback by constructor name so we do not need every module imported.
const filteredNames = [
    'DebugFrontendApplicationContribution',
    'DebugFrontendContribution',
    'ScmContribution',
    'ScmFrontendContribution',
    'OutlineViewContribution',
    'CallHierarchyContribution',
    'CallHierarchyFrontendContribution',
    'ProblemContribution',
    'PluginFrontendContribution',
    'PluginFrontendViewContribution',
    'TaskContribution',
    'NotebookContribution',
    'WindowContribution',
];

@injectable()
export class RemoveFromUIFilterContribution implements FilterContribution {
    registerContributionFilters(registry: ContributionFilterRegistry): void {
        registry.addFilters('*', [
            contrib => {
                const ctorName = contrib?.constructor?.name ?? '';
                const blockedByInstance = filteredInstances.some(c => contrib instanceof c);
                const blockedByName = filteredNames.includes(ctorName);
                return !(blockedByInstance || blockedByName);
            },
        ]);
    }
}

export function registerFilters({ bind }: { bind: interfaces.Bind; rebind: interfaces.Rebind }): void {
    bind(FilterContribution).to(RemoveFromUIFilterContribution).inSingletonScope();
}
