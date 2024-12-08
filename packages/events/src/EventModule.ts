import { Inject, InjectOptional } from '@wasd/di'
import { Cli, CliNamespace } from '@wasd/cli'
import {
    Module,
    ModuleDecorator,
    ModuleManager,
    ModulePriority,
} from '@wasd/modules'
import { EventBus, Event } from './types'
import { LocalEventBus } from './eventBus'
import EventModuleProperties from './EventModuleProperties'
import { getEventHandlers, hasEventHandlers } from './decorator'

@ModuleDecorator()
export default class EventModule implements Module, EventBus {
    public priority: ModulePriority = ModulePriority.CORE

    private eventBus: EventBus

    private cli: Cli

    constructor(
        @Inject(ModuleManager) private modules: ModuleManager,
        @InjectOptional(EventModuleProperties) { eventBus }: EventModuleProperties = {},
        @InjectOptional(Cli) cli: Cli = new Cli(),
    ) {
        this.cli = cli.createChild(CliNamespace.createElement('Event', { fontColor: 'magenta' }))
        let eventBusInstance = eventBus
        if (!eventBusInstance) {
            eventBusInstance = new LocalEventBus()
            this.cli.logInfo('No eventBus configured, using default LocalEventBus.')
        }
        this.eventBus = eventBusInstance
    }

    async onStart(): Promise<void> {
        const sortedModules = await this.modules.getModulesByPriority()
        // Register Event Listeners
        sortedModules.forEach((module) => {
            this.registerListener(module)
        })
    }

    async onStop(): Promise<void> {
        const sortedModules = await this.modules.getModulesByPriority()

        // Unregister Event Listeners
        sortedModules.forEach((module) => {
            this.unregisterListener(module)
        })
    }

    subscribe<T extends Event>(
        eventClass: new (...args: any[]) => T,
        handler: (event: T) => void,
        priority?: number,
    ): void {
        this.eventBus.subscribe(eventClass, handler, priority)
    }

    unsubscribe<T extends Event>(
        eventClass: new (...args: any[]) => T,
        handler: (event: T) => void,
    ): void {
        this.eventBus.unsubscribe(eventClass, handler)
    }

    emit<T extends Event, Args extends any[] = []>(eventInstance: T, ...args: Args): void {
        this.eventBus.emit(eventInstance, ...args)
    }

    registerListener(instance: Object): void {
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

    unregisterListener(instance: Object): void {
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
