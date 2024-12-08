import {
    Cli, CliNamespace, Inject, Module, ModuleDecorator,
    ClientConnectedNetworkEvent,
    ClientDisconnectedNetworkEvent,
    NetworkClient, NetworkModule,
    Physics3D, On,
} from '@wasd/wasd'
import {
    CharacterNameGenerator, fairyGibberish, Locale, medievalGibberish,
} from '@wasd/character-name-generator'
import { InitialStateNetworkEvent, StateUpdateNetworkEvent } from '@shared/events'
import WorldManagerModule from '../world/WorldManagerModule'
import PlayerEntity from './PlayerEntity'
import { RoomModule } from '../room'

@ModuleDecorator()
export default class PlayerModule implements Module {
    private cli: Cli

    private generator: CharacterNameGenerator

    private playerEntities: Map<NetworkClient, PlayerEntity> = new Map()

    private static readonly ENTITY_UPDATE_RANGE = new Physics3D.Vector3(50, 50, 50)

    constructor(
        @Inject(NetworkModule) private network: NetworkModule,
        @Inject(WorldManagerModule) private worlds: WorldManagerModule,
        @Inject(RoomModule) private rooms: RoomModule,
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChild(CliNamespace.createElement('Player', { fontColor: 'yellow' }))
        this.generator = new CharacterNameGenerator(Locale.En, [fairyGibberish, medievalGibberish])
    }

    public getClientEntity(client: NetworkClient): PlayerEntity | undefined {
        return this.playerEntities.get(client)
    }

    public getAllEntities(): PlayerEntity[] {
        return Array.from(this.playerEntities.values())
    }

    public onUpdate(): void {
        this.playerEntities.forEach((playerEntity, client) => {
            const diff = playerEntity.getWorld().getStateDiffForEntity(
                playerEntity,
                new Physics3D.Box(
                    playerEntity.position.subtract(PlayerModule.ENTITY_UPDATE_RANGE),
                    playerEntity.position.add(PlayerModule.ENTITY_UPDATE_RANGE),
                ),
            )

            if (diff && !diff.isEmpty()) {
                this.network.sendEventToClient(
                    client,
                    new StateUpdateNetworkEvent(diff.serialize(), playerEntity.id),
                )
            }
        })
    }

    @On(ClientConnectedNetworkEvent)
    onClientConnected({ client }: ClientConnectedNetworkEvent): void {
        const playerEntity = new PlayerEntity({
            position: new Physics3D.Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10),
            world: this.worlds.getDefaultWorld(),
            name: this.generator.generateString({
                adjective: 0.2,
                title: 0.1,
                lastName: false,
                doubleFirstName: 0.2,
            }),
        })

        this.playerEntities.set(client, playerEntity)

        const { state, hash } = playerEntity.getWorld().getStateForEntity(
            playerEntity,
            new Physics3D.Box(
                playerEntity.position.subtract(PlayerModule.ENTITY_UPDATE_RANGE),
                playerEntity.position.add(PlayerModule.ENTITY_UPDATE_RANGE),
            ),
        )

        this.network.sendEventToClient(
            client,
            new InitialStateNetworkEvent(state.serialize(), hash, playerEntity.id),
        )

        this.rooms.joinRoom('default', client)
    }

    @On(ClientDisconnectedNetworkEvent)
    onClientDisconnected({ client }: ClientDisconnectedNetworkEvent): void {
        this.rooms.leaveRooms(client)
        const entity = this.playerEntities.get(client)
        if (entity) {
            this.worlds.getDefaultWorld().removeEntity(entity)
            this.playerEntities.delete(client)
        }
    }
}
