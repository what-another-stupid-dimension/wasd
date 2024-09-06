import { Linter, ESLint } from 'eslint'
import typescriptParser from '@typescript-eslint/parser'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintPluginImportX from 'eslint-plugin-import-x'
import baseRules from './rules/base'
import typescriptRules from './rules/typescript'

const recommended: Linter.Config[] = [
    eslintPluginImportX.flatConfigs.recommended as Linter.Config,
    {
        rules: {
            ...baseRules.bestPractices,
            ...baseRules.errors,
            ...baseRules.es6,
            ...baseRules.imports,
            ...baseRules.node,
            ...baseRules.strict,
            ...baseRules.style,
            ...baseRules.variables,
        },
        plugins: {
            import: eslintPluginImportX as unknown as ESLint.Plugin,
        },
    },
]

const typescript: Linter.Config[] = [
    eslintPluginImportX.flatConfigs.typescript as Linter.Config,
    {
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            ...typescriptRules.bestPractices,
            ...typescriptRules.es6,
            ...typescriptRules.imports,
            ...typescriptRules.style,
            ...typescriptRules.variables,
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin as unknown as ESLint.Plugin,
        },
    },
]

const config = {
    recommended,
    typescript,
}

export default config
