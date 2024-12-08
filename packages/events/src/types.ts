export interface Event {
}

export type EventConstructor<T extends Event> = new (...args: any[]) => T

export type EventHandler<T extends Event> = (event: T, ...args: any[]) => void

export type PrioritizedEventHandler<T extends Event> = {
    handler: EventHandler<T>,
    priority: number
}

export interface EventBus {
    subscribe<T extends Event>(
        eventClass: new (...args: any[]) =>T,
        handler: (event: T) => void,
        priority?: number
    ): void

    unsubscribe<T extends Event>(
        eventClass: EventConstructor<T>,
        handler: (event: T) => void,
    ): void

    emit<T extends Event, Args extends any[] = []>(eventInstance: T, ...args: Args) :void
}
