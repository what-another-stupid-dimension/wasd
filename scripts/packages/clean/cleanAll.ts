import { getPackages } from '../../utils'
import { Cli } from '../../wasd/Cli'
import clean from './clean'

export default async (cli: Cli, startAt: number = Date.now()) => {
    const packages = getPackages()

    const bundles = packages.map((packageConfig) => Promise.all([
        clean(
            cli.createChildWithLabel(packageConfig.module.name || packageConfig.folderName),
            packageConfig,
        ),
    ]))

    await Promise.all(bundles)
    cli.logSuccess(`Cleaned ${packages.length.toString()} packages in ${(Date.now() - startAt) / 1000}s!`)
}
