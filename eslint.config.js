import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    ignores: [
      '.vitepress/cache/',
      '.vitepress/dist/',
      'assets/',
      'node_modules/',
      'public/',
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module',
    },
    rules: {
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', { after: true, before: false }],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/template-curly-spacing': ['error', 'always'],

      'no-param-reassign': ['error', { props: false }],
      'no-underscore-dangle': 'off',
      'prefer-promise-reject-errors': 'off',
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1,
      }],
      'vue/multi-word-component-names': 'off',
      'vue/script-indent': ['error', 2, {
        baseIndent: 0,
        ignores: [],
        switchCase: 1,
      }],
    },
  },

  {
    files: ['.vitepress/**/*.js', '*.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
];
