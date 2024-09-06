import 'reflect-metadata'
import { ON } from './constants'

export default (instance: Object): boolean => Reflect.hasMetadata(ON, instance)
