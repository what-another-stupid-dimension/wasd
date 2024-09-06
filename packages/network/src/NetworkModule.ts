import { Inject, InjectOptional } from '@wasd/di'
import { Module, ModuleDecorator } from '@wasd/modules'
import { Cli, CliNamespace } from '@wasd/cli'
import { EventModule } from '@wasd/events'
import NetworkModuleProperties from './NetworkModuleProperties'
import { Transport, NetworkClient } from './transport'
import { DEFAULT_PORT, DEFAULT_TRANSPORT } from './constants'
import { ClientConnectedNetworkEvent, ClientDisconnectedNetworkEvent } from './events'

@ModuleDecorator()
class NetworkModule implements Module {
    private eventModule: EventModule

    private transports: Transport[] = []

    private cli: Cli

    constructor(
        @Inject(EventModule) eventModule: EventModule,
        @InjectOptional(NetworkModuleProperties) { transports }: NetworkModuleProperties = {},
        @InjectOptional(Cli) cli: Cli = new Cli(),
    ) {
        this.eventModule = eventModule
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

    private handleOpen(name: string, port: number) {
        this.cli.logInfo(`${name} is listening on port ${port}`)
    }

    private handleClose(name: string, port: number) {
        this.cli.logInfo(`${name} stopped listening on port ${port}`)
    }

    private handleError(error: Error) {
        this.cli.logError(error.message)
    }

    private handleClientConnected(client: NetworkClient<Transport>) {
        this.cli.logDebug(`Client (${client.getIdentifier()}) connected at ${client.transport.constructor.name}`)
        this.eventModule.emit(new ClientConnectedNetworkEvent(client))
    }

    private handleClientDisconnected(client: NetworkClient<Transport>) {
        this.cli.logDebug(`Client (${client.getIdentifier()}) disconnected at ${client.transport.constructor.name}`)
        this.eventModule.emit(new ClientDisconnectedNetworkEvent(client))
    }

    private handleClientMessage(client: NetworkClient<Transport>, message: string) {
        this.cli.logDebug(`Client (${client.getIdentifier()}) message: ${message}`)
    }

    private handleClientError(message: string) {
        this.cli.logError(message)
    }
}

export default NetworkModule
