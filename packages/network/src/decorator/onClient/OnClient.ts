import 'reflect-metadata'
import { Event, EventConstructor } from '@wasd/events'
import { ON_CLIENT } from './constants'

export default <T extends Event>(eventType: EventConstructor<T>, priority: number = 0) => (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => {
    const handlers = Reflect.getMetadata(ON_CLIENT, target) || []
    handlers.push({ eventType, handler: descriptor.value, priority })

    Reflect.defineMetadata(ON_CLIENT, handlers, target)
}
