import { RollupOutput } from 'rollup'
import { Cli, CliNamespace } from '../../wasd/Cli'
import { getPackages, topologicalSortPackages } from '../../utils'
import buildWithDependencies from './buildWithDependencies'

export default async (cli: Cli, startAt: number = Date.now()) => {
    const packages = topologicalSortPackages(getPackages())

    cli.logInfo(`Building ${packages.length.toString()} packages ...`)

    const buildMap: Map<string, Promise<RollupOutput[]>> = new Map()

    packages.forEach((packageInfo) => {
        const packageCli = cli.createChild(CliNamespace.createElement(
            packageInfo.module.name || packageInfo.folderName,
            { fontColor: 'gray' },
            { start: ' ', end: '' },
        ))
        const buildPromise = buildWithDependencies(packageCli, packageInfo, buildMap)
        buildMap.set(packageInfo.name, buildPromise)
    })

    try {
        const bundles = await Promise.all(buildMap.values())
        cli.logSuccess(`Finished building ${bundles.length.toString()} packages after ${(Date.now() - startAt) / 1000}s.`)
    } catch (error) {
        cli.logError(`Build failed: ${error}`)
        process.exit(1)
    }
}
