import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
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
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/ui/uiv3', '@/ui/uiv3/*'],
              message: 'Legacy uiv3 paths removed — use @/components/*, @/pages/*, or @/providers/*.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/server/routes/**/*.ts'],
    ignores: ['src/server/routes/studio.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.property.name='json'] > ObjectExpression > Property[key.name='error']",
          message: 'Use throw AppError(...) — inline res.json({ error }) is forbidden.',
        },
        {
          selector:
            "CallExpression[callee.object.name='res'][callee.property.name='json']",
          message:
            'Use ok()/created()/okMessage() or sendResult() — bare res.json() is forbidden.',
        },
      ],
    },
  },
  {
    files: ['src/server/routes/studio.ts'],
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
    files: ['src/server/routes/**/*.ts', 'src/server/middleware/**/*.ts', 'src/server/workers/**/*.ts'],
    rules: {
      'no-console': ['error', { allow: ['log', 'info'] }],
    },
  },
])
