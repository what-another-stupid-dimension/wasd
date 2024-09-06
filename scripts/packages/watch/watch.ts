import {
    watch,
    RollupWatcher,
    RollupWatcherEvent,
    ChangeEvent,
} from 'rollup'
import { PackageMetaInfo } from '../../utils'
import * as rollupConfig from '../../rollup'
import { Cli } from '../../wasd/Cli'

const handleRollupWatcherEvent = (
    event: RollupWatcherEvent,
    cli: Cli,
    packageConfig: PackageMetaInfo,
) => {
    switch (event.code) {
        case 'START':
            break
        case 'BUNDLE_START':
            if (event.input && Array.isArray(event.input)) {
                event.input.forEach((fileName) => {
                    cli.logInfo(`Watching '${fileName.replace(packageConfig.path, '.')}'`)
                })
            } else if (event.input) {
                cli.logInfo('Updating Bundes...')
            }
            break
        case 'BUNDLE_END':
            event.output.forEach((output) => {
                cli.logSuccess(`✓ ${output.replace(packageConfig.path, '.')}`)
            })
            break
        case 'END':
            break
        case 'ERROR':
            cli.logError(`${event.error}`)
            break
        default:
            cli.logWarning('Unknown Rollup Watcher Event')
    }

    if ((event.code === 'BUNDLE_END' || event.code === 'ERROR') && event.result) {
        event.result.close()
    }
}

const handleRollupChangeEvent = (
    id: string,
    event: ChangeEvent,
    cli: Cli,
    packageConfig: PackageMetaInfo,
) => {
    switch (event) {
        case 'update':
            cli.logInfo(`File updated: '${id.replace(packageConfig.path, '')}'`)
            break
        case 'create':
            cli.logSuccess(`File created: '${id.replace(packageConfig.path, '')}'`)
            break
        case 'delete':
            cli.logSuccess(`File delete: '${id.replace(packageConfig.path, '')}'`)
            break
        default:
            cli.logWarning(`Unknown Rollup Change Event on file '${id.replace(packageConfig.path, '')}'`)
    }
}

export default (
    cli: Cli,
    packageConfig: PackageMetaInfo,
): Promise<RollupWatcher> => new Promise<RollupWatcher>((resolve) => {
    const watcher = watch(rollupConfig.watchOptions(packageConfig, false))

    watcher.on('event', (event) => {
        handleRollupWatcherEvent(event, cli, packageConfig)
    })

    watcher.on('change', (id, { event }) => {
        handleRollupChangeEvent(id, event, cli, packageConfig)
    })

    watcher.on('close', () => {
        resolve(watcher)
    })
})
