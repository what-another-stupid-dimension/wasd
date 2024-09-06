import { Cli, CliLogger, CliNamespace } from './wasd/Cli'
import { watchPackages } from './packages'

const cli = new Cli({
    namespace: CliNamespace.create(['watch'], { fontColor: 'cyan' }, { start: '[', end: ']' }),
    logger: new CliLogger({ showTimestamps: false }),
})

cli.logInfo('Watching the wonderful fruits of our labor!')

watchPackages(cli, Date.now())
    .catch((error) => {
        cli.logError(`An error occurred while watching packages: ${error}`)
    })
