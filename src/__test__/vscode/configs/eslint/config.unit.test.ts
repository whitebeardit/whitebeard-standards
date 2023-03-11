import config from '../../../../vscode/configs/eslint/config';

describe('Config Eslint', () => {
  const configExpected = {
    env: { es6: true, jest: true, node: true },
    extends: [
      'airbnb-typescript/base',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'prettier',
      'plugin:boundaries/recommended',
      'eslint:recommended',
    ],
    globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 11,
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'boundaries'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          custom: { match: true, regex: '^I[A-Z]' },
          format: ['PascalCase'],
          selector: 'interface',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-readonly': [
        'error',
        { onlyInlineLambdas: true },
      ],
      'boundaries/element-types': [
        2,
        {
          default: 'disallow',
          rules: [
            { allow: ['domains'], from: 'domains' },
            {
              allow: ['infrastructure', 'domains', 'configurations'],
              from: 'infrastructure',
            },
            {
              allow: ['domains', 'application', 'configurations'],
              from: 'application',
            },
            {
              allow: [
                'infrastructure',
                'domains',
                'application',
                'configurations',
              ],
              from: 'configurations',
            },
          ],
        },
      ],
      'class-methods-use-this': 'off',
      'default-case': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
      ],
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'max-params': ['error', 3],
      'no-fallthrough': 'error',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
    },
    settings: {
      'boundaries/elements': [
        {
          mode: 'file',
          pattern: 'src/configurations/**/*.ts',
          type: 'configurations',
        },
        {
          mode: 'file',
          pattern: 'src/infrastructure/**/*.ts',
          type: 'infrastructure',
        },
        { mode: 'file', pattern: 'src/domain/**/*.ts', type: 'domains' },
        {
          mode: 'file',
          pattern: 'src/application/**/*.ts',
          type: 'application',
        },
      ],
      'boundaries/no-unknown': false,
      'boundaries/no-unknown-files': false,
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
  };
  it('Should return a right configuration', async () => {
    expect(config).toMatchObject(configExpected);
  });
});
