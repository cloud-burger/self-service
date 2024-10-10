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
          '~/presenters': './src/adapters/presenters',
          '~/domain': './src/domain',
          '~/database': './src/infrastructure/database',
          '~/service': './src/infrastructure/service',
          '~/use-cases': './src/application/use-cases',
        },
      },
    ],
  ],
  ignore: ['**/*.test.ts'],
};
