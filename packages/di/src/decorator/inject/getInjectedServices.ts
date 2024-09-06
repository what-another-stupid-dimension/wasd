import 'reflect-metadata'
import { INJECT_METADATA_KEY } from './constants'

export default (instance: Object): { token: any; index: number, optional: boolean }[] => (
    Reflect.getMetadata(INJECT_METADATA_KEY, instance)
        || []
).sort((
    a : { token: any; index: number, optional: boolean },
    b : { token: any; index: number, optional: boolean },
) => a.index - b.index)
