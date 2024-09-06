import { Token } from '../types'

export default (token: Token<any>): string => (Object.prototype.hasOwnProperty.call(token, 'name') ? (token as any).name : `token ${token.toString()}`)
