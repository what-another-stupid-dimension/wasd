import path from 'node:path'
import { OutputOptions } from 'rollup'
import { PackageMetaInfo } from '../utils/types'

export default (packageConfig: PackageMetaInfo): OutputOptions[] => {
    const outputs: OutputOptions[] = []

    if (packageConfig.module.main) {
        outputs.push({
            file: path.join(packageConfig.path, packageConfig.module.main),
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        })
    }

    if (packageConfig.module.module) {
        outputs.push({
            file: path.join(packageConfig.path, packageConfig.module.module),
            format: 'es',
            sourcemap: true,
        })
    }

    return outputs
}
