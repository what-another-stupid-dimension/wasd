import 'reflect-metadata'
import { SCOPED_METADATA_KEY } from './constants'

export default (instance: Object): boolean => Reflect.getMetadata(
    SCOPED_METADATA_KEY,
    instance,
) === true
