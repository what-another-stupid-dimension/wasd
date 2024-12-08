import { x86 as MurmurHash } from 'murmurhash3js'

export const createHash = (data: any): string => {
    const serialized = JSON.stringify(data) // Ensure consistent input
    return MurmurHash.hash32(serialized).toString(16) // Hexadecimal hash
}
