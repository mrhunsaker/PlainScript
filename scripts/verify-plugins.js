// Verifies that every plugin declared in the root package.json's `theiaPlugins`
// field was actually downloaded into `plugins/`.
//
// `npm run download:plugins` runs `theia download:plugins --ignore-errors`, which
// is intentional: one flaky/rate-limited download shouldn't abort the whole batch.
// But that also means a single plugin can silently fail to install with no
// non-zero exit code and no obvious signal — e.g. a missing color theme falling
// back to Theia's built-in schemes with no explanation why.
//
// This script runs immediately after the download and fails loudly (non-zero
// exit, clear message) if any declared plugin's directory is missing.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');

function main() {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const theiaPlugins = pkg.theiaPlugins || {};

  const declared = Object.keys(theiaPlugins);
  if (declared.length === 0) {
    console.warn('verify-plugins: no theiaPlugins declared in package.json, nothing to check.');
    return;
  }

  const missing = declared.filter((id) => {
    const dir = path.join(PLUGINS_DIR, id);
    return !fs.existsSync(dir) || fs.readdirSync(dir).length === 0;
  });

  if (missing.length > 0) {
    console.error('');
    console.error('verify-plugins: the following plugins are declared in package.json but');
    console.error('were NOT found in plugins/ after download:plugins ran:');
    for (const id of missing) {
      console.error(`  - ${id}`);
    }
    console.error('');
    console.error('This usually means the download for that plugin failed (network issue,');
    console.error('rate limit, or a stale pinned version/URL in theiaPlugins) and was silently');
    console.error('skipped because download:plugins runs with --ignore-errors.');
    console.error('');
    console.error('Try re-running "npm run download:plugins" and watch its output for the');
    console.error('specific error, or check the pinned version/URL for the missing plugin(s)');
    console.error('against the registry (e.g. https://open-vsx.org).');
    console.error('');
    process.exit(1);
  }

  console.log(`verify-plugins: all ${declared.length} declared plugin(s) present in plugins/.`);
}

main();
