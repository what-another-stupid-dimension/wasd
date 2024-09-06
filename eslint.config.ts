import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Linter } from 'eslint'
import { includeIgnoreFile } from '@eslint/compat'
import globals from 'globals'
import config from '@wasd/eslint-config'
// TODO: Create declarations in globals.d.ts
// @ts-ignore This Plugin has no types, as its only for eslint let's ignore it
import pluginReactHooks from 'eslint-plugin-react-hooks'
// @ts-ignore This Plugin has no types, as its only for eslint let's ignore it
import pluginReactRefresh from 'eslint-plugin-react-refresh'

const fileUrl = fileURLToPath(import.meta.url)
const currentPath = path.dirname(fileUrl)
const gitignorePath = path.resolve(currentPath, '.gitignore')

const globalIgnores = [
    './.rollup.cache',
]

const baseConfig: Linter.Config = {
    languageOptions: {
        parserOptions: {
            project: [
                './tsconfig.lint.json',
            ],
            tsconfigRootDir: currentPath,
        },
        globals: {
            ...globals.node,
        },
    },
    ignores: globalIgnores,
}

const packageConfig: Linter.Config = {
    files: [
        'packages/*/src/**/*.ts',
    ],
    rules: {
        'class-methods-use-this': 'off',
        'no-param-reassign': ['off', {
            props: false,
        }],
    },
    ignores: globalIgnores,
}

const packageTestsConfig: Linter.Config = {
    files: [
        'packages/*/tests/**/*.spec.ts',
        'packages/*/tests/**/*.test.ts',
    ],
    rules: {
        'max-lines-per-function': 'off',
        // Allow devDependencies in tests, as they are used in development only
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'no-restricted-globals': 'off',
    },
    ignores: globalIgnores,
}

const examplesConfig: Linter.Config = {
    files: [
        'examples/*/**/*.ts',
    ],
    rules: {
        // A Server Module may uses non static methods without `this`, we need to disable this rule
        'class-methods-use-this': 'off',
        'import-x/no-unresolved': 'off',
    },
    ignores: globalIgnores,
}

const examplesReactConfig: Linter.Config = {
    files: [
        'examples/*/**/*.tsx',
    ],
    plugins: {
        'react-refresh': pluginReactRefresh,
        'react-hooks': pluginReactHooks,
    },
    ignores: globalIgnores,
}

const scriptsConfig: Linter.Config = {
    files: [
        '*.config.ts',
        'scripts/**/*.ts',
        'examples/*/**/*.config.ts',
    ],
    rules: {
        'no-restricted-globals': 'off',
        // Allow devDependencies in scripts, as they are used in development only
        'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    ignores: globalIgnores,
}

export default [
    ...config.recommended,
    ...config.typescript,
    includeIgnoreFile(gitignorePath),
    baseConfig,
    packageConfig,
    packageTestsConfig,
    examplesConfig,
    examplesReactConfig,
    scriptsConfig,
]
