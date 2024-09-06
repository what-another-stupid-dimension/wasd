import 'reflect-metadata'
import { SERVICE_TAG_METADATA_KEY } from './constants'

export default (instance: Object): string[] => Reflect.getMetadata(
    SERVICE_TAG_METADATA_KEY,
    instance,
) || []
