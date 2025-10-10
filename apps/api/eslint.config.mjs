// ESLint v9 configuration for API package
export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser').then((m) => m.default),
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add basic rules or extend from recommended configs
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
