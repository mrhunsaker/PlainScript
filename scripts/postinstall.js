const { execSync } = require('child_process');
const { join } = require('path');

if (process.env.SKIP_THEIA_CHECK === '1') {
  process.exit(0);
}

try {
  // Prefer the local workspace binary when dependencies are present.
  const localTheiaBin = join(process.cwd(), 'node_modules', '.bin', 'theia');
  execSync(`\"${localTheiaBin}\" check:theia-version`, { stdio: 'inherit' });
} catch (err) {
  console.warn(
    'postinstall: local theia check failed (non-fatal):',
    err && err.message ? err.message : err
  );
  // npm 10+ compatible fallback: install package temporarily and run its binary.
  try {
    execSync('npm exec --yes --package @theia/cli@1.73.0 -- theia check:theia-version', {
      stdio: 'inherit',
    });
  } catch (err2) {
    console.warn(
      'postinstall: theia check fallback failed (non-fatal):',
      err2 && err2.message ? err2.message : err2
    );
  }
  // Don't fail the install if the Theia check cannot run.
  process.exit(0);
}
