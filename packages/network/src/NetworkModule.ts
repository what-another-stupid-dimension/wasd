import { Inject, InjectOptional } from '@wasd/di'
import { Module, ModuleDecorator } from '@wasd/modules'
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
} from './event'
import { InvalidClientMessageError, InvalidClientMessageErrorReason } from './exception'

@ModuleDecorator()
class NetworkModule implements Module {
    private eventModule: EventModule

    private transports: Transport[] = []

    private proxies: Proxy[] = []

    private cli: Cli

    private clientEvents: Map<string, NetworkEventConstructor<NetworkEvent>> = new Map()

    constructor(
        @Inject(EventModule) eventModule: EventModule,
        @InjectOptional(NetworkModuleProperties) {
                transports,
                proxies,
            }: NetworkModuleProperties = new NetworkModuleProperties(),
        @InjectOptional(Cli) cli: Cli = new Cli(),
    ) {
        this.eventModule = eventModule
        this.proxies = proxies
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

    onStart() {
        this.transports.forEach((transport) => {
            transport.open()
        })
    }

    onStop() {
        this.transports.forEach((transport) => {
            transport.close()
        })
        this.cli.logDebug('All transports closed')
    }

    registerClientEvent<T extends NetworkEvent>(
        event: NetworkEventConstructor<T>,
    ) {
        if (this.clientEvents.has(event.name)) {
            throw new Error('Event already registered')
        }
        this.clientEvents.set(event.eventName, event)
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
        this.cli.logDebug(`Client (${client.getIdentifier()}) connected`)
        this.eventModule.emit(new ClientConnectedNetworkEvent())
    }

    private handleClientDisconnected(client: NetworkClient) {
        this.cli.logDebug(`Client (${client.getIdentifier()}) disconnected`)
        this.eventModule.emit(new ClientDisconnectedNetworkEvent())
    }

    private async handleClientMessage(client: NetworkClient, message: string) {
        let eventObject: NetworkEvent
        try {
            eventObject = this.parseClientMessage(message)
        } catch (error: any) {
            this.cli.logError(`Client (${client.getIdentifier()}) message is not a valid: ${error.message}`)
            return
        }

        this.cli.logDebug(`Client (${client.getIdentifier()}) event received: ${eventObject.constructor.name} (${message})})`)

        const proxiedEventObject: NetworkEvent | false = eventObject

        /*
        for (const proxy of this.proxies) {
            if (proxy.accepts(eventObject) && proxiedEventObject) {
                // eslint-disable-next-line no-await-in-loop
                proxiedEventObject = await proxy.apply(proxiedEventObject)
            }
        } */

        if (proxiedEventObject) {
            this.eventModule.emit(proxiedEventObject)
        }
    }

    private parseClientMessage(message: string): NetworkEvent {
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

        return this.clientEvents.get(eventObject.type)!.deserialize(eventObject.data)
    }

    private handleClientError(message: string) {
        this.cli.logError(message)
    }
}

export default NetworkModule
