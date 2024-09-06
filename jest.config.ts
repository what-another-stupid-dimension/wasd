import type { Config } from 'jest'

const jestConfig: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: [
        '.ts',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.test.json' }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/packages/.*/node_modules/',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/packages/.*/dist/',
    ],

}

export default jestConfig
