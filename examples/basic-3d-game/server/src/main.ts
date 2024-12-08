import {
    Server,
    CliLoggerSeverity,
    AuthenticationProxy,
    NetworkModuleProperties,
    WebSocketTransport,
    NetworkModule,
} from '@wasd/wasd'

import { WorldManagerModule } from './world'
import { PlayerModule } from './player'
import PlayerControlsModule from './player/PlayerControlsModule'
import { WebRTCModule } from './webRTC'
import { RoomModule } from './room'

const gameServer = new Server({
    fps: 10,
    loggerSeverity: CliLoggerSeverity.DEBUG,
})

// Core Module
gameServer.setValue(NetworkModuleProperties, {
    transports: [
        { transport: WebSocketTransport, port: 8080 },
    ],
    proxies: [
        new AuthenticationProxy(),
    ],
})
gameServer.addModule(NetworkModule)

// Game Modules
gameServer.addModule(WorldManagerModule)
gameServer.addModule(PlayerModule)
gameServer.addModule(PlayerControlsModule)
gameServer.addModule(RoomModule)
gameServer.addModule(WebRTCModule)

gameServer.start()
