import {
    Cli,
    Inject,
    Module,
    ModuleDecorator,
} from '@wasd/wasd'
import { EventModule, On } from '@wasd/events'
import { ClientConnectedNetworkEvent } from '@wasd/network'
import { SharedNetworkEvent, TestEvent } from '@shared/networkEvents'

@ModuleDecorator()
export default class NetworkEventModule implements Module {
    private cli: Cli

    constructor(
        @Inject(EventModule) private events: EventModule,
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChildWithLabel('NetworkEvent')
    }

    sendEvent(event: SharedNetworkEvent): void {
        this.events.emit(event)
    }

    onStart(): Promise<void> | void {
        this.cli.logInfo('NetworkEvent module started')
    }

    @On(ClientConnectedNetworkEvent)
    onClientConnect(event: ClientConnectedNetworkEvent): void {
        event.client.send(new TestEvent())
    }
}
