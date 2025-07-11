module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true,
    es2020: true,
    webextensions: true
  },
  globals: {
    chrome: 'readonly'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error'
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      env: {
        jest: true
      }
    },
    {
      files: ['*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        node: true,
        jest: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
      }
    },
    {
      files: ['tests/**/*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'script'
      },
      env: {
        jest: true,
        node: true
      },
      globals: {
        page: 'readonly',
        browser: 'readonly',
        context: 'readonly',
        jestPuppeteer: 'readonly'
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-require-imports': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'source/',
    '*.min.js'
  ]
};