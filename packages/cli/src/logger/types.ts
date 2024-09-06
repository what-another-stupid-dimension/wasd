export enum Severity {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

export enum TimestampStyle {
    ISO = 'iso',
    Time = 'time',
    DateTime = 'dateTime',
    Unix = 'unix'
}

export type TimestampStyleFormatFn = (date: Date) => string

export type TimestampFormat = TimestampStyle | TimestampStyleFormatFn

export enum TimestampPosition {
    Append = 'append',
    Prepend = 'prepend'
}

export type Options = {
    severityThreshold?: Severity,
    showTimestamps?: boolean,
    timestampFormat?: TimestampStyle | TimestampStyleFormatFn,
    timestampPosition?: TimestampPosition
}
