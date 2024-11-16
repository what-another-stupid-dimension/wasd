import {
    Cli, Inject, Module, ModuleDecorator,
} from '@wasd/wasd'
import { CharacterNameGenerator } from '@wasd/character-name-generator'
import { EventModule, On } from '@wasd/events'
import { ClientConnectedNetworkEvent, NetworkModule } from '@wasd/network'
import { TestEvent } from '@shared/events'

@ModuleDecorator()
export default class TestModule implements Module {
    private cli: Cli

    private generator: CharacterNameGenerator

    constructor(
        @Inject(EventModule) private events: EventModule,
        @Inject(NetworkModule) private network: NetworkModule,
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChildWithLabel('Test')
        this.generator = new CharacterNameGenerator()
    }

    onLoad(): Promise<void> | void {
        this.network.registerClientEvent(TestEvent)
    }

    onStart() {
    }

    @On(ClientConnectedNetworkEvent)
    onClientConnected() {
        this.cli.logInfo('Client connected')
    }

    @On(TestEvent)
    onClientTestEvent() {
        this.cli.logInfo('Test event received')
    }
}
