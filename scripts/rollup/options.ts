import path from 'node:path'
import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { PackageMetaInfo } from '../utils/types'

export default (
    packageConfig: PackageMetaInfo,
    noEmitOnTypescriptError: boolean,
): RollupOptions => ({
    logLevel: 'debug',
    input: path.join(packageConfig.path, 'src', 'index.ts'),
    external: [
        path.join(packageConfig.path, 'node_modules'),
        ...(
            packageConfig.module.dependencies
                ? Object.keys(packageConfig.module.dependencies)
                : []
        ),
    ],
    plugins: [
        resolve({
            jail: packageConfig.path,
            modulePaths: [
                path.join(packageConfig.path, 'node_modules'),
            ],
        }),
        typescript({
            tsconfig: path.join(packageConfig.path, 'tsconfig.build.json'),
            compilerOptions: {
                importHelpers: false,
                baseUrl: packageConfig.path,
                declaration: true,
                declarationDir: path.join(packageConfig.path, 'dist'),
            },
            noEmitOnError: noEmitOnTypescriptError,
            outputToFilesystem: true,
        }),
        json(),
    ],
})
