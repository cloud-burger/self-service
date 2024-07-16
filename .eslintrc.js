module.exports = {
  extends: ['airbnb-base'],
  env: {
    commonjs: true,
    node: true,
    jest: true,
  },
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    camelcase: [
      'off',
      {
        properties: 'never',
      },
    ],
    'max-statements-per-line': [
      'error',
      {
        max: 1,
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'operator-linebreak': ['error', 'before'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: false,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always-and-inside-groups',
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
        ],
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'unknown', 'object', 'type'],
          ['index', 'sibling'],
        ],
      },
    ],
    'no-unused-vars': 'off',
    'key-spacing': [
      'error',
      {
        afterColon: true,
      },
    ],
    'switch-colon-spacing': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          },
        },
      },
    ],
    'no-console': 'error',
  },
};
