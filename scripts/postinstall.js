const { execSync } = require('child_process');

if (process.env.SKIP_THEIA_CHECK === '1') {
  process.exit(0);
}

try {
  execSync('npx --yes @theia/cli@1.67.0 theia check:theia-version', { stdio: 'inherit' });
} catch (err) {
  console.warn('postinstall: theia check failed (non-fatal):', err && err.message ? err.message : err);
  // Don't fail the install if the Theia check cannot run.
  process.exit(0);
}
