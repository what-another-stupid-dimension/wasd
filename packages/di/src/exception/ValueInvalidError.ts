import { Token } from '../types'
import { tokenToString } from '../utils'

export default class ValueInvalidError extends Error {
    constructor(token: Token<any>) {
        super(`Value for token ${tokenToString(token)} is invalid`)
    }
}
