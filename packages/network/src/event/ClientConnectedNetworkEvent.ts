import NetworkEvent from './NetworkEvent'

class ClientConnectedNetworkEvent extends NetworkEvent {
    serialize(): string {
        return JSON.stringify({
            client: {
                id: this.client.getIdentifier(),
            },
        })
    }
}
export default ClientConnectedNetworkEvent
