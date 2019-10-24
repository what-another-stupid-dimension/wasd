module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__fixtures__/',
    '/__tests__/',
    '/lib/'
  ],
  testPathIgnorePatterns: ['__fixtures__', 'node_modules', 'lib'],
  projects: [
    // '<rootDir>/algorithm/*/jest.config.js',
    // '<rootDir>/command/*/jest.config.js',
    '<rootDir>/core/*/jest.config.js'
  ],
  globals: {
    NODE_ENV: 'test'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/'
}
