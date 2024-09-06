import 'reflect-metadata'
import { ON } from './constants'
import { EventConstructor } from '../../types'

export default (instance: Object): {
    eventType: EventConstructor<Event>,
    handler: (event: Event) => void,
    priority: number,
}[] => Reflect.getMetadata(ON, instance) || []
