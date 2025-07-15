import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import path from 'node:path';

export default tseslint.config(
  {
    ignores: ['**/node_modules/', '**/dist/', '**/build/', '**/.next/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    overrides: [
      {
        files: ['apps/frontend/**/*.ts', 'apps/frontend/**/*.tsx'],
        parserOptions: {
          project: './apps/frontend/tsconfig.json',
          tsconfigRootDir: path.resolve(),
        },
      },
      {
        files: ['apps/backend/**/*.ts'],
        parserOptions: {
          project: './apps/backend/tsconfig.json',
          tsconfigRootDir: path.resolve(),
        },
      },
    ],
  }
);
