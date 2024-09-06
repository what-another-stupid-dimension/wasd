import { Container, Inject, InjectOptional } from '@wasd/di'
import { Cli, CliNamespace } from '@wasd/cli'
import { Module, ModuleDecorator, ModulePriority } from '@wasd/modules'
import { EventBus, Event } from './types'
import { LocalEventBus } from './eventBus'
import EventModuleProperties from './EventModuleProperties'

@ModuleDecorator()
export default class EventModule implements Module, EventBus {
    public priority: ModulePriority = ModulePriority.CORE

    private eventBus: EventBus

    private cli: Cli

    constructor(
        @Inject(Container) private container: Container,
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
        const sortedModules = await this.getSortedModules()
        // Register Event Listeners
        sortedModules.forEach((module) => {
            this.eventBus.registerListener(module)
        })
    }

    async onStop(): Promise<void> {
        const sortedModules = await this.getSortedModules()

        // Unregister Event Listeners
        sortedModules.forEach((module) => {
            this.eventBus.unregisterListener(module)
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

    emit<T extends Event>(event: T): void {
        this.eventBus.emit(event)
    }

    registerListener(instance: Object): void {
        this.eventBus.registerListener(instance)
    }

    unregisterListener(instance: Object): void {
        this.eventBus.unregisterListener(instance)
    }

    private async getSortedModules(): Promise<Module[]> {
        const modules: Module[] = await this.container.getTaggedServices('module')
        modules.sort((a, b) => (b.priority || ModulePriority.CUSTOM)
                - (a.priority || ModulePriority.CUSTOM))
        return modules
    }
}
