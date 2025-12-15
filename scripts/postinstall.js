const { execSync } = require('child_process');

if (process.env.SKIP_THEIA_CHECK === '1') {
  process.exit(0);
}

try {
  execSync('npx --yes @theia/cli@1.67.0 theia check:theia-version', { stdio: 'inherit' });
} catch (err) {
  console.error('postinstall: theia check failed', err && err.message ? err.message : err);
  process.exit(err && err.status ? err.status : 1);
}
