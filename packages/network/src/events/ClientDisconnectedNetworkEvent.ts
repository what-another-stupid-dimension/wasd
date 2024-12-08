import { NetworkClient } from '../client'

class ClientDisconnectedNetworkEvent {
    constructor(
        public client: NetworkClient,
    ) {
    }
}

export default ClientDisconnectedNetworkEvent
