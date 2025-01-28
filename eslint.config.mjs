import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/.DS_Store',
      '**/node_modules',
      'build',
      'dist',
      'package',
      '**/.env',
      '**/.env.*',
      '**/*.env',
      '**/package-lock.json',
      '**/*.{js,mjs,cjs}',
      'docker/**',
      'tmp/**',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    settings: {
      'import/core-modules': ['fs', 'path', 'os'],
      'import/resolver': {
        typescript: {},
      },
      // This will do the trick
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
        '@typescript-eslint/parser': ['.ts'],
      },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/prefer-nullish-coalescing': 'off',

      // Enforce consistent 2-space indentation
      indent: ['error', 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
      // Enforce Unix linebreaks
      'linebreak-style': ['error', 'unix'],
      // Enforce the use of semicolons
      semi: ['error', 'always'],
      // Enforce consistent keyword spacing
      'keyword-spacing': ['error', { overrides: { function: { after: false } } }],
      // Enforce a newline at the end of the file
      'eol-last': ['error', 'always'],

      /**
       * Variables and constants
       */

      // Require const declarations for variables that are never reassigned
      'prefer-const': ['error'],
      // Disallow var declarations
      'no-var': 'error',

      /**
       * Functions and arrow functions
       */

      // Require parentheses around arrow function arguments
      'arrow-parens': ['error', 'always'],
      // Enforce return await
      'no-return-await': ['off'],
      // Require object literal shorthand syntax
      'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true }],

      /**
       * Operators and expressions
       */

      // Disallow mixed logical operators
      'no-mixed-operators': ['error', { groups: [['&&', '||']] }],
      // Enforce radix parameter in parseInt
      radix: ['error', 'always'],
      // Disallow throwing literals and non-error objects
      'no-throw-literal': ['error'],
      // Require consistent return values
      'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],

      /**
       * Imports and exports
       */

      // Ensure imports appear before other statements
      'import/first': 'warn',
      // Disallow unnecessary path segments in import statements
      'import/no-useless-path-segments': 'warn',
      // Enforce a consistent order for import statements
      'import/order': [
        'warn',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          pathGroups: [
            { pattern: '#/**', group: 'internal', position: 'after' },
            { pattern: '{,~}/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        },
      ],
      'sort-imports': ['warn', { ignoreDeclarationSort: true }], // Enforce alphabetical sorting of named imports within an import statement

      /**
       * Control structures
       */

      // Require consistent use of curly braces for control structures
      curly: ['warn', 'multi-line', 'consistent'],
    },
  },
];
