import { Token } from '../types'
import { tokenToString } from '../utils'

export default class ResolveFailedError extends Error {
    constructor(token: Token<any>, before?: Error) {
        super(`Failed to resolve ${tokenToString(token)}${before ? `: ${before.message}` : ''}`)
    }
}
