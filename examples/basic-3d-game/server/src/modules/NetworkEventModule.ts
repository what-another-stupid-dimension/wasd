import {
    Cli,
    Inject,
    Module,
    ModuleDecorator,
} from '@wasd/wasd'
import { EventModule } from '@wasd/events'

@ModuleDecorator()
export default class NetworkEventModule implements Module {
    private cli: Cli

    constructor(
        @Inject(EventModule) private events: EventModule,
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChildWithLabel('NetworkEvent')
    }

    onStart(): Promise<void> | void {
        this.cli.logInfo('NetworkEvent module started')
    }
}
