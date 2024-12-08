import {
    Module,
    ModuleDecorator,
    Inject,
    NetworkClient,
    NetworkModule,
    OnClient,
    Cli,
    CliNamespace,
} from '@wasd/wasd'
import { WebRTCEvents } from '@shared/events'
import { RoomModule } from '../room'
import { PlayerModule } from '../player'

@ModuleDecorator()
export default class WebRTCModule implements Module {
    public readonly name = 'WebRTCModule'

    private cli: Cli

    constructor(
        @Inject(NetworkModule) private network: NetworkModule,
        @Inject(RoomModule) private rooms: RoomModule,
        @Inject(PlayerModule) private players: PlayerModule, // Inject PlayerModule
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChild(CliNamespace.createElement('WebRTC', { fontColor: 'cyan' }))
    }

    async onInitialize(): Promise<void> {
        this.cli.logInfo('Initializing WebRTCModule...')
        this.network.registerClientEvent(WebRTCEvents.WebRTCOfferEvent)
        this.network.registerClientEvent(WebRTCEvents.WebRTCAnswerEvent)
        this.network.registerClientEvent(WebRTCEvents.WebRTCIceCandidateEvent)
    }

    async onStart(): Promise<void> {
        this.cli.logInfo('Starting WebRTCModule...')
    }

    @OnClient(WebRTCEvents.WebRTCOfferEvent)
    async onWebRTCOffer(
        { sdp, type }: WebRTCEvents.WebRTCOfferEvent,
        client: NetworkClient,
    ): Promise<void> {
        const playerEntity = this.players.getClientEntity(client)
        if (!playerEntity) {
            this.cli.logError(`Client ${client.getIdentifier()} does not have an associated PlayerEntity.`)
            return
        }

        // Set the local description on the player entity
        playerEntity.setLocalDescription({ sdp, type })

        const room = this.rooms.getRoomForClient(client)
        if (!room) {
            this.cli.logError(`Client ${client.getIdentifier()} is not in a room.`)
            return
        }

        this.cli.logInfo(`Relaying offer from ${client.getIdentifier()} for entity ${playerEntity.name}`)

        // eslint-disable-next-line no-restricted-syntax
        for (const otherClient of room.clients) {
            if (otherClient !== client) {
                this.network.sendEventToClient(
                    otherClient,
                    new WebRTCEvents.WebRTCOfferEvent(sdp, type, playerEntity.id),
                )
            }
        }
    }

    @OnClient(WebRTCEvents.WebRTCAnswerEvent)
    async onWebRTCAnswer(
        { answer }: WebRTCEvents.WebRTCAnswerEvent,
        client: NetworkClient,
    ): Promise<void> {
        const playerEntity = this.players.getClientEntity(client)
        if (!playerEntity) {
            this.cli.logError(`Client ${client.getIdentifier()} does not have an associated PlayerEntity.`)
            return
        }

        // Set the remote description on the player entity
        playerEntity.setRemoteDescription(answer)

        const room = this.rooms.getRoomForClient(client)
        if (!room) {
            this.cli.logError(`Client ${client.getIdentifier()} is not in a room.`)
            return
        }

        this.cli.logInfo(`Relaying answer from ${client.getIdentifier()} for entity ${playerEntity.name}`)

        // eslint-disable-next-line no-restricted-syntax
        for (const otherClient of room.clients) {
            if (otherClient !== client) {
                this.network.sendEventToClient(
                    otherClient,
                    new WebRTCEvents.WebRTCAnswerEvent(answer, playerEntity.id),
                )
            }
        }
    }

    @OnClient(WebRTCEvents.WebRTCIceCandidateEvent)
    async onWebRTCIceCandidate(
        { candidate }: WebRTCEvents.WebRTCIceCandidateEvent,
        client: NetworkClient,
    ): Promise<void> {
        const playerEntity = this.players.getClientEntity(client)
        if (!playerEntity) {
            this.cli.logError(`Client ${client.getIdentifier()} does not have an associated PlayerEntity.`)
            return
        }

        // Add ICE candidate to the player entity
        playerEntity.addIceCandidate(candidate)

        const room = this.rooms.getRoomForClient(client)
        if (!room) {
            this.cli.logError(`Client ${client.getIdentifier()} is not in a room.`)
            return
        }

        this.cli.logInfo(`Relaying ICE candidate from ${client.getIdentifier()} for entity ${playerEntity.name}`)

        // eslint-disable-next-line no-restricted-syntax
        for (const otherClient of room.clients) {
            if (otherClient !== client) {
                this.network.sendEventToClient(
                    otherClient,
                    new WebRTCEvents.WebRTCIceCandidateEvent(candidate, playerEntity.id),
                )
            }
        }
    }

    async onDestroy(): Promise<void> {
        this.cli.logInfo('Destroying WebRTCModule...')
    }
}
