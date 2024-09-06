import { rollup, RollupOutput } from 'rollup'
import { PackageMetaInfo } from '../../utils'
import * as rollupConfig from '../../rollup'
import { Cli } from '../../wasd/Cli'
import { cleanPackage } from '../clean'

export default async (cli: Cli, packageConfig: PackageMetaInfo): Promise<RollupOutput[]> => {
    const bundlers: Promise<Promise<RollupOutput>[]> = cleanPackage(cli, packageConfig)
        .then(() => rollup(rollupConfig.options(packageConfig, true)))
        .then((bundle) => {
            cli.logInfo(`Building Package bundles: ${rollupConfig.outputs(packageConfig).map((option) => option.format).join(', ')}`)
            return rollupConfig.outputs(packageConfig).map(
                (outputConfig) => {
                    if (outputConfig.format) cli.logDebug(outputConfig.format)
                    return bundle.write(outputConfig)
                },
            )
        })

    return bundlers
        .then((bundlesPromises: Promise<RollupOutput>[]) => Promise.all(bundlesPromises))
        .then((bundles) => {
            cli.logSuccess('Package created!')
            return bundles
        })
        .catch((error) => {
            cli.logError(error)
            cleanPackage(cli, packageConfig)
            return Promise.reject(error)
        })
}
