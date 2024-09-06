import 'reflect-metadata'
import { ON } from './constants'
import { EventConstructor, Event } from '../../types'

export default <T extends Event>(eventType: EventConstructor<T>, priority: number = 0) => (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => {
    const handlers = Reflect.getMetadata(ON, target) || []
    handlers.push({ eventType, handler: descriptor.value, priority })

    Reflect.defineMetadata(ON, handlers, target)
}
