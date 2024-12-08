import {
    Module,
    ModuleDecorator,
    Inject,
    NetworkClient,
    NetworkModule,
    Cli,
    CliNamespace,
} from '@wasd/wasd'

export type Room = {
    id: string;
    clients: Set<NetworkClient>;
};

@ModuleDecorator()
export default class RoomModule implements Module {
    public readonly name = 'RoomModule'

    private cli: Cli

    private rooms: Map<string, Room> = new Map()

    constructor(@Inject(NetworkModule) private network: NetworkModule, @Inject(Cli) cli: Cli) {
        this.cli = cli.createChild(CliNamespace.createElement('Room', { fontColor: 'blue' }))
    }

    async onInitialize(): Promise<void> {
        this.cli.logInfo('Initializing RoomModule...')
        this.createRoom('default')
    }

    async onStart(): Promise<void> {
        this.cli.logInfo('Starting RoomModule...')
    }

    public createRoom(roomId: string): void {
        if (this.rooms.has(roomId)) {
            throw new Error(`Room with ID ${roomId} already exists`)
        }

        this.rooms.set(roomId, { id: roomId, clients: new Set() })
        this.cli.logInfo(`Room "${roomId}" created.`)
    }

    public joinRoom(roomId: string, client: NetworkClient): void {
        const room = this.rooms.get(roomId)
        if (!room) {
            throw new Error(`Room with ID ${roomId} does not exist.`)
        }

        room.clients.add(client)
        this.cli.logInfo(`Client ${client.getIdentifier()} joined room "${roomId}".`)
    }

    public leaveRoom(roomId: string, client: NetworkClient): void {
        const room = this.rooms.get(roomId)
        if (!room) {
            throw new Error(`Room with ID ${roomId} does not exist.`)
        }

        if (room.clients.delete(client)) {
            this.cli.logInfo(`Client ${client.getIdentifier()} left room "${roomId}".`)
        }
    }

    public leaveRooms(client: NetworkClient): void {
        // eslint-disable-next-line no-restricted-syntax
        for (const [roomId] of this.rooms) {
            this.leaveRoom(roomId, client)
        }
    }

    public getRoomForClient(client: NetworkClient): Room | undefined {
        // eslint-disable-next-line no-restricted-syntax
        for (const room of this.rooms.values()) {
            if (room.clients.has(client)) {
                return room
            }
        }
        return undefined
    }

    public getClientsInRoom(client: NetworkClient): NetworkClient[] {
        const room = this.getRoomForClient(client)
        return room ? Array.from(room.clients) : []
    }

    async onDestroy(): Promise<void> {
        this.cli.logInfo('Destroying RoomModule...')
        this.rooms.clear()
    }
}
