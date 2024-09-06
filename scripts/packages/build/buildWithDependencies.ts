import { RollupOutput } from 'rollup'
import { Cli } from '../../wasd/Cli'
import { PackageMetaInfo } from '../../utils'
import build from './build'

export default async (
    cli: Cli,
    packageInfo: PackageMetaInfo,
    buildMap: Map<string, Promise<RollupOutput[]>>,
): Promise<RollupOutput[]> => {
    const dependencyBuilds = packageInfo
        .internalDependencies.map((depName) => buildMap.get(depName)!)

    if (dependencyBuilds.length > 0) {
        cli.logInfo(`Waiting for ${packageInfo.internalDependencies.join(', ')}`)
        await Promise.all(dependencyBuilds)
    }

    return new Promise((resolve) => {
        setTimeout(() => build(cli, packageInfo).then(resolve), 200)
    })
}
