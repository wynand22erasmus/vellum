import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'backup']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.tsx', 'src/hooks/**/*.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['src/routes/**/*.ts', 'src/middleware/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.property.name='json'] > ObjectExpression > Property[key.name='error']",
          message: 'Use throw AppError(...) — inline res.json({ error }) is forbidden.',
        },
      ],
    },
  },
  {
    files: ['src/routes/**/*.ts', 'src/middleware/**/*.ts', 'src/workers/**/*.ts'],
    rules: {
      'no-console': ['error', { allow: ['log', 'info'] }],
    },
  },
])
