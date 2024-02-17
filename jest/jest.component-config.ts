const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  rootDir: '../test',
  testRegex: '.component-spec.ts$'
};
