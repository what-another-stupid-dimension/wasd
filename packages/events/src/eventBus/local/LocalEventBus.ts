import { getEventHandlers, hasEventHandlers } from '../../decorator'
import {
    EventConstructor,
    EventHandler,
    Event,
    PrioritizedEventHandler,
    EventBus,
} from '../../types'

export default class LocalEventBus implements EventBus {
    private handlers: Map<EventConstructor<any>, PrioritizedEventHandler<any>[]> = new Map()

    subscribe<T extends Event>(
        eventType: EventConstructor<T>,
        handler: EventHandler<T>,
        priority: number = 0,
    ) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, [])
        }
        const handlers = this.handlers.get(eventType)!
        handlers.push({ handler, priority })
        handlers.sort((a, b) => b.priority - a.priority)
    }

    unsubscribe<T extends Event>(
        eventType: EventConstructor<T>,
        handler: EventHandler<T>,
    ) {
        const handlers = this.handlers.get(eventType)
        if (handlers) {
            this.handlers.set(
                eventType,
                handlers.filter((h) => h.handler !== handler),
            )
            if (this.handlers.get(eventType)!.length === 0) {
                this.handlers.delete(eventType)
            }
        }
    }

    emit<T extends Event>(eventInstance: T) {
        const eventType = eventInstance.constructor as EventConstructor<T>
        const handlers = this.handlers.get(eventType)
        if (handlers) {
            handlers.forEach(({ handler }) => {
                handler(eventInstance)
            })
        }
    }

    registerListener(instance: Object) {
        if (!hasEventHandlers(instance)) {
            return
        }

        const handlers = getEventHandlers(instance)
        if (handlers) {
            handlers.forEach(({
                eventType,
                handler,
                priority,
            }: { eventType: any; handler: (event: any) => void, priority: number }) => {
                this.subscribe(eventType, handler.bind(instance), priority)
            })
        }
    }

    unregisterListener(instance: Object) {
        if (!hasEventHandlers(instance)) {
            return
        }

        const handlers = getEventHandlers(instance)
        if (handlers) {
            handlers.forEach(({
                eventType,
                handler,
            }: { eventType: any; handler: (event: any) => void }) => {
                this.unsubscribe(eventType, handler.bind(instance))
            })
        }
    }
}
