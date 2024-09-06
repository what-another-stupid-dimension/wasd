import { Options } from './types'
import Namespace, { NamespaceElement } from './namespace'
import Logger, { LoggerSeverity, LoggerTimestampFormat } from './logger'
import { TimestampPosition } from './logger/types'

class Cli {
    private logger: Logger

    private namespace: Namespace

    constructor({
        namespace = Namespace.createEmpty(),
        logger = new Logger(),
    }: Options = {}) {
        this.namespace = namespace
        this.logger = logger
    }

    public createChild(element: NamespaceElement) {
        return new Cli({
            namespace: this.namespace.extendWithElement(element),
            logger: this.logger,
        })
    }

    public createChildWithLabel(label: string) {
        return this.createChild(Namespace.createElement(
            label,
        ))
    }

    public log(severity: LoggerSeverity, message: string) {
        this.logger.log(message, severity, this.namespace)
    }

    public logDebug(message: string) {
        this.logger.debug(message, this.namespace)
    }

    public logInfo(message: string) {
        this.logger.info(message, this.namespace)
    }

    public logSuccess(message: string) {
        this.logger.success(message, this.namespace)
    }

    public logWarning(message: string) {
        this.logger.warning(message, this.namespace)
    }

    public logError(message: string) {
        this.logger.error(message, this.namespace)
    }

    public logCritical(message: string) {
        this.logger.critical(message, this.namespace)
    }

    public setLoggerSeverityThreshold(severity: LoggerSeverity) {
        this.logger.setSeverityThreshold(severity)
    }

    public setLoggerShowTimestamps(enable: boolean) {
        this.logger.setShowTimestamps(enable)
    }

    public setLoggerTimestampFormat(format: LoggerTimestampFormat) {
        this.logger.setTimestampFormat(format)
    }

    public setLoggerTimestampPosition(position: TimestampPosition) {
        this.logger.setTimestampPosition(position)
    }
}

export default Cli
