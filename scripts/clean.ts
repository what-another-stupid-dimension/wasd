import { Cli, CliLogger, CliNamespace } from './wasd/Cli'
import { cleanPackages } from './packages'

const cli = new Cli({
    namespace: CliNamespace.create(['clean']),
    logger: new CliLogger(),
})

cli.logInfo('Cleaning up:')

cleanPackages(cli, Date.now())
