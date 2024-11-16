import NetworkEvent from './NetworkEvent'

class ClientDisconnectedNetworkEvent extends NetworkEvent {
    serialize(): string {
        return JSON.stringify({
            client: {
                id: this.client.getIdentifier(),
            },
        })
    }

    static deserialize(data: string): ClientDisconnectedNetworkEvent {
        const parsed = JSON.parse(data)
        return new ClientDisconnectedNetworkEvent(parsed.client)
    }
}

export default ClientDisconnectedNetworkEvent
