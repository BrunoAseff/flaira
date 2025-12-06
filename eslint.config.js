import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextConfig from 'eslint-config-next';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/.next/',
      '**/components/ui/**',
      '**/hooks/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...(typeof nextConfig === 'function' 
    ? nextConfig() 
    : Array.isArray(nextConfig) 
    ? nextConfig 
    : [nextConfig]
  ).map((config) => ({
    ...config,
    files: config.files ? [...config.files, 'apps/frontend/**/*.{js,jsx,ts,tsx}'] : ['apps/frontend/**/*.{js,jsx,ts,tsx}'],
  }))
);
