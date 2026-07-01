const { execSync } = require('child_process');
const { dirname, join } = require('path');

if (process.env.CI) {
  process.exit(0);
}

let huskyBin;
try {
  huskyBin = join(dirname(require.resolve('husky/package.json')), 'bin.js');
} catch {
  process.exit(0);
}

try {
  execSync(`"${process.execPath}" "${huskyBin}"`, { stdio: 'inherit' });
} catch (err) {
  console.warn('prepare: husky execution failed (non-fatal):', err?.message ?? err);
}
