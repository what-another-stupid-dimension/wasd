module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/__fixtures__/',
    '/__tests__/'
  ],
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/lib/**',
    '!**/*.config.js',
    '!**/index.ts'
  ],
  testPathIgnorePatterns: ['__fixtures__', 'node_modules', 'lib'],
  projects: ['<rootDir>/core/*/jest.config.js'],
  globals: {
    NODE_ENV: 'test'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/'
}
