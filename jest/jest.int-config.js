const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  testRegex: '.*\\.int.test\\.ts$',
  coverageDirectory: '../coverage/int'
};
