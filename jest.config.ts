process.env.TZ = 'UTC';
export default {
  clearMocks: true,
  setupFiles: ['<rootDir>/src/tests/set-env-vars.ts'],
  moduleDirectories: ['src', 'node_modules'],
  coverageProvider: 'babel',
  coverageReporters: ['json', 'text', 'html', 'cobertura', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  maxConcurrency: 10,
  maxWorkers: '50%',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '~/api/(.*)': '<rootDir>/src/api/$1',
    '~/controllers/(.*)': '<rootDir>/src/adapters/controllers/$1',
    '~/presenters/(.*)': '<rootDir>/src/adapters/presenters/$1',
    '~/domain/(.*)': '<rootDir>/src/domain/$1',
    '~/infrastructure/(.*)': '<rootDir>/src/infrastructure/$1',
    '~/use-cases/(.*)': '<rootDir>/src/application/use-cases/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.build/', '<rootDir>/node_modules/'],
  testMatch: ['**/?(*.)+(test).+(ts|js)'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        sourceMap: true,
      },
    ],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  verbose: true,
};
