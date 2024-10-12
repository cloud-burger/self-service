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
          '~/api': './src/api',
          '~/controllers': './src/adapters/controllers',
          '~/presenters': './src/adapters/presenters',
          '~/domain': './src/domain',
          '~/infrastructure': './src/infrastructure',
          '~/use-cases': './src/application/use-cases',
        },
      },
    ],
  ],
  ignore: ['**/*.test.ts'],
};
