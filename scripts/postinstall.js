const { execSync } = require('child_process');

if (process.env.SKIP_THEIA_CHECK === '1') {
  process.exit(0);
}

try {
  // Prefer npx with explicit -y to avoid npm exec resolution issues on newer npm/Volta.
  execSync('npx -y @theia/cli@1.67.0 theia check:theia-version', { stdio: 'inherit' });
} catch (err) {
  console.warn('postinstall: theia check failed (non-fatal):', err && err.message ? err.message : err);
  // Fallback attempt without version pin, in case the versioned npx fails.
  try {
    execSync('npx theia check:theia-version', { stdio: 'inherit' });
  } catch (err2) {
    console.warn('postinstall: theia check fallback failed (non-fatal):', err2 && err2.message ? err2.message : err2);
  }
  // Don't fail the install if the Theia check cannot run.
  process.exit(0);
}
