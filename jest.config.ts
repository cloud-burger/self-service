process.env.TZ = 'UTC';
export default {
  clearMocks: true,
  setupFiles: ['<rootDir>/src/tests/set-env-vars.ts'],
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '~/app/(.*)': '<rootDir>/src/app/$1',
    '~/driven/(.*)': '<rootDir>/src/adapters/driven/$1',
    '~/driver/(.*)': '<rootDir>/src/adapters/driver/$1',
    '~/domain/(.*)': '<rootDir>/src/domain/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.build/', '<rootDir>/node_modules/'],
  testMatch: ['**/?(*.)+(test).+(ts|js)'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.tsx?$': [
      'esbuild-jest',
      {
        sourceMap: true,
      },
    ],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  verbose: true,
};
