import { Inject, InjectOptional } from '@wasd/di'
import {
    Module,
    ModuleDecorator,
    ModuleManager,
} from '@wasd/modules'
import { Cli, CliNamespace } from '@wasd/cli'
import { EventModule } from '@wasd/events'
import NetworkModuleProperties from './NetworkModuleProperties'
import { Transport } from './transport'
import { DEFAULT_PORT, DEFAULT_TRANSPORT } from './constants'
import { Proxy } from './proxy'
import { NetworkClient } from './client'
import {
    ClientConnectedNetworkEvent,
    ClientDisconnectedNetworkEvent,
    NetworkEvent,
    NetworkEventConstructor,
} from './events'
import { InvalidClientMessageError, InvalidClientMessageErrorReason } from './exception'
import { getClientEventHandlers, hasClientEventHandlers } from './decorator'

@ModuleDecorator()
class NetworkModule implements Module {
    private eventModule: EventModule

    private transports: Transport[] = []

    private proxies: Proxy[] = []

    private cli: Cli

    private clientEvents: Map<string, NetworkEventConstructor<NetworkEvent>> = new Map()

    private clients: Map<string, NetworkClient> = new Map()

    constructor(
        @Inject(EventModule) eventModule: EventModule,
        @Inject(ModuleManager) private modules: ModuleManager,
        @InjectOptional(NetworkModuleProperties) {
            transports,
            proxies,
        }: NetworkModuleProperties = new NetworkModuleProperties(),
        @InjectOptional(Cli) cli: Cli = new Cli(),
    ) {
        this.eventModule = eventModule
        this.proxies = proxies || []
        this.cli = cli.createChild(CliNamespace.createElement('Network', { fontColor: 'green' }))

        if (!transports) {
            this.cli.logInfo(`No transport configured, using default [${DEFAULT_TRANSPORT.transport.name}] with port ${DEFAULT_TRANSPORT.port}.`)
        }

        (transports || [DEFAULT_TRANSPORT]).forEach((
            { transport: TransportConstructor, port },
        ) => {
            this.transports.push(new TransportConstructor(
                port || DEFAULT_PORT,
                {
                    onClientConnected: this.handleClientConnected.bind(this),
                    onClientDisconnected: this.handleClientDisconnected.bind(this),
                    onClientError: this.handleClientError.bind(this),
                    onClientMessage: this.handleClientMessage.bind(this),
                    onError: this.handleError.bind(this),
                    onClose: this.handleClose.bind(this),
                    onOpen: this.handleOpen.bind(this),
                },
            ))
        })
    }

    async onStart() {
        this.transports.forEach((transport) => {
            transport.open()
        })

        const sortedModules = await this.modules.getModulesByPriority()
        // Register Event Listeners
        sortedModules.forEach((module) => {
            this.registerClientListener(module)
        })
    }

    async onStop() {
        this.transports.forEach((transport) => {
            transport.close()
        })
        this.cli.logDebug('All transports closed')

        const sortedModules = await this.modules.getModulesByPriority()

        // Unregister Event Listeners
        sortedModules.forEach((module) => {
            this.unregisterClientListener(module)
        })
    }

    getClients(): NetworkClient[] {
        return Array.from(this.clients.values())
    }

    sendEventToClient<T extends NetworkEvent>(client: NetworkClient, event: T): void {
        client.emit(event.constructor.name, event.serialize())

        this.cli.logDebug(`Event ${event.constructor.name} sent to client (${client.getIdentifier()})`)
    }

    sendBinaryDataToClient(client: NetworkClient, data: ArrayBuffer): void {
        client.sendMessage(data)
    }

    broadcastEvent<T extends NetworkEvent>(event: T): void {
        const serializedEvent = JSON.stringify({
            type: event.constructor.name,
            data: event.serialize(),
        })

        this.transports.forEach((transport) => {
            transport.broadcast(serializedEvent)
        })

        this.cli.logDebug(`Event ${event.constructor.name} broadcasted to all clients`)
    }

    registerClientEvent<T extends NetworkEvent>(
        event: NetworkEventConstructor<T>,
    ) {
        if (this.clientEvents.has(event.name)) {
            throw new Error('Event already registered')
        }
        this.clientEvents.set(event.name, event)
    }

