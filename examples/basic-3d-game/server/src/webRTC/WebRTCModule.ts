/* eslint-disable no-restricted-syntax */
import {
    Module, ModuleDecorator, Inject, OnClient, NetworkClient, NetworkModule, Cli,
    CliNamespace,
} from '@wasd/wasd'
import { WebRTCEvents } from '@shared/events'
import { RoomModule } from '../room'

@ModuleDecorator()
export default class WebRTCModule implements Module {
    private cli: Cli

    constructor(
        @Inject(NetworkModule) private network: NetworkModule,
        @Inject(RoomModule) private rooms: RoomModule,
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChild(CliNamespace.createElement('WebRTC', { fontColor: 'blue' }))
    }

    async onInitialize() {
        this.network.registerClientEvent(WebRTCEvents.WebRTCOfferEvent)
        this.network.registerClientEvent(WebRTCEvents.WebRTCAnswerEvent)
        this.network.registerClientEvent(WebRTCEvents.WebRTCIceCandidateEvent)
        this.cli.logInfo('WebRTC Module Initialized')
    }

    @OnClient(WebRTCEvents.WebRTCOfferEvent)
    async handleOffer(event: WebRTCEvents.WebRTCOfferEvent, client: NetworkClient) {
        const room = this.rooms.getRoomForClient(client)
        if (!room) {
            this.cli.logError(`Client ${client.getIdentifier()} is not in a room.`)
            return
        }
        for (const otherClient of room.clients) {
            if (otherClient !== client) {
                this.network.sendEventToClient(otherClient, event)
            }
        }
    }

    @OnClient(WebRTCEvents.WebRTCAnswerEvent)
    async handleAnswer(event: WebRTCEvents.WebRTCAnswerEvent, client: NetworkClient) {
        const room = this.rooms.getRoomForClient(client)
        if (!room) {
            this.cli.logError(`Client ${client.getIdentifier()} is not in a room.`)
            return
        }
        for (const otherClient of room.clients) {
            if (otherClient !== client) {
                this.network.sendEventToClient(otherClient, event)
            }
        }
    }

    @OnClient(WebRTCEvents.WebRTCIceCandidateEvent)
    async handleIceCandidate(event: WebRTCEvents.WebRTCIceCandidateEvent, client: NetworkClient) {
        const room = this.rooms.getRoomForClient(client)
        if (!room) {
            this.cli.logError(`Client ${client.getIdentifier()} is not in a room.`)
            return
        }
        for (const otherClient of room.clients) {
            if (otherClient !== client) {
                this.network.sendEventToClient(otherClient, event)
            }
        }
    }
}
