import {
    Server,
    CliLoggerSeverity,
} from '@wasd/wasd'
import {
    NetworkModule,
    NetworkModuleProperties,
    WebSocketTransport,
} from '@wasd/network'
import { EventModule } from '@wasd/events'
import { TestModule, NetworkEventModule } from './modules'

const gameServer = new Server({
    fps: 10,
    loggerSeverity: CliLoggerSeverity.DEBUG,
})

gameServer.setValue(NetworkModuleProperties, {
    transports: [
        { transport: WebSocketTransport, port: 8080 },
    ],
})
gameServer.addModule(NetworkModule)
gameServer.addModule(NetworkEventModule)
gameServer.addModule(EventModule)
gameServer.addModule(TestModule)

gameServer.start()
