import 'reflect-metadata'
import { EventConstructor } from '@wasd/events'
import { ON_CLIENT } from './constants'

export default (instance: Object): {
    eventType: EventConstructor<Event>,
    handler: (event: Event) => void,
    priority: number,
}[] => Reflect.getMetadata(ON_CLIENT, instance) || []
