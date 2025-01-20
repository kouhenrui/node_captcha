module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/captchaTest.test.ts'], // Match test files in the `tests` directory
  collectCoverage: true, // Enable coverage reports
  coverageDirectory: 'coverage', // Coverage output directory
};