    registerClientListener(instance: Object): void {
        if (!hasClientEventHandlers(instance)) {
            return
        }

        const handlers = getClientEventHandlers(instance)
        if (handlers) {
            handlers.forEach(({
                eventType,
                handler,
                priority,
            }: { eventType: any; handler: (event: any) => void, priority: number }) => {
                this.eventModule.subscribe(eventType, handler.bind(instance), priority)
            })
        }
    }

    unregisterClientListener(instance: Object): void {
        if (!hasClientEventHandlers(instance)) {
            return
        }

        const handlers = getClientEventHandlers(instance)
        if (handlers) {
            handlers.forEach(({
                eventType,
                handler,
            }: { eventType: any; handler: (event: any) => void }) => {
                this.eventModule.unsubscribe(eventType, handler.bind(instance))
            })
        }
    }

    private handleOpen(name: string, port: number) {
        this.cli.logInfo(`${name} is listening on port ${port}`)
    }

    private handleClose(name: string, port: number) {
        this.cli.logInfo(`${name} stopped listening on port ${port}`)
    }

    private handleError(error: Error) {
        this.cli.logError(error.message)
    }

    private handleClientConnected(client: NetworkClient) {
        this.clients.set(client.getIdentifier(), client)
        this.cli.logDebug(`Client (${client.getIdentifier()}) connected`)
        this.eventModule.emit(new ClientConnectedNetworkEvent(client))
    }

    private handleClientDisconnected(client: NetworkClient) {
        this.cli.logDebug(`Client (${client.getIdentifier()}) disconnected`)
        this.eventModule.emit(new ClientDisconnectedNetworkEvent(client))
        this.clients.delete(client.getIdentifier())
    }

    private async handleClientMessage(client: NetworkClient, message: string) {
        let eventObject: NetworkEvent
        this.cli.logDebug(`Client (${client.getIdentifier()}) message received. Raw: (${message})})`)

        try {
            eventObject = this.parseClientMessage(client, message)
        } catch (error: any) {
            this.cli.logError(`Client (${client.getIdentifier()}) message is not a valid: ${error.message}`)
            return
        }

        let proxiedEventObject: NetworkEvent | false = eventObject

        // eslint-disable-next-line no-restricted-syntax
        for (const proxy of this.proxies) {
            if (proxy.accepts(eventObject) && proxiedEventObject) {
                // eslint-disable-next-line no-await-in-loop
                proxiedEventObject = await proxy.apply(proxiedEventObject, client)
                if (!proxiedEventObject) {
                    this.cli.logDebug(`${proxy.constructor.name}: message blocked. Client: (${client.getIdentifier()}) Type: ${eventObject.constructor.name} Raw: ${message}`)
                    break
                } else {
                    this.cli.logDebug(`${proxy.constructor.name}: message handled. Client (${client.getIdentifier()}) Type: ${eventObject.constructor.name} Raw: ${message}`)
                }
            }
        }

        if (proxiedEventObject) {
            this.cli.logDebug(`Client (${client.getIdentifier()}) message processed: ${eventObject.constructor.name} (${message})})`)
            this.eventModule.emit(proxiedEventObject, client)
        }
    }

    private parseClientMessage(client: NetworkClient, message: string): NetworkEvent {
        const eventObject: { type: string, data?: any } = JSON.parse(message)

        if (typeof eventObject !== 'object') {
            throw new InvalidClientMessageError(
                message,
                InvalidClientMessageErrorReason.InvalidObject,
            )
        }

        if (!Object.prototype.hasOwnProperty.call(eventObject, 'type')) {
            throw new InvalidClientMessageError(
                message,
                InvalidClientMessageErrorReason.MissingType,
            )
        }

        if (typeof eventObject.type !== 'string') {
            throw new InvalidClientMessageError(
                message,
                InvalidClientMessageErrorReason.InvalidType,
            )
        }

        if (!this.clientEvents.has(eventObject.type)) {
            throw new InvalidClientMessageError(
                message,
                InvalidClientMessageErrorReason.UnkownEvent,
            )
        }

        return this.clientEvents.get(eventObject.type)!.deserialize(eventObject.data, client)
    }

    private handleClientError(message: string) {
        this.cli.logError(message)
    }
}

export default NetworkModule
