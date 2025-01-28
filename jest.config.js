module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Coverage
  collectCoverage: !!process.env.JEST_COVERAGE,
  coverageReporters: ['text'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  // coverageThreshold: undefined,

  // The test environment that will be used for testing
  testEnvironment: 'node',
  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/**/*\\.(spec|test)\\.(js|ts)?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '.d.ts'],
};
