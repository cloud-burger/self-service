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
          '~/driven': './src/adapters/driven',
          '~/driver': './src/adapters/driver',
          '~/domain': './src/domain',
        },
      },
    ],
  ],
  ignore: ['**/*.test.ts'],
};
