module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '~/app': './src/app',
          '~/controllers': './src/adapters/controllers',
          '~/gateways': './src/adapters/gateways',
          '~/presenters': './src/adapters/presenters',
          '~/domain': './src/domain',
        },
      },
    ],
  ],
  ignore: ['**/*.test.ts'],
};
