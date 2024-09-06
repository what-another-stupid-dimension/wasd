import type { TSESLint } from '@typescript-eslint/utils'

const rules:TSESLint.FlatConfig.Rules = {
    // Append 'ts' and 'tsx' extensions to Airbnb 'import/no-extraneous-dependencies' rule
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import-x/no-extraneous-dependencies': ['error', {
        devDependencies: [
            'test/**', // tape, common npm pattern
            'tests/**', // also common npm pattern
            'scripts/**', // also common npm pattern
            'spec/**', // mocha, rspec-like pattern
            '**/__tests__/**', // jest pattern
            '**/__mocks__/**', // jest pattern
            'test.{ts,tsx}', // repos with a single test file
            'test-*.{ts,tsx}', // repos with multiple top-level test files
            '**/*{.,_}{test,spec}.{ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
            '**/eslint.config.ts', // jest config
            '**/jest.config.ts', // jest config
            '**/jest.setup.ts', // jest setup
            '**/vue.config.ts', // vue-cli config
            '**/webpack.config.ts', // webpack config
            '**/webpack.config.*.ts', // webpack config
            '**/rollup.config.ts', // rollup config
            '**/rollup.config.*.ts', // rollup config
            '**/gulpfile.ts', // gulp config
            '**/gulpfile.*.ts', // gulp config
            '**/Gruntfile{,.ts}', // grunt config
            '**/protractor.conf.ts', // protractor config
            '**/protractor.conf.*.ts', // protractor config
            '**/karma.conf.ts', // karma config
            '**/.eslintrc.ts', // eslint config
        ],
        optionalDependencies: false,
    }],
}

export default rules
