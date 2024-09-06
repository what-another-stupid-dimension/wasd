import 'reflect-metadata'
import { SERVICE_TAG_METADATA_KEY } from './constants'

export default (tag: string): ClassDecorator => (target: Object) => {
    const existingTags = Reflect.getMetadata(SERVICE_TAG_METADATA_KEY, target) || []
    Reflect.defineMetadata(SERVICE_TAG_METADATA_KEY, [...existingTags, tag], target)
}
