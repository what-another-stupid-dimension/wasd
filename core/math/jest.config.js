/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('../../jest.config.js')
const packageName = require('./package.json').name

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName,
  rootDir: '../..',
  testMatch: [`${__dirname}/__tests__/*.ts`, `${__dirname}/**/__tests__/*.ts`]
}
