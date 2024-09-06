import { ServiceClass } from '../types'

export default <T>(fn: any): fn is ServiceClass<T> => typeof fn === 'function'
        && (fn.prototype && fn.prototype.constructor === fn)
