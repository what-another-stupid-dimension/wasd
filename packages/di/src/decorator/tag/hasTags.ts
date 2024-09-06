import 'reflect-metadata'
import { SERVICE_TAG_METADATA_KEY } from './constants'

export default (instance: Object): boolean => Reflect.hasMetadata(
    SERVICE_TAG_METADATA_KEY,
    instance,
)
