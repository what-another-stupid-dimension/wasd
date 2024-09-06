import { RollupOutput, RollupWatcher } from 'rollup'
import { Cli, CliNamespace } from '../../wasd/Cli'
import { getPackages, topologicalSortPackages } from '../../utils'
import watch from './watch'
import { buildWithDependencies } from '../build'

export default async (cli: Cli, startAt: number = Date.now()) => {
    const packages = topologicalSortPackages(getPackages())
    const buildMap: Map<string, Promise<RollupOutput[]>> = new Map()
    const watchMap: Map<string, Promise<RollupWatcher>> = new Map()

    cli.logInfo(`Watching: ${packages.map((packageInfo) => packageInfo.module.name).join(', ')}`)

    packages.forEach((packageInfo) => {
        const packageCli = cli.createChild(CliNamespace.createElement(
            packageInfo.module.name || packageInfo.folderName,
            { fontColor: 'gray' },
            { start: ' ', end: '' },
        ))

        const buildPromise = buildWithDependencies(
            packageCli,
            packageInfo,
            buildMap,
        ).then((output) => {
            const watchPromise = watch(packageCli, packageInfo)
            watchMap.set(packageInfo.name, watchPromise)
            return output
        })

        buildMap.set(packageInfo.name, buildPromise)
    })

    try {
        const bundles = await Promise.all(buildMap.values()).catch(() => {
            cli.logError('Inital Build failed')
            process.exit(1)
        })
        await Promise.all(watchMap.values())
        cli.logSuccess(`Watched ${bundles.length.toString()} packages for ${(Date.now() - startAt) / 1000}s!`)
    } catch (reason) {
        cli.logError(reason && typeof reason.toString === 'function' ? reason.toString() : '')
        process.exit(1)
    }
}
