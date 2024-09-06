import { RollupWatchOptions } from 'rollup'
import { PackageMetaInfo } from '../utils/types'
import options from './options'
import outputs from './outputs'

export default (
    packageConfig: PackageMetaInfo,
    noEmitOnTypescriptError: boolean,
): RollupWatchOptions => ({
    ...options(packageConfig, noEmitOnTypescriptError),
    output: outputs(packageConfig),
    watch: {
        clearScreen: true,
    },
})
