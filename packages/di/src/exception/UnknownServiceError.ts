import { Token } from '../types'
import { tokenToString } from '../utils'

export default class UnknownServiceError extends Error {
    constructor(token: Token<any>, reason?: Error) {
        super(`No provider found for Service: ${tokenToString(token)}. Did you forget to register it?${reason ? `\n${reason.message}` : ''}`)
    }
}
