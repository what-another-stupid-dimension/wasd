import { CliLoggerSeverity } from '@wasd/cli'

export default class ServerProperties {
    constructor(
        public readonly fps?: number,
        public readonly loggerSeverity: CliLoggerSeverity = CliLoggerSeverity.INFO,
    ) {
    }
}
