import { Cli, CliLogger, CliNamespace } from './wasd/Cli'
import { buildPackages } from './packages'

const cli = new Cli({
    namespace: CliNamespace.create(['build'], { fontColor: 'cyan' }),
    logger: new CliLogger({ showTimestamps: false }),
})

cli.logInfo('Building the wonderful fruits of our labor!')

buildPackages(cli, Date.now())
