module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../src',
  bail: 1,
  testRegex: '.*\\.unit.test\\.ts$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/test/**'],
  coverageDirectory: '../coverage/unit',
  preset: 'ts-jest',
};
