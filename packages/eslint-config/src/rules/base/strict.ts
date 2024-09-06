import type { TSESLint } from '@typescript-eslint/utils'

const rules:TSESLint.FlatConfig.Rules = {
    // babel inserts `'use strict';` for us
    strict: ['error', 'never'],
}

export default rules
