/**
 * Contribution filters for PlainScript IDE.
 *
 * MAINTENANCE NOTE: The constructor names in filteredNames below are matched
 * by string comparison against contribution class names at runtime. These names
 * MUST be re-verified whenever the Theia version is bumped.
 *
 * Last verified against: Theia 1.67.0
 * Verification date: 2026-05
 * Verification method: Search https://github.com/eclipse-theia/theia/tree/v1.67.0
 *   for each class name and confirm the exported class has the exact matching name.
 */
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
  'OutlineViewContribution',
  'CallHierarchyContribution',
  'ProblemContribution',
  'PluginApiFrontendContribution',
  'PluginFrontendViewContribution',
  'WindowContribution',
];

@injectable()
export class RemoveFromUIFilterContribution implements FilterContribution {
  registerContributionFilters(registry: ContributionFilterRegistry): void {
    registry.addFilters('*', [
      (contrib) => {
        const ctorName = contrib?.constructor?.name ?? '';
        const blockedByInstance = filteredInstances.some((c) => contrib instanceof c);
        const blockedByName = filteredNames.includes(ctorName);
        return !(blockedByInstance || blockedByName);
      },
    ]);
  }
}

export function registerFilters({
  bind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void {
  bind(FilterContribution).to(RemoveFromUIFilterContribution).inSingletonScope();
}
