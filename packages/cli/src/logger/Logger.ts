import chalk from 'chalk'
import Namespace from '../namespace/Namespace'
import {
    Severity,
    Options,
    TimestampFormat,
    TimestampPosition,
    TimestampStyle,
} from './types'

export default class Logger {
    private severityThreshold: Severity

    private showTimestamps: boolean

    private timestampFormat: TimestampFormat

    private timestampPosition: TimestampPosition

    constructor({
        severityThreshold = Severity.INFO,
        showTimestamps = true,
        timestampFormat = TimestampStyle.Time,
        timestampPosition = TimestampPosition.Prepend,
    }: Options = {}) {
        this.severityThreshold = severityThreshold
        this.showTimestamps = showTimestamps
        this.timestampFormat = timestampFormat
        this.timestampPosition = timestampPosition
    }

    public log(message: string, severity: Severity, namespace?: Namespace) {
        if (!this.shouldLog(severity)) {
            return
        }

        const formattedMessage = Logger.formatLogMessage(
            message,
            severity,
            namespace,
            this.showTimestamps,
            this.timestampFormat,
            this.timestampPosition,
        )

        if (severity === Severity.ERROR) {
            process.stderr.write(`${formattedMessage}\n`)
        } else {
            process.stdout.write(`${formattedMessage}\n`)
        }
    }

    public debug(message: string, namespace?: Namespace) {
        this.log(message, Severity.DEBUG, namespace)
    }

    public info(message: string, namespace?: Namespace) {
        this.log(message, Severity.INFO, namespace)
    }

    public success(message: string, namespace?: Namespace) {
        this.log(message, Severity.SUCCESS, namespace)
    }

    public warning(message: string, namespace?: Namespace) {
        this.log(message, Severity.WARNING, namespace)
    }

    public error(message: string, namespace?: Namespace) {
        this.log(message, Severity.ERROR, namespace)
    }

    public critical(message: string, namespace?: Namespace) {
        this.log(message, Severity.CRITICAL, namespace)
    }

    public setSeverityThreshold(severity: Severity) {
        this.severityThreshold = severity
    }

    public setShowTimestamps(enable: boolean) {
        this.showTimestamps = enable
    }

    public setTimestampFormat(format: TimestampFormat) {
        this.timestampFormat = format
    }

    public setTimestampPosition(position: TimestampPosition) {
        this.timestampPosition = position
    }

    private static formatLogMessage(
        message: string,
        severity: Severity,
        namespace: Namespace|undefined,
        showTimestamps: boolean,
        timestampFormat: TimestampFormat,
        timestampPosition: TimestampPosition,
    ): string {
        let formattedMessage = ''

        if (namespace) {
            formattedMessage += namespace.toString()
        }

        if (showTimestamps) {
            const timestamp = Logger.time(new Date(), timestampFormat)
            formattedMessage = timestampPosition === TimestampPosition.Prepend
                ? `${timestamp}${formattedMessage}`
                : `${formattedMessage}${timestamp}`
        }

        formattedMessage += `${formattedMessage.length ? ' ' : ''}${Logger.formatMessage(severity, message)}`

        return formattedMessage
    }

    private static time(
        at: Date = new Date(),
        timestampFormat: TimestampFormat = TimestampStyle.ISO,
    ): string {
        switch (timestampFormat) {
            case TimestampStyle.ISO:
                return `${chalk.white(`[${at.toISOString()}]`)}`
            case TimestampStyle.Time:
                return `${chalk.white(`[${at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]`)}`
            case TimestampStyle.DateTime:
                return `${chalk.white(`[${at.toLocaleDateString()}-${at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]`)}`
            case TimestampStyle.Unix:
                return `${chalk.white(`[${at.valueOf()}]`)}`
            default:
                return typeof timestampFormat === 'function' ? timestampFormat(at) : at.toString()
        }
    }

    private shouldLog(severity: Severity): boolean {
        const levels = Object.values(Severity)
        const currentLevel = levels.indexOf(this.severityThreshold)
        const messageLevel = levels.indexOf(severity)
        return messageLevel >= currentLevel
    }

    static formatMessage(severity: Severity, message: string): string {
        switch (severity) {
            case Severity.SUCCESS:
                return chalk.green(message)
            case Severity.WARNING:
                return chalk.yellow(message)
            case Severity.ERROR:
                return chalk.red(message)
            case Severity.INFO:
                return chalk.white(message)
            default:
                return chalk.white(message)
        }
    }
}
