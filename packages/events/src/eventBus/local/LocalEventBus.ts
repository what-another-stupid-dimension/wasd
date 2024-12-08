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

    emit<T extends Event, Args extends any[] = []>(eventInstance: T, ...args: Args) {
        const eventType = eventInstance.constructor as EventConstructor<T>
        const handlers = this.handlers.get(eventType)
        if (handlers) {
            handlers.forEach(({ handler }) => {
                (handler as (event: T, ...args: Args) => void)(eventInstance, ...args)
            })
        }
    }
}
