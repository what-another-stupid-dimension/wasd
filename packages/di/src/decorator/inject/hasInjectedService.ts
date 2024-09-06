import 'reflect-metadata'
import { INJECT_METADATA_KEY } from './constants'

export default (instance: Object): boolean => Reflect.hasMetadata(INJECT_METADATA_KEY, instance)
