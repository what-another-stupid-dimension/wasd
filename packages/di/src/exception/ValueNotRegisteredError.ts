import { Token } from '../types'
import { tokenToString } from '../utils'

export default class ValueNotExistsError extends Error {
    constructor(token: Token<any>) {
        super(`No value registered for token: ${tokenToString(token)}`)
    }
}
