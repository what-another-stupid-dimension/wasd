/* eslint-disable complexity */
const deepEqual = (a: any, b: any, cache = new Map()): boolean => {
    const cacheKey = `${JSON.stringify(a)}|${JSON.stringify(b)}`
    if (cache.has(cacheKey)) return cache.get(cacheKey)

    if (a === b) return true
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false

    if (Array.isArray(a)) {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i += 1) {
            if (!deepEqual(a[i], b[i], cache)) return false
        }
        return true
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key], cache)) {
            cache.set(cacheKey, false)
            return false
        }
    }

    cache.set(cacheKey, true)
    return true
}

export default deepEqual
