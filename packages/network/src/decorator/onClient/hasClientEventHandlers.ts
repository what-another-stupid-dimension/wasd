import 'reflect-metadata'
import { ON_CLIENT } from './constants'

export default (instance: Object): boolean => Reflect.hasMetadata(ON_CLIENT, instance)
