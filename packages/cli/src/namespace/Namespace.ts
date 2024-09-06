import chalk from 'chalk'
import {
    Path,
    Element,
    Label,
    Delimiter,
    Style,
} from './types'
import { defaultDelimiter, defaultStyle } from './constants'

export default class Namespace {
    constructor(
        private path: Path = [],
    ) {}

    public toString(): string {
        if (this.path.length < 1) return ''
        return Namespace.formatPath(this.path)
    }

    public extendWith(path: Path) {
        return new Namespace([
            ...this.path,
            ...path,
        ])
    }

    public extendWithElement(element: Element) {
        return this.extendWith([element])
    }

    static createElement(
        label: Label,
        style: Style = defaultStyle,
        delimiter: Delimiter = defaultDelimiter,
    ): Element {
        return {
            label,
            style,
            delimiter,
        }
    }

    static formatElement(element: Element): string {
        let formattedNamespace = `${element.delimiter.start}${element.label}${element.delimiter.end}`

        if (element.style.fontColor) {
            formattedNamespace = chalk[element.style.fontColor](formattedNamespace)
        }
        if (element.style.backgroundColor) {
            formattedNamespace = chalk[element.style.backgroundColor](formattedNamespace)
        }

        return formattedNamespace
    }

    static createPath(
        labels: Label[],
        style: Style = defaultStyle,
        delimiter: Delimiter = defaultDelimiter,
    ): Path {
        return labels.map((label) => ({
            label,
            style,
            delimiter,
        }))
    }

    static formatPath(path: Path): string {
        return path.map(Namespace.formatElement).join('')
    }

    static create(
        labels: Label[],
        style?: Style,
        delimiter?: Delimiter,
    ) {
        return new Namespace(Namespace.createPath(labels, style, delimiter))
    }

    static createEmpty() {
        return Namespace.create([])
    }
}
