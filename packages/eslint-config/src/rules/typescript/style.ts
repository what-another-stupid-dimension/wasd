import type { TSESLint } from '@typescript-eslint/utils'
import baseRules from '../base'

const rules:TSESLint.FlatConfig.Rules = {
    // Replace Airbnb 'camelcase' rule with '@typescript-eslint/naming-convention'
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
    camelcase: 'off',
    // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
    '@typescript-eslint/naming-convention': [
        'error',
        // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
        {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        // Allow camelCase functions (23.2), and PascalCase functions (23.8)
        {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
        },
        // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
        {
            selector: 'typeLike',
            format: ['PascalCase'],
        },
    ],

    // Replace Airbnb 'no-array-constructor' rule with '@typescript-eslint' version
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': baseRules.style['no-array-constructor'],
}

export default rules
