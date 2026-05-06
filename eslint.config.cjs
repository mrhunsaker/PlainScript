const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const legacyTsConfigs = compat.config(require('./.eslintrc.json')).map((config) => {
  const next = {
    ...config,
    files: ['custom-ui/src/frontend/**/*.{ts,tsx}'],
    ignores: [
      ...(config.ignores ?? []),
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/src-gen/**',
      '**/.browser_modules/**',
      '**/.turbo/**',
      '**/site/**',
    ],
  };

  if (next.languageOptions?.parserOptions) {
    next.languageOptions = {
      ...next.languageOptions,
      parserOptions: {
        ...next.languageOptions.parserOptions,
        tsconfigRootDir: __dirname,
        project: ['./custom-ui/tsconfig.json'],
      },
    };
  }

  return next;
});

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/src-gen/**',
      '**/plugins/**',
      '**/.browser_modules/**',
      '**/.turbo/**',
      '**/site/**',
    ],
  },
  ...legacyTsConfigs,
];
