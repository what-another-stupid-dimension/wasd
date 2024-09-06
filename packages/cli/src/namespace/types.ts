import { BackgroundColor, ForegroundColor } from 'chalk'

export type Delimiter = {
    start?: string,
    end?: string,
}

export type Style = {
    fontColor?: typeof ForegroundColor,
    backgroundColor?: typeof BackgroundColor,
}

export type Label = string

export type Element = {
    label: Label,
    delimiter: Delimiter,
    style: Style,
}

export type Path = Element[]
